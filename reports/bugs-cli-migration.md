# Bug Report: CLI Migration

Generated: 2025-12-23
Feature: CLI Migration (API-free RAG)

## Scope
Files analyzed:
- src/responder.ts
- src/responder-gemini.ts
- src/subagents/retriever.ts
- src/index.ts
- src/server.ts

## High Priority

| # | Location | Description | Impact |
|---|----------|-------------|--------|
| 1 | responder.ts:96-97,186 | Command injection - user query/context passed directly to CLI without escaping | Arbitrary command execution via malicious query |
| 2 | responder.ts:199-209 | Race condition in stream handler - resolveWait called without proper synchronization | Potential crash or missed chunks |
| 3 | responder.ts:273 | Promise not awaited before generator completion - early return possible | Error handling bypassed |
| 4 | index.ts:183,414 | SQL injection in documentId filter - direct string interpolation | Query manipulation, data access bypass |
| 5 | server.ts:381,406,439 | Missing JSON parsing error handling - req.json() can throw | Server crash on malformed JSON |
| 6 | server.ts:392-394,416-420 | Unsafe type casting without validation - `as` assertions on untrusted input | Type errors, invalid data downstream |
| 7 | server.ts:381,406,439 | No Content-Length validation - unlimited payload size | Memory exhaustion DoS |
| 8 | retriever.ts:221-227 | Type mismatch with GoogleGenAI API - contents format may be wrong | Silent failures or API errors |
| 9 | responder-gemini.ts:58-62 | No validation of query/context/sources parameters | API calls with empty/invalid data |
| 10 | responder-gemini.ts:80-88 | Incomplete error handling for API response structure | Runtime errors on malformed response |

## Medium Priority

| # | Location | Description | Impact |
|---|----------|-------------|--------|
| 1 | responder.ts:113-114 | Missing null safety on process exit code (null = signal) | Misidentified errors |
| 2 | responder.ts:116,122,212,216 | Brittle error pattern matching - case-sensitive substring checks | Missed error detection |
| 3 | index.ts:89-95 | Silent fallback to Gemini when Claude unavailable | User not informed of responder change |
| 4 | index.ts:278 | documentId collision risk - Date.now() can collide | Database corruption |
| 5 | index.ts:138-139 | Missing query validation - empty strings pass through | Wasted API calls |
| 6 | server.ts:383-387 | Empty string validation bypassed - `""` passes typeof check | Invalid queries accepted |
| 7 | server.ts:27 | CORS wildcard `*` - allows any origin | CSRF vulnerability in production |
| 8 | server.ts:486 | Raw error messages returned to clients | Implementation detail leakage |
| 9 | retriever.ts:188 | No validation for empty query string | Wasted tokens |
| 10 | retriever.ts:275 | Promise.all fails entirely if one query fails | Batch processing fragile |
| 11 | responder-gemini.ts:181-195 | Generic error catching - doesn't differentiate error types | Harder debugging |
| 12 | responder-gemini.ts:80,152 | No timeout on API calls | Indefinite hangs possible |

## Low Priority ✅ All Fixed (2025-12-23)

| # | Location | Description | Impact | Fix |
|---|----------|-------------|--------|-----|
| 1 | responder.ts:98,188 | Missing stdin closure after spawn | Process may hang | Already fixed (stdin.end() called) |
| 2 | responder.ts:127,220 | Stderr may be empty even with meaningful errors | Lost error details | Fallback to stdout/fullAnswer in error |
| 3 | index.ts:204,426 | `_distance \|\| 0` loses info when distance is legitimately 0 | Ranking data loss | Changed to `?? 0` null coalescing |
| 4 | index.ts:18 | RAGResponse imported from responder.ts but also defined in responder-gemini.ts | Type divergence | Import shared types from responder.ts |
| 5 | server.ts:321 | OPTIONS returns 204 for any route without validation | Incorrect CORS preflight | Added route validation before 204 |
| 6 | retriever.ts:162,247 | Empty limitedIndices not checked by caller | Misleading empty results | Fallback to top chunks with reasoning |
| 7 | responder-gemini.ts:40-53 | Race condition in client singleton initialization | Multiple instances possible | Added clientInitializing guard flag |
| 8 | responder-gemini.ts:72-77 | Context not sanitized for prompt injection | LLM manipulation | Sanitize context with delimiters |

## Summary
- High: 10 bugs ✅ All fixed
- Medium: 12 bugs ✅ All fixed
- Low: 8 bugs ✅ All fixed (2025-12-23)
- Total: 30 bugs ✅ All fixed

## Critical Issues
1. **Command injection** in responder.ts - must escape or use stdin
2. **SQL injection** in documentId filter - needs parameterized queries
3. **No input validation** across server.ts endpoints
