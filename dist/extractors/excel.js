/**
 * Excel/CSV Text Extraction
 * Uses SheetJS (xlsx) for spreadsheet parsing
 */
import * as XLSX from 'xlsx';
/**
 * Extract text from an Excel or CSV buffer
 * @param buffer - Spreadsheet file as ArrayBuffer
 * @returns Extracted text with sheet metadata
 */
export function extractExcel(buffer) {
    let workbook;
    try {
        workbook = XLSX.read(buffer, { type: 'array' });
    }
    catch (err) {
        const message = err instanceof Error ? err.message : 'Unknown error';
        throw new Error(`Failed to parse spreadsheet: ${message}`);
    }
    const sheetNames = workbook.SheetNames;
    const sheetsWithContent = [];
    const textParts = [];
    let totalRows = 0;
    for (const sheetName of sheetNames) {
        const sheet = workbook.Sheets[sheetName];
        if (!sheet)
            continue;
        // Convert sheet to text with tab-separated values
        const text = XLSX.utils.sheet_to_txt(sheet, { blankrows: false });
        if (text.trim()) {
            sheetsWithContent.push(sheetName);
            // Add sheet header for multi-sheet workbooks
            if (sheetNames.length > 1) {
                textParts.push(`[Sheet: ${sheetName}]`);
            }
            textParts.push(text.trim());
            // Count rows (approximate from range)
            const range = XLSX.utils.decode_range(sheet['!ref'] || 'A1');
            totalRows += range.e.r - range.s.r + 1;
        }
    }
    const text = textParts.join('\n\n');
    const warnings = [];
    if (!text) {
        warnings.push('Workbook contains no extractable text content');
    }
    else if (sheetsWithContent.length < sheetNames.length) {
        const emptyCount = sheetNames.length - sheetsWithContent.length;
        warnings.push(`${emptyCount} empty sheet${emptyCount > 1 ? 's' : ''} skipped`);
    }
    return {
        text,
        sheetCount: sheetsWithContent.length,
        sheetNames: sheetsWithContent,
        rowCount: totalRows,
        ...(warnings.length > 0 && { warnings }),
    };
}
/**
 * Extract text from a CSV buffer (xlsx handles CSV natively)
 */
export const extractCSV = extractExcel;
//# sourceMappingURL=excel.js.map