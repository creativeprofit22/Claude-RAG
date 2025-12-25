# Bug Report: Chat Scroll Fix

Generated: 2025-12-24
Feature: Chat Scroll Fix (1 of 1)

## Scope
Files analyzed:
- demo/ragchat.css
- demo/styles.css
- demo/index.html
- src/react/styles.css

## High Priority
| # | Location | Description | Impact |
|---|----------|-------------|--------|
| - | - | No high priority bugs found | - |

## Medium Priority
| # | Location | Description | Impact |
|---|----------|-------------|--------|
| 1 | demo/index.html:101 | Unpinned CDN dependency `lucide@latest` can break without warning | Lucide API changes could break icons unexpectedly in production |
| 2 | demo/ragchat.css vs src/react/styles.css | CSS files are out of sync - demo has `.rag-error-banner`, `.rag-error-dismiss` styles missing from source | Error banner unstyled when using package import (not demo) |
| 3 | src/react/styles.css:182-203 | Source has `.rag-message-loading`, `.rag-loading-dots span:nth-child` animation delays missing from demo | Loading animation timing differs between demo and package |

## Low Priority
| # | Location | Description | Impact |
|---|----------|-------------|--------|
| 1 | demo/index.html:151-156 | `handleFiles` dedupes by filename only - same-named files from different directories won't both be added | Edge case UX issue, unlikely to affect typical usage |
| 2 | demo/index.html:91 | Footer hardcodes `localhost:3000` but app uses dynamic `window.location.origin` | Cosmetic inconsistency, link may point to wrong port if server runs elsewhere |

## Summary
- High: 0 bugs
- Medium: 3 bugs
- Low: 2 bugs
- Total: 5 bugs
