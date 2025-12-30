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
Phase: build
Feature: Card Catalog
Last-Completed: TypewriterInput SVG Integration (built, validated, refactored)

## Last Session (2025-12-29)
**TypewriterInput Refactoring Complete:**
- H1: Fixed invalid SVG fill syntax (BUG)
- H2: Removed dead rapidDeletionRef code
- H3: Extracted bell harmonics helper (DRY, -14 lines)
- H4: Applied CSS variables for ink colors
- M3: Replaced setTimeout with GSAP timeline
- M5: Referenced TIMING constants instead of magic numbers
- Skipped: M1 (high complexity), M2 (valid design), M4 (medium complexity), L1-L4 (per recommendations)
- Validation: tsc clean, 21/21 tests pass

## Library Skin V2 Progress
| Phase | Status | Notes |
|-------|--------|-------|
| 1. Foundation | ✅ Done | Color tokens, SVG assets, sound infra |
| 2. Typewriter Core | ✅ Done | Key press, typebar swing, carriage, sounds |
| 3. Correction Tape | ✅ Done | Backspace animation, rapid deletion |
| 4. Card Catalog | ❌ Not Started | Drawer + index card components |
| 5. Ink System | ⏳ Partial | InkFilters exists, full effects pending |
| 6. Pre-loader | ✅ Done | LibraryPreloader + skip logic |
| 7. Polish | ⏳ Ongoing | Mobile, a11y, cross-browser |

## Completed
- TypewriterInput SVG Integration (2025-12-29) - Flex layout fix, full SVG rendering
- Library Skin V2 Design (2025-12-29) - Spec + TypewriterInput prototype
- Library Skin Aged Brass (2025-12-29) - Colors fixed, refactored
- Library Skin Artifacts (2025-12-29) - Built, validated, refactored
- All Cyberpunk Artifacts (2025-12-29) - StatChip, PowerConduit, FileManifest
- Phase 3: Modals + Upload Motion System (2025-12-28)
- Final E2E Validation (2025-12-29)

## Key Files
- `src/server.ts` - Bun HTTP server
- `src/database.ts` - LanceDB wrapper
- `src/responder.ts` - Claude CLI integration
- `src/react/` - React components and hooks
- `src/react/tokens/` - Curator design tokens
- `src/react/fonts/` - Self-hosted Fraunces + Satoshi
- `src/react/components/library/` - Library Skin V2 components
- `reports/SPEC-library-skin-v2-typewriter.md` - Full design specification

## Environment
```
GOOGLE_AI_API_KEY=xxx          # Required
RAG_RESPONDER=claude|gemini    # Optional, default: claude
```
