/**
 * DOCX Text Extraction
 * Uses mammoth for Word document parsing
 */
export interface DOCXExtractionResult {
    text: string;
    html?: string;
    warnings: string[];
}
/**
 * Extract text from a DOCX buffer
 * @param buffer - DOCX file as ArrayBuffer
 * @returns Extracted text and any warnings
 */
export declare function extractDOCX(buffer: ArrayBuffer): Promise<DOCXExtractionResult>;
//# sourceMappingURL=docx.d.ts.map