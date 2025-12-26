/**
 * Shared file type constants - browser-safe
 * Used by both React components and server-side extractors
 */
export const SUPPORTED_EXTENSIONS = ['.pdf', '.docx', '.txt', '.md', '.html', '.htm', '.xlsx', '.xls', '.csv'];
export const SUPPORTED_MIME_TYPES = [
    'application/pdf',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'text/plain',
    'text/markdown',
    'text/html',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // .xlsx
    'application/vnd.ms-excel', // .xls
    'text/csv', // .csv
];
//# sourceMappingURL=file-types.js.map