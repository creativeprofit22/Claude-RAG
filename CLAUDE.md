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
Phase: refactoring
Feature: The Curator Design System - Phase 2 Light Theme
Files:
  - src/react/tokens/colors.css
  - src/react/tokens/index.css
  - src/react/styles.css
Reports:
  - validation: reports/validation-curator-phase2-light-theme.md
  - refactor: reports/refactor-hunt-curator-phase2-light-theme.md
Tier: high
Tier-Status: pending
Tier-Counts: high=3, medium=5, low=3

## Last Session (2025-12-27)
Refactor-hunt complete on Phase 2 Light Theme:
- Created refactor report with 11 items (3 High, 5 Medium, 3 Low)
- High: duplicate modal overlay (3x), error banner (3x), animation lines 315-318
- Medium: BEM inconsistency, dead :root block, light theme border derivation, empty state pattern, hardcoded tokens
- Low: gold-hover literal, scrollbar selector, stale TODOs
- Stopped at: Ready for refactoring phase (high tier first)

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
