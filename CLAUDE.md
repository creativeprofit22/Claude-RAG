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
Library Skin Layout - "Writer's Desk" side-by-side layout needs polish
Files: `src/react/RAGChat.tsx`, `src/react/styles.css`

## Last Session (2025-12-30)
**Message Animations + Desk Layout:**
- Removed Framer Motion from MessageBubble, TypingIndicator, RAGChat (GSAP conflict caused UI freeze)
- Added CSS keyframe animations: message entry, timestamp fade, sources expand, typing indicator
- Implemented side-by-side "Writer's Desk" layout for library skin (typewriter left, messages right)
- Layout structure works but **typewriter appears too small** - needs more vertical space/better proportions
- Stopped at: Desk layout proportions need adjustment

## Library Skin V2 Progress
| Phase | Status | Notes |
|-------|--------|-------|
| 1. Foundation | ✅ Done | Color tokens, SVG assets, sound infra |
| 2. Typewriter Core | ✅ Done | Key press, typebar swing, carriage, sounds |
| 3. Correction Tape | ✅ Done | Backspace animation, rapid deletion |
| 4. Card Catalog | ✅ Done | Drawer physics, index cards, fan/select animations |
| 5. Ink System | ⏳ Partial | InkFilters exists, full effects pending |
| 6. Pre-loader | ✅ Done | LibraryPreloader + skip logic |
| 7. Polish | ⏳ Ongoing | Desk layout, mobile, a11y |

## Next Steps
1. Fix desk layout proportions - typewriter needs more vertical space
2. Consider alternative layouts (typewriter scale, paper panel sizing)
3. Validate card catalog drawers work in new layout

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
