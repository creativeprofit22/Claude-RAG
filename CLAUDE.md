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
Phase: complete
Feature: Brutalist Skin - Admin Panel Components
Files: demo/skins.css (lines 959-1280)
Refactor-Report: reports/refactors-brutalist-admin.md

## Last Session (2025-12-28)
- **Refactoring Complete**: 11/12 refactors executed (1 skipped - subjective)
- **High Priority**: Status colors extracted, bar-label conflict fixed, dual selectors removed
- **Medium Priority**: Combined focus states, stripe gradients to variables, typography/container/item base selectors
- **Low Priority**: Removed redundant border-radius, documented z-index stacking
- **Line Reduction**: ~50 lines through selector consolidation

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
