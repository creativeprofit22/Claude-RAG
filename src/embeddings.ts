/**
 * Embeddings module for RAG system
 * Uses Google Gemini for high-quality embeddings
 * https://ai.google.dev/gemini-api/docs/embeddings
 */

import { getGeminiClient } from './utils/gemini-client.js';

const GEMINI_MODEL = process.env.GEMINI_EMBEDDING_MODEL || 'gemini-embedding-001';
const OUTPUT_DIMENSIONALITY = Number(process.env.GEMINI_EMBEDDING_DIM) || 1024;
const MAX_TEXT_LENGTH = 8000; // Gemini supports up to 2048 tokens (~8K chars)

export interface EmbeddingResponse {
  embedding: number[];
}

export interface EmbeddingError extends Error {
  statusCode?: number;
  model?: string;
}

type TaskType = 'RETRIEVAL_DOCUMENT' | 'RETRIEVAL_QUERY';

/**
 * Core embedding generation with configurable task type
 */
async function generateEmbeddingCore(text: string, taskType: TaskType): Promise<number[]> {
  if (!text || typeof text !== 'string') {
    throw new Error('Text must be a non-empty string');
  }

  const truncated = text.slice(0, MAX_TEXT_LENGTH);

  try {
    const client = getGeminiClient();
    const response = await client.models.embedContent({
      model: GEMINI_MODEL,
      contents: truncated,
      config: {
        taskType,
        outputDimensionality: OUTPUT_DIMENSIONALITY,
      },
    });

    if (!response.embeddings?.[0]?.values) {
      throw new Error('Invalid embedding response: missing embedding array');
    }

    return response.embeddings[0].values;
  } catch (error) {
    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw new Error('Failed to connect to Google AI API. Check your internet connection.');
    }
    throw error;
  }
}

/**
 * Generate an embedding vector for a single text string (document)
 * @param text - The text to generate an embedding for
 * @returns Promise resolving to the embedding vector
 * @throws EmbeddingError if the API call fails
 */
export async function generateEmbedding(text: string): Promise<number[]> {
  return generateEmbeddingCore(text, 'RETRIEVAL_DOCUMENT');
}

/**
 * Generate embedding for a query (uses RETRIEVAL_QUERY task type for better retrieval)
 * @param text - The query text
 * @returns Promise resolving to the embedding vector
 */
export async function generateQueryEmbedding(text: string): Promise<number[]> {
  return generateEmbeddingCore(text, 'RETRIEVAL_QUERY');
}

/**
 * Generate embeddings for multiple texts in a single API call (more efficient)
 * @param texts - Array of texts to generate embeddings for
 * @param batchSize - Number of texts per API call (max 100 for Gemini)
 * @param onProgress - Optional callback for progress updates
 * @returns Promise resolving to array of embedding vectors
 */
export async function generateEmbeddingsBatch(
  texts: string[],
  batchSize = 50, // Gemini supports up to 100
  onProgress?: (completed: number, total: number) => void
): Promise<number[][]> {
  if (!Array.isArray(texts)) {
    throw new Error('Texts must be an array');
  }

  if (texts.length === 0) {
    return [];
  }

  const results: number[][] = [];
  const client = getGeminiClient();

  for (let i = 0; i < texts.length; i += batchSize) {
    const batch = texts.slice(i, i + batchSize).map((t) => t.slice(0, MAX_TEXT_LENGTH));

    const response = await client.models.embedContent({
      model: GEMINI_MODEL,
      contents: batch,
      config: {
        taskType: 'RETRIEVAL_DOCUMENT',
        outputDimensionality: OUTPUT_DIMENSIONALITY,
      },
    });

    if (!response.embeddings) {
      throw new Error('Invalid batch embedding response: missing embeddings array');
    }

    // Extract embeddings in order, validating each one
    const batchEmbeddings = response.embeddings.map((e, idx) => {
      const values = e.values;
      // Validate embedding is a non-empty array to prevent DB corruption
      if (!Array.isArray(values) || values.length === 0) {
        throw new Error(`Invalid embedding at batch index ${i + idx}: expected non-empty array, got ${JSON.stringify(values)?.slice(0, 50)}`);
      }
      return values;
    });
    results.push(...batchEmbeddings);

    if (onProgress) {
      onProgress(Math.min(i + batchSize, texts.length), texts.length);
    }
  }

  return results;
}

/**
 * Calculate cosine similarity between two embedding vectors
 * @param a - First embedding vector
 * @param b - Second embedding vector
 * @returns Similarity score between -1 and 1
 */
export function cosineSimilarity(a: number[], b: number[]): number {
  if (a.length !== b.length) {
    throw new Error('Vectors must have the same length');
  }

  let dotProduct = 0;
  let normA = 0;
  let normB = 0;

  for (let i = 0; i < a.length; i++) {
    dotProduct += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }

  const magnitude = Math.sqrt(normA) * Math.sqrt(normB);
  if (magnitude === 0) return 0;

  return dotProduct / magnitude;
}

/**
 * Check if Google AI embeddings are available and API key is valid
 * @returns Promise resolving to true if ready
 */
export async function checkEmbeddingsReady(): Promise<boolean> {
  try {
    // Test with a minimal embedding request
    const embedding = await generateEmbedding('test');
    return embedding.length > 0;
  } catch {
    return false;
  }
}

// Backwards compatibility alias
export const checkOllamaReady = checkEmbeddingsReady;
