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
Tier: high
Tier-Status: pending

## Reports
- bugs: `reports/bug-report-2025-12-25.md`
- refactors: `reports/refactors-comprehensive-bug-fixes.md`

## Last Session (2025-12-25)
- Fixed all 16 LOW priority bugs (3 were false positives)
- Committed: `c9cf5c6`
- Generated refactor report: 17 refactors (3 High, 6 Medium, 8 Low)

## Next Steps
1. Execute high priority refactors (DRY violations)
2. Run tests to verify
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
