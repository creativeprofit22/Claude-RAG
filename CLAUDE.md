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
Phase: refactor-hunt
Feature: Phase 3 - Modals + Upload Motion System
Files-Validated:
- src/react/components/upload/UploadModal.tsx
- src/react/components/documents/DocumentPreview.tsx
- src/react/components/shared/ConfirmDialog.tsx
- src/react/components/upload/FileDropZone.tsx
- src/react/components/upload/FileQueue.tsx
Validation-Report: reports/validation-phase3-modals-motion.md

## Last Session (2025-12-28)
**Phase 3 Validation Complete - 4 Bugs Fixed:**
- DocumentPreview: Added isOpen prop + AnimatePresence conditional
- ConfirmDialog: Added isOpen prop + AnimatePresence conditional + stopPropagation
- Both modals: Added key props on motion.div inside AnimatePresence
- 18 performance bottlenecks documented for refactor-hunt
- Build + tests green (21 pass)

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
