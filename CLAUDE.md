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

## Last Session (2025-12-31)
**Ink Effects Integration - Refactoring Complete:**
- HIGH: 4/4 applied (dead code removal, CSS var extraction)
- MEDIUM: 5/10 applied (DRY header, SIZE_MAP, filter docs)
- LOW: 2/13 applied (moz-selection, overflow combine)
- Skipped: Large M-effort refactors (SourcesAccordion, animation extraction)
- Validation: Build PASS, Tests 21/21 PASS

## Pipeline State
Phase: COMPLETE
Feature: Ink Effects Integration
Last-Completed: 2025-12-31
All-Tiers-Complete: HIGH (4/4), MEDIUM (5/10), LOW (2/13)

## Library Skin V2 Progress
| Phase | Status | Notes |
|-------|--------|-------|
| 1. Foundation | ✅ Done | Color tokens, SVG assets, sound infra |
| 2. Typewriter Core | ✅ Done | Key press, typebar swing, carriage, sounds |
| 3. Correction Tape | ✅ Done | Backspace animation, rapid deletion |
| 4. Card Catalog | ✅ Done | Drawer physics, index cards, fan/select animations |
| 5. Ink System | ✅ Done | InkDrop bottle animation, blotter paper, CSS vars |
| 6. Pre-loader | ✅ Done | LibraryPreloader + skip logic |
| 7. Polish | ✅ Done | Desk layout complete, responsive fixed |

## Next Steps
1. Library Skin V2 complete - ready for production use
2. Consider MessageBubble memoization if performance issues arise
3. Optional: Extract SourcesAccordion component for better testability

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
