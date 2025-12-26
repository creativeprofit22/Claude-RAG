/**
 * Chunk utilities for Claude RAG
 * Shared helpers for building chunks from search results
 */
/**
 * Represents a chunk built from search results
 */
export interface Chunk {
    text: string;
    documentId: string;
    documentName: string;
    chunkIndex: number;
    score: number;
}
/**
 * Represents a source reference for the response
 */
export interface ChunkSource {
    documentId: string;
    documentName: string;
    chunkIndex: number;
    snippet: string;
}
/**
 * Search result metadata structure
 */
interface SearchResultMetadata {
    documentId: string;
    documentName: string;
    chunkIndex: number;
}
/**
 * Search result structure from database
 */
interface SearchResult {
    text: string;
    metadata: SearchResultMetadata;
    _distance?: number;
}
/**
 * Build chunks array from search results
 */
export declare function buildChunksFromResults(searchResults: SearchResult[]): Chunk[];
/**
 * Build formatted context string from chunks
 */
export declare function buildContextFromChunks(chunks: Chunk[]): string;
/**
 * Build source references from chunks
 */
export declare function buildSourcesFromChunks(chunks: Chunk[]): ChunkSource[];
export {};
//# sourceMappingURL=chunks.d.ts.map