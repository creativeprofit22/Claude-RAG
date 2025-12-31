# Refactor Report: Ink Effects Integration

Generated: 2025-12-31

## Scope
Files analyzed:
- src/react/RAGChat.tsx
- src/react/components/MessageBubble.tsx
- src/react/components/TypingIndicator.tsx
- src/react/components/library/InkEffects/InkDrop.tsx
- src/react/components/library/InkEffects/InkEffects.css
- src/react/styles.css (library skin section)

## High Priority
| # | Location | Issue | Suggested Fix | Effort |
|---|----------|-------|---------------|--------|
| 1 | InkDrop.tsx:46 | Unused `containerRef` (dead code) | Remove unused ref and `ref={containerRef}` attribute | S |
| 2 | styles.css:2992,3011,3027,3063,3198,3375 | Duplicated paper texture SVG data URLs (6x) | Extract to CSS custom properties `--lib-texture-paper-*` | M |
| 3 | styles.css:3091-3098,3236-3242,3296-3304,3354-3361 | Repeated wood gradient pattern (4x) | Create `--lib-gradient-wood-walnut` custom property | S |
| 4 | styles.css:3067-3069,3170,3317,etc | Hardcoded hex colors not using CSS vars | Add `--lib-blotter-*`, `--lib-ink-dark`, `--lib-danger-*` vars | M |

## Medium Priority
| # | Location | Issue | Suggested Fix | Effort |
|---|----------|-------|---------------|--------|
| 5 | RAGChat.tsx:174-180,222-228 | Duplicated ChatHeader JSX in both layouts | Extract to `headerContent` variable like `messagesContent` | S |
| 6 | MessageBubble.tsx:27-28 | Unused `isFreshRef` pattern | Remove ref, use direct `useState(!isUser && !message.isLoading)` | S |
| 7 | MessageBubble.tsx:87-119 | Sources accordion could be extracted | Create `<SourcesAccordion>` component | M |
| 8 | InkDrop.tsx:63 | Magic numbers for size (24/40/64) | Extract to `SIZE_MAP = { sm: 24, md: 40, lg: 64 }` | S |
| 9 | InkDrop.tsx:51-147 | Large 96-line inline useEffect | Extract to `createInkDropAnimation()` function | M |
| 10 | InkEffects.css:220-222 | No size variants for `.ink-swirl` | Add `--sm/--md/--lg` variants like `.ink-drop` | S |
| 11 | InkEffects.css:multiple | Undocumented filter dependencies | Add comment listing required SVG filter IDs | S |
| 12 | styles.css:2967-2976,3108-3115 | Repeated velvet/vellum gradient | Create `--lib-gradient-velvet-interior` | S |
| 13 | styles.css:3038,3053,etc | Inconsistent font-family declarations | Define `--lib-font-serif` custom property | S |
| 14 | styles.css:3176-3179,etc | Repeated brass bevel box-shadow | Review usage of existing `--lib-bevel-brass` | M |

## Low Priority
| # | Location | Issue | Suggested Fix | Effort |
|---|----------|-------|---------------|--------|
| 15 | RAGChat.tsx:93-119 | Auto-scroll logic could be hook | Extract to `useAutoScroll` (only if reused) | M |
| 16 | RAGChat.tsx:63-71 | Mobile detection pattern | Extract to `useMediaQuery` (only if reused) | S |
| 17 | RAGChat.tsx:66 | Magic number 768px breakpoint | Use shared constants file | S |
| 18 | RAGChat.tsx:109 | Magic number 100ms delay | Extract to `ANIMATION_SETTLE_DELAY_MS` | S |
| 19 | MessageBubble.tsx:54-61 | Inline style object recreation | Memoize with `useMemo` | S |
| 20 | MessageBubble.tsx:33 | Magic number 2000ms | Extract to `FRESH_INK_ANIMATION_DURATION_MS` | S |
| 21 | MessageBubble.tsx:72 | Conditional class building | Consider `clsx` utility | S |
| 22 | InkDrop.tsx:68-142 | Animation magic numbers | Extract config object or add comments | M |
| 23 | InkDrop.tsx:128 | Magic border-radius string | Extract to named constant | S |
| 24 | InkEffects.css:374,414,641 | Repeated font-family | Add `--ink-font-mono` CSS var | S |
| 25 | InkEffects.css:609-612 | Obsolete `::-moz-selection` | Remove (Firefox 62+ supports standard) | S |
| 26 | styles.css:2996,etc | Repeated border declaration (7x) | Consider utility or leave as-is | S |
| 27 | styles.css:3081-3087 | Duplicate overflow rules | Combine with comma-separated selectors | S |

## Summary
- High: 4 refactors
- Medium: 10 refactors
- Low: 13 refactors
- Total: 27 refactors

## Clean Files
- **TypingIndicator.tsx**: No refactors needed - well-structured, minimal, properly typed

## Notes
- High priority items focus on dead code removal and DRY violations in CSS
- Many Low priority items are magic number extractions - address opportunistically
- RAGChat.tsx and MessageBubble.tsx hook extractions only worthwhile if patterns reused elsewhere
