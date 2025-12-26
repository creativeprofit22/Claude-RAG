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
Phase: debugging
Feature: Excel/CSV Support & Chat Scroll Fix
Tier: high
Tier-Status: pending
Reports:
  - bugs: reports/bugs-excel-scroll-fix.md

## Last Session (2025-12-25)
- Fixed chat input Enter key scroll bug: changed from `scrollIntoView()` to `container.scrollTop`
- Added Excel/CSV file support: new `src/extractors/excel.ts` using SheetJS (xlsx)
- Updated file-types.ts with .xlsx, .xls, .csv MIME types
- Committed: `6baac60`
- Bug hunt: Found 5 bugs (1 high, 2 medium, 2 low) in new code

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
