/**
 * Gemini-based responder for RAG system
 * Alternative to Claude-based responder for users without Anthropic API access
 * Uses Google Gemini 2.0 Flash (free tier)
 */
import type { Source, RAGResponse, ResponseOptions } from './responder.js';
/**
 * Generate a response using Gemini 2.0 Flash based on pre-filtered context
 */
export declare function generateResponse(query: string, context: string, sources: Source[], options?: ResponseOptions): Promise<RAGResponse>;
/**
 * Streaming version for real-time responses.
 * Yields text chunks as they arrive, returns full RAGResponse at the end.
 */
export declare function streamResponse(query: string, context: string, sources: Source[], options?: ResponseOptions): AsyncGenerator<string, RAGResponse, unknown>;
/**
 * Check if Gemini response generation is available
 */
export declare function checkGeminiReady(): Promise<boolean>;
export type { Source, RAGResponse, ResponseOptions };
//# sourceMappingURL=responder-gemini.d.ts.map