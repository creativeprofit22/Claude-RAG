/**
 * Shared Gemini client singleton
 * Used by responder-gemini.ts and retriever.ts
 */

import { GoogleGenAI } from '@google/genai';

let genaiClient: GoogleGenAI | null = null;
let clientInitializing = false;

/**
 * Get or create the Gemini client singleton
 * Thread-safe initialization with concurrent access protection
 */
export function getGeminiClient(): GoogleGenAI {
  if (genaiClient) {
    return genaiClient;
  }

  // Prevent concurrent initialization attempts
  if (clientInitializing) {
    throw new Error('Client initialization already in progress. Please retry.');
  }

  clientInitializing = true;
  try {
    const apiKey = process.env.GOOGLE_AI_API_KEY;
    if (!apiKey) {
      throw new Error(
        'GOOGLE_AI_API_KEY environment variable is required. Get one at https://aistudio.google.com/apikey'
      );
    }
    genaiClient = new GoogleGenAI({ apiKey });
    return genaiClient;
  } finally {
    clientInitializing = false;
  }
}
