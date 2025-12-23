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
Section: Ready for new features
Files: Core system complete

## Pipeline State
Phase: build
Feature: CLI Migration
Status: Complete
Reports:
  - bugs: reports/bugs-cli-migration.md
  - refactors: reports/refactors-cli-migration.md

## Last Session (2025-12-23)
Low priority refactors complete (commit 089442a):
- Removed unused AbortController in responder-gemini.ts
- Created shared ResponderError class (src/utils/responder-errors.ts)
- Created withTiming() utility (src/utils/timing.ts)
- Defined routes as constants with metadata (server.ts ROUTES object)
- Consolidated type definitions: Source→ChunkSource, RetrievedChunk→Chunk
- All 17 refactors complete, pushed to origin

## Key Files
- `src/responder.ts` - Claude Code CLI integration
- `src/responder-gemini.ts` - Gemini fallback
- `src/index.ts` - Main API (query, search)
- `src/server.ts` - Bun HTTP server
- `src/subagents/retriever.ts` - Chunk retrieval

## Environment
```
GOOGLE_AI_API_KEY=xxx          # Required
RAG_RESPONDER=claude|gemini    # Optional, default: claude
```

## Note
102 pre-existing TypeScript errors in React components (TSX/DOM config) - not from this migration.
