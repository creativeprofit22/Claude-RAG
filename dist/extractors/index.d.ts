/**
 * Text Extraction Module
 * Dispatches to appropriate extractor based on file type
 */
import { type SupportedMimeType } from '../shared/file-types.js';
export { SUPPORTED_EXTENSIONS, SUPPORTED_MIME_TYPES, type SupportedMimeType } from '../shared/file-types.js';
export type ExtractionResult = {
    text: string;
    isScanned?: boolean;
    pageCount?: number;
    warnings?: string[];
    metadata?: Record<string, unknown>;
};
/**
 * Get MIME type from file extension
 */
export declare function getMimeType(filename: string): SupportedMimeType | null;
/**
 * Check if a file type is supported
 */
export declare function isSupported(mimeType: string): mimeType is SupportedMimeType;
/**
 * Get supported file extensions for display
 */
export declare function getSupportedExtensions(): string[];
/**
 * Extract text from a file buffer
 * @param buffer - File content as ArrayBuffer
 * @param mimeType - MIME type of the file
 * @param filename - Original filename (used for extension fallback)
 * @returns Extracted text and metadata
 */
export declare function extractText(buffer: ArrayBuffer, mimeType: string, filename: string): Promise<ExtractionResult>;
export type { PDFExtractionResult } from './pdf.js';
export type { DOCXExtractionResult } from './docx.js';
export type { ExcelExtractionResult } from './excel.js';
//# sourceMappingURL=index.d.ts.map