/**
 * DOCX Text Extraction
 * Uses mammoth for Word document parsing
 */
import mammoth from 'mammoth';
/**
 * Extract text from a DOCX buffer
 * @param buffer - DOCX file as ArrayBuffer
 * @returns Extracted text and any warnings
 */
export async function extractDOCX(buffer) {
    const nodeBuffer = Buffer.from(buffer);
    // Extract raw text (preserves structure better for RAG)
    const textResult = await mammoth.extractRawText({ buffer: nodeBuffer });
    return {
        text: textResult.value.trim(),
        warnings: textResult.messages.map(m => m.message),
    };
}
//# sourceMappingURL=docx.js.map