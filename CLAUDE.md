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
Tier: low
Tier-Status: pending
Reports:
  - bugs: reports/bugs-excel-scroll-fix.md

## Last Session (2025-12-25)
- Fixed Medium #1: RAGChat scroll trigger - added `wasTypingRef` to track typing state transitions, scroll now only fires when `isTyping` goes false→true
- Fixed Medium #2: Empty workbook warning - added `warnings?: string[]` to `ExcelExtractionResult`, empty workbooks now return warning message
- Updated `extractors/index.ts` to propagate Excel/CSV warnings
- Type check passed

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
