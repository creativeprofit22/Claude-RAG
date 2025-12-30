/**
 * Gemini-based responder for RAG system
 * Alternative to Claude-based responder for users without Anthropic API access
 * Uses Google Gemini 2.0 Flash (free tier)
 */
import { getGeminiClient } from './utils/gemini-client.js';
import { DEFAULT_SYSTEM_PROMPT } from './constants.js';
import { validateQuery, validateContext, validateSources } from './utils/validation.js';
import { ResponderError, classifyGeminiError, createTimeoutError } from './utils/responder-errors.js';
// Gemini 2.0 Flash via OpenRouter - fast and cost effective
const GEMINI_MODEL = process.env.GEMINI_RESPONSE_MODEL || 'google/gemini-2.0-flash-001';
// API timeout in milliseconds (default: 60 seconds)
const API_TIMEOUT_MS = parseInt(process.env.GEMINI_TIMEOUT_MS || '60000', 10);
/**
 * Sanitize context to prevent prompt injection attacks.
 * Uses clear delimiters that are unlikely to appear in legitimate content.
 */
function sanitizeContext(context) {
    return context
        .replace(/```/g, '′′′') // Replace code fences that could escape context
        .replace(/<\/?system>/gi, '[system]') // Neutralize system tags
        .replace(/\[INST\]/gi, '[inst]') // Neutralize instruction markers
        .replace(/<<SYS>>/gi, '[[SYS]]'); // Neutralize system markers
}
/**
 * Wrap a promise with a timeout
 */
function withTimeout(promise, ms, operation) {
    return Promise.race([
        promise,
        new Promise((_, reject) => setTimeout(() => reject(createTimeoutError(operation, ms)), ms))
    ]);
}
/**
 * Generate a response using Gemini 2.0 Flash based on pre-filtered context
 */
export async function generateResponse(query, context, sources, options = {}) {
    validateQuery(query);
    validateContext(context);
    validateSources(sources);
    const client = getGeminiClient();
    const { maxTokens = 2048, temperature = 0.7, systemPrompt = DEFAULT_SYSTEM_PROMPT } = options;
    const sanitizedCtx = sanitizeContext(context);
    const userMessage = `Context (pre-filtered for relevance):
\`\`\`context
${sanitizedCtx}
\`\`\`

Question: ${query}

Please provide a comprehensive answer based on the context above.`;
    try {
        const response = await withTimeout(client.models.generateContent({
            model: GEMINI_MODEL,
            contents: [{ role: 'user', parts: [{ text: userMessage }] }],
            config: {
                systemInstruction: systemPrompt,
                maxOutputTokens: maxTokens,
                temperature,
            },
        }), API_TIMEOUT_MS, 'Gemini generateContent');
        // Safely extract text from response with proper error handling
        let text;
        try {
            text = response.text;
        }
        catch (textError) {
            // response.text getter can throw if response structure is malformed
            throw new ResponderError(`Failed to extract text from Gemini response: ${textError instanceof Error ? textError.message : 'Unknown error'}`, 'UNKNOWN', 'gemini');
        }
        if (!text) {
            throw new ResponderError('Empty response from Gemini', 'UNKNOWN', 'gemini');
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
    }
    catch (error) {
        throw classifyGeminiError(error, API_TIMEOUT_MS);
    }
}
/**
 * Streaming version for real-time responses.
 * Yields text chunks as they arrive, returns full RAGResponse at the end.
 */
export async function* streamResponse(query, context, sources, options = {}) {
    validateQuery(query);
    validateContext(context);
    validateSources(sources);
    const client = getGeminiClient();
    const { maxTokens = 2048, temperature = 0.7, systemPrompt = DEFAULT_SYSTEM_PROMPT } = options;
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
    }
    catch (error) {
        throw classifyGeminiError(error, API_TIMEOUT_MS);
    }
}
/**
 * Check if Gemini response generation is available
 */
export async function checkGeminiReady() {
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
    }
    catch {
        return false;
    }
}
//# sourceMappingURL=responder-gemini.js.map