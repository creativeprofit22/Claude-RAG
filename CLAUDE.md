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

## Last Session (2025-12-30)
**Library Skin Desk Layout - Refactoring Complete:**
- M1: Removed unused `type LucideIcon` import (RAGChat.tsx)
- M2: Removed empty `.rag-chat--desk-layout` CSS rule (styles.css)
- M3: Removed dead legacy variables (demo/styles.css)
- L2: Removed unused `iconStyle` variable (EmptyState.tsx)
- Validation: 21/21 tests, tsc clean, build passes

## Pipeline State
Phase: COMPLETE
Feature: Library Desk Layout
All-Tiers-Complete: MEDIUM (3/3), LOW (1/1), L1 skipped (low value)

## Library Skin V2 Progress
| Phase | Status | Notes |
|-------|--------|-------|
| 1. Foundation | ✅ Done | Color tokens, SVG assets, sound infra |
| 2. Typewriter Core | ✅ Done | Key press, typebar swing, carriage, sounds |
| 3. Correction Tape | ✅ Done | Backspace animation, rapid deletion |
| 4. Card Catalog | ✅ Done | Drawer physics, index cards, fan/select animations |
| 5. Ink System | ⏳ Partial | InkFilters exists, full effects pending |
| 6. Pre-loader | ✅ Done | LibraryPreloader + skip logic |
| 7. Polish | ✅ Done | Desk layout complete, responsive fixed |

## Next Steps
1. Remove unused InkFilters import from RAGChat.tsx
2. Consider MessageBubble memoization (performance)
3. Validate card catalog drawers in desk layout

## Key Files
- `src/server.ts` - Bun HTTP server
- `src/database.ts` - LanceDB wrapper
- `src/responder.ts` - Claude CLI integration
- `src/react/RAGChat.tsx` - Main chat component (has desk layout logic)
- `src/react/styles.css` - All styles including `.rag-desk-*` classes
- `src/react/components/library/` - Library Skin V2 components

## Environment
```
GOOGLE_AI_API_KEY=xxx          # Required
RAG_RESPONDER=claude|gemini    # Optional, default: claude
```
