# Refactor Report: HUD Frame Cyberpunk Artifact

Generated: 2025-12-29

## Scope
Files analyzed:
- src/react/artifacts/hud-frame/HudFrame.tsx
- src/react/artifacts/hud-frame/hud-frame.base.css
- src/react/artifacts/hud-frame/hud-frame.cyberpunk.css
- src/react/components/admin/AdminDashboard.tsx

## High Priority
| # | Location | Issue | Suggested Fix | Effort |
|---|----------|-------|---------------|--------|
| 1 | cyberpunk.css:33-63 | Duplicated clip-path (webkit + standard) | Remove -webkit-clip-path, modern browsers support unprefixed | S |
| 2 | cyberpunk.css:175-228 | Trace positioning pattern repeated for each corner | Use CSS variables for common properties | M |
| 3 | AdminDashboard.tsx:323-391 | Loading/empty state logic duplicated | Extract ConditionalPanelContent component | M |

## Medium Priority
| # | Location | Issue | Suggested Fix | Effort |
|---|----------|-------|---------------|--------|
| 4 | HudFrame.tsx:89-103 | 4 reticle spans copy-pasted | Map over RETICLE_POSITIONS array | S |
| 5 | cyberpunk.css:101-104 | Hidden .hud-frame__glow element (dead code) | Remove from HTML or document why kept | S |
| 6 | cyberpunk.css:231-249 | Magic number 24px repeated for reticle offset | Extract to --reticle-offset variable | S |
| 7 | cyberpunk.css:257-270 | Hover shadows repeated | Create --glow-shadow CSS variables | M |
| 8 | base.css:72-90 | Reticle 8px offset repeated | Extract to --hud-reticle-offset | S |
| 9 | base.css:140-150 | Responsive only handles default variant | Extend to all size variants | S |
| 10 | AdminDashboard.tsx:320,348,363 | className="rag-admin-panel" repeated | Extract to constant | S |
| 11 | AdminDashboard.tsx:319,347,362 | isLoading prop repeated on all HudFrames | Create wrapper component | M |
| 12 | cyberpunk.css:16-26,366-388 | Inconsistent CSS variable usage | Add neutral/accent color tokens | M |

## Low Priority
| # | Location | Issue | Suggested Fix | Effort |
|---|----------|-------|---------------|--------|
| 13 | HudFrame.tsx:52-62 | Class name building pattern verbose | Consider clsx library | M |
| 14 | HudFrame.tsx:40 | Missing displayName on memo | Add HudFrame.displayName | S |
| 15 | base.css:49-52 | Type selector .title-icon svg | Use explicit class | S |
| 16 | base.css:123-125 | No-header rule may be dead CSS | Document or remove | S |
| 17 | cyberpunk.css:multiple | Magic numbers (16px, 300px, 15s) | Extract design tokens | M |
| 18 | cyberpunk.css:multiple | Long selector chains with [data-skin] | Consider theme class instead | L |

## Summary
- High: 3 refactors
- Medium: 9 refactors
- Low: 6 refactors
- Total: 18 refactors

## Recommended Order
1. Extract clip-path duplicate (High/S) - quick win
2. Extract reticle 24px to variable (Medium/S) - quick win
3. Map reticle spans (Medium/S) - quick win
4. Remove hidden glow element (Medium/S) - quick win
5. Consolidate trace positioning (High/M) - significant cleanup
6. Loading/empty state component (High/M) - DRY improvement
