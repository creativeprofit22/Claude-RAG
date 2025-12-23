import Anthropic from '@anthropic-ai/sdk';

const OPUS_MODEL = 'claude-opus-4-5-20251101';

interface Source {
  documentId: string;
  documentName: string;
  chunkIndex: number;
  snippet: string;
}

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

const DEFAULT_SYSTEM_PROMPT = `You are a helpful assistant that answers questions based on provided context.
- Answer using ONLY the information in the context
- If the context doesn't contain enough information, say so clearly
- Reference sources when possible (e.g., "According to [document name]...")
- Be concise but thorough`;

/**
 * Generate a response using Claude Opus 4.5 based on pre-filtered context
 * from the Haiku sub-agent.
 */
export async function generateResponse(
  query: string,
  context: string,
  sources: Source[],
  options: ResponseOptions = {}
): Promise<RAGResponse> {
  const anthropic = new Anthropic();

  const {
    maxTokens = 2048,
    temperature = 0.7,
    systemPrompt = DEFAULT_SYSTEM_PROMPT
  } = options;

  const userMessage = `Context (pre-filtered for relevance):
${context}

Question: ${query}

Please provide a comprehensive answer based on the context above.`;

  try {
    const response = await anthropic.messages.create({
      model: OPUS_MODEL,
      max_tokens: maxTokens,
      temperature,
      system: systemPrompt,
      messages: [{ role: 'user', content: userMessage }]
    });

    const content = response.content[0];
    if (content.type !== 'text') {
      throw new Error('Unexpected response type from Opus');
    }

    return {
      answer: content.text,
      sources,
      tokensUsed: {
        input: response.usage.input_tokens,
        output: response.usage.output_tokens
      }
    };
  } catch (error) {
    if (error instanceof Anthropic.APIError) {
      throw new Error(`Anthropic API error: ${error.status} - ${error.message}`);
    }
    throw error;
  }
}

/**
 * Streaming version for real-time responses.
 * Yields text chunks as they arrive, returns full RAGResponse at the end.
 */
export async function* streamResponse(
  query: string,
  context: string,
  sources: Source[],
  options: ResponseOptions = {}
): AsyncGenerator<string, RAGResponse, unknown> {
  const anthropic = new Anthropic();

  const {
    maxTokens = 2048,
    temperature = 0.7,
    systemPrompt = DEFAULT_SYSTEM_PROMPT
  } = options;

  const userMessage = `Context (pre-filtered for relevance):
${context}

Question: ${query}`;

  let fullAnswer = '';
  let inputTokens = 0;
  let outputTokens = 0;

  try {
    const stream = anthropic.messages.stream({
      model: OPUS_MODEL,
      max_tokens: maxTokens,
      temperature,
      system: systemPrompt,
      messages: [{ role: 'user', content: userMessage }]
    });

    for await (const event of stream) {
      if (event.type === 'content_block_delta' && event.delta.type === 'text_delta') {
        fullAnswer += event.delta.text;
        yield event.delta.text;
      }
      if (event.type === 'message_delta' && event.usage) {
        outputTokens = event.usage.output_tokens;
      }
      if (event.type === 'message_start' && event.message.usage) {
        inputTokens = event.message.usage.input_tokens;
      }
    }

    return {
      answer: fullAnswer,
      sources,
      tokensUsed: { input: inputTokens, output: outputTokens }
    };
  } catch (error) {
    if (error instanceof Anthropic.APIError) {
      throw new Error(`Anthropic API error: ${error.status} - ${error.message}`);
    }
    throw error;
  }
}

// Export types for use in other modules
export type { Source, RAGResponse, ResponseOptions };
