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
 * @param timeout - Timeout in milliseconds (default: 5000ms)
 */
export async function checkClaudeCodeAvailable(timeout = 5000) {
    try {
        await execAsync('which claude', { timeout });
        return true;
    }
    catch {
        return false;
    }
}
//# sourceMappingURL=cli.js.map