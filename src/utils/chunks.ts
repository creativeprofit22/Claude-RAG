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
export function buildChunksFromResults(searchResults: SearchResult[]): Chunk[] {
  return searchResults.map((r) => ({
    text: r.text,
    documentId: r.metadata.documentId,
    documentName: r.metadata.documentName,
    chunkIndex: r.metadata.chunkIndex,
    score: r._distance ?? 0
  }));
}

/**
 * Build formatted context string from chunks
 */
export function buildContextFromChunks(chunks: Chunk[]): string {
  return chunks.map((chunk) => {
    return `[Source: ${chunk.documentName}, Chunk ${chunk.chunkIndex}]\n${chunk.text}`;
  }).join('\n\n---\n\n');
}

/**
 * Build source references from chunks
 */
export function buildSourcesFromChunks(chunks: Chunk[]): ChunkSource[] {
  return chunks.map(chunk => ({
    documentId: chunk.documentId,
    documentName: chunk.documentName,
    chunkIndex: chunk.chunkIndex,
    snippet: chunk.text.slice(0, 150) + '...'
  }));
}
