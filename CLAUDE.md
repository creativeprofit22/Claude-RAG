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
Section: Tab Navigation
Files: demo/index.html, demo/demo.js, demo/styles.css

## Pipeline State
Phase: debugging
Feature: Tab Navigation (Chat/Admin sections)
Tier: high
Tier-Status: pending
Reports:
  - bugs: reports/bugs-tab-navigation.md

## Last Session (2025-12-27)
- Added tab navigation to demo UI - Chat and Admin now separate sections
- Demo URL: http://localhost:3000/demo (NOT root path)
- Ran bug hunt checkpoint, found 3 bugs:
  - **High**: demo.js:246-248 - Query params break URL when responder dropdown used
  - **Medium**: demo.js:221-235 - askQuestion() crashes if chat not mounted
  - **Low**: demo.js:224 - No defensive check on property descriptor
- Stopped at: Ready to fix high-priority bug

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
