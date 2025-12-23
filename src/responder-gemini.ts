/**
 * Gemini-based responder for RAG system
 * Alternative to Claude-based responder for users without Anthropic API access
 * Uses Google Gemini 2.0 Flash (free tier)
 */

import { GoogleGenAI } from '@google/genai';

// Gemini 2.0 Flash - fast and free-tier friendly
const GEMINI_MODEL = process.env.GEMINI_RESPONSE_MODEL || 'gemini-2.0-flash';

interface Source {
  documentId: string;
  documentName: string;
  chunkIndex: number;
  snippet: string;
}

interface RAGResponse {
  answer: string;
  sources: Source[];
  tokensUsed: {
    input: number;
    output: number;
  };
}

interface ResponseOptions {
  systemPrompt?: string;
  maxTokens?: number;
  temperature?: number;
}

const DEFAULT_SYSTEM_PROMPT = `You are a helpful assistant that answers questions based on provided context.
- Answer using ONLY the information in the context
- If the context doesn't contain enough information, say so clearly
- Reference sources when possible (e.g., "According to [document name]...")
- Be concise but thorough`;

let genaiClient: GoogleGenAI | null = null;

function getClient(): GoogleGenAI {
  if (!genaiClient) {
    const apiKey = process.env.GOOGLE_AI_API_KEY;
    if (!apiKey) {
      throw new Error(
        'GOOGLE_AI_API_KEY environment variable is required. Get one at https://aistudio.google.com/apikey'
      );
    }
    genaiClient = new GoogleGenAI({ apiKey });
  }
  return genaiClient;
}

/**
 * Generate a response using Gemini 2.0 Flash based on pre-filtered context
 */
export async function generateResponse(
  query: string,
  context: string,
  sources: Source[],
  options: ResponseOptions = {}
): Promise<RAGResponse> {
  // Validate required parameters
  if (!query || typeof query !== 'string' || query.trim().length === 0) {
    throw new Error('Query must be a non-empty string');
  }
  if (!context || typeof context !== 'string') {
    throw new Error('Context must be a string');
  }
  if (!Array.isArray(sources)) {
    throw new Error('Sources must be an array');
  }

  const client = getClient();

  const {
    maxTokens = 2048,
    temperature = 0.7,
    systemPrompt = DEFAULT_SYSTEM_PROMPT
  } = options;

  const userMessage = `Context (pre-filtered for relevance):
${context}

Question: ${query}

Please provide a comprehensive answer based on the context above.`;

  try {
    const response = await client.models.generateContent({
      model: GEMINI_MODEL,
      contents: [{ role: 'user', parts: [{ text: userMessage }] }],
      config: {
        systemInstruction: systemPrompt,
        maxOutputTokens: maxTokens,
        temperature,
      },
    });

    // Safely extract text from response with proper error handling
    let text: string | undefined;
    try {
      text = response.text;
    } catch (textError) {
      // response.text getter can throw if response structure is malformed
      throw new Error(`Failed to extract text from Gemini response: ${textError instanceof Error ? textError.message : 'Unknown error'}`);
    }

    if (!text) {
      throw new Error('Empty response from Gemini');
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
    if (error instanceof Error) {
      // Handle common Gemini API errors
      if (error.message.includes('API key')) {
        throw new Error('Invalid or missing GOOGLE_AI_API_KEY');
      }
      if (error.message.includes('quota')) {
        throw new Error('Gemini API quota exceeded. Try again later or check your usage limits.');
      }
      if (error.message.includes('safety')) {
        throw new Error('Response blocked by Gemini safety filters. Try rephrasing your query.');
      }
      throw new Error(`Gemini API error: ${error.message}`);
    }
    throw error;
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
  // Validate required parameters
  if (!query || typeof query !== 'string' || query.trim().length === 0) {
    throw new Error('Query must be a non-empty string');
  }
  if (!context || typeof context !== 'string') {
    throw new Error('Context must be a string');
  }
  if (!Array.isArray(sources)) {
    throw new Error('Sources must be an array');
  }

  const client = getClient();

  const {
    maxTokens = 2048,
    temperature = 0.7,
    systemPrompt = DEFAULT_SYSTEM_PROMPT
  } = options;

  const userMessage = `Context (pre-filtered for relevance):
${context}

Question: ${query}`;

  let fullAnswer = '';
  let inputTokens = 0;
  let outputTokens = 0;

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
  } catch (error) {
    if (error instanceof Error) {
      if (error.message.includes('API key')) {
        throw new Error('Invalid or missing GOOGLE_AI_API_KEY');
      }
      if (error.message.includes('quota')) {
        throw new Error('Gemini API quota exceeded. Try again later or check your usage limits.');
      }
      if (error.message.includes('safety')) {
        throw new Error('Response blocked by Gemini safety filters. Try rephrasing your query.');
      }
      throw new Error(`Gemini API error: ${error.message}`);
    }
    throw error;
  }
}

/**
 * Check if Gemini response generation is available
 */
export async function checkGeminiReady(): Promise<boolean> {
  try {
    const client = getClient();
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
