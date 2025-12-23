/**
 * Embeddings module for RAG system
 * Uses Voyage AI for high-quality embeddings (200M free tokens)
 * https://docs.voyageai.com/docs/embeddings
 */

const VOYAGE_API_URL = 'https://api.voyageai.com/v1/embeddings';
const VOYAGE_MODEL = process.env.VOYAGE_MODEL || 'voyage-3.5-lite';
const MAX_TEXT_LENGTH = 16000; // Voyage supports up to 32K context

export interface EmbeddingResponse {
  embedding: number[];
}

export interface EmbeddingError extends Error {
  statusCode?: number;
  model?: string;
}

interface VoyageResponse {
  object: string;
  data: Array<{
    object: string;
    embedding: number[];
    index: number;
  }>;
  model: string;
  usage: {
    total_tokens: number;
  };
}

function getApiKey(): string {
  const key = process.env.VOYAGE_API_KEY;
  if (!key) {
    throw new Error(
      'VOYAGE_API_KEY environment variable is required. Get one at https://dash.voyageai.com/'
    );
  }
  return key;
}

/**
 * Generate an embedding vector for a single text string
 * @param text - The text to generate an embedding for
 * @returns Promise resolving to the embedding vector
 * @throws EmbeddingError if the API call fails
 */
export async function generateEmbedding(text: string): Promise<number[]> {
  if (!text || typeof text !== 'string') {
    throw new Error('Text must be a non-empty string');
  }

  // Truncate to safe length
  const truncated = text.slice(0, MAX_TEXT_LENGTH);

  try {
    const response = await fetch(VOYAGE_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getApiKey()}`,
      },
      body: JSON.stringify({
        model: VOYAGE_MODEL,
        input: truncated,
        input_type: 'document',
      }),
    });

    if (!response.ok) {
      const errorBody = await response.text();
      const error = new Error(
        `Voyage AI embedding failed: ${response.status} ${response.statusText} - ${errorBody}`
      ) as EmbeddingError;
      error.statusCode = response.status;
      error.model = VOYAGE_MODEL;
      throw error;
    }

    const data: VoyageResponse = await response.json();

    if (!data.data?.[0]?.embedding) {
      throw new Error('Invalid embedding response: missing embedding array');
    }

    return data.data[0].embedding;
  } catch (error) {
    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw new Error('Failed to connect to Voyage AI API. Check your internet connection.');
    }
    throw error;
  }
}

/**
 * Generate embedding for a query (uses query input_type for better retrieval)
 * @param text - The query text
 * @returns Promise resolving to the embedding vector
 */
export async function generateQueryEmbedding(text: string): Promise<number[]> {
  if (!text || typeof text !== 'string') {
    throw new Error('Text must be a non-empty string');
  }

  const truncated = text.slice(0, MAX_TEXT_LENGTH);

  const response = await fetch(VOYAGE_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${getApiKey()}`,
    },
    body: JSON.stringify({
      model: VOYAGE_MODEL,
      input: truncated,
      input_type: 'query', // Optimized for retrieval queries
    }),
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`Voyage AI query embedding failed: ${response.status} - ${errorBody}`);
  }

  const data: VoyageResponse = await response.json();
  return data.data[0].embedding;
}

/**
 * Generate embeddings for multiple texts in a single API call (more efficient)
 * @param texts - Array of texts to generate embeddings for
 * @param batchSize - Number of texts per API call (max 128 for Voyage)
 * @param onProgress - Optional callback for progress updates
 * @returns Promise resolving to array of embedding vectors
 */
export async function generateEmbeddingsBatch(
  texts: string[],
  batchSize = 64, // Voyage supports up to 128
  onProgress?: (completed: number, total: number) => void
): Promise<number[][]> {
  if (!Array.isArray(texts)) {
    throw new Error('Texts must be an array');
  }

  if (texts.length === 0) {
    return [];
  }

  const results: number[][] = [];
  const apiKey = getApiKey();

  for (let i = 0; i < texts.length; i += batchSize) {
    const batch = texts.slice(i, i + batchSize).map((t) => t.slice(0, MAX_TEXT_LENGTH));

    const response = await fetch(VOYAGE_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: VOYAGE_MODEL,
        input: batch,
        input_type: 'document',
      }),
    });

    if (!response.ok) {
      const errorBody = await response.text();
      throw new Error(`Voyage AI batch embedding failed: ${response.status} - ${errorBody}`);
    }

    const data: VoyageResponse = await response.json();

    // Ensure embeddings are in correct order
    const sortedEmbeddings = data.data
      .sort((a, b) => a.index - b.index)
      .map((d) => d.embedding);

    results.push(...sortedEmbeddings);

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
 * Check if Voyage AI is available and API key is valid
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
