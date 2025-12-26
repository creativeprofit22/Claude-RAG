import type { RAGConfig } from "./types.js";
/**
 * Claude model identifiers
 */
export declare const MODELS: {
    /** Haiku 3.5 - Fast and efficient for sub-agent tasks */
    readonly HAIKU: "claude-haiku-4-5-20241022";
    /** Opus 4.5 - Most capable model for synthesis */
    readonly OPUS: "claude-opus-4-5-20251101";
    /** Sonnet 3.5 - Balanced option */
    readonly SONNET: "claude-sonnet-4-20250514";
};
/**
 * Default configuration values
 */
export declare const DEFAULTS: {
    /** Number of top chunks to retrieve */
    readonly TOP_K: 5;
    /** Chunk size in words */
    readonly CHUNK_SIZE: 100;
    /** Overlap between chunks in words */
    readonly CHUNK_OVERLAP: 20;
    /** Default database path */
    readonly DB_PATH: "./data/lancedb";
};
/**
 * Get the default RAG configuration
 */
export declare function getDefaultConfig(overrides?: Partial<RAGConfig>): RAGConfig;
/**
 * Validate a RAG configuration
 */
export declare function validateConfig(config: RAGConfig): void;
//# sourceMappingURL=config.d.ts.map