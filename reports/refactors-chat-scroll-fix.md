# Refactor Report: Chat Scroll Fix

Generated: 2025-12-24
Feature: Chat Scroll Fix (1 of 1)
Source: reports/bugs-chat-scroll-fix.md

## Scope
Files analyzed:
- demo/ragchat.css
- demo/styles.css
- demo/index.html
- src/react/styles.css

## High Priority (Tech Debt / DRY)
| # | Location | Issue | Suggested Fix | Effort |
|---|----------|-------|---------------|--------|
| 1 | demo/ragchat.css + src/react/styles.css | DRY violation: Two CSS files are 80%+ identical, requiring manual sync | Use a single source file and build/copy for demo, or import shared partials | L |

## Medium Priority (Code Clarity)
| # | Location | Issue | Suggested Fix | Effort |
|---|----------|-------|---------------|--------|
| 1 | demo/ragchat.css, src/react/styles.css | Magic colors repeated: `#0a0a0f`, `#9ca3af`, `#6b7280`, `rgba(255,255,255,0.05/0.1)` appear 20+ times | Extract to CSS custom properties (`:root { --bg-primary: #0a0a0f; }`) | M |
| 2 | demo/index.html:103-344 | Large inline script (240+ lines) makes HTML hard to maintain | Extract to `/demo/demo.js` as ES module | M |
| 3 | demo/styles.css:189-208 + 305-324 | Similar button styles for `.upload-form button` and `.upload-actions button` | Extract common button base class `.btn-primary` | S |

## Low Priority (Nice-to-Have)
| # | Location | Issue | Suggested Fix | Effort |
|---|----------|-------|---------------|--------|
| 1 | demo/ragchat.css vs src/react/styles.css | Inconsistent rgba formatting (`rgba(255,255,255,0.05)` vs `rgba(255, 255, 255, 0.05)`) | Standardize on spaced format for readability | S |
| 2 | src/react/styles.css | Has `backdrop-filter: blur(8px)` on some elements that demo/ragchat.css is missing | Sync backdrop-filter usage or document intentional difference | S |

## Summary
- High: 1 refactor (0 Small, 0 Medium, 1 Large)
- Medium: 3 refactors (1 Small, 2 Medium, 0 Large)
- Low: 2 refactors (2 Small, 0 Medium, 0 Large)
- Total: 6 refactors
