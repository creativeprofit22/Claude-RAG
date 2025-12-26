/**
 * CLI utilities for Claude RAG
 * Shared utilities for exec operations and Claude Code CLI checks
 */
import { exec } from 'child_process';
/**
 * Promisified exec for async command execution
 */
export declare const execAsync: typeof exec.__promisify__;
/**
 * Check if Claude Code CLI is available in PATH
 * @param timeout - Timeout in milliseconds (default: 5000ms)
 */
export declare function checkClaudeCodeAvailable(timeout?: number): Promise<boolean>;
//# sourceMappingURL=cli.d.ts.map