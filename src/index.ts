/**
 * Claude RAG - RAG system with Voyage AI embeddings and Opus main agent
 * Optional Haiku compression layer when compress=true
 */

import { generateEmbedding, generateQueryEmbedding, generateEmbeddingsBatch, checkOllamaReady } from './embeddings.js';
import { ragDatabase } from './database.js';
import { filterAndRankChunks, type SubAgentResult } from './subagents/index.js';
import { generateResponse, streamResponse, type RAGResponse } from './responder.js';
import { getDefaultConfig } from './config.js';
import { logger } from './utils/logger.js';

export interface QueryOptions {
  topK?: number;
  documentId?: string;
  compress?: boolean;
  stream?: boolean;
  systemPrompt?: string;
}

export interface QueryResult extends RAGResponse {
  subAgentResult?: SubAgentResult;  // Only present when compress=true
  timing: {
    embedding: number;
    search: number;
    filtering?: number;  // Only present when compress=true
    response: number;
    total: number;
  };
}

/**
 * Main RAG query function - the unified entry point
 *
 * Default flow (compress=false):
 * 1. Generate query embedding (Voyage AI)
 * 2. Search vector DB for relevant chunks (LanceDB)
 * 3. Pass chunks directly to Opus main agent
 *
 * Compressed flow (compress=true):
 * 1. Generate query embedding (Voyage AI)
 * 2. Search vector DB for relevant chunks (LanceDB)
 * 3. Filter & compress chunks with Haiku sub-agent
 * 4. Generate final response with Opus main agent
 */
export async function query(
  userQuery: string,
  options: QueryOptions = {}
): Promise<QueryResult> {
  const config = getDefaultConfig();
  const { topK = config.topK, compress = false, documentId } = options;
  const timing: QueryResult['timing'] = { embedding: 0, search: 0, response: 0, total: 0 };
  const startTotal = Date.now();

  logger.info(`Processing query: "${userQuery.slice(0, 50)}..."`);

  // Step 1: Generate query embedding
  const startEmbed = Date.now();
  const queryVector = await generateQueryEmbedding(userQuery);
  timing.embedding = Date.now() - startEmbed;
  logger.debug(`Embedding generated in ${timing.embedding}ms`);

  // Step 2: Search vector database
  const startSearch = Date.now();
  const searchResults = await ragDatabase.search(queryVector, {
    limit: compress ? topK * 3 : topK,  // Get more for filtering when compressing
    filter: documentId ? `metadata.documentId = "${documentId}"` : undefined
  });
  timing.search = Date.now() - startSearch;
  logger.debug(`Found ${searchResults.length} chunks in ${timing.search}ms`);

  if (searchResults.length === 0) {
    return {
      answer: "I don't have any documents to search. Please upload some documents first.",
      sources: [],
      tokensUsed: { input: 0, output: 0 },
      timing: { ...timing, total: Date.now() - startTotal }
    };
  }

  // Build chunks array from search results
  const chunks = searchResults.map((r, i) => ({
    text: r.text,
    documentId: r.metadata.documentId,
    documentName: r.metadata.documentName,
    chunkIndex: r.metadata.chunkIndex,
    score: r._distance || 0
  }));

  let context: string;
  let sources: Array<{ documentId: string; documentName: string; chunkIndex: number; snippet: string }>;
  let subAgentResult: SubAgentResult | undefined;

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
  } else {
    // Step 3b: Direct flow - format chunks for Opus without Haiku
    logger.debug(`Direct flow: passing ${chunks.length} chunks to Opus`);

    // Build context from all chunks with document attribution
    context = chunks.map((chunk, i) => {
      return `[Source: ${chunk.documentName}, Chunk ${chunk.chunkIndex}]\n${chunk.text}`;
    }).join('\n\n---\n\n');

    sources = chunks.map(chunk => ({
      documentId: chunk.documentId,
      documentName: chunk.documentName,
      chunkIndex: chunk.chunkIndex,
      snippet: chunk.text.slice(0, 150) + '...'
    }));
  }

  // Step 4: Opus main agent generates response
  const startResponse = Date.now();
  const response = await generateResponse(
    userQuery,
    context,
    sources,
    { systemPrompt: options.systemPrompt }
  );
  timing.response = Date.now() - startResponse;
  timing.total = Date.now() - startTotal;

  if (compress && subAgentResult) {
    logger.info(`Query completed in ${timing.total}ms (Haiku: ${subAgentResult.tokensUsed} tokens, Opus: ${response.tokensUsed.input + response.tokensUsed.output} tokens)`);
  } else {
    logger.info(`Query completed in ${timing.total}ms (Direct to Opus: ${response.tokensUsed.input + response.tokensUsed.output} tokens)`);
  }

  return {
    ...response,
    ...(subAgentResult && { subAgentResult }),
    timing
  };
}

/**
 * Add a document to the RAG system
 */
export async function addDocument(
  text: string,
  metadata: { name: string; source?: string; type?: string }
): Promise<{ documentId: string; chunks: number }> {
  const config = getDefaultConfig();
  const documentId = `doc_${Date.now()}`;

  // Simple chunking (word-based with overlap)
  const words = text.split(/\s+/);
  const chunkSize = config.chunkSize;
  const overlap = config.chunkOverlap;
  const chunks: string[] = [];

  for (let i = 0; i < words.length; i += chunkSize - overlap) {
    const chunk = words.slice(i, i + chunkSize).join(' ');
    if (chunk.trim()) chunks.push(chunk);
  }

  // Generate embeddings
  logger.info(`Generating embeddings for ${chunks.length} chunks...`);
  const embeddings = await generateEmbeddingsBatch(chunks);

  // Store in database
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
  logger.info(`Added document ${documentId} with ${chunks.length} chunks`);

  return { documentId, chunks: chunks.length };
}

/**
 * List all documents
 */
export async function listDocuments(): Promise<string[]> {
  return ragDatabase.listDocuments();
}

/**
 * Delete a document
 */
export async function deleteDocument(documentId: string): Promise<void> {
  await ragDatabase.deleteDocument(documentId);
  logger.info(`Deleted document ${documentId}`);
}

/**
 * Check if the system is ready
 */
export async function isReady(): Promise<{ ready: boolean; error?: string }> {
  try {
    await checkOllamaReady();
    return { ready: true };
  } catch (error) {
    return { ready: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}

// Re-export types and utilities
export * from './types.js';
export { getDefaultConfig } from './config.js';
export { ragDatabase } from './database.js';
export { generateEmbedding, generateQueryEmbedding } from './embeddings.js';
export { filterAndRankChunks } from './subagents/index.js';
export { generateResponse, streamResponse } from './responder.js';
