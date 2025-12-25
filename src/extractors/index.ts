/**
 * Text Extraction Module
 * Dispatches to appropriate extractor based on file type
 */

import { extractPDF, type PDFExtractionResult } from './pdf.js';
import { extractDOCX, type DOCXExtractionResult } from './docx.js';

export type ExtractionResult = {
  text: string;
  isScanned?: boolean;
  pageCount?: number;
  warnings?: string[];
  metadata?: Record<string, unknown>;
};

export type SupportedMimeType =
  | 'application/pdf'
  | 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  | 'text/plain'
  | 'text/markdown'
  | 'text/html';

export const SUPPORTED_EXTENSIONS = ['.pdf', '.docx', '.txt', '.md', '.html', '.htm'] as const;

export const SUPPORTED_MIME_TYPES = [
  'application/pdf',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'text/plain',
  'text/markdown',
  'text/html',
] as const;

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
      const text = html
        .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '') // Remove scripts
        .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '') // Remove styles
        .replace(/<!--[\s\S]*?-->/g, '') // Remove HTML comments
        .replace(/<[^>]*>/g, ' ') // Remove remaining tags (handles self-closing and malformed)
        // Decode common HTML entities
        .replace(/&nbsp;/gi, ' ')
        .replace(/&amp;/gi, '&')
        .replace(/&lt;/gi, '<')
        .replace(/&gt;/gi, '>')
        .replace(/&quot;/gi, '"')
        .replace(/&apos;/gi, "'")
        .replace(/&#39;/gi, "'")
        .replace(/&mdash;/gi, '—')
        .replace(/&ndash;/gi, '–')
        .replace(/&hellip;/gi, '…')
        .replace(/&copy;/gi, '©')
        .replace(/&reg;/gi, '®')
        .replace(/&trade;/gi, '™')
        .replace(/&ldquo;/gi, '\u201C')
        .replace(/&rdquo;/gi, '\u201D')
        .replace(/&lsquo;/gi, '\u2018')
        .replace(/&rsquo;/gi, '\u2019')
        // Decode numeric entities (decimal and hex)
        .replace(/&#(\d+);/g, (_, code) => String.fromCharCode(parseInt(code, 10)))
        .replace(/&#x([0-9a-fA-F]+);/g, (_, code) => String.fromCharCode(parseInt(code, 16)))
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
