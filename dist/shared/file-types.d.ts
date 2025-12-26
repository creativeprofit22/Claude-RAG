/**
 * Shared file type constants - browser-safe
 * Used by both React components and server-side extractors
 */
export declare const SUPPORTED_EXTENSIONS: readonly [".pdf", ".docx", ".txt", ".md", ".html", ".htm", ".xlsx", ".xls", ".csv"];
export declare const SUPPORTED_MIME_TYPES: readonly ["application/pdf", "application/vnd.openxmlformats-officedocument.wordprocessingml.document", "text/plain", "text/markdown", "text/html", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "application/vnd.ms-excel", "text/csv"];
export type SupportedExtension = typeof SUPPORTED_EXTENSIONS[number];
export type SupportedMimeType = typeof SUPPORTED_MIME_TYPES[number];
//# sourceMappingURL=file-types.d.ts.map