/**
 * Excel/CSV Text Extraction
 * Uses SheetJS (xlsx) for spreadsheet parsing
 */
export interface ExcelExtractionResult {
    text: string;
    sheetCount: number;
    sheetNames: string[];
    rowCount: number;
    warnings?: string[];
}
/**
 * Extract text from an Excel or CSV buffer
 * @param buffer - Spreadsheet file as ArrayBuffer
 * @returns Extracted text with sheet metadata
 */
export declare function extractExcel(buffer: ArrayBuffer): ExcelExtractionResult;
/**
 * Extract text from a CSV buffer (xlsx handles CSV natively)
 */
export declare const extractCSV: typeof extractExcel;
//# sourceMappingURL=excel.d.ts.map