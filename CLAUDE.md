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
Section: React Chat UI
Files: src/react/RAGChat.tsx, src/react/hooks/useRAGChat.ts, src/react/components/ChatHeader.tsx, src/react/components/ChatInput.tsx, src/react/components/MessageBubble.tsx, src/react/components/TypingIndicator.tsx, src/react/components/LoadingDots.tsx, src/react/types.ts

## Pipeline State
Phase: refactoring
Feature: React Chat UI
Tier: medium
Tier-Status: pending
Reports:
  - bugs: reports/bugs-react-chat-ui.md
  - refactors: reports/refactors-react-chat-ui.md

## Last Session (2025-12-23)
Completed high-tier refactoring (also completed low-tier via LoadingDots extraction):
- Created `DEFAULT_ACCENT_COLOR` constant in types.ts:6, imported in all 5 components
- Extracted shared `LoadingDots.tsx` component with `DOT_DELAYS` array pattern
- Updated MessageBubble and TypingIndicator to use LoadingDots
- TypeScript compilation verified

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
