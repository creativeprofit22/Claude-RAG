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
Section: Demo UI Page
Files: demo/index.html, demo/ragchat-bundle.js, src/server.ts

## Pipeline State
Phase: debugging
Feature: Demo UI Page
Tier: low
Tier-Status: pending
Reports:
  - bugs: reports/bugs-demo-ui.md

## Last Session (2025-12-23)
Fixed high and medium priority bugs in Demo UI:
- 3 High: XSS protection, memory leak fix, path traversal prevention (already in code)
- 4 Medium: Form submit timing, error parsing, PDF removal, upload try-catch
- Remaining: 4 low priority (unused vars, SVG icons, error states, CORS hardening)

## Package Usage
```tsx
// Backend API
import { query, addDocument } from 'claude-rag';

// React UI
import { RAGChat } from 'claude-rag/react';
import 'claude-rag/react/styles.css';

<RAGChat endpoint="/api/rag/query" />
```

## Key Files
- `src/index.ts` - Main API exports
- `src/server.ts` - Bun HTTP server
- `src/react/RAGChat.tsx` - Drop-in chat component
- `src/react/hooks/useRAGChat.ts` - React hook
- `src/react/styles.css` - Standalone styles

## Environment
```
GOOGLE_AI_API_KEY=xxx          # Required
RAG_RESPONDER=claude|gemini    # Optional, default: claude
```
