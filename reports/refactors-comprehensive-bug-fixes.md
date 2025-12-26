# Refactor Report: Comprehensive Bug Fixes

Generated: 2025-12-25
Feature: Comprehensive bug fixes (1 of 1)
Source: reports/bug-report-2025-12-25.md

## Scope
Files analyzed:
- src/server.ts
- src/database.ts
- src/responder.ts
- src/embeddings.ts
- src/extractors/index.ts
- src/extractors/pdf.ts
- src/subagents/retriever.ts
- src/utils/gemini-client.ts
- src/react/hooks/useFileQueue.ts
- src/react/hooks/useUploadStream.ts
- src/react/hooks/useDocumentLibraryState.ts
- src/react/hooks/useAPIResource.ts
- src/react/hooks/useModal.ts
- src/react/RAGChat.tsx
- src/react/components/upload/UploadModal.tsx

## High Priority (Tech Debt / DRY)

| # | Location | Issue | Suggested Fix | Effort |
|---|----------|-------|---------------|--------|
| 1 | embeddings.ts:43-72 + 80-108 | DRY violation: `generateEmbedding` and `generateQueryEmbedding` are ~95% identical, differing only in `taskType` | Extract shared logic into helper function with `taskType` parameter | S |
| 2 | responder.ts + embeddings.ts | Duplicate Gemini client pattern: both files create their own `genaiClient` singletons with identical API key validation | Use shared `gemini-client.ts` singleton in `embeddings.ts` instead of duplicating | S |
| 3 | server.ts:1315-1320 | CORS preflight handler returns empty body for 403, but other error paths return JSON | Consistent error response format - either all JSON or document the exception | S |

## Medium Priority (Code Clarity) ✅ COMPLETED

| # | Location | Issue | Suggested Fix | Effort | Status |
|---|----------|-------|---------------|--------|--------|
| 4 | extractors/index.ts | Long chain of `.replace()` calls for HTML entity decoding | Extracted `decodeHtmlEntities()` with HTML_ENTITIES map | M | ✅ |
| 5 | useUploadStream.ts | SSE event parsing switch has duplicated fallback logic | Extracted `createProgressUpdate()` and `createUploadResult()` | M | ✅ |
| 6 | useFileQueue.ts | `startUpload` function is 57 lines with deeply nested logic | Extracted `markFileComplete()` and `markFileError()` | M | ✅ |
| 7 | subagents/retriever.ts | `parseLLMResponse` mixes JSON extraction and validation | Added `validateLLMResponse()` function | S | ✅ |
| 8 | database.ts | `addDocuments` has race condition handling in main flow | Extracted `withTableRaceRetry()` wrapper | M | ✅ |
| 9 | UploadModal.tsx | Category fetch effect uses setTimeout hack | Replaced with AbortController pattern | S | ✅ |

## Low Priority (Nice-to-Have) ✅ COMPLETED

| # | Location | Issue | Suggested Fix | Effort | Status |
|---|----------|-------|---------------|--------|--------|
| 10 | embeddings.ts:22 | Module-level `genaiClient` var without JSDoc explaining singleton pattern | Add brief doc comment explaining why it's module-scoped | S | ✅ N/A (refactored to shared client in High #2) |
| 11 | responder.ts:13 | `spawnClaudeProcess` hardcodes 5000ms force-kill delay | Extract to constant with doc explaining the timeout escalation | S | ✅ |
| 12 | database.ts:12 | `DEFAULT_CHUNK_LIMIT = 10000` is arbitrary-looking magic number | Add comment explaining why 10000 was chosen | S | ✅ |
| 13 | useAPIResource.ts:55-56 | `headersJson` + `stableHeaders` useMemo is clever but not obvious | Add comment explaining the JSON.stringify stabilization pattern | S | ✅ |
| 14 | RAGChat.tsx:71-84 | Scroll effect uses both ref and dependency array tracking | Simplify: either use ref-only approach or dependency-only | S | ✅ (documented hybrid pattern rationale) |
| 15 | pdf.ts:9 | `MIN_CHARS_PER_PAGE = 100` is magic number for scanned PDF detection | Document the heuristic reasoning | S | ✅ |
| 16 | useModal.ts:34 | `{ passive: true }` option on keydown listener is unusual | Document why passive is appropriate for ESC key handling | S | ✅ |
| 17 | subagents/retriever.ts:256-257 | Temperature `0.1` is magic number | Extract to constant with doc explaining low-temp rationale | S | ✅ |

## Summary
- High: 3 refactors (3 Small, 0 Medium, 0 Large) - pending
- Medium: 6 refactors (2 Small, 4 Medium, 0 Large) - **COMPLETED** ✅
- Low: 8 refactors (8 Small, 0 Medium, 0 Large) - **COMPLETED** ✅
- Total: 17 refactors (14 completed, 3 high priority pending)

### Key Themes
1. **DRY violations in Gemini client usage** - Two files maintain separate singletons
2. ~~**Long functions needing extraction** - Several 50+ line functions with nested logic~~ ✅
3. ~~**Magic numbers** - Multiple numeric constants without documentation~~ ✅
4. ~~**HTML entity handling** - Brittle regex chain that should be abstracted~~ ✅
