/**
 * Simple logger utility for the RAG system
 */
export type LogLevel = "debug" | "info" | "warn" | "error";
declare class Logger {
    private minLevel;
    private useColors;
    constructor(minLevel?: LogLevel, useColors?: boolean);
    /**
     * Set the minimum log level
     */
    setLevel(level: LogLevel): void;
    /**
     * Check if a log level should be output
     */
    private shouldLog;
    /**
     * Format a log entry
     */
    private format;
    /**
     * Create a log entry
     */
    private log;
    debug(message: string, data?: unknown): void;
    info(message: string, data?: unknown): void;
    warn(message: string, data?: unknown): void;
    error(message: string, data?: unknown): void;
    /**
     * Log a timing measurement
     */
    time(label: string): () => void;
    /**
     * Create a child logger with a prefix
     */
    child(prefix: string): Logger;
}
/**
 * Default logger instance
 */
export declare const logger: Logger;
export { Logger };
//# sourceMappingURL=logger.d.ts.map