# Claude-RAG

Reusable RAG component for embedding into projects. Uses Claude Code CLI (user's subscription) for responses - NOT Anthropic API.

## CRITICAL CONSTRAINT
**NO Anthropic API.** User has Claude Max subscription. Response generation uses:
- Primary: Claude Code CLI (`claude -p "..." --print`)
- Fallback: Gemini 2.0 Flash

## Flow
```
Query → Gemini Embeddings → LanceDB → Chunks → Claude Code CLI → Response
```

## Current Focus
Bug fixing - LOW tier remaining (19 bugs)

## Pipeline State
Phase: debugging
Feature: Comprehensive bug fixes
Tier: low
Status: pending

## Reports
- bugs: `reports/bug-report-2025-12-25.md`

## Last Session (2025-12-25)
Fixed all 19 MEDIUM priority bugs:
- server.ts: Validated categoryIds/tags arrays, error handling for metadata ops, DoS protection for static files
- database.ts: Null checks in pagination, type validation for escapeFilterValue, error handling in paginateTable
- responder.ts: 2-min CLI timeout, stderr sanitization
- gemini-client.ts: Promise-based initialization to fix race condition
- embeddings.ts: Embedding array validation
- retriever.ts: Balanced brace JSON extraction, warning logs for invalid indices
- extractors: Expanded HTML entity decoding, empty PDF handling
- React: Fixed race conditions in RAGChat scroll, useModal listeners, UploadModal category fetch
- Committed: `d03175d`

## Next Steps
1. Fix 19 LOW priority bugs
2. Run tests to verify fixes
3. Update to build phase

## Key Files
- `src/server.ts` - Bun HTTP server
- `src/database.ts` - LanceDB wrapper
- `src/responder.ts` - Claude CLI integration
- `src/react/` - React components and hooks

## Environment
```
GOOGLE_AI_API_KEY=xxx          # Required
RAG_RESPONDER=claude|gemini    # Optional, default: claude
```
