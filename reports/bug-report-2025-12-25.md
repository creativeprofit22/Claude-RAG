# Claude-RAG Bug Report (2025-12-25)

Comprehensive bug analysis across 4 areas. Total: **52 bugs found**.

## Summary

| Severity | Server | Database | React | Core | Total |
|----------|--------|----------|-------|------|-------|
| HIGH | 5 | 4 | 3 | 0 | **12** |
| MEDIUM | 5 | 4 | 4 | 11 | **24** |
| LOW | 5 | 5 | 4 | 5 | **19** |

## Scope (Files to Fix)

- `src/server.ts`
- `src/database.ts`
- `src/responder.ts`
- `src/embeddings.ts`
- `src/extractors/index.ts`
- `src/extractors/pdf.ts`
- `src/subagents/retriever.ts`
- `src/utils/gemini-client.ts`
- `src/react/hooks/useFileQueue.ts`
- `src/react/hooks/useUploadStream.ts`
- `src/react/hooks/useDocumentLibraryState.ts`
- `src/react/hooks/useAPIResource.ts`
- `src/react/hooks/useModal.ts`
- `src/react/RAGChat.tsx`
- `src/react/components/upload/UploadModal.tsx`

---

## HIGH SEVERITY BUGS

### Server (server.ts)

| Line | Issue | Fix |
|------|-------|-----|
| 758 | Unhandled error in `deleteDocument` - no try-catch | Wrap in try-catch, return 500 on failure |
| 773 | Unhandled error in `getDocumentSummaries` | Add try-catch error handling |
| 693 | Missing error handling in query operation | Add local try-catch for clearer error handling |
| 1259 | Incomplete CORS preflight for parameterized routes (`/:id/metadata`, `/:id/details`, `/categories/:id`) | Add all parameterized routes to preflight validation |
| 634 | Race condition in SSE stream - `controller.close()` may fire before flush completes | Use proper SSE error closing pattern |

### Database (database.ts)

| Line | Issue | Fix |
|------|-------|-----|
| 164 | `this.db!` non-null assertion could fail if connect() fails silently | Add proper null check after connect() |
| 193-200 | Race condition between `tableNames()` check and `openTable()` | Use mutex or atomic operation |
| 258 | Potential query injection in `getDocumentChunks` via `escapeFilterValue()` | Use parameterized queries or stricter escaping |
| 279 | Potential query injection in `deleteDocument` | Same as above |

### React Hooks

| File:Line | Issue | Fix |
|-----------|-------|-----|
| useFileQueue.ts:216 | Stale closure in `startUpload` - callbacks receive outdated file state | Use refs or functional state updates |
| useUploadStream.ts:143 | Missing SSE reader cleanup on unmount - memory leak | Add cleanup in abort handler for reader loop |
| useDocumentLibraryState.ts:47 | Stale refetch ref in delete handler | Add refetch to effect dependencies or use stable callback |

---

## MEDIUM SEVERITY BUGS

### Server (server.ts)

| Line | Issue |
|------|-------|
| 494-495 | No validation of categoryIds/tags arrays after JSON.parse |
| 818,831 | Missing error handling in setDocumentCategories/setDocumentTags |
| 110 | validateContentLength throws but not consistently caught |
| 1291 | Unsafe file read without size check (DoS risk) |
| 835 | Missing null check on metadata result |

### Database (database.ts)

| Line | Issue |
|------|-------|
| 395 | `firstDoc.metadata` accessed without verifying firstDoc exists |
| 136-144 | Missing error handling in paginateTable loop |
| 83-84 | Type casting without validation |
| 240 | Incomplete null check in listDocuments |

### Core Logic

| File:Line | Issue |
|-----------|-------|
| responder.ts:10-18 | No timeout for Claude CLI subprocess (hang risk) |
| responder.ts:97-100 | Error message leakage (stderr to users) |
| gemini-client.ts:15-38 | Race condition in client initialization |
| embeddings.ts:137-156 | Empty embedding arrays on failure (corrupts DB) |
| retriever.ts:118-135 | Greedy JSON regex extraction |
| retriever.ts:223-224 | Silent fallback when indices invalid |
| database.ts:354-368 | Missing null check for metadata in pagination |
| index.ts:35-37 | Incomplete escaping for LanceDB filters |
| extractors/pdf.ts:39 | Empty PDFs treated as "scanned" instead of invalid |
| extractors/index.ts:116-130 | Limited HTML entity decoding |
| extractors/pdf.ts:35 | No validation for empty text result |

### React Components

| File:Line | Issue |
|-----------|-------|
| RAGChat.tsx:98-100 | Race condition on rapid message updates |
| useAPIResource.ts:114-118 | Missing dependency in auto-fetch effect |
| useModal.ts:32-41 | Event listener accumulation on frequent open/close |
| UploadModal.tsx:34-37 | Race condition in category auto-fetch |

---

## LOW SEVERITY BUGS

### Server
- Inconsistent error message patterns (line 1228-1239)
- CORS preflight returns 404 with JSON body instead of 403 (line 1261)
- Path normalization edge case with trailing slashes (line 1283)
- No input validation on documentId format (line 799-801)
- Responder preference loses trace context (line 687-691)

### Database
- Silent failure in withTable error handling (line 115-120)
- Missing validation for limit parameter (line 254, 382)
- Potential memory leak in paginateTable with large batches (line 127-146)
- Missing documentName validation (line 402)

### Core Logic
- Inaccurate token estimation (responder.ts:61-63)
- Module-level singleton not cleared on API key change (gemini-client.ts:33)
- Incomplete HTML tag stripping regex (extractors/index.ts:120-122)
- Silent category ID filtering (categories.ts:280-293)
- Chunk building documentation unclear (index.ts:323-331)

### React
- Source key could cause re-renders with duplicates (MessageBubble.tsx:69)
- Skeleton loader key causes unnecessary re-mounts (DocumentList.tsx:68-70)
- Missing dependency in processFiles callback (FileDropZone.tsx:77)
- setTimeout without cleanup (FileQueue.tsx:59)
