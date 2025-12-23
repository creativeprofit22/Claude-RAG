import { spawn, ChildProcess } from 'child_process';
import { checkClaudeCodeAvailable } from './utils/cli.js';
import { DEFAULT_SYSTEM_PROMPT } from './constants.js';

/**
 * Classify CLI errors from stderr content and exit code
 */
function classifyCliError(stderr: string, fallbackOutput: string, code: number | null): Error {
  // Handle signal termination (code is null when killed by signal)
  if (code === null) {
    return new Error('Claude Code CLI was terminated by a signal');
  }
  // Check for common error patterns (case-insensitive)
  const stderrLower = stderr.toLowerCase();
  if (stderrLower.includes('not authenticated') || stderrLower.includes('auth')) {
    return new Error(
      'Claude Code authentication error. Run "claude login" to authenticate.'
    );
  }
  if (stderrLower.includes('rate limit') || stderrLower.includes('429')) {
    return new Error('Rate limit exceeded. Please wait before retrying.');
  }
  return new Error(
    `Claude Code CLI failed with exit code ${code}: ${stderr || fallbackOutput || 'Unknown error'}`
  );
}

/**
 * Spawn Claude CLI process with stdin prompt
 */
function spawnClaudeProcess(prompt: string): ChildProcess {
  const claudeProcess = spawn('claude', ['--print'], {
    stdio: ['pipe', 'pipe', 'pipe'],
    env: { ...process.env }
  });
  claudeProcess.stdin.write(prompt);
  claudeProcess.stdin.end();
  return claudeProcess;
}

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

/**
 * Build the full prompt for Claude Code CLI
 */
function buildPrompt(
  query: string,
  context: string,
  systemPrompt: string
): string {
  return `${systemPrompt}

Context (pre-filtered for relevance):
${context}

Question: ${query}

Please provide a comprehensive answer based on the context above.`;
}

/**
 * Estimate token counts based on text length.
 * Claude Code CLI doesn't provide token usage, so we estimate.
 * Rough estimate: ~4 characters per token for English text.
 */
function estimateTokens(text: string): number {
  return Math.ceil(text.length / 4);
}

/**
 * Generate a response using Claude Code CLI based on pre-filtered context.
 */
export async function generateResponse(
  query: string,
  context: string,
  sources: Source[],
  options: ResponseOptions = {}
): Promise<RAGResponse> {
  const { systemPrompt = DEFAULT_SYSTEM_PROMPT } = options;

  // Check if Claude Code is available
  const isAvailable = await checkClaudeCodeAvailable();
  if (!isAvailable) {
    throw new Error(
      'Claude Code CLI is not installed or not in PATH. ' +
      'Install it with: npm install -g @anthropic-ai/claude-code'
    );
  }

  const fullPrompt = buildPrompt(query, context, systemPrompt);

  return new Promise((resolve, reject) => {
    const claudeProcess = spawnClaudeProcess(fullPrompt);
    let stdout = '';
    let stderr = '';

    claudeProcess.stdout!.on('data', (data: Buffer) => {
      stdout += data.toString();
    });

    claudeProcess.stderr!.on('data', (data: Buffer) => {
      stderr += data.toString();
    });

    claudeProcess.on('close', (code: number | null) => {
      if (code !== 0) {
        reject(classifyCliError(stderr, stdout, code));
        return;
      }

      resolve({
        answer: stdout.trim(),
        sources,
        tokensUsed: {
          input: estimateTokens(fullPrompt),
          output: estimateTokens(stdout)
        }
      });
    });

    claudeProcess.on('error', (error: Error) => {
      if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
        reject(new Error(
          'Claude Code CLI is not installed or not in PATH. ' +
          'Install it with: npm install -g @anthropic-ai/claude-code'
        ));
        return;
      }
      reject(new Error(`Failed to spawn Claude Code CLI: ${error.message}`));
    });
  });
}

/**
 * State for streaming chunk queue
 */
interface StreamState {
  chunkQueue: string[];
  processComplete: boolean;
  resolveWait: (() => void) | null;
}

/**
 * Wait for either a chunk or process completion
 */
function waitForChunk(state: StreamState): Promise<void> {
  return new Promise((resolve) => {
    if (state.chunkQueue.length > 0 || state.processComplete) {
      resolve();
      return;
    }
    state.resolveWait = resolve;
  });
}

/**
 * Set up event handlers for streaming Claude process
 */
function setupStreamHandlers(
  claudeProcess: ChildProcess,
  state: StreamState,
  fullAnswer: { value: string },
  resolve: () => void,
  reject: (error: Error) => void
): void {
  let stderr = '';

  claudeProcess.stdout!.on('data', (data: Buffer) => {
    const chunk = data.toString();
    fullAnswer.value += chunk;
    state.chunkQueue.push(chunk);
    const waitResolve = state.resolveWait;
    state.resolveWait = null;
    waitResolve?.();
  });

  claudeProcess.stderr!.on('data', (data: Buffer) => {
    stderr += data.toString();
  });

  claudeProcess.on('close', (code: number | null) => {
    state.processComplete = true;
    const waitResolve = state.resolveWait;
    state.resolveWait = null;
    waitResolve?.();

    if (code !== 0) {
      reject(classifyCliError(stderr, fullAnswer.value, code));
      return;
    }
    resolve();
  });

  claudeProcess.on('error', (err: Error) => {
    state.processComplete = true;
    const waitResolve = state.resolveWait;
    state.resolveWait = null;
    waitResolve?.();

    if ((err as NodeJS.ErrnoException).code === 'ENOENT') {
      reject(new Error(
        'Claude Code CLI is not installed or not in PATH. ' +
        'Install it with: npm install -g @anthropic-ai/claude-code'
      ));
    } else {
      reject(new Error(`Failed to spawn Claude Code CLI: ${err.message}`));
    }
  });
}

/**
 * Streaming version for real-time responses.
 * Yields text chunks as they arrive from Claude Code CLI stdout,
 * returns full RAGResponse at the end.
 */
export async function* streamResponse(
  query: string,
  context: string,
  sources: Source[],
  options: ResponseOptions = {}
): AsyncGenerator<string, RAGResponse, unknown> {
  const { systemPrompt = DEFAULT_SYSTEM_PROMPT } = options;

  const isAvailable = await checkClaudeCodeAvailable();
  if (!isAvailable) {
    throw new Error(
      'Claude Code CLI is not installed or not in PATH. ' +
      'Install it with: npm install -g @anthropic-ai/claude-code'
    );
  }

  const fullPrompt = buildPrompt(query, context, systemPrompt);
  const fullAnswer = { value: '' };
  const state: StreamState = {
    chunkQueue: [],
    processComplete: false,
    resolveWait: null
  };

  const processPromise = new Promise<void>((resolve, reject) => {
    const claudeProcess = spawnClaudeProcess(fullPrompt);
    setupStreamHandlers(claudeProcess, state, fullAnswer, resolve, reject);
  });

  try {
    while (!state.processComplete || state.chunkQueue.length > 0) {
      await waitForChunk(state);
      while (state.chunkQueue.length > 0) {
        yield state.chunkQueue.shift()!;
      }
    }

    await processPromise;

    return {
      answer: fullAnswer.value.trim(),
      sources,
      tokensUsed: {
        input: estimateTokens(fullPrompt),
        output: estimateTokens(fullAnswer.value)
      }
    };
  } finally {
    await processPromise.catch(() => {});
  }
}

// Export types for use in other modules
export type { Source, RAGResponse, ResponseOptions };
