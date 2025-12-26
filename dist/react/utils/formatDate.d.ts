/**
 * Date formatting utilities with preset formats
 */
export type DateFormat = 'short' | 'full' | 'datetime';
/**
 * Format a timestamp to a readable date string
 * @param timestamp - Unix timestamp in milliseconds
 * @param format - Preset format: 'short', 'full', or 'datetime'
 */
export declare function formatDate(timestamp: number, format?: DateFormat): string;
//# sourceMappingURL=formatDate.d.ts.map