/**
 * Excel/CSV Text Extraction
 * Uses SheetJS (xlsx) for spreadsheet parsing
 */

import * as XLSX from 'xlsx';

export interface ExcelExtractionResult {
  text: string;
  sheetCount: number;
  sheetNames: string[];
  rowCount: number;
}

/**
 * Extract text from an Excel or CSV buffer
 * @param buffer - Spreadsheet file as ArrayBuffer
 * @returns Extracted text with sheet metadata
 */
export function extractExcel(buffer: ArrayBuffer): ExcelExtractionResult {
  let workbook: XLSX.WorkBook;
  try {
    workbook = XLSX.read(buffer, { type: 'array' });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    throw new Error(`Failed to parse spreadsheet: ${message}`);
  }

  const sheetNames = workbook.SheetNames;
  const textParts: string[] = [];
  let totalRows = 0;

  for (const sheetName of sheetNames) {
    const sheet = workbook.Sheets[sheetName];
    if (!sheet) continue;

    // Convert sheet to text with tab-separated values
    const text = XLSX.utils.sheet_to_txt(sheet, { blankrows: false });

    if (text.trim()) {
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

  return {
    text: textParts.join('\n\n'),
    sheetCount: sheetNames.length,
    sheetNames,
    rowCount: totalRows,
  };
}

/**
 * Extract text from a CSV buffer
 * @param buffer - CSV file as ArrayBuffer
 * @returns Extracted text
 */
export function extractCSV(buffer: ArrayBuffer): ExcelExtractionResult {
  // xlsx handles CSV natively
  return extractExcel(buffer);
}
