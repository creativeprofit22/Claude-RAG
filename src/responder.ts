import { spawn, ChildProcess } from 'child_process';
import { checkClaudeCodeAvailable } from './utils/cli.js';
import { DEFAULT_SYSTEM_PROMPT } from './constants.js';
import { classifyCliError, cliNotFoundError } from './utils/responder-errors.js';
import type { ChunkSource } from './utils/chunks.js';

/** Default timeout for Claude CLI subprocess (2 minutes) */
const CLI_TIMEOUT_MS = Number(process.env.CLAUDE_CLI_TIMEOUT_MS) || 120_000;

/**
 * Spawn Claude CLI process with stdin prompt and timeout
 */
function spawnClaudeProcess(prompt: string, timeoutMs: number = CLI_TIMEOUT_MS): { process: ChildProcess; cleanup: () => void } {
  const claudeProcess = spawn('claude', ['--print'], {
    stdio: ['pipe', 'pipe', 'pipe'],
    env: { ...process.env }
  });
  claudeProcess.stdin.write(prompt);
  claudeProcess.stdin.end();

  // Set up timeout to prevent hanging processes
  const timeoutId = setTimeout(() => {
    claudeProcess.kill('SIGTERM');
    // Force kill if SIGTERM doesn't work after 5 seconds
    setTimeout(() => {
      if (!claudeProcess.killed) {
        claudeProcess.kill('SIGKILL');
      }
    }, 5000);
  }, timeoutMs);

  const cleanup = () => {
    clearTimeout(timeoutId);
  };

  return { process: claudeProcess, cleanup };
}

// Re-export ChunkSource as Source for API compatibility
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
 *
 * Note: This is a rough approximation. Actual tokenization varies:
 * - English prose: ~3.5-4 chars/token
 * - Code: ~2.5-3 chars/token (more symbols)
 * - Non-ASCII text: typically fewer chars/token
 *
 * Using 4 chars/token as conservative estimate for English text.
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
    throw cliNotFoundError();
  }

  const fullPrompt = buildPrompt(query, context, systemPrompt);

  return new Promise((resolve, reject) => {
    const { process: claudeProcess, cleanup } = spawnClaudeProcess(fullPrompt);
    let stdout = '';
    let stderr = '';
    let timedOut = false;

    claudeProcess.stdout!.on('data', (data: Buffer) => {
      stdout += data.toString();
    });

    claudeProcess.stderr!.on('data', (data: Buffer) => {
      stderr += data.toString();
    });

    claudeProcess.on('close', (code: number | null, signal: NodeJS.Signals | null) => {
      cleanup();

      // Check if process was killed due to timeout
      if (signal === 'SIGTERM' || signal === 'SIGKILL') {
        timedOut = true;
        reject(new Error('Claude CLI timed out. The request may be too complex or the CLI is unresponsive.'));
        return;
      }

      if (code !== 0) {
        // Sanitize stderr to avoid leaking internal details to users
        const sanitizedError = sanitizeStderr(stderr);
        reject(classifyCliError(sanitizedError, stdout, code));
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
      cleanup();
      if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
        reject(cliNotFoundError());
        return;
      }
      reject(classifyCliError(error.message, '', 1));
    });
  });
}

/**
 * Sanitize stderr to avoid leaking internal details (paths, stack traces, etc.)
 */
function sanitizeStderr(stderr: string): string {
  // Remove file paths that might reveal server structure
  let sanitized = stderr.replace(/\/[^\s:]+\.(ts|js|json)/g, '[path]');
  // Remove stack traces
  sanitized = sanitized.replace(/\s+at\s+.+\(.*\)/g, '');
  // Truncate if too long
  if (sanitized.length > 500) {
    sanitized = sanitized.slice(0, 500) + '... [truncated]';
  }
  return sanitized.trim() || 'CLI error';
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
  cleanup: () => void,
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

  claudeProcess.on('close', (code: number | null, signal: NodeJS.Signals | null) => {
    cleanup();
    state.processComplete = true;
    const waitResolve = state.resolveWait;
    state.resolveWait = null;
    waitResolve?.();

    // Check if process was killed due to timeout
    if (signal === 'SIGTERM' || signal === 'SIGKILL') {
      reject(new Error('Claude CLI timed out. The request may be too complex or the CLI is unresponsive.'));
      return;
    }

    if (code !== 0) {
      const sanitizedError = sanitizeStderr(stderr);
      reject(classifyCliError(sanitizedError, fullAnswer.value, code));
      return;
    }
    resolve();
  });

  claudeProcess.on('error', (err: Error) => {
    cleanup();
    state.processComplete = true;
    const waitResolve = state.resolveWait;
    state.resolveWait = null;
    waitResolve?.();

    if ((err as NodeJS.ErrnoException).code === 'ENOENT') {
      reject(cliNotFoundError());
    } else {
      reject(classifyCliError(err.message, '', 1));
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
    throw cliNotFoundError();
  }

  const fullPrompt = buildPrompt(query, context, systemPrompt);
  const fullAnswer = { value: '' };
  const state: StreamState = {
    chunkQueue: [],
    processComplete: false,
    resolveWait: null
  };

  const processPromise = new Promise<void>((resolve, reject) => {
    const { process: claudeProcess, cleanup } = spawnClaudeProcess(fullPrompt);
    setupStreamHandlers(claudeProcess, cleanup, state, fullAnswer, resolve, reject);
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

// Export types for use in other modules (Source already exported at top)
export type { RAGResponse, ResponseOptions };
