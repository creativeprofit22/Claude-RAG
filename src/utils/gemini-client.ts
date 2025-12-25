/**
 * Shared Gemini client singleton
 * Used by responder-gemini.ts and retriever.ts
 */

import { GoogleGenAI } from '@google/genai';

let genaiClient: GoogleGenAI | null = null;
let initializationPromise: Promise<GoogleGenAI> | null = null;
// Note: If GOOGLE_AI_API_KEY changes at runtime, call resetGeminiClient() to pick up the new key

/**
 * Get or create the Gemini client singleton
 * Thread-safe initialization using Promise-based locking to handle concurrent access
 */
export function getGeminiClient(): GoogleGenAI {
  if (genaiClient) {
    return genaiClient;
  }

  // Synchronous initialization - safe since GoogleGenAI constructor is sync
  const apiKey = process.env.GOOGLE_AI_API_KEY;
  if (!apiKey) {
    throw new Error(
      'GOOGLE_AI_API_KEY environment variable is required. Get one at https://aistudio.google.com/apikey'
    );
  }
  genaiClient = new GoogleGenAI({ apiKey });
  return genaiClient;
}

/**
 * Async version for scenarios where you want to await initialization
 * Handles concurrent access safely using a shared promise
 */
export async function getGeminiClientAsync(): Promise<GoogleGenAI> {
  if (genaiClient) {
    return genaiClient;
  }

  // If initialization is already in progress, wait for it
  if (initializationPromise) {
    return initializationPromise;
  }

  // Start initialization and cache the promise
  initializationPromise = (async () => {
    const apiKey = process.env.GOOGLE_AI_API_KEY;
    if (!apiKey) {
      initializationPromise = null; // Reset on failure
      throw new Error(
        'GOOGLE_AI_API_KEY environment variable is required. Get one at https://aistudio.google.com/apikey'
      );
    }
    genaiClient = new GoogleGenAI({ apiKey });
    return genaiClient;
  })();

  return initializationPromise;
}

/**
 * Reset the client (useful for testing or when API key changes)
 */
export function resetGeminiClient(): void {
  genaiClient = null;
  initializationPromise = null;
}
