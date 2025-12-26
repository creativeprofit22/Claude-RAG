/**
 * Embeddings module for RAG system
 * Uses Google Gemini for high-quality embeddings
 * https://ai.google.dev/gemini-api/docs/embeddings
 */
export interface EmbeddingResponse {
    embedding: number[];
}
export interface EmbeddingError extends Error {
    statusCode?: number;
    model?: string;
}
/**
 * Generate an embedding vector for a single text string (document)
 * @param text - The text to generate an embedding for
 * @returns Promise resolving to the embedding vector
 * @throws EmbeddingError if the API call fails
 */
export declare function generateEmbedding(text: string): Promise<number[]>;
/**
 * Generate embedding for a query (uses RETRIEVAL_QUERY task type for better retrieval)
 * @param text - The query text
 * @returns Promise resolving to the embedding vector
 */
export declare function generateQueryEmbedding(text: string): Promise<number[]>;
/**
 * Generate embeddings for multiple texts in a single API call (more efficient)
 * @param texts - Array of texts to generate embeddings for
 * @param batchSize - Number of texts per API call (max 100 for Gemini)
 * @param onProgress - Optional callback for progress updates
 * @returns Promise resolving to array of embedding vectors
 */
export declare function generateEmbeddingsBatch(texts: string[], batchSize?: number, // Gemini supports up to 100
onProgress?: (completed: number, total: number) => void): Promise<number[][]>;
/**
 * Calculate cosine similarity between two embedding vectors
 * @param a - First embedding vector
 * @param b - Second embedding vector
 * @returns Similarity score between -1 and 1
 */
export declare function cosineSimilarity(a: number[], b: number[]): number;
/**
 * Check if Google AI embeddings are available and API key is valid
 * @returns Promise resolving to true if ready
 */
export declare function checkEmbeddingsReady(): Promise<boolean>;
export declare const checkOllamaReady: typeof checkEmbeddingsReady;
//# sourceMappingURL=embeddings.d.ts.map