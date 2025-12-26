/**
 * Shared error handling utilities for RAG responders
 * Provides consistent error classification across Claude CLI and Gemini responders
 */
/**
 * Base error class for responder failures
 */
export class ResponderError extends Error {
    code;
    responder;
    constructor(message, code, responder) {
        super(message);
        this.code = code;
        this.responder = responder;
        this.name = 'ResponderError';
    }
}
/**
 * Classify CLI errors from stderr content and exit code
 */
export function classifyCliError(stderr, fallbackOutput, code) {
    // Handle signal termination (code is null when killed by signal)
    if (code === null) {
        return new ResponderError('Claude Code CLI was terminated by a signal', 'UNKNOWN', 'claude');
    }
    // Check for common error patterns (case-insensitive)
    const stderrLower = stderr.toLowerCase();
    if (stderrLower.includes('not authenticated') || stderrLower.includes('auth')) {
        return new ResponderError('Claude Code authentication error. Run "claude login" to authenticate.', 'AUTH', 'claude');
    }
    if (stderrLower.includes('rate limit') || stderrLower.includes('429')) {
        return new ResponderError('Rate limit exceeded. Please wait before retrying.', 'RATE_LIMIT', 'claude');
    }
    return new ResponderError(`Claude Code CLI failed with exit code ${code}: ${stderr || fallbackOutput || 'Unknown error'}`, 'UNKNOWN', 'claude');
}
/**
 * Classify Gemini API errors
 */
export function classifyGeminiError(error, timeoutMs) {
    if (error instanceof ResponderError) {
        return error;
    }
    if (error instanceof Error) {
        const msg = error.message.toLowerCase();
        if (msg.includes('api key') || msg.includes('apikey') || msg.includes('authentication')) {
            return new ResponderError('Invalid or missing GOOGLE_AI_API_KEY', 'AUTH', 'gemini');
        }
        if (msg.includes('quota') || msg.includes('rate limit') || msg.includes('429')) {
            return new ResponderError('Gemini API quota exceeded. Try again later or check your usage limits.', 'RATE_LIMIT', 'gemini');
        }
        if (msg.includes('safety') || msg.includes('blocked')) {
            return new ResponderError('Response blocked by Gemini safety filters. Try rephrasing your query.', 'SAFETY', 'gemini');
        }
        if (msg.includes('timeout') || msg.includes('timed out')) {
            const timeoutInfo = timeoutMs ? ` after ${timeoutMs}ms` : '';
            return new ResponderError(`Gemini API request timed out${timeoutInfo}`, 'TIMEOUT', 'gemini');
        }
        if (msg.includes('network') || msg.includes('econnrefused') || msg.includes('fetch failed')) {
            return new ResponderError('Network error connecting to Gemini API', 'NETWORK', 'gemini');
        }
        return new ResponderError(`Gemini API error: ${error.message}`, 'UNKNOWN', 'gemini');
    }
    return new ResponderError('Unknown Gemini API error', 'UNKNOWN', 'gemini');
}
/**
 * Create a CLI not found error
 */
export function cliNotFoundError() {
    return new ResponderError('Claude Code CLI is not installed or not in PATH. Install it with: npm install -g @anthropic-ai/claude-code', 'NOT_FOUND', 'claude');
}
/**
 * Create a timeout error for Gemini
 */
export function createTimeoutError(operation, ms) {
    return new ResponderError(`${operation} timed out after ${ms}ms`, 'TIMEOUT', 'gemini');
}
//# sourceMappingURL=responder-errors.js.map