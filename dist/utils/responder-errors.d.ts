/**
 * Shared error handling utilities for RAG responders
 * Provides consistent error classification across Claude CLI and Gemini responders
 */
/**
 * Error codes for responder failures
 */
export type ResponderErrorCode = 'AUTH' | 'RATE_LIMIT' | 'SAFETY' | 'TIMEOUT' | 'NETWORK' | 'NOT_FOUND' | 'UNKNOWN';
/**
 * Base error class for responder failures
 */
export declare class ResponderError extends Error {
    readonly code: ResponderErrorCode;
    readonly responder: 'claude' | 'gemini';
    constructor(message: string, code: ResponderErrorCode, responder: 'claude' | 'gemini');
}
/**
 * Classify CLI errors from stderr content and exit code
 */
export declare function classifyCliError(stderr: string, fallbackOutput: string, code: number | null): ResponderError;
/**
 * Classify Gemini API errors
 */
export declare function classifyGeminiError(error: unknown, timeoutMs?: number): ResponderError;
/**
 * Create a CLI not found error
 */
export declare function cliNotFoundError(): ResponderError;
/**
 * Create a timeout error for Gemini
 */
export declare function createTimeoutError(operation: string, ms: number): ResponderError;
//# sourceMappingURL=responder-errors.d.ts.map