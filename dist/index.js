/**
 * Claude RAG - RAG system with Voyage AI embeddings and Opus main agent
 * Optional Haiku compression layer when compress=true
 *
 * Supports two responders:
 * - Claude Code CLI (default): Uses local Claude Code installation
 * - Gemini: Uses Google Gemini 2.0 Flash API
 *
 * Set RAG_RESPONDER=gemini to use Gemini, or RAG_RESPONDER=claude for Claude Code CLI
 */
import { generateQueryEmbedding, generateEmbeddingsBatch, checkOllamaReady } from './embeddings.js';
import { ragDatabase } from './database.js';
import { filterAndRankChunks } from './subagents/index.js';
import { generateResponse as claudeGenerateResponse, streamResponse as claudeStreamResponse } from './responder.js';
import { generateResponse as geminiGenerateResponse, streamResponse as geminiStreamResponse, checkGeminiReady } from './responder-gemini.js';
import { getDefaultConfig } from './config.js';
import { logger } from './utils/logger.js';
import { checkClaudeCodeAvailable } from './utils/cli.js';
import { buildChunksFromResults, buildContextFromChunks, buildSourcesFromChunks } from './utils/chunks.js';
import { validateQuery } from './utils/validation.js';
/**
 * Escape a string for use in LanceDB filter expressions.
 * Prevents SQL injection by escaping quotes and backslashes.
 */
