/**
 * Shared validation utilities for Claude RAG
 */
/**
 * Validate that a query is a non-empty string
 * @throws Error if query is invalid
 */
export declare function validateQuery(query: unknown): asserts query is string;
/**
 * Validate that context is a string (can be empty)
 * @throws Error if context is not a string
 */
export declare function validateContext(context: unknown): asserts context is string;
/**
 * Validate that sources is an array
 * @throws Error if sources is not an array
 */
export declare function validateSources(sources: unknown): asserts sources is unknown[];
//# sourceMappingURL=validation.d.ts.map