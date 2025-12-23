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
Section: CLI Migration
Files: src/responder.ts, src/responder-gemini.ts, src/subagents/retriever.ts, src/index.ts, src/server.ts

## Pipeline State
Phase: refactoring
Feature: CLI Migration
Tier: medium
Tier-Status: pending
Reports:
  - bugs: reports/bugs-cli-migration.md
  - refactors: reports/refactors-cli-migration.md

## Last Session (2025-12-23)
High priority refactors complete (commits 1664bca, 342586e):
- Created 4 shared utilities: cli.ts, constants.ts, gemini-client.ts, chunks.ts
- Removed 374 lines of duplicate code across 6 files
- Pushed to origin

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
