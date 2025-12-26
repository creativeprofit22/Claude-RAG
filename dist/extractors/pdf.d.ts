/**
 * PDF Text Extraction
 * Uses pdf-parse for text-based PDFs
 */
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
export declare function extractPDF(buffer: ArrayBuffer): Promise<PDFExtractionResult>;
//# sourceMappingURL=pdf.d.ts.map