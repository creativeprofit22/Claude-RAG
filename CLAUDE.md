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
Feature: Phase 2 - Charts + Admin Components
Previous: Phase 1 Motion System (complete, refactored)

## Last Session (2025-12-28)
**Phase 1 Refactors Completed:**
- Derived VALID_SKINS from skinMotionMap keys (no duplication)
- Consolidated MotionContextValue/UseSkinMotionReturn interfaces
- Added exit transitions to list/button in all 4 skin variants
- Used shared EmptyState component in RAGChat (removed inline duplication)

**Phase 2 Charts Infrastructure Built:**
- Installed echarts + echarts-for-react
- Created `src/react/charts/` directory structure
- Built 4 ECharts skin themes (library, cyberpunk, brutalist, glass)
- Created SkinAwareChart wrapper component (native echarts, skin-aware theming)
- Build passing

**Next Steps:**
- Integrate SkinAwareChart into AdminDashboard (replace CSS bar chart)
- Add motion to DocumentList, RAGInterface, RAGChat empty state, DocumentLibrary

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
