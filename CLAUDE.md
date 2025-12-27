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
Phase: COMPLETE
Feature: The Curator Design System - Phase 2 Light Theme
Status: Validated, all bugs fixed, ready for npm publish
Reports:
  - validation: reports/validation-curator-phase2-light-theme.md
  - refactor: reports/refactor-hunt-curator-phase2-light-theme.md

## Last Session (2025-12-27)
Curator Phase 2 Light Theme - COMPLETE:
- Refactoring: All tiers complete (High 3/3, Medium 5/5, Low 3/3)
- D1 Button Classes: Complete (curator-btn variants)
- Validation: Tests pass (21/21), build passes
- Bug fixes: HIGH 3/3, MEDIUM 6/6 fixed
  - CategoryFilter hardcoded colors → CSS variables
  - FileQueue keyboard support → tabIndex, onKeyDown
  - Focus states → :focus-visible on sources toggle, sort order
  - RAGInterface ARIA → aria-controls, tabpanel roles
  - DocumentCard → aria-pressed for selection

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
