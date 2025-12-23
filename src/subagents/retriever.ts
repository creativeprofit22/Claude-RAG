import { getGeminiClient } from '../utils/gemini-client.js';

const GEMINI_MODEL = process.env.GEMINI_RETRIEVER_MODEL || 'gemini-2.0-flash';

/**
 * Represents a chunk of text retrieved from a document
 */
export interface RetrievedChunk {
  text: string;
  documentId: string;
  documentName: string;
  chunkIndex: number;
  score: number;
}

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
 * Response structure expected from the LLM
 */
interface LLMResponse {
  selectedIndices: number[];
  relevantContext: string;
  reasoning: string;
}

/**
 * Error thrown when the retriever sub-agent fails
 */
export class RetrieverError extends Error {
  constructor(
    message: string,
    public readonly cause?: unknown
  ) {
    super(message);
    this.name = 'RetrieverError';
  }
}


/**
 * Formats chunks into a numbered list for the prompt
 */
function formatChunksForPrompt(chunks: RetrievedChunk[]): string {
  return chunks
    .map((c, i) => `[${i}] (${c.documentName}, score: ${c.score.toFixed(3)}): ${c.text}`)
    .join('\n\n');
}

/**
 * Builds the system prompt for the retrieval assistant
 */
function buildSystemPrompt(): string {
  return `You are a retrieval assistant specialized in filtering and ranking document chunks for relevance.
Your job is to analyze chunks retrieved from a vector search and determine which are most useful for answering a query.
Be precise and only select chunks that contain information directly relevant to the query.
Discard chunks that are tangentially related or contain no useful information.`;
}

/**
 * Builds the user prompt for chunk filtering
 */
function buildUserPrompt(query: string, chunksText: string, compress: boolean): string {
  const outputInstruction = compress
    ? 'Summarize the key information from relevant chunks into a condensed, coherent context'
    : 'Concatenate the text from relevant chunks';

  return `Given the following user query and document chunks, identify the most relevant chunks.

User Query: "${query}"

Retrieved Chunks:
${chunksText}

Instructions:
1. Identify which chunks are MOST relevant to answering the query
2. ${outputInstruction}
3. Explain your reasoning briefly

Respond in this exact JSON format (no markdown, just raw JSON):
{
  "selectedIndices": [0, 2, 4],
  "relevantContext": "The condensed or concatenated relevant information...",
  "reasoning": "Brief explanation of why these chunks were selected and others were discarded"
}`;
}

/**
 * Parses the JSON response from the LLM
 */
function parseLLMResponse(text: string): LLMResponse {
  // Try to extract JSON from the response (handles markdown code blocks)
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    throw new RetrieverError('Could not find JSON in LLM response');
  }

  try {
    const parsed = JSON.parse(jsonMatch[0]) as LLMResponse;

    // Validate required fields
    if (!Array.isArray(parsed.selectedIndices)) {
      throw new RetrieverError('Response missing selectedIndices array');
    }
    if (typeof parsed.relevantContext !== 'string') {
      throw new RetrieverError('Response missing relevantContext string');
    }

    return parsed;
  } catch (error) {
    if (error instanceof RetrieverError) {
      throw error;
    }
    throw new RetrieverError('Failed to parse LLM response as JSON', error);
  }
}

/**
 * Validates that selected indices are within bounds
 */
function validateIndices(indices: number[], maxIndex: number): number[] {
  return indices.filter((i) => Number.isInteger(i) && i >= 0 && i < maxIndex);
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
export async function filterAndRankChunks(
  query: string,
  chunks: RetrievedChunk[],
  options: FilterOptions = {}
): Promise<SubAgentResult> {
  // Validate query
  if (!query || typeof query !== 'string' || query.trim().length === 0) {
    throw new RetrieverError('Query must be a non-empty string');
  }

  const { compress = true, maxChunks = 5 } = options;

  // Handle empty chunks
  if (chunks.length === 0) {
    return {
      relevantContext: '',
      selectedChunks: [],
      tokensUsed: 0,
      reasoning: 'No chunks provided'
    };
  }

  // If we have fewer chunks than maxChunks and no compression needed,
  // we might skip the API call entirely (optimization)
  if (!compress && chunks.length <= maxChunks) {
    return {
      relevantContext: chunks.map((c) => c.text).join('\n\n'),
      selectedChunks: chunks.map((_, i) => i),
      tokensUsed: 0,
      reasoning: 'All chunks returned without filtering (count below maxChunks)'
    };
  }

  const client = getGeminiClient();
  const chunksText = formatChunksForPrompt(chunks);

  try {
    const response = await client.models.generateContent({
      model: GEMINI_MODEL,
      contents: [{ role: 'user', parts: [{ text: buildUserPrompt(query, chunksText, compress) }] }],
      config: {
        systemInstruction: buildSystemPrompt(),
        maxOutputTokens: 1024,
        temperature: 0.1 // Low temperature for more deterministic output
      }
    });

    // Extract text content from response
    const text = response.text;
    if (!text) {
      throw new RetrieverError('Empty response from Gemini');
    }

    // Parse and validate the response
    const parsed = parseLLMResponse(text);
    const validIndices = validateIndices(parsed.selectedIndices, chunks.length);
    const limitedIndices = validIndices.slice(0, maxChunks);

    // Warn if no valid indices were selected - may indicate LLM misunderstanding
    if (limitedIndices.length === 0 && chunks.length > 0) {
      return {
        relevantContext: chunks.slice(0, maxChunks).map((c) => c.text).join('\n\n'),
        selectedChunks: chunks.slice(0, maxChunks).map((_, i) => i),
        tokensUsed: (response.usageMetadata?.promptTokenCount || 0) +
          (response.usageMetadata?.candidatesTokenCount || 0),
        reasoning: `LLM selected no valid chunks (indices: ${parsed.selectedIndices}). Falling back to top ${Math.min(maxChunks, chunks.length)} chunks by vector similarity.`
      };
    }

    // Calculate tokens used (Gemini provides usage metadata)
    const tokensUsed =
      (response.usageMetadata?.promptTokenCount || 0) +
      (response.usageMetadata?.candidatesTokenCount || 0);

    return {
      relevantContext: parsed.relevantContext,
      selectedChunks: limitedIndices,
      summary: compress ? parsed.relevantContext : undefined,
      tokensUsed,
      reasoning: parsed.reasoning
    };
  } catch (error) {
    if (error instanceof RetrieverError) {
      throw error;
    }

    // Handle general errors
    const message = error instanceof Error ? error.message : 'Unknown error';
    throw new RetrieverError(`Gemini API error: ${message}`, error);
  }
}

/**
 * Batch process multiple queries with their respective chunks.
 * Useful for processing multiple retrieval results in parallel.
 *
 * @param queries - Array of query-chunks pairs
 * @param options - Shared options for all queries
 * @returns Array of results in the same order as input
 */
export async function batchFilterChunks(
  queries: Array<{ query: string; chunks: RetrievedChunk[] }>,
  options: FilterOptions = {}
): Promise<Array<SubAgentResult | { error: string; query: string }>> {
  const results = await Promise.allSettled(
    queries.map(({ query, chunks }) => filterAndRankChunks(query, chunks, options))
  );

  return results.map((result, index) => {
    if (result.status === 'fulfilled') {
      return result.value;
    }
    // Return error info instead of failing entirely
    return {
      error: result.reason instanceof Error ? result.reason.message : 'Unknown error',
      query: queries[index].query
    };
  });
}

export default filterAndRankChunks;
