# Refactor Report: CLI Migration

Generated: 2025-12-23
Feature: CLI Migration (API-free RAG)

## Scope
Files analyzed:
- src/responder.ts
- src/responder-gemini.ts
- src/subagents/retriever.ts
- src/index.ts
- src/server.ts

## High Priority (Tech Debt / DRY Violations)

| # | Location | Issue | Suggested Fix | Effort |
|---|----------|-------|---------------|--------|
| 1 | responder.ts:64, index.ts:56, server.ts:111 | `checkClaudeCodeAvailable()` duplicated in 3 files | Extract to shared `src/utils/cli.ts` | S |
| 2 | responder.ts:28, responder-gemini.ts:74 | `DEFAULT_SYSTEM_PROMPT` duplicated identically | Move to shared `src/constants.ts` | S |
| 3 | responder-gemini.ts:83, retriever.ts:68 | Gemini client singleton pattern duplicated | Create shared `src/utils/gemini-client.ts` | S |
| 4 | responder.ts:4, index.ts:30, server.ts:18 | `execAsync = promisify(exec)` repeated in 3 files | Export from shared utility | S |
| 5 | index.ts:222, index.ts:448, server.ts:268 | Chunk building from search results duplicated | Extract `buildChunksFromResults()` helper | S |
| 6 | index.ts:155-296, server.ts:225-363 | `query()` function duplicated between index.ts and server.ts | Server should import from index.ts, not reimplement | M |

## Medium Priority (Code Clarity) - COMPLETED

| # | Location | Issue | Status |
|---|----------|-------|--------|
| 1 | responder.ts | `streamResponse()` was 150 lines | ✅ Split into: `classifyCliError()`, `spawnClaudeProcess()`, `StreamState`, `waitForChunk()`, `setupStreamHandlers()` |
| 2 | server.ts | `handleRequest()` was 240 lines | ✅ Extracted: `handleHealthCheck()`, `handleRespondersCheck()`, `handleUpload()`, `handleQuery()`, `handleSearch()`, `handleListDocuments()`, `handleDeleteDocument()`, `sanitizeErrorMessage()` |
| 3 | Multiple files | Query validation repeated | ✅ Created shared `src/utils/validation.ts` with `validateQuery()`, `validateContext()`, `validateSources()` |
| 4 | index.ts, server.ts | Context formatting repeated | ✅ Already existed in `src/utils/chunks.ts` as `buildContextFromChunks()` |
| 5 | index.ts, server.ts | Sources building repeated | ✅ Already existed in `src/utils/chunks.ts` as `buildSourcesFromChunks()` |
| 6 | responder-gemini.ts | Context sanitization duplicated | ✅ Extracted `sanitizeContext()` helper function |

## Low Priority (Nice-to-Have)

| # | Location | Issue | Suggested Fix | Effort |
|---|----------|-------|---------------|--------|
| 1 | responder-gemini.ts:249-250 | AbortController created but signal not used | Either use signal or remove unused code | S |
| 2 | responder.ts vs responder-gemini.ts | Different error handling approaches | Standardize error classification across responders | M |
| 3 | Multiple files | Timing measurement done inline | Create `withTiming()` utility wrapper | S |
| 4 | server.ts:372-379 | Valid routes hardcoded in array | Define routes as constants with metadata | S |
| 5 | index.ts, server.ts | Type definitions for chunks/sources repeated | Consolidate in types.ts | S |

## Summary
- High: 6 refactors - COMPLETED (2025-12-23)
- Medium: 6 refactors - COMPLETED (2025-12-23)
- Low: 5 refactors (Polish and consistency) - PENDING
- Total: 17 refactors (12 complete, 5 remaining)
