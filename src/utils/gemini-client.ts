/**
 * OpenRouter client for embeddings and chat completions
 * Replaces direct Google AI SDK with OpenRouter API
 */

const OPENROUTER_BASE_URL = 'https://openrouter.ai/api/v1';

// ============ Embedding Types ============

interface OpenRouterEmbeddingResponse {
  data: Array<{
    embedding: number[];
    index: number;
  }>;
  model: string;
  usage: {
    prompt_tokens: number;
    total_tokens: number;
  };
}

interface EmbedContentConfig {
  taskType?: 'RETRIEVAL_DOCUMENT' | 'RETRIEVAL_QUERY';
  outputDimensionality?: number;
}

interface EmbedContentResponse {
  embeddings: Array<{
    values: number[];
  }>;
}

// ============ Chat Completion Types ============

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

interface OpenRouterChatResponse {
  choices: Array<{
    message: {
      content: string;
      role: string;
    };
    finish_reason: string;
  }>;
  usage?: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

// ============ Streaming Types ============

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
class OpenRouterClient {
  private apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  models = {
    /**
     * Generate embeddings via OpenRouter
     */
    embedContent: async (params: {
      model: string;
      contents: string | string[];
      config?: EmbedContentConfig;
    }): Promise<EmbedContentResponse> => {
      const { model, contents } = params;

      // Normalize to array
      const inputArray = Array.isArray(contents) ? contents : [contents];

      // Get dimensions from env or default to 1024 for backwards compatibility
      const dimensions = Number(process.env.GEMINI_EMBEDDING_DIM) || 1024;

      const response = await fetch(`${OPENROUTER_BASE_URL}/embeddings`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': 'https://claude-rag.local',
          'X-Title': 'Claude-RAG',
        },
        body: JSON.stringify({
          model,
          input: inputArray,
          dimensions,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`OpenRouter API error (${response.status}): ${errorText}`);
      }

      const data: OpenRouterEmbeddingResponse = await response.json();

      // Convert OpenRouter response to Google GenAI format
      return {
        embeddings: data.data.map(item => ({
          values: item.embedding,
        })),
      };
    },

    /**
     * Generate chat completion via OpenRouter
     */
    generateContent: async (params: GenerateContentParams): Promise<GenerateContentResponse> => {
      const { model, contents, config } = params;

      // Convert Google format to OpenAI format
      const messages: Array<{ role: string; content: string }> = [];

      // Add system message if provided
      if (config?.systemInstruction) {
        messages.push({
          role: 'system',
          content: config.systemInstruction,
        });
      }

      // Convert contents - handle string or Content[]
      if (typeof contents === 'string') {
        messages.push({ role: 'user', content: contents });
      } else {
        for (const content of contents) {
          messages.push({
            role: content.role === 'model' ? 'assistant' : 'user',
            content: content.parts.map(p => p.text).join('\n'),
          });
        }
      }

      const response = await fetch(`${OPENROUTER_BASE_URL}/chat/completions`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': 'https://claude-rag.local',
          'X-Title': 'Claude-RAG',
        },
        body: JSON.stringify({
          model,
          messages,
          max_tokens: config?.maxOutputTokens,
          temperature: config?.temperature,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`OpenRouter API error (${response.status}): ${errorText}`);
      }

      const data: OpenRouterChatResponse = await response.json();

      return {
        text: data.choices[0]?.message?.content ?? '',
        usageMetadata: data.usage ? {
          promptTokenCount: data.usage.prompt_tokens,
          candidatesTokenCount: data.usage.completion_tokens,
          totalTokenCount: data.usage.total_tokens,
        } : undefined,
      };
    },

    /**
     * Stream chat completion via OpenRouter
     */
    generateContentStream: async (params: GenerateContentParams): Promise<AsyncGenerateContentResponse> => {
      const { model, contents, config } = params;

      // Convert Google format to OpenAI format
      const messages: Array<{ role: string; content: string }> = [];

      if (config?.systemInstruction) {
        messages.push({
          role: 'system',
          content: config.systemInstruction,
        });
      }

      // Convert contents - handle string or Content[]
      if (typeof contents === 'string') {
        messages.push({ role: 'user', content: contents });
      } else {
        for (const content of contents) {
          messages.push({
            role: content.role === 'model' ? 'assistant' : 'user',
            content: content.parts.map(p => p.text).join('\n'),
          });
        }
      }

      const response = await fetch(`${OPENROUTER_BASE_URL}/chat/completions`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': 'https://claude-rag.local',
          'X-Title': 'Claude-RAG',
        },
        body: JSON.stringify({
          model,
          messages,
          max_tokens: config?.maxOutputTokens,
          temperature: config?.temperature,
          stream: true,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`OpenRouter API error (${response.status}): ${errorText}`);
      }

      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error('No response body for streaming');
      }

      const decoder = new TextDecoder();

      return {
        async *[Symbol.asyncIterator]() {
          let buffer = '';

          while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            buffer += decoder.decode(value, { stream: true });
            const lines = buffer.split('\n');
            buffer = lines.pop() || '';

            for (const line of lines) {
              const trimmed = line.trim();
              if (!trimmed || trimmed === 'data: [DONE]') continue;
              if (!trimmed.startsWith('data: ')) continue;

              try {
                const json = JSON.parse(trimmed.slice(6));
                const content = json.choices?.[0]?.delta?.content;
                if (content) {
                  yield { text: content };
                }
              } catch {
                // Skip malformed JSON
              }
            }
          }
        },
      };
    },
  };
}

let client: OpenRouterClient | null = null;

/**
 * Get or create the OpenRouter client singleton
 */
export function getGeminiClient(): OpenRouterClient {
  if (client) {
    return client;
  }

  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) {
    throw new Error(
      'OPENROUTER_API_KEY environment variable is required. Get one at https://openrouter.ai/keys'
    );
  }

  client = new OpenRouterClient(apiKey);
  return client;
}

/**
 * Async version for scenarios where you want to await initialization
 */
export async function getGeminiClientAsync(): Promise<OpenRouterClient> {
  return getGeminiClient();
}

/**
 * Reset the client (useful for testing or when API key changes)
 */
export function resetGeminiClient(): void {
  client = null;
}
