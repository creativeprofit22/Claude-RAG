/**
 * Shared Gemini client singleton
 * Used by responder-gemini.ts and retriever.ts
 */
import { GoogleGenAI } from '@google/genai';
/**
 * Get or create the Gemini client singleton
 * Thread-safe initialization using Promise-based locking to handle concurrent access
 */
export declare function getGeminiClient(): GoogleGenAI;
/**
 * Async version for scenarios where you want to await initialization
 * Handles concurrent access safely using a shared promise
 */
export declare function getGeminiClientAsync(): Promise<GoogleGenAI>;
/**
 * Reset the client (useful for testing or when API key changes)
 */
export declare function resetGeminiClient(): void;
//# sourceMappingURL=gemini-client.d.ts.map