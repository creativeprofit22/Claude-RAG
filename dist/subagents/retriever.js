import { getGeminiClient } from '../utils/gemini-client.js';
import { validateQuery } from '../utils/validation.js';
const GEMINI_MODEL = process.env.GEMINI_RETRIEVER_MODEL || 'gemini-2.0-flash';
/**
 * Low temperature for deterministic chunk selection.
 * We want consistent, reproducible filtering rather than creative responses.
 * 0.1 allows minimal variation for edge cases while keeping output stable.
 */
const RETRIEVER_TEMPERATURE = 0.1;
/**
 * Error thrown when the retriever sub-agent fails
 */
export class RetrieverError extends Error {
    cause;
    constructor(message, cause) {
        super(message);
        this.cause = cause;
        this.name = 'RetrieverError';
    }
}
/**
 * Formats chunks into a numbered list for the prompt
 */
function formatChunksForPrompt(chunks) {
    return chunks
        .map((c, i) => `[${i}] (${c.documentName}, score: ${c.score.toFixed(3)}): ${c.text}`)
        .join('\n\n');
}
/**
 * Builds the system prompt for the retrieval assistant
 */
function buildSystemPrompt() {
    return `You are a retrieval assistant specialized in filtering and ranking document chunks for relevance.
Your job is to analyze chunks retrieved from a vector search and determine which are most useful for answering a query.
Be precise and only select chunks that contain information directly relevant to the query.
Discard chunks that are tangentially related or contain no useful information.`;
}
/**
 * Builds the user prompt for chunk filtering
 */
function buildUserPrompt(query, chunksText, compress) {
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
 * Validate that parsed JSON contains required LLM response fields
 */
function validateLLMResponse(parsed) {
    if (typeof parsed !== 'object' || parsed === null) {
        throw new RetrieverError('Response is not a valid object');
    }
    const obj = parsed;
    if (!Array.isArray(obj.selectedIndices)) {
        throw new RetrieverError('Response missing selectedIndices array');
    }
    if (typeof obj.relevantContext !== 'string') {
        throw new RetrieverError('Response missing relevantContext string');
    }
    return obj;
}
/**
 * Parses the JSON response from the LLM
 */
function parseLLMResponse(text) {
    // Try to extract JSON from the response (handles markdown code blocks)
    const jsonMatch = extractBalancedJson(text);
    if (!jsonMatch) {
        throw new RetrieverError('Could not find valid JSON in LLM response');
    }
    try {
        const parsed = JSON.parse(jsonMatch);
        return validateLLMResponse(parsed);
    }
    catch (error) {
        if (error instanceof RetrieverError) {
            throw error;
        }
        throw new RetrieverError('Failed to parse LLM response as JSON', error);
    }
}
/**
 * Extract JSON object from text using balanced brace matching
 * More accurate than greedy regex for nested structures
 */
function extractBalancedJson(text) {
    const startIdx = text.indexOf('{');
    if (startIdx === -1)
        return null;
    let depth = 0;
    let inString = false;
    let escape = false;
    for (let i = startIdx; i < text.length; i++) {
        const char = text[i];
        if (escape) {
            escape = false;
            continue;
        }
        if (char === '\\' && inString) {
            escape = true;
            continue;
        }
        if (char === '"') {
            inString = !inString;
            continue;
        }
        if (!inString) {
            if (char === '{') {
                depth++;
            }
            else if (char === '}') {
                depth--;
                if (depth === 0) {
                    return text.slice(startIdx, i + 1);
                }
            }
        }
    }
    return null; // Unbalanced braces
}
/**
 * Validates that selected indices are within bounds
 */
function validateIndices(indices, maxIndex) {
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
export async function filterAndRankChunks(query, chunks, options = {}) {
    try {
        validateQuery(query);
    }
    catch (error) {
        throw new RetrieverError(error instanceof Error ? error.message : 'Invalid query');
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
                temperature: RETRIEVER_TEMPERATURE
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
            console.warn('[Retriever] LLM returned invalid indices:', {
                requestedIndices: parsed.selectedIndices,
                maxValidIndex: chunks.length - 1,
                query: query.slice(0, 100)
            });
            return {
                relevantContext: chunks.slice(0, maxChunks).map((c) => c.text).join('\n\n'),
                selectedChunks: chunks.slice(0, maxChunks).map((_, i) => i),
                tokensUsed: (response.usageMetadata?.promptTokenCount || 0) +
                    (response.usageMetadata?.candidatesTokenCount || 0),
                reasoning: `LLM selected no valid chunks (indices: ${parsed.selectedIndices}). Falling back to top ${Math.min(maxChunks, chunks.length)} chunks by vector similarity.`
            };
        }
        // Calculate tokens used (Gemini provides usage metadata)
        const tokensUsed = (response.usageMetadata?.promptTokenCount || 0) +
            (response.usageMetadata?.candidatesTokenCount || 0);
        return {
            relevantContext: parsed.relevantContext,
            selectedChunks: limitedIndices,
            summary: compress ? parsed.relevantContext : undefined,
            tokensUsed,
            reasoning: parsed.reasoning
        };
    }
    catch (error) {
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
export async function batchFilterChunks(queries, options = {}) {
    const results = await Promise.allSettled(queries.map(({ query, chunks }) => filterAndRankChunks(query, chunks, options)));
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
//# sourceMappingURL=retriever.js.map