function escapeFilterValue(value) {
    return value.replace(/\\/g, '\\\\').replace(/"/g, '\\"');
}
/**
 * Get the configured responder type from environment
 * Defaults to 'claude' if not set
 */
export function getResponderType() {
    const envValue = process.env.RAG_RESPONDER?.toLowerCase();
    if (envValue === 'gemini')
        return 'gemini';
    return 'claude'; // Default to Claude Code CLI
}
/**
 * Get the appropriate responder functions based on configuration and availability
 * Returns the responder type actually being used and the functions
 */
async function getResponder() {
    const configuredType = getResponderType();
    if (configuredType === 'gemini') {
        logger.debug('Using Gemini responder (configured via RAG_RESPONDER)');
        return {
            type: 'gemini',
            generateResponse: geminiGenerateResponse,
            streamResponse: geminiStreamResponse,
            fallback: false
        };
    }
    // Default to Claude Code CLI, but check availability
    const claudeAvailable = await checkClaudeCodeAvailable();
    if (claudeAvailable) {
        logger.debug('Using Claude Code CLI responder');
        return {
            type: 'claude',
            generateResponse: claudeGenerateResponse,
            streamResponse: claudeStreamResponse,
            fallback: false
        };
    }
    // Fall back to Gemini if Claude Code is not available
    const fallbackMessage = 'Claude Code CLI not available, falling back to Gemini responder';
    logger.warn(fallbackMessage);
    return {
        type: 'gemini',
        generateResponse: geminiGenerateResponse,
        streamResponse: geminiStreamResponse,
        fallback: true,
        fallbackMessage
    };
}
/**
 * Main RAG query function - the unified entry point
 *
 * Default flow (compress=false):
 * 1. Generate query embedding (Voyage AI)
 * 2. Search vector DB for relevant chunks (LanceDB)
 * 3. Pass chunks directly to configured responder (Claude Code CLI or Gemini)
 *
 * Compressed flow (compress=true):
 * 1. Generate query embedding (Voyage AI)
 * 2. Search vector DB for relevant chunks (LanceDB)
 * 3. Filter & compress chunks with Haiku sub-agent
 * 4. Generate final response with configured responder
 *
 * Responder selection:
 * - Use options.responder to override for a single query
 * - Set RAG_RESPONDER env var to change default (claude|gemini)
 * - Falls back to Gemini if Claude Code CLI is not available
 */
export async function query(userQuery, options = {}) {
    validateQuery(userQuery);
    const config = getDefaultConfig();
    const { topK = config.topK, compress = false, documentId } = options;
    const timing = { embedding: 0, search: 0, response: 0, total: 0 };
    const startTotal = Date.now();
    logger.info(`Processing query: "${userQuery.slice(0, 50)}..."`);
    // Determine which responder to use
    let responder;
    if (options.responder) {
        // Use explicitly specified responder
        if (options.responder === 'gemini') {
            responder = {
                type: 'gemini',
                generateResponse: geminiGenerateResponse,
                streamResponse: geminiStreamResponse,
                fallback: false
            };
        }
        else {
            responder = {
                type: 'claude',
                generateResponse: claudeGenerateResponse,
                streamResponse: claudeStreamResponse,
                fallback: false
            };
        }
        logger.debug(`Using ${options.responder} responder (explicitly specified)`);
    }
    else {
        // Use configured responder with fallback
        responder = await getResponder();
    }
    // Step 1: Generate query embedding
    const startEmbed = Date.now();
    const queryVector = await generateQueryEmbedding(userQuery);
    timing.embedding = Date.now() - startEmbed;
    logger.debug(`Embedding generated in ${timing.embedding}ms`);
    // Step 2: Search vector database
    const startSearch = Date.now();
    const searchResults = await ragDatabase.search(queryVector, {
        limit: compress ? topK * 3 : topK, // Get more for filtering when compressing
        filter: documentId ? `metadata.documentId = "${escapeFilterValue(documentId)}"` : undefined
    });
    timing.search = Date.now() - startSearch;
    logger.debug(`Found ${searchResults.length} chunks in ${timing.search}ms`);
    if (searchResults.length === 0) {
        return {
            answer: "I don't have any documents to search. Please upload some documents first.",
            sources: [],
            tokensUsed: { input: 0, output: 0 },
            responderUsed: responder.type,
            timing: { ...timing, total: Date.now() - startTotal }
        };
    }
    // Build chunks array from search results
    const chunks = buildChunksFromResults(searchResults);
    let context;
    let sources;
    let subAgentResult;
    if (compress) {
        // Step 3a: Haiku sub-agent filters and compresses
        const startFilter = Date.now();
        subAgentResult = await filterAndRankChunks(userQuery, chunks, {
            compress: true,
            maxChunks: topK
        });
        timing.filtering = Date.now() - startFilter;
        logger.debug(`Haiku filtered to ${subAgentResult.selectedChunks.length} chunks in ${timing.filtering}ms`);
        context = subAgentResult.relevantContext;
        sources = subAgentResult.selectedChunks.map(i => ({
            documentId: chunks[i].documentId,
            documentName: chunks[i].documentName,
            chunkIndex: chunks[i].chunkIndex,
            snippet: chunks[i].text.slice(0, 150) + '...'
        }));
    }
    else {
        // Step 3b: Direct flow - format chunks for responder without Haiku
        logger.debug(`Direct flow: passing ${chunks.length} chunks to ${responder.type}`);
        // Build context from all chunks with document attribution
        context = buildContextFromChunks(chunks);
        sources = buildSourcesFromChunks(chunks);
    }
    // Step 4: Generate response using configured responder
    const startResponse = Date.now();
    const response = await responder.generateResponse(userQuery, context, sources, { systemPrompt: options.systemPrompt });
    timing.response = Date.now() - startResponse;
    timing.total = Date.now() - startTotal;
    if (compress && subAgentResult) {
        logger.info(`Query completed in ${timing.total}ms (Haiku: ${subAgentResult.tokensUsed} tokens, ${responder.type}: ${response.tokensUsed.input + response.tokensUsed.output} tokens)`);
    }
    else {
        logger.info(`Query completed in ${timing.total}ms (Direct to ${responder.type}: ${response.tokensUsed.input + response.tokensUsed.output} tokens)`);
    }
    return {
        ...response,
        ...(subAgentResult && { subAgentResult }),
        responderUsed: responder.type,
        ...(responder.fallback && {
            responderFallback: true,
            responderFallbackMessage: responder.fallbackMessage
        }),
        timing
    };
}
/**
 * Estimate how many chunks a text will produce
 */
export function estimateChunks(text, options) {
    const config = getDefaultConfig();
    const chunkSize = options?.chunkSize ?? config.chunkSize;
    const chunkOverlap = options?.chunkOverlap ?? config.chunkOverlap;
    const words = text.split(/\s+/).filter(w => w.trim());
    const wordCount = words.length;
    if (wordCount === 0) {
        return { wordCount: 0, estimatedChunks: 0, chunkSize, chunkOverlap };
    }
    // Calculate chunks with overlap
    const step = chunkSize - chunkOverlap;
    const estimatedChunks = Math.max(1, Math.ceil((wordCount - chunkOverlap) / step));
    return { wordCount, estimatedChunks, chunkSize, chunkOverlap };
}
/**
 * Add a document to the RAG system with progress callback
 */
export async function addDocumentWithProgress(text, metadata, onProgress) {
    const config = getDefaultConfig();
    const documentId = `doc_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
    // Chunking stage (30-35%)
    // Splits text into overlapping word-based chunks for better semantic coverage.
    // Each chunk contains `chunkSize` words, with `overlap` words shared between
    // consecutive chunks. E.g., with chunkSize=200 and overlap=50:
    // Chunk 1: words 0-199, Chunk 2: words 150-349, etc.
    onProgress?.({ stage: 'chunking', percent: 30 });
    const words = text.split(/\s+/);
    const chunkSize = config.chunkSize;
    const overlap = config.chunkOverlap;
    const chunks = [];
    const step = chunkSize - overlap;
    for (let i = 0; i < words.length; i += step) {
        const chunk = words.slice(i, i + chunkSize).join(' ');
        if (chunk.trim())
            chunks.push(chunk);
    }
    onProgress?.({ stage: 'chunking', percent: 35, chunkCount: chunks.length });
    // Embedding stage (35-90%)
    logger.info(`Generating embeddings for ${chunks.length} chunks...`);
    const embeddings = await generateEmbeddingsBatch(chunks, 50, (completed, total) => {
        const percent = 35 + Math.floor((completed / total) * 55);
        onProgress?.({ stage: 'embedding', percent, current: completed, total });
    });
    // Storing stage (90-100%)
    onProgress?.({ stage: 'storing', percent: 90 });
    const docs = chunks.map((text, i) => ({
        id: `${documentId}_${i}`,
        vector: embeddings[i],
        text,
        metadata: {
            documentId,
            documentName: metadata.name,
            chunkIndex: i,
            timestamp: Date.now(),
            source: metadata.source,
            type: metadata.type
        }
    }));
    await ragDatabase.addDocuments(docs);
    // Store category and tag metadata if provided
    if (metadata.categoryIds || metadata.tags) {
        const { setDocumentCategories, setDocumentTags } = await import('./categories.js');
        if (metadata.categoryIds) {
            setDocumentCategories(documentId, metadata.categoryIds);
        }
        if (metadata.tags) {
            setDocumentTags(documentId, metadata.tags);
        }
    }
    logger.info(`Added document ${documentId} with ${chunks.length} chunks`);
    onProgress?.({ stage: 'complete', percent: 100 });
    return { documentId, chunks: chunks.length };
}
/**
 * Add a document to the RAG system
 */
export async function addDocument(text, metadata) {
    return addDocumentWithProgress(text, metadata);
}
/**
 * List all documents
 */
export async function listDocuments() {
    return ragDatabase.listDocuments();
}
/**
 * Delete a document
 */
export async function deleteDocument(documentId) {
    await ragDatabase.deleteDocument(documentId);
    logger.info(`Deleted document ${documentId}`);
}
/**
 * Get summary of all documents with full metadata
 */
export async function getDocumentSummaries() {
    return ragDatabase.getDocumentSummaries();
}
/**
 * Get detailed info for a single document including chunk previews
 */
export async function getDocumentDetails(documentId) {
    return ragDatabase.getDocumentDetails(documentId);
}
/**
 * Check if the system is ready
 * Checks both embedding service and configured responder
 */
export async function isReady() {
    try {
        // Check embedding service
        await checkOllamaReady();
        // Check responder availability
        const responderType = getResponderType();
        let responderReady = false;
        if (responderType === 'gemini') {
            responderReady = await checkGeminiReady();
        }
        else {
            responderReady = await checkClaudeCodeAvailable();
        }
        return {
            ready: true,
            responder: responderType,
            responderReady
        };
    }
    catch (error) {
        return { ready: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
}
/**
 * Search-only mode - returns relevant chunks without calling any LLM
 * Use this when you want to get context to use in Claude Code CLI
 *
 * Flow:
 * 1. Generate query embedding (Google Gemini)
 * 2. Search vector DB for relevant chunks (LanceDB)
 * 3. Return formatted context (NO Anthropic API calls)
 */
export async function search(userQuery, options = {}) {
    const config = getDefaultConfig();
    const { topK = config.topK, documentId } = options;
    const timing = { embedding: 0, search: 0, total: 0 };
    const startTotal = Date.now();
    logger.info(`Searching: "${userQuery.slice(0, 50)}..."`);
    // Step 1: Generate query embedding (Google Gemini only)
    const startEmbed = Date.now();
    const queryVector = await generateQueryEmbedding(userQuery);
    timing.embedding = Date.now() - startEmbed;
    logger.debug(`Embedding generated in ${timing.embedding}ms`);
    // Step 2: Search vector database (LanceDB - local)
    const startSearch = Date.now();
    const searchResults = await ragDatabase.search(queryVector, {
        limit: topK,
        filter: documentId ? `metadata.documentId = "${escapeFilterValue(documentId)}"` : undefined
    });
    timing.search = Date.now() - startSearch;
    timing.total = Date.now() - startTotal;
    logger.debug(`Found ${searchResults.length} chunks in ${timing.search}ms`);
    // Build chunks array
    const chunks = searchResults.map((r) => ({
        text: r.text,
        documentId: r.metadata.documentId,
        documentName: r.metadata.documentName,
        chunkIndex: r.metadata.chunkIndex,
        score: r._distance ?? 0
    }));
    // Format context for Claude Code usage
    const context = chunks.length === 0
        ? 'No relevant documents found.'
        : chunks.map((chunk, i) => `## Source: ${chunk.documentName} (Chunk ${chunk.chunkIndex})\n\n${chunk.text}`).join('\n\n---\n\n');
    logger.info(`Search completed in ${timing.total}ms`);
    return { context, chunks, timing };
}
// Re-export types and utilities
export * from './types.js';
export { getDefaultConfig } from './config.js';
export { ragDatabase } from './database.js';
export { generateEmbedding, generateQueryEmbedding } from './embeddings.js';
export { filterAndRankChunks } from './subagents/index.js';
// Export both responders
export { generateResponse as claudeGenerateResponse, streamResponse as claudeStreamResponse } from './responder.js';
export { generateResponse as geminiGenerateResponse, streamResponse as geminiStreamResponse, checkGeminiReady } from './responder-gemini.js';
// Default responder exports (for backward compatibility - uses Claude Code CLI)
export { generateResponse, streamResponse } from './responder.js';
//# sourceMappingURL=index.js.map