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
Section: Document Library Module
Files: src/react/components/documents/*, src/react/hooks/useDocuments.ts, src/react/hooks/useCategories.ts, src/categories.ts, src/database.ts

## Pipeline State
Phase: build
Feature: Chat Integration (Phase 3)
Status: RAGInterface component complete

## Last Session (2025-12-24)
Started Phase 3: Chat Integration:
- Created `RAGInterface.tsx` - unified tabbed component (Chat | Documents)
- Implements document scoping: select document in library → queries filter to that doc
- Added scope indicator bar with document name and clear button
- CSS styles for tabs, scope indicator, and view content
- Updated exports in `src/react/index.ts`
- Build passes

Previous session - Document Library refactors:
- All 10 refactors complete (2 high, 4 medium, 4 low)
- Committed: 622e55d

## Completed Features
- **Chat Integration** (2025-12-24): RAGInterface component with tab navigation + document scoping
- **Document Library** (2025-12-24): Phase 1 complete, all 14 bugs fixed
- **Category System** (2025-12-24): JSON-based storage, CRUD API, React components
- **Chat Scroll Fix** (2025-12-24): Bug fixes + refactoring complete
- **Demo UI Page** (2025-12-24): Security fixes, refactors complete

## Package Usage
```tsx
// Backend API
import { query, addDocument, getDocumentSummaries, getDocumentDetails } from 'claude-rag';

// Unified Interface (Chat + Documents with tabs)
import { RAGInterface } from 'claude-rag/react';
import 'claude-rag/react/styles.css';

<RAGInterface
  endpoint="/api/rag"
  chatTitle="Document Assistant"
  accentColor="#10b981"
/>

// Standalone Chat UI
import { RAGChat } from 'claude-rag/react';
<RAGChat endpoint="/api/rag/query" />

// Standalone Document Library
import { DocumentLibrary } from 'claude-rag/react';
<DocumentLibrary endpoint="/api/rag" onDocumentSelect={(doc) => console.log(doc)} />
```

## Key Files
- `src/index.ts` - Main API exports
- `src/server.ts` - Bun HTTP server
- `src/database.ts` - LanceDB wrapper with document queries
- `src/categories.ts` - Category storage helpers
- `src/react/RAGInterface.tsx` - Unified chat + documents tabbed interface
- `src/react/components/documents/DocumentLibrary.tsx` - Document browser
- `src/react/hooks/useDocuments.ts` - Document management hook

## Environment
```
GOOGLE_AI_API_KEY=xxx          # Required
RAG_RESPONDER=claude|gemini    # Optional, default: claude
```
