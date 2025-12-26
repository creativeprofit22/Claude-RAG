/**
 * Simple logger utility for the RAG system
 */
const LOG_LEVELS = {
    debug: 0,
    info: 1,
    warn: 2,
    error: 3,
};
const LOG_COLORS = {
    debug: "\x1b[36m", // Cyan
    info: "\x1b[32m", // Green
    warn: "\x1b[33m", // Yellow
    error: "\x1b[31m", // Red
};
const RESET = "\x1b[0m";
class Logger {
    minLevel;
    useColors;
    constructor(minLevel = "info", useColors = true) {
        this.minLevel = minLevel;
        this.useColors = useColors && process.stdout.isTTY === true;
    }
    /**
     * Set the minimum log level
     */
    setLevel(level) {
        this.minLevel = level;
    }
    /**
     * Check if a log level should be output
     */
    shouldLog(level) {
        return LOG_LEVELS[level] >= LOG_LEVELS[this.minLevel];
    }
    /**
     * Format a log entry
     */
    format(entry) {
        const levelStr = entry.level.toUpperCase().padEnd(5);
        const prefix = this.useColors
            ? `${LOG_COLORS[entry.level]}[${levelStr}]${RESET}`
            : `[${levelStr}]`;
        let output = `${entry.timestamp} ${prefix} ${entry.message}`;
        if (entry.data !== undefined) {
            const dataStr = typeof entry.data === "string"
                ? entry.data
                : JSON.stringify(entry.data, null, 2);
            output += `\n${dataStr}`;
        }
        return output;
    }
    /**
     * Create a log entry
     */
    log(level, message, data) {
        if (!this.shouldLog(level))
            return;
        const entry = {
            timestamp: new Date().toISOString(),
            level,
            message,
            data,
        };
        const formatted = this.format(entry);
        if (level === "error") {
            console.error(formatted);
        }
        else if (level === "warn") {
            console.warn(formatted);
        }
        else {
            console.log(formatted);
        }
    }
    debug(message, data) {
        this.log("debug", message, data);
    }
    info(message, data) {
        this.log("info", message, data);
    }
    warn(message, data) {
        this.log("warn", message, data);
    }
    error(message, data) {
        this.log("error", message, data);
    }
    /**
     * Log a timing measurement
     */
    time(label) {
        const start = performance.now();
        return () => {
            const duration = performance.now() - start;
            this.debug(`${label}: ${duration.toFixed(2)}ms`);
        };
    }
    /**
     * Create a child logger with a prefix
     */
    child(prefix) {
        const parent = this;
        const child = new Logger(this.minLevel, this.useColors);
        const wrapMethod = (method) => {
            return (message, data) => {
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
export const logger = new Logger(process.env.LOG_LEVEL || "info");
export { Logger };
//# sourceMappingURL=logger.js.map