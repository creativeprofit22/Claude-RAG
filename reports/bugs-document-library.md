# Bug Report: Document Library Module

Generated: 2025-12-24
Feature: Document Library & Categorization

## Scope
Files analyzed:
- src/react/components/documents/DocumentCard.tsx
- src/react/components/documents/DocumentLibrary.tsx
- src/react/components/documents/DocumentList.tsx
- src/react/components/documents/DocumentPreview.tsx
- src/react/components/documents/DocumentSearch.tsx
- src/react/components/shared/ConfirmDialog.tsx
- src/react/hooks/useDocuments.ts
- src/react/hooks/useCategories.ts
- src/categories.ts
- src/database.ts

## High Priority

| # | Location | Description | Impact |
|---|----------|-------------|--------|
| 1 | database.ts:201-202 | SQL injection vulnerability in `getDocumentChunks()` - documentId is interpolated directly into WHERE clause without escaping | Attacker could inject malicious SQL via crafted documentId, potentially accessing or deleting all data |
| 2 | database.ts:224 | SQL injection vulnerability in `deleteDocument()` - documentId is interpolated directly into delete filter without escaping | Attacker could craft documentId to delete arbitrary data |
| 3 | database.ts:350-351 | SQL injection vulnerability in `getDocumentDetails()` - documentId is interpolated directly into WHERE clause | Attacker could inject malicious SQL to access unauthorized data |
| 4 | useDocuments.ts:139 | API endpoint mismatch - calls `GET /documents/:id` but server expects `GET /documents/:id/details` | Document preview will fail with 404, breaking the preview functionality |

## Medium Priority

| # | Location | Description | Impact |
|---|----------|-------------|--------|
| 1 | DocumentLibrary.tsx:65 | Unused variable `refetch` - destructured but never called | After delete, document list may be stale if optimistic update fails; no way to manually refresh |
| 2 | categories.ts:161-164 | Category mutation without returning updated object - mutates `category` in place then returns it, but if spread operator was intended for immutability, this pattern is inconsistent | Could cause unexpected state if caller expects immutable return |
| 3 | DocumentSearch.tsx:61 | Debounce effect dependency on `onChange` - if parent recreates `onChange` callback on every render (no useCallback), debounce will be reset repeatedly | Search may not debounce properly in some parent implementations |
| 4 | useCategories.ts:214-218 | Infinite fetch loop risk - `refetch` is in dependency array of useEffect that calls it; if `refetch` identity changes, causes re-fetch | Performance issue, potential infinite loop if headers object recreated on each render |
| 5 | useDocuments.ts:161-165 | Same infinite fetch loop risk as useCategories - `refetch` in useEffect dependency array | Same as above |

## Low Priority

| # | Location | Description | Impact |
|---|----------|-------------|--------|
| 1 | DocumentCard.tsx:83-88 | Missing keyboard handler for Delete and Preview buttons - only card itself is keyboard accessible | Accessibility: users can't trigger hover actions via keyboard |
| 2 | DocumentPreview.tsx:39 | Global document object shadowing - uses `document` variable name which shadows global `document` | Could cause confusion, though the code works due to renamed parameter |
| 3 | DocumentList.tsx:66-68 | Non-unique skeleton keys - uses array index as key for skeletons | React warning in development, minor perf impact |
| 4 | categories.ts:69 | Silently swallows parse errors - returns default categories on JSON parse failure without indication | User may lose custom categories without knowing why |
| 5 | ConfirmDialog.tsx:39-46 | Event listener added to document without passive option | Minor performance on mobile scroll events (though dialog prevents scrolling anyway) |

## Summary
- High: 4 bugs
- Medium: 5 bugs
- Low: 5 bugs
- Total: 14 bugs

## Notes

### SQL Injection Pattern (High #1-3)
The LanceDB WHERE clause uses string interpolation:
```typescript
.where(`metadata.documentId = "${documentId}"`)
```
If `documentId` contains `"` or other special characters, it could break the query or inject malicious filters. Recommend using parameterized queries or escaping special characters.

### API Endpoint Mismatch (High #4)
In `useDocuments.ts:139`, the `getDocumentDetails` function calls:
```typescript
GET /documents/${id}
```
But the server at `server.ts` expects:
```typescript
GET /documents/:id/details
```
This will cause 404 errors when trying to preview documents.
