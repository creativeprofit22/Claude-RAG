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
Section: M6 Complete, Ready for Publish
Files: src/react/styles.css

## Pipeline State
Phase: validated
Feature: M6 Token Migration
Validation-Report: reports/validation-m6-token-migration.md

## Last Session (2025-12-27)
- M6 validated: 82 token usages, zero hardcoded 0.375rem/0.25rem
- All tokens defined in spacing.css
- Build passes, 21 tests pass

## Next Steps
1. Publish to npm (version bump, npm publish)
2. Add dual runtime support (README with Bun alternative, keep npm primary)

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
