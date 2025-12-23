import { spawn, exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

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
 * Check if Claude Code CLI is available
 */
async function checkClaudeCodeAvailable(): Promise<boolean> {
  try {
    await execAsync('which claude');
    return true;
  } catch {
    return false;
  }
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
    // Use stdin to pass prompt - avoids command injection via shell metacharacters
    const args = ['--print'];
    const claudeProcess = spawn('claude', args, {
      stdio: ['pipe', 'pipe', 'pipe'],
      env: { ...process.env }
    });

    // Write prompt to stdin and close it
    claudeProcess.stdin.write(fullPrompt);
    claudeProcess.stdin.end();

    let stdout = '';
    let stderr = '';

    claudeProcess.stdout.on('data', (data: Buffer) => {
      stdout += data.toString();
    });

    claudeProcess.stderr.on('data', (data: Buffer) => {
      stderr += data.toString();
    });

    claudeProcess.on('close', (code: number | null) => {
      if (code !== 0) {
        // Handle signal termination (code is null when killed by signal)
        if (code === null) {
          reject(new Error('Claude Code CLI was terminated by a signal'));
          return;
        }
        // Check for common error patterns (case-insensitive)
        const stderrLower = stderr.toLowerCase();
        if (stderrLower.includes('not authenticated') || stderrLower.includes('auth')) {
          reject(new Error(
            'Claude Code authentication error. Run "claude login" to authenticate.'
          ));
          return;
        }
        if (stderrLower.includes('rate limit') || stderrLower.includes('429')) {
          reject(new Error('Rate limit exceeded. Please wait before retrying.'));
          return;
        }
        reject(new Error(
          `Claude Code CLI failed with exit code ${code}: ${stderr || stdout || 'Unknown error'}`
        ));
        return;
      }

      const answer = stdout.trim();

      resolve({
        answer,
        sources,
        tokensUsed: {
          input: estimateTokens(fullPrompt),
          output: estimateTokens(answer)
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

  // Check if Claude Code is available
  const isAvailable = await checkClaudeCodeAvailable();
  if (!isAvailable) {
    throw new Error(
      'Claude Code CLI is not installed or not in PATH. ' +
      'Install it with: npm install -g @anthropic-ai/claude-code'
    );
  }

  const fullPrompt = buildPrompt(query, context, systemPrompt);

  let fullAnswer = '';
  let error: Error | null = null;

  // Create a promise-based wrapper for the streaming process
  const processPromise = new Promise<void>((resolve, reject) => {
    // Use stdin to pass prompt - avoids command injection via shell metacharacters
    const args = ['--print'];
    const claudeProcess = spawn('claude', args, {
      stdio: ['pipe', 'pipe', 'pipe'],
      env: { ...process.env }
    });

    // Write prompt to stdin and close it
    claudeProcess.stdin.write(fullPrompt);
    claudeProcess.stdin.end();

    let stderr = '';

    // We'll collect chunks via an event emitter pattern
    claudeProcess.stdout.on('data', (data: Buffer) => {
      const chunk = data.toString();
      fullAnswer += chunk;
      // Queue the chunk for yielding
      chunkQueue.push(chunk);
      // Capture and clear resolveWait atomically to prevent race condition
      const resolve = resolveWait;
      resolveWait = null;
      resolve?.();
    });

    claudeProcess.stderr.on('data', (data: Buffer) => {
      stderr += data.toString();
    });

    claudeProcess.on('close', (code: number | null) => {
      processComplete = true;
      const resolveFunc = resolveWait;
      resolveWait = null;
      resolveFunc?.();

      if (code !== 0) {
        // Handle signal termination (code is null when killed by signal)
        if (code === null) {
          error = new Error('Claude Code CLI was terminated by a signal');
        } else {
          // Check for common error patterns (case-insensitive)
          const stderrLower = stderr.toLowerCase();
          if (stderrLower.includes('not authenticated') || stderrLower.includes('auth')) {
            error = new Error(
              'Claude Code authentication error. Run "claude login" to authenticate.'
            );
          } else if (stderrLower.includes('rate limit') || stderrLower.includes('429')) {
            error = new Error('Rate limit exceeded. Please wait before retrying.');
          } else {
            error = new Error(
              `Claude Code CLI failed with exit code ${code}: ${stderr || fullAnswer || 'Unknown error'}`
            );
          }
        }
        reject(error);
        return;
      }
      resolve();
    });

    claudeProcess.on('error', (err: Error) => {
      processComplete = true;
      const resolve = resolveWait;
      resolveWait = null;
      resolve?.();

      if ((err as NodeJS.ErrnoException).code === 'ENOENT') {
        error = new Error(
          'Claude Code CLI is not installed or not in PATH. ' +
          'Install it with: npm install -g @anthropic-ai/claude-code'
        );
      } else {
        error = new Error(`Failed to spawn Claude Code CLI: ${err.message}`);
      }
      reject(error);
    });
  });

  // Queue for chunks and synchronization
  const chunkQueue: string[] = [];
  let processComplete = false;
  let resolveWait: (() => void) | null = null;

  // Wait for either a chunk or process completion
  function waitForChunk(): Promise<void> {
    return new Promise((resolve) => {
      if (chunkQueue.length > 0 || processComplete) {
        resolve();
        return;
      }
      resolveWait = resolve;
    });
  }

  // Yield chunks as they arrive
  try {
    while (!processComplete || chunkQueue.length > 0) {
      await waitForChunk();

      while (chunkQueue.length > 0) {
        const chunk = chunkQueue.shift()!;
        yield chunk;
      }
    }

    // Wait for process to fully complete - must await to catch errors
    await processPromise;

    if (error) {
      throw error;
    }

    return {
      answer: fullAnswer.trim(),
      sources,
      tokensUsed: {
        input: estimateTokens(fullPrompt),
        output: estimateTokens(fullAnswer)
      }
    };
  } finally {
    // Ensure process promise is always awaited even if generator is abandoned early
    await processPromise.catch(() => {});
  }
}

// Export types for use in other modules
export type { Source, RAGResponse, ResponseOptions };
