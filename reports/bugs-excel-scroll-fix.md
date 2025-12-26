# Bug Report: Excel Extractor & Scroll Fix

Generated: 2025-12-25
Feature: Excel/CSV Support & Chat Scroll Fix

## Scope
Files analyzed:
- src/extractors/excel.ts
- src/extractors/index.ts
- src/shared/file-types.ts
- src/react/RAGChat.tsx

## High Priority
| # | Location | Description | Impact |
|---|----------|-------------|--------|
| 1 | excel.ts:21 | No try-catch around `XLSX.read()` - corrupted or invalid Excel files will throw unhandled exception | Crashes server on bad file upload |

## Medium Priority
| # | Location | Description | Impact |
|---|----------|-------------|--------|
| 1 | RAGChat.tsx:77 | Scroll triggers whenever `isTyping` is true, not just on state change. Condition `messages.length > lastMessageCountRef.current \|\| isTyping` fires on every render while typing | Potential jittery scroll during streaming responses |
| 2 | excel.ts:47-48 | Empty workbook (all sheets empty) returns `{ text: '' }` with no indication of issue | Downstream code may fail or index empty content |

## Low Priority
| # | Location | Description | Impact |
|---|----------|-------------|--------|
| 1 | excel.ts:42-44 | Row count only incremented for sheets with content after trim, but sheetCount includes all sheets | Minor metadata inconsistency |
| 2 | RAGChat.tsx:73 | `lastMessageCountRef` initialized to `messages.length` - no initial scroll if component mounts with existing messages | User may not see latest message on mount |

## Summary
- High: 1 bugs
- Medium: 2 bugs
- Low: 2 bugs
- Total: 5 bugs
