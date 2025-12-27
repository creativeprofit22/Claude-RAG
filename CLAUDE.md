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
Phase: refactoring
Feature: Tab Navigation (Chat/Admin sections)
Reports:
  - refactors: reports/refactors-tab-navigation.md
Refactors-Remaining: 19 (High: 0, Medium: 5, Low: 14)

## Last Session (2025-12-27)
Completed 3 Medium priority refactors:
- #4: Extracted FILE_ICON_SVG constant (demo.js:32-36)
- #1: Extracted parseSSEStream() + uploadSingleFile() helpers (demo.js:131-166)
- #2: Extracted createReactRenderer() factory (demo.js:210-226)
- Build verified passing
- Stopped at: Medium #3 (JSDoc), #5-8 remaining

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
