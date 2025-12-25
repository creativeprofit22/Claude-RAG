/**
 * PDF Text Extraction
 * Uses pdf-parse for text-based PDFs
 */

import pdfParse from 'pdf-parse';

/** Minimum characters per page to consider PDF as text-based (not scanned) */
const MIN_CHARS_PER_PAGE = 100;

export interface PDFExtractionResult {
  text: string;
  pageCount: number;
  isScanned: boolean;
  metadata?: {
    title?: string;
    author?: string;
    creationDate?: Date;
  };
}

/**
 * Extract text from a PDF buffer
 * @param buffer - PDF file as ArrayBuffer
 * @returns Extracted text and metadata
 */
export async function extractPDF(buffer: ArrayBuffer): Promise<PDFExtractionResult> {
  const nodeBuffer = Buffer.from(buffer);

  const result = await pdfParse(nodeBuffer, {
    // Limit pages for performance (can be overridden)
    max: 0, // 0 = no limit
  });

  const text = result.text.trim();
  const pageCount = result.numpages;

  // Validate we got some text content - empty PDFs should be flagged
  if (text.length === 0 && pageCount > 0) {
    // Return with isScanned=true to indicate content couldn't be extracted
    return {
      text: '',
      pageCount,
      isScanned: true,
      metadata: {
        title: result.info?.Title,
        author: result.info?.Author,
      },
    };
  }

  // Heuristic: if text is very short relative to page count, it's likely scanned
  const avgCharsPerPage = text.length / Math.max(pageCount, 1);
  const isScanned = avgCharsPerPage < MIN_CHARS_PER_PAGE && pageCount > 0;

  // Parse creation date safely (PDF dates can be in various formats)
  let creationDate: Date | undefined;
  if (result.info?.CreationDate) {
    const parsed = new Date(result.info.CreationDate);
    if (!isNaN(parsed.getTime())) {
      creationDate = parsed;
    }
  }

  return {
    text,
    pageCount,
    isScanned,
    metadata: {
      title: result.info?.Title,
      author: result.info?.Author,
      creationDate,
    },
  };
}
