import type { ChunkSource } from './utils/chunks.js';
export type Source = ChunkSource;
interface RAGResponse {
    answer: string;
    sources: Source[];
    tokensUsed: {
        input: number;
        output: number;
    };
}
interface ResponseOptions {
    systemPrompt?: string;
    maxTokens?: number;
    temperature?: number;
}
/**
 * Generate a response using Claude Code CLI based on pre-filtered context.
 */
export declare function generateResponse(query: string, context: string, sources: Source[], options?: ResponseOptions): Promise<RAGResponse>;
/**
 * Streaming version for real-time responses.
 * Yields text chunks as they arrive from Claude Code CLI stdout,
 * returns full RAGResponse at the end.
 */
export declare function streamResponse(query: string, context: string, sources: Source[], options?: ResponseOptions): AsyncGenerator<string, RAGResponse, unknown>;
export type { RAGResponse, ResponseOptions };
//# sourceMappingURL=responder.d.ts.map