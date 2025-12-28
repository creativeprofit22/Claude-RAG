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
Section: M5 Token Migration Complete, Polish Phase
Files: src/react/styles.css

## Pipeline State
Phase: refactor-hunt
Feature: M5 Token Migration
Files-Validated:
  - src/react/styles.css
  - src/react/tokens/*.css
Validation-Report: reports/validation-m5-token-migration.md

## Last Session (2025-12-27)
- Completed M5 Token Migration: 148 hardcoded CSS values → design tokens
- Replacements: border-radius (40), font-size (52), gap (56)
- Reduced hardcoded rem values: 217 → 69
- All 6 validation checks pass (Tests, API, UI, Wiring, Bottlenecks, Bugs)
- Build passes, 21 tests pass
- Stopped at: Validation complete, ready for refactor-hunt or next polish item

## Key Files
- `src/server.ts` - Bun HTTP server
- `src/database.ts` - LanceDB wrapper
- `src/responder.ts` - Claude CLI integration
- `src/react/` - React components and hooks
- `src/react/tokens/` - Curator design tokens
- `src/react/fonts/` - Self-hosted Fraunces + Satoshi

## Environment
```
GOOGLE_AI_API_KEY=xxx          # Required
RAG_RESPONDER=claude|gemini    # Optional, default: claude
```
