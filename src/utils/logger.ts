/**
 * Simple logger utility for the RAG system
 */

export type LogLevel = "debug" | "info" | "warn" | "error";

interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
  data?: unknown;
}

const LOG_LEVELS: Record<LogLevel, number> = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3,
};

const LOG_COLORS: Record<LogLevel, string> = {
  debug: "\x1b[36m", // Cyan
  info: "\x1b[32m", // Green
  warn: "\x1b[33m", // Yellow
  error: "\x1b[31m", // Red
};

const RESET = "\x1b[0m";

class Logger {
  private minLevel: LogLevel;
  private useColors: boolean;

  constructor(minLevel: LogLevel = "info", useColors: boolean = true) {
    this.minLevel = minLevel;
    this.useColors = useColors && process.stdout.isTTY === true;
  }

  /**
   * Set the minimum log level
   */
  setLevel(level: LogLevel): void {
    this.minLevel = level;
  }

  /**
   * Check if a log level should be output
   */
  private shouldLog(level: LogLevel): boolean {
    return LOG_LEVELS[level] >= LOG_LEVELS[this.minLevel];
  }

  /**
   * Format a log entry
   */
  private format(entry: LogEntry): string {
    const levelStr = entry.level.toUpperCase().padEnd(5);
    const prefix = this.useColors
      ? `${LOG_COLORS[entry.level]}[${levelStr}]${RESET}`
      : `[${levelStr}]`;

    let output = `${entry.timestamp} ${prefix} ${entry.message}`;

    if (entry.data !== undefined) {
      const dataStr =
        typeof entry.data === "string"
          ? entry.data
          : JSON.stringify(entry.data, null, 2);
      output += `\n${dataStr}`;
    }

    return output;
  }

  /**
   * Create a log entry
   */
  private log(level: LogLevel, message: string, data?: unknown): void {
    if (!this.shouldLog(level)) return;

    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level,
      message,
      data,
    };

    const formatted = this.format(entry);

    if (level === "error") {
      console.error(formatted);
    } else if (level === "warn") {
      console.warn(formatted);
    } else {
      console.log(formatted);
    }
  }

  debug(message: string, data?: unknown): void {
    this.log("debug", message, data);
  }

  info(message: string, data?: unknown): void {
    this.log("info", message, data);
  }

  warn(message: string, data?: unknown): void {
    this.log("warn", message, data);
  }

  error(message: string, data?: unknown): void {
    this.log("error", message, data);
  }

  /**
   * Log a timing measurement
   */
  time(label: string): () => void {
    const start = performance.now();
    return () => {
      const duration = performance.now() - start;
      this.debug(`${label}: ${duration.toFixed(2)}ms`);
    };
  }

  /**
   * Create a child logger with a prefix
   */
  child(prefix: string): Logger {
    const parent = this;
    const child = new Logger(this.minLevel, this.useColors);

    const wrapMethod = (method: LogLevel) => {
      return (message: string, data?: unknown) => {
        parent.log(method, `[${prefix}] ${message}`, data);
      };
    };

    child.debug = wrapMethod("debug");
    child.info = wrapMethod("info");
    child.warn = wrapMethod("warn");
    child.error = wrapMethod("error");

    return child;
  }
}

/**
 * Default logger instance
 */
export const logger = new Logger(
  (process.env.LOG_LEVEL as LogLevel) || "info"
);

export { Logger };
