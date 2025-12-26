/**
 * Chunk utilities for Claude RAG
 * Shared helpers for building chunks from search results
 */
/**
 * Build chunks array from search results
 */
export function buildChunksFromResults(searchResults) {
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
export function buildContextFromChunks(chunks) {
    return chunks.map((chunk) => {
        return `[Source: ${chunk.documentName}, Chunk ${chunk.chunkIndex}]\n${chunk.text}`;
    }).join('\n\n---\n\n');
}
/**
 * Build source references from chunks
 */
export function buildSourcesFromChunks(chunks) {
    return chunks.map(chunk => ({
        documentId: chunk.documentId,
        documentName: chunk.documentName,
        chunkIndex: chunk.chunkIndex,
        snippet: chunk.text.slice(0, 150) + '...'
    }));
}
//# sourceMappingURL=chunks.js.map