/**
 * Gemini-based responder for RAG system
 * Alternative to Claude-based responder for users without Anthropic API access
 * Uses Google Gemini 2.0 Flash (free tier)
 */

import { getGeminiClient } from './utils/gemini-client.js';
import { DEFAULT_SYSTEM_PROMPT } from './constants.js';
import { validateQuery, validateContext, validateSources } from './utils/validation.js';

// Gemini 2.0 Flash - fast and free-tier friendly
const GEMINI_MODEL = process.env.GEMINI_RESPONSE_MODEL || 'gemini-2.0-flash';

// API timeout in milliseconds (default: 60 seconds)
const API_TIMEOUT_MS = parseInt(process.env.GEMINI_TIMEOUT_MS || '60000', 10);

/**
 * Sanitize context to prevent prompt injection attacks.
 * Uses clear delimiters that are unlikely to appear in legitimate content.
 */
function sanitizeContext(context: string): string {
  return context
    .replace(/```/g, '′′′')  // Replace code fences that could escape context
    .replace(/<\/?system>/gi, '[system]')  // Neutralize system tags
    .replace(/\[INST\]/gi, '[inst]')  // Neutralize instruction markers
    .replace(/<<SYS>>/gi, '[[SYS]]');  // Neutralize system markers
}

/**
 * Error types for Gemini API failures
 */
export class GeminiAPIError extends Error {
  constructor(
    message: string,
    public readonly code: 'API_KEY' | 'QUOTA' | 'SAFETY' | 'TIMEOUT' | 'NETWORK' | 'UNKNOWN'
  ) {
    super(message);
    this.name = 'GeminiAPIError';
  }
}

/**
 * Wrap a promise with a timeout
 */
function withTimeout<T>(promise: Promise<T>, ms: number, operation: string): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) =>
      setTimeout(() => reject(new GeminiAPIError(`${operation} timed out after ${ms}ms`, 'TIMEOUT')), ms)
    )
  ]);
}

/**
 * Classify and wrap Gemini API errors with specific types
 */
function classifyError(error: unknown): GeminiAPIError {
  if (error instanceof GeminiAPIError) {
    return error;
  }

  if (error instanceof Error) {
    const msg = error.message.toLowerCase();
    if (msg.includes('api key') || msg.includes('apikey') || msg.includes('authentication')) {
      return new GeminiAPIError('Invalid or missing GOOGLE_AI_API_KEY', 'API_KEY');
    }
    if (msg.includes('quota') || msg.includes('rate limit') || msg.includes('429')) {
      return new GeminiAPIError('Gemini API quota exceeded. Try again later or check your usage limits.', 'QUOTA');
    }
    if (msg.includes('safety') || msg.includes('blocked')) {
      return new GeminiAPIError('Response blocked by Gemini safety filters. Try rephrasing your query.', 'SAFETY');
    }
    if (msg.includes('timeout') || msg.includes('timed out')) {
      return new GeminiAPIError(`Gemini API request timed out after ${API_TIMEOUT_MS}ms`, 'TIMEOUT');
    }
    if (msg.includes('network') || msg.includes('econnrefused') || msg.includes('fetch failed')) {
      return new GeminiAPIError('Network error connecting to Gemini API', 'NETWORK');
    }
    return new GeminiAPIError(`Gemini API error: ${error.message}`, 'UNKNOWN');
  }

  return new GeminiAPIError('Unknown Gemini API error', 'UNKNOWN');
}

// Import shared types from responder.ts to avoid type divergence
import type { Source, RAGResponse, ResponseOptions } from './responder.js';

/**
 * Generate a response using Gemini 2.0 Flash based on pre-filtered context
 */
export async function generateResponse(
  query: string,
  context: string,
  sources: Source[],
  options: ResponseOptions = {}
): Promise<RAGResponse> {
  validateQuery(query);
  validateContext(context);
  validateSources(sources);

  const client = getGeminiClient();

  const {
    maxTokens = 2048,
    temperature = 0.7,
    systemPrompt = DEFAULT_SYSTEM_PROMPT
  } = options;

  const sanitizedCtx = sanitizeContext(context);

  const userMessage = `Context (pre-filtered for relevance):
\`\`\`context
${sanitizedCtx}
\`\`\`

Question: ${query}

Please provide a comprehensive answer based on the context above.`;

  try {
    const response = await withTimeout(
      client.models.generateContent({
        model: GEMINI_MODEL,
        contents: [{ role: 'user', parts: [{ text: userMessage }] }],
        config: {
          systemInstruction: systemPrompt,
          maxOutputTokens: maxTokens,
          temperature,
        },
      }),
      API_TIMEOUT_MS,
      'Gemini generateContent'
    );

    // Safely extract text from response with proper error handling
    let text: string | undefined;
    try {
      text = response.text;
    } catch (textError) {
      // response.text getter can throw if response structure is malformed
      throw new GeminiAPIError(
        `Failed to extract text from Gemini response: ${textError instanceof Error ? textError.message : 'Unknown error'}`,
        'UNKNOWN'
      );
    }

    if (!text) {
      throw new GeminiAPIError('Empty response from Gemini', 'UNKNOWN');
    }

    // Gemini provides usage metadata when available
    const usageMetadata = response.usageMetadata;

    return {
      answer: text,
      sources,
      tokensUsed: {
        input: usageMetadata?.promptTokenCount ?? 0,
        output: usageMetadata?.candidatesTokenCount ?? 0
      }
    };
  } catch (error) {
    throw classifyError(error);
  }
}

/**
 * Streaming version for real-time responses.
 * Yields text chunks as they arrive, returns full RAGResponse at the end.
 */
export async function* streamResponse(
  query: string,
  context: string,
  sources: Source[],
  options: ResponseOptions = {}
): AsyncGenerator<string, RAGResponse, unknown> {
  validateQuery(query);
  validateContext(context);
  validateSources(sources);

  const client = getGeminiClient();

  const {
    maxTokens = 2048,
    temperature = 0.7,
    systemPrompt = DEFAULT_SYSTEM_PROMPT
  } = options;

  const sanitizedCtx = sanitizeContext(context);

  const userMessage = `Context (pre-filtered for relevance):
\`\`\`context
${sanitizedCtx}
\`\`\`

Question: ${query}`;

  let fullAnswer = '';
  let inputTokens = 0;
  let outputTokens = 0;

  try {
    // Create abort controller for timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), API_TIMEOUT_MS);

    try {
      const response = await client.models.generateContentStream({
        model: GEMINI_MODEL,
        contents: [{ role: 'user', parts: [{ text: userMessage }] }],
        config: {
          systemInstruction: systemPrompt,
          maxOutputTokens: maxTokens,
          temperature,
        },
      });

      for await (const chunk of response) {
        const text = chunk.text;
        if (text) {
          fullAnswer += text;
          yield text;
        }

        // Update token counts from usage metadata when available
        if (chunk.usageMetadata) {
          inputTokens = chunk.usageMetadata.promptTokenCount ?? inputTokens;
          outputTokens = chunk.usageMetadata.candidatesTokenCount ?? outputTokens;
        }
      }

      return {
        answer: fullAnswer,
        sources,
        tokensUsed: { input: inputTokens, output: outputTokens }
      };
    } finally {
      clearTimeout(timeoutId);
    }
  } catch (error) {
    throw classifyError(error);
  }
}

/**
 * Check if Gemini response generation is available
 */
export async function checkGeminiReady(): Promise<boolean> {
  try {
    const client = getGeminiClient();
    const response = await client.models.generateContent({
      model: GEMINI_MODEL,
      contents: 'Say "ready" in one word.',
      config: {
        maxOutputTokens: 10,
      },
    });
    return !!response.text;
  } catch {
    return false;
  }
}

// Export types for use in other modules
export type { Source, RAGResponse, ResponseOptions };
