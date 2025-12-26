import type { Chunk } from '../utils/chunks.js';
export type RetrievedChunk = Chunk;
/**
 * Options for filtering and ranking chunks
 */
export interface FilterOptions {
    /** Whether to compress/summarize the context (default: true) */
    compress?: boolean;
    /** Maximum number of chunks to return (default: 5) */
    maxChunks?: number;
    /** Minimum relevance threshold (0-1) for chunk selection */
    minRelevance?: number;
}
/**
 * Result from the retrieval sub-agent
 */
export interface SubAgentResult {
    /** The filtered and optionally summarized context */
    relevantContext: string;
    /** Indices of chunks that were deemed relevant */
    selectedChunks: number[];
    /** Summary of the context if compression was enabled */
    summary?: string;
    /** Total tokens used by the LLM call */
    tokensUsed: number;
    /** Reasoning provided by the LLM for chunk selection */
    reasoning?: string;
}
/**
 * Error thrown when the retriever sub-agent fails
 */
export declare class RetrieverError extends Error {
    readonly cause?: unknown | undefined;
    constructor(message: string, cause?: unknown | undefined);
}
/**
 * Uses Gemini Flash to filter and rank retrieved chunks by relevance.
 *
 * This sub-agent takes chunks from a vector search and uses Gemini's
 * understanding to determine which are most relevant to the query,
 * optionally summarizing them to reduce context size.
 *
 * @param query - The user's original query
 * @param chunks - Retrieved document chunks from vector search
 * @param options - Configuration options for filtering
 * @returns Filtered and optionally summarized context
 *
 * @example
 * ```typescript
 * const result = await filterAndRankChunks(
 *   "How do I configure authentication?",
 *   retrievedChunks,
 *   { compress: true, maxChunks: 3 }
 * );
 * console.log(result.relevantContext);
 * ```
 */
export declare function filterAndRankChunks(query: string, chunks: RetrievedChunk[], options?: FilterOptions): Promise<SubAgentResult>;
/**
 * Batch process multiple queries with their respective chunks.
 * Useful for processing multiple retrieval results in parallel.
 *
 * @param queries - Array of query-chunks pairs
 * @param options - Shared options for all queries
 * @returns Array of results in the same order as input
 */
export declare function batchFilterChunks(queries: Array<{
    query: string;
    chunks: RetrievedChunk[];
}>, options?: FilterOptions): Promise<Array<SubAgentResult | {
    error: string;
    query: string;
}>>;
export default filterAndRankChunks;
//# sourceMappingURL=retriever.d.ts.map