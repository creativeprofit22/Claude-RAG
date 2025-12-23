/**
 * CLI utilities for Claude RAG
 * Shared utilities for exec operations and Claude Code CLI checks
 */

import { exec } from 'child_process';
import { promisify } from 'util';

/**
 * Promisified exec for async command execution
 */
export const execAsync = promisify(exec);

/**
 * Check if Claude Code CLI is available in PATH
 */
export async function checkClaudeCodeAvailable(): Promise<boolean> {
  try {
    await execAsync('which claude');
    return true;
  } catch {
    return false;
  }
}
