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
Section: The Curator Design System
Files: src/react/styles.css, src/react/tokens/*, src/react/fonts/*

## Pipeline State
Phase: debugging
Feature: The Curator Design System - Phase 2 Light Theme
Files:
  - src/react/styles.css
  - src/react/tokens/*.css
  - src/react/components/**/*.tsx
Reports:
  - validation: reports/validation-curator-phase2-light-theme.md
  - refactor: reports/refactor-hunt-curator-phase2-light-theme.md
Tier: low
Tier-Status: pending
Tier-Counts: high=3 ✓, medium=6 ✓, low=9

## Last Session (2025-12-27)
- Fixed 6 MEDIUM bugs (accessibility/theme consistency)
- Updated validation report and CLAUDE.md
- All committed and pushed to origin
- Stopped at: LOW priority bugs remaining (9 items)

## Key Files
- `src/server.ts` - Bun HTTP server
- `src/database.ts` - LanceDB wrapper
- `src/responder.ts` - Claude CLI integration
- `src/react/` - React components and hooks
- `src/react/tokens/` - Curator design tokens (NEW)
- `src/react/fonts/` - Self-hosted Fraunces + Satoshi (NEW)

## Environment
```
GOOGLE_AI_API_KEY=xxx          # Required
RAG_RESPONDER=claude|gemini    # Optional, default: claude
```
