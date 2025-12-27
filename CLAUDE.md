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
Phase: build
Feature: The Curator Design System
Files:
  - src/react/tokens/colors.css
  - src/react/tokens/typography.css
  - src/react/tokens/animation.css
  - src/react/tokens/spacing.css
  - src/react/tokens/index.css
  - src/react/fonts/Fraunces-*.woff2
  - src/react/fonts/Satoshi-*.woff2
  - src/react/styles.css
Plan: /home/reaver47/.claude/plans/eventual-seeking-ripple.md
Current-Phase: 1 of 6 complete

## Last Session (2025-12-26)
Completed Phase 1 (Token Foundation) of The Curator design system:
- Created tokens/ directory with OKLCH color palette, typography, animation, spacing
- Downloaded self-hosted fonts (Fraunces serif + Satoshi sans) - 236KB total
- Migrated styles.css to use new --curator-* variables (~250+ replacements)
- Fixed font paths in typography.css (../fonts/)
- Updated package.json copy-assets script
- Build verified: `npm run build` SUCCESS
- Stopped at: Ready for Phase 2 (MessageBubble transformation)

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
