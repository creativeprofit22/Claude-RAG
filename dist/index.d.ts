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
import { type SubAgentResult } from './subagents/index.js';
import { type RAGResponse } from './responder.js';
export type ResponderType = 'claude' | 'gemini';
/**
 * Get the configured responder type from environment
 * Defaults to 'claude' if not set
 */
export declare function getResponderType(): ResponderType;
export interface QueryOptions {
    topK?: number;
    documentId?: string;
    compress?: boolean;
    stream?: boolean;
    systemPrompt?: string;
    responder?: ResponderType;
}
export interface QueryResult extends RAGResponse {
    subAgentResult?: SubAgentResult;
    responderUsed: ResponderType;
    responderFallback?: boolean;
    responderFallbackMessage?: string;
    timing: {
        embedding: number;
        search: number;
        filtering?: number;
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
export declare function query(userQuery: string, options?: QueryOptions): Promise<QueryResult>;
/**
 * Estimate how many chunks a text will produce
 */
export declare function estimateChunks(text: string, options?: {
    chunkSize?: number;
    chunkOverlap?: number;
}): {
    wordCount: number;
    estimatedChunks: number;
    chunkSize: number;
    chunkOverlap: number;
};
/**
 * Progress stage for document upload
 */
export type UploadStage = 'reading' | 'extracting' | 'chunking' | 'embedding' | 'storing' | 'complete';
/**
 * Progress callback for document upload
 */
export interface UploadProgress {
    stage: UploadStage;
    percent: number;
    current?: number;
    total?: number;
    chunkCount?: number;
}
/**
 * Add a document to the RAG system with progress callback
 */
export declare function addDocumentWithProgress(text: string, metadata: {
    name: string;
    source?: string;
    type?: string;
    categoryIds?: string[];
    tags?: string[];
}, onProgress?: (progress: UploadProgress) => void): Promise<{
    documentId: string;
    chunks: number;
}>;
/**
 * Add a document to the RAG system
 */
export declare function addDocument(text: string, metadata: {
    name: string;
    source?: string;
    type?: string;
}): Promise<{
    documentId: string;
    chunks: number;
}>;
/**
 * List all documents
 */
export declare function listDocuments(): Promise<string[]>;
/**
 * Delete a document
 */
export declare function deleteDocument(documentId: string): Promise<void>;
/**
 * Get summary of all documents with full metadata
 */
export declare function getDocumentSummaries(): Promise<import("./database.js").DocumentSummary[]>;
/**
 * Get detailed info for a single document including chunk previews
 */
export declare function getDocumentDetails(documentId: string): Promise<import("./database.js").DocumentDetails | null>;
/**
 * Check if the system is ready
 * Checks both embedding service and configured responder
 */
export declare function isReady(): Promise<{
    ready: boolean;
    error?: string;
    responder?: ResponderType;
    responderReady?: boolean;
}>;
/**
 * Search result for search-only mode
 */
export interface SearchResult {
    context: string;
    chunks: Array<{
        text: string;
        documentId: string;
        documentName: string;
        chunkIndex: number;
        score: number;
    }>;
    timing: {
        embedding: number;
        search: number;
        total: number;
    };
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
export declare function search(userQuery: string, options?: {
    topK?: number;
    documentId?: string;
}): Promise<SearchResult>;
export * from './types.js';
export { getDefaultConfig } from './config.js';
export { ragDatabase, type DocumentSummary, type DocumentDetails } from './database.js';
export { generateEmbedding, generateQueryEmbedding } from './embeddings.js';
export { filterAndRankChunks } from './subagents/index.js';
export { generateResponse as claudeGenerateResponse, streamResponse as claudeStreamResponse } from './responder.js';
export { generateResponse as geminiGenerateResponse, streamResponse as geminiStreamResponse, checkGeminiReady } from './responder-gemini.js';
export { generateResponse, streamResponse } from './responder.js';
//# sourceMappingURL=index.d.ts.map