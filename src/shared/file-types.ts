/**
 * Shared file type constants - browser-safe
 * Used by both React components and server-side extractors
 */

export const SUPPORTED_EXTENSIONS = ['.pdf', '.docx', '.txt', '.md', '.html', '.htm'] as const;

export const SUPPORTED_MIME_TYPES = [
  'application/pdf',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'text/plain',
  'text/markdown',
  'text/html',
] as const;

export type SupportedExtension = typeof SUPPORTED_EXTENSIONS[number];
export type SupportedMimeType = typeof SUPPORTED_MIME_TYPES[number];
