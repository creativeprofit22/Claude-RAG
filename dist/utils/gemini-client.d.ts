/**
 * OpenRouter client for embeddings and chat completions
 * Replaces direct Google AI SDK with OpenRouter API
 */
interface EmbedContentConfig {
    taskType?: 'RETRIEVAL_DOCUMENT' | 'RETRIEVAL_QUERY';
    outputDimensionality?: number;
}
interface EmbedContentResponse {
    embeddings: Array<{
        values: number[];
    }>;
}
interface ContentPart {
    text: string;
}
interface Content {
    role: 'user' | 'model';
    parts: ContentPart[];
}
interface GenerateContentConfig {
    systemInstruction?: string;
    maxOutputTokens?: number;
    temperature?: number;
}
interface GenerateContentParams {
    model: string;
    contents: Content[] | string;
    config?: GenerateContentConfig;
}
interface UsageMetadata {
    promptTokenCount: number;
    candidatesTokenCount: number;
    totalTokenCount: number;
}
interface GenerateContentResponse {
    text: string;
    usageMetadata?: UsageMetadata;
}
interface StreamChunk {
    text: string;
    usageMetadata?: UsageMetadata;
}
interface AsyncGenerateContentResponse {
    [Symbol.asyncIterator](): AsyncIterator<StreamChunk>;
}
/**
 * OpenRouter client that mimics the Google GenAI interface
 */
declare class OpenRouterClient {
    private apiKey;
    constructor(apiKey: string);
    models: {
        /**
         * Generate embeddings via OpenRouter
         */
        embedContent: (params: {
            model: string;
            contents: string | string[];
            config?: EmbedContentConfig;
        }) => Promise<EmbedContentResponse>;
        /**
         * Generate chat completion via OpenRouter
         */
        generateContent: (params: GenerateContentParams) => Promise<GenerateContentResponse>;
        /**
         * Stream chat completion via OpenRouter
         */
        generateContentStream: (params: GenerateContentParams) => Promise<AsyncGenerateContentResponse>;
    };
}
/**
 * Get or create the OpenRouter client singleton
 */
export declare function getGeminiClient(): OpenRouterClient;
/**
 * Async version for scenarios where you want to await initialization
 */
export declare function getGeminiClientAsync(): Promise<OpenRouterClient>;
/**
 * Reset the client (useful for testing or when API key changes)
 */
export declare function resetGeminiClient(): void;
export {};
//# sourceMappingURL=gemini-client.d.ts.map