/**
 * Text Extraction Module
 * Dispatches to appropriate extractor based on file type
 */

import { extractPDF, type PDFExtractionResult } from './pdf.js';
import { extractDOCX, type DOCXExtractionResult } from './docx.js';
import { SUPPORTED_EXTENSIONS, SUPPORTED_MIME_TYPES, type SupportedMimeType } from '../shared/file-types.js';

// Re-export for backwards compatibility
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
export function getMimeType(filename: string): SupportedMimeType | null {
  const ext = filename.toLowerCase().split('.').pop();
  switch (ext) {
    case 'pdf':
      return 'application/pdf';
    case 'docx':
      return 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
    case 'txt':
      return 'text/plain';
    case 'md':
      return 'text/markdown';
    case 'html':
    case 'htm':
      return 'text/html';
    default:
      return null;
  }
}

/**
 * Check if a file type is supported
 */
export function isSupported(mimeType: string): mimeType is SupportedMimeType {
  return (SUPPORTED_MIME_TYPES as readonly string[]).includes(mimeType);
}

/**
 * Get supported file extensions for display
 */
export function getSupportedExtensions(): string[] {
  return [...SUPPORTED_EXTENSIONS];
}

/**
 * HTML entity mapping for decoding
 */
const HTML_ENTITIES: Record<string, string> = {
  '&nbsp;': ' ',
  '&amp;': '&',
  '&lt;': '<',
  '&gt;': '>',
  '&quot;': '"',
  '&apos;': "'",
  '&#39;': "'",
  '&mdash;': '—',
  '&ndash;': '–',
  '&hellip;': '…',
  '&copy;': '©',
  '&reg;': '®',
  '&trade;': '™',
  '&ldquo;': '\u201C',
  '&rdquo;': '\u201D',
  '&lsquo;': '\u2018',
  '&rsquo;': '\u2019',
};

/**
 * Decode HTML entities in text
 * Handles named entities and numeric entities (decimal and hex)
 */
function decodeHtmlEntities(text: string): string {
  // Decode named entities
  let result = text;
  for (const [entity, char] of Object.entries(HTML_ENTITIES)) {
    result = result.replace(new RegExp(entity, 'gi'), char);
  }
  // Decode numeric entities (decimal and hex)
  return result
    .replace(/&#(\d+);/g, (_, code) => String.fromCharCode(parseInt(code, 10)))
    .replace(/&#x([0-9a-fA-F]+);/g, (_, code) => String.fromCharCode(parseInt(code, 16)));
}

/**
 * Extract text from a file buffer
 * @param buffer - File content as ArrayBuffer
 * @param mimeType - MIME type of the file
 * @param filename - Original filename (used for extension fallback)
 * @returns Extracted text and metadata
 */
export async function extractText(
  buffer: ArrayBuffer,
  mimeType: string,
  filename: string
): Promise<ExtractionResult> {
  // Fall back to extension-based detection if MIME type is generic
  let effectiveMimeType = mimeType;
  if (mimeType === 'application/octet-stream' || !mimeType) {
    const detected = getMimeType(filename);
    if (detected) {
      effectiveMimeType = detected;
    }
  }

  switch (effectiveMimeType) {
    case 'application/pdf': {
      const result = await extractPDF(buffer);
      return {
        text: result.text,
        isScanned: result.isScanned,
        pageCount: result.pageCount,
        metadata: result.metadata,
      };
    }

    case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document': {
      const result = await extractDOCX(buffer);
      return {
        text: result.text,
        warnings: result.warnings,
      };
    }

    case 'text/plain':
    case 'text/markdown': {
      const text = new TextDecoder().decode(buffer);
      return { text: text.trim() };
    }

    case 'text/html': {
      const html = new TextDecoder().decode(buffer);
      // Strip HTML tags for RAG indexing
      // Note: This regex-based approach handles common cases but may miss:
      // - Malformed HTML (unclosed tags)
      // - CDATA sections
      // - Comments (<!-- -->)
      // For production use with untrusted HTML, consider a proper HTML parser
      const stripped = html
        .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '') // Remove scripts
        .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '') // Remove styles
        .replace(/<!--[\s\S]*?-->/g, '') // Remove HTML comments
        .replace(/<[^>]*>/g, ' '); // Remove remaining tags (handles self-closing and malformed)
      const text = decodeHtmlEntities(stripped)
        .replace(/\s+/g, ' ') // Normalize whitespace
        .trim();
      return { text };
    }

    default:
      throw new Error(`Unsupported file type: ${effectiveMimeType}. Supported types: PDF, DOCX, TXT, MD, HTML`);
  }
}

// Re-export types
export type { PDFExtractionResult } from './pdf.js';
export type { DOCXExtractionResult } from './docx.js';
