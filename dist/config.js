/**
 * Claude model identifiers
 */
export const MODELS = {
    /** Haiku 3.5 - Fast and efficient for sub-agent tasks */
    HAIKU: "claude-haiku-4-5-20241022",
    /** Opus 4.5 - Most capable model for synthesis */
    OPUS: "claude-opus-4-5-20251101",
    /** Sonnet 3.5 - Balanced option */
    SONNET: "claude-sonnet-4-20250514",
};
/**
 * Default configuration values
 */
export const DEFAULTS = {
    /** Number of top chunks to retrieve */
    TOP_K: 5,
    /** Chunk size in words */
    CHUNK_SIZE: 100,
    /** Overlap between chunks in words */
    CHUNK_OVERLAP: 20,
    /** Default database path */
    DB_PATH: "./data/lancedb",
};
/**
 * Get the default RAG configuration
 */
export function getDefaultConfig(overrides) {
    return {
        haikuModel: MODELS.HAIKU,
        opusModel: MODELS.OPUS,
        topK: DEFAULTS.TOP_K,
        chunkSize: DEFAULTS.CHUNK_SIZE,
        chunkOverlap: DEFAULTS.CHUNK_OVERLAP,
        dbPath: DEFAULTS.DB_PATH,
        apiKey: process.env.ANTHROPIC_API_KEY,
        ...overrides,
    };
}
/**
 * Validate a RAG configuration
 */
export function validateConfig(config) {
    if (!config.apiKey) {
        throw new Error("Anthropic API key is required. Set ANTHROPIC_API_KEY environment variable or pass apiKey in config.");
    }
    if (config.topK < 1 || config.topK > 100) {
        throw new Error("topK must be between 1 and 100");
    }
    if (config.chunkSize < 10 || config.chunkSize > 10000) {
        throw new Error("chunkSize must be between 10 and 10000 words");
    }
    if (config.chunkOverlap < 0 || config.chunkOverlap >= config.chunkSize) {
        throw new Error("chunkOverlap must be >= 0 and less than chunkSize");
    }
}
//# sourceMappingURL=config.js.map