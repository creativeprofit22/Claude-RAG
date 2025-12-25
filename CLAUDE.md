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

## Pipeline State
Phase: refactoring
Feature: Comprehensive bug fixes
Tier: medium
Tier-Status: pending

## Reports
- bugs: `reports/bug-report-2025-12-25.md`
- refactors: `reports/refactors-comprehensive-bug-fixes.md`

## Last Session (2025-12-25)
- Completed HIGH priority refactors (3 of 3):
  - embeddings.ts: Extracted `generateEmbeddingCore()` to eliminate DRY violation
  - embeddings.ts: Replaced local singleton with shared `gemini-client.ts`
  - server.ts: Documented CORS preflight 403 empty body rationale
- Committed: `35858c7`

## Next Steps
1. Execute medium priority refactors (6 items)
2. Execute low priority refactors (8 items)
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
