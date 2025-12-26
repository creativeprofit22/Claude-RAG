# Refactor Report: Excel Extractor & Scroll Fix

Generated: 2025-12-25
Feature: Excel/CSV Support & Chat Scroll Fix
Source: reports/bugs-excel-scroll-fix.md

## Scope
Files analyzed:
- src/extractors/excel.ts
- src/extractors/index.ts
- src/shared/file-types.ts
- src/react/RAGChat.tsx

## High Priority (Tech Debt / DRY)
| # | Location | Issue | Suggested Fix | Effort |
|---|----------|-------|---------------|--------|

## Medium Priority (Code Clarity)
| # | Location | Issue | Suggested Fix | Effort |
|---|----------|-------|---------------|--------|
| 1 | index.ts:25-48 | `getMimeType` uses verbose switch statement; adding new types requires updating switch and SUPPORTED_EXTENSIONS separately | Refactor to data-driven lookup using a `Record<string, SupportedMimeType>` map derived from or alongside SUPPORTED_EXTENSIONS | S |
| 2 | index.ts:168-191 | Excel (xlsx/xls) and CSV extraction have nearly identical result transformation patterns | Consolidate into single helper or handle both cases together since `extractCSV` already delegates to `extractExcel` | S |

## Low Priority (Nice-to-Have)
| # | Location | Issue | Suggested Fix | Effort |
|---|----------|-------|---------------|--------|
| 1 | excel.ts:80-83 | `extractCSV` is a trivial 3-line function that just calls `extractExcel` | Replace with const alias: `export const extractCSV = extractExcel;` — clearer intent, less indirection | S |
| 2 | index.ts:67-101 | HTML entity handling is defined inline; if other extractors need HTML decoding, this creates duplication | If future extractors need it, move to `src/shared/html-utils.ts`. Currently fine as-is. | M |

## Summary
- High: 0 refactors
- Medium: 2 refactors (2 Small)
- Low: 2 refactors (1 Small, 1 Medium)
- Total: 4 refactors
