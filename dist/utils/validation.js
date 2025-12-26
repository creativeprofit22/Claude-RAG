/**
 * Shared validation utilities for Claude RAG
 */
/**
 * Validate that a query is a non-empty string
 * @throws Error if query is invalid
 */
export function validateQuery(query) {
    if (!query || typeof query !== 'string' || query.trim().length === 0) {
        throw new Error('Query must be a non-empty string');
    }
}
/**
 * Validate that context is a string (can be empty)
 * @throws Error if context is not a string
 */
export function validateContext(context) {
    if (typeof context !== 'string') {
        throw new Error('Context must be a string');
    }
}
/**
 * Validate that sources is an array
 * @throws Error if sources is not an array
 */
export function validateSources(sources) {
    if (!Array.isArray(sources)) {
        throw new Error('Sources must be an array');
    }
}
//# sourceMappingURL=validation.js.map