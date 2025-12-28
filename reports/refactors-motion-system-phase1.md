# Refactor Report: Phase 1 Motion System

Generated: 2025-12-28

## Scope

Files analyzed:

**Infrastructure:**
- src/react/motion/index.ts
- src/react/motion/types.ts
- src/react/motion/constants.ts
- src/react/motion/gsap-init.ts
- src/react/motion/hooks/index.ts
- src/react/motion/hooks/useReducedMotion.ts
- src/react/motion/hooks/useSkinDetect.ts
- src/react/motion/hooks/useSkinMotion.ts
- src/react/motion/components/index.ts
- src/react/motion/components/MotionProvider.tsx

**Variants:**
- src/react/motion/variants/index.ts
- src/react/motion/variants/library.ts
- src/react/motion/variants/cyberpunk.ts
- src/react/motion/variants/brutalist.ts
- src/react/motion/variants/glass.ts

**Components:**
- src/react/components/MessageBubble.tsx
- src/react/components/ChatInput.tsx
- src/react/components/documents/DocumentCard.tsx
- src/react/components/TypingIndicator.tsx
- src/react/RAGChat.tsx
- src/react/components/documents/DocumentList.tsx

---

## High Priority

| # | Location | Issue | Suggested Fix | Effort |
|---|----------|-------|---------------|--------|
| - | - | None found | - | - |

---

## Medium Priority

| # | Location | Issue | Suggested Fix | Effort |
|---|----------|-------|---------------|--------|
| 1 | `hooks/useSkinDetect.ts:4` | VALID_SKINS duplicates SkinType union values | Derive from `skinMotionMap` keys | S |
| 2 | `types.ts:72-76` + `useSkinMotion.ts:60-64` | Duplicate interfaces: `MotionContextValue` and `UseSkinMotionReturn` are identical | Consolidate to single interface, alias if needed | S |
| 3 | All 4 skin variant files | Missing explicit exit transitions - asymmetric with enter animations | Add exit transitions with matching duration/ease | M |
| 4 | `RAGChat.tsx:101,128,134` | Inconsistent CSS class prefix: `curator-*` vs `rag-*` | Rename to `rag-empty-state`, `rag-error-banner`, `rag-error-dismiss` | S |

---

## Low Priority

| # | Location | Issue | Suggested Fix | Effort |
|---|----------|-------|---------------|--------|
| 5 | `motion/index.ts:12` | Duplicate `skinMotionMap` export (already exported via `export *`) | Remove line 12 | S |
| 6 | `motion/variants/index.ts:2-11` | Duplicate import/export pattern for each variant | Use single export statement | S |
| 7 | `hooks/useSkinMotion.ts:15-36` | Repetitive `reducedMotionConfig` structure (same hidden/visible/exit pattern x5) | Create shared `minimalVariant` object | S |
| 8 | `hooks/useSkinDetect.ts:16-17` | Loose type assertion `attr as SkinType` | Use type guard function | S |
| 9 | `brutalist.ts:84` | Inline spring config instead of using SPRING constant | Add `SPRING.brutal` to constants.ts | S |
| 10 | `cyberpunk.ts:101`, `brutalist.ts:82` | Hardcoded `duration: 0.1` instead of constant | Add `DURATION.ultraFast` to constants.ts | S |
| 11 | `MessageBubble.tsx:25-28` | Inline time formatting with hardcoded `'en-US'` | Extract to `formatTime` utility | S |
| 12 | `RAGChat.tsx:100-113` | Inline `defaultEmptyState` JSX recreated on every render | Extract to component or use `useMemo` | S |

---

## Summary

- High: 0 refactors
- Medium: 4 refactors
- Low: 8 refactors
- Total: 12 refactors

---

## Verdict

The codebase is **well-architected and production-ready**. All findings are minor refinements rather than structural problems. The motion system demonstrates:

- Good TypeScript typing throughout
- Proper separation of concerns
- Consistent patterns across files
- No dead code or type safety issues

**Recommended approach:** Address Medium priority items for consistency, Low priority items are optional polish.

---

## Quick Wins (5 minutes each)

1. Remove duplicate export in `motion/index.ts:12`
2. Consolidate duplicate interfaces (`MotionContextValue` / `UseSkinMotionReturn`)
3. Fix CSS class prefixes in `RAGChat.tsx`
