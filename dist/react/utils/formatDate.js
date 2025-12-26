/**
 * Date formatting utilities with preset formats
 */
const FORMAT_OPTIONS = {
    short: {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
    },
    full: {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
        year: 'numeric',
    },
    datetime: {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    },
};
/**
 * Format a timestamp to a readable date string
 * @param timestamp - Unix timestamp in milliseconds
 * @param format - Preset format: 'short', 'full', or 'datetime'
 */
export function formatDate(timestamp, format = 'short') {
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-US', FORMAT_OPTIONS[format]);
}
//# sourceMappingURL=formatDate.js.map