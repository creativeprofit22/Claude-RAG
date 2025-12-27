# Refactor Report: Tab Navigation

Generated: 2025-12-27

## Scope
Files analyzed:
- demo/index.html
- demo/demo.js
- demo/styles.css

## High Priority
| # | Location | Issue | Suggested Fix | Effort |
|---|----------|-------|---------------|--------|
| 1 | demo.js:8,80,168 | Mutable module-level `selectedFiles` array | Encapsulate in state manager object with add/remove/clear methods | M |
| 2 | index.html:71 | Hidden file input uses inline onclick, poor accessibility | Use proper `<label for="fileInput">` association | S |
| 3 | index.html:78,84,92-94 | Inline onclick handlers (4 instances) | Move to addEventListener in demo.js | M |
| 4 | styles.css:multiple | No CSS variables - repeated rgba/colors throughout | Add :root with design tokens (--bg-*, --text-*, --color-*) | M |
| 5 | styles.css:52,74,100,138+ | Repeated `rgba(255,255,255,...)` patterns (15+ occurrences) | Extract to CSS variables --bg-subtle, --bg-muted, --border-subtle | M |
| 6 | styles.css:32,154,233 | Repeated gradient pattern (3 occurrences) | Extract to --gradient-primary variable | S |

## Medium Priority
| # | Location | Issue | Suggested Fix | Effort |
|---|----------|-------|---------------|--------|
| 1 | demo.js:101-177 | `uploadFiles` function too long (76 lines), high complexity | Extract parseSSEStream() and uploadSingleFile() helpers | M |
| 2 | demo.js:241-307 | Repeated React root creation pattern (3 times) | Extract createReactRenderer() factory function | S |
| 3 | demo.js:1-345 | No JSDoc type annotations on public functions | Add JSDoc for initDemo, renderChat, renderAdmin, etc. | M |
| 4 | demo.js:80-93 | Inline SVG in template literal | Extract to FILE_ICON_SVG constant | S |
| 5 | index.html:18-40 | Repeated control-group structure (4 times) | Consider JS template generation for maintainability | M |
| 6 | index.html:73-77 | Inline SVG icon, Lucide already available | Use Lucide upload icon instead | S |
| 7 | index.html:19-20,23-24,27-28,34-35 | Labels not associated with inputs | Add for= attributes matching input IDs | S |
| 8 | styles.css:70-85 vs 202-218 | Inconsistent input styling approach | Create shared .form-input base class | M |
| 9 | styles.css:40,141,193,269,294,374 | Repeated muted text color #9ca3af (6 times) | Extract to --text-muted variable | S |
| 10 | styles.css:65,308,337,375 | Repeated dim text color #6b7280 (4 times) | Extract to --text-dim variable | S |
| 11 | styles.css:120-122 | Status dot colors hard-coded | Use CSS variables --color-success/error/warning | S |

## Low Priority (Completed 2025-12-27)
| # | Location | Issue | Status |
|---|----------|-------|--------|
| 1 | demo.js | Magic number 1024 in formatFileSize | ✅ Added BYTES_PER_KB constant |
| 2 | demo.js | Deep nesting in SSE parser | ✅ Already extracted to parseSSEStream() |
| 3 | demo.js | Nested try-catch in checkHealth | ⏭️ Skipped - separation is intentional |
| 4 | demo.js | Duplicate status dot assignment | ✅ Already handled via statusDom object |
| 5 | demo.js | setTimeout(..., 0) | ✅ Replaced with queueMicrotask |
| 6 | demo.js | Inconsistent DOM refs | ✅ Already grouped in statusDom |
| 7 | index.html | Inline styles | ✅ Moved to .api-config-container, .chat-root-container |
| 8 | index.html | Boolean select strings | ⏭️ Skipped - semantic preference only |
| 9 | index.html | Hardcoded sample questions | ⏭️ Skipped - not worth added complexity |
| 10 | index.html | CDN without SRI hashes | ✅ Added integrity/crossorigin attributes |
| 11 | index.html | SVG missing aria | ✅ Already has aria-hidden="true" |
| 12 | styles.css | .upload-form button duplicates | ✅ Removed dead code |
| 13 | styles.css | Inconsistent transitions | ⏭️ Skipped - now using CSS variables |
| 14 | styles.css | .browse-btn naming | ⏭️ Skipped - it's a label, not button |

## Summary
All refactoring tiers complete:
- High: 6/6 ✅ (commit 604847c)
- Medium: 11/11 ✅ (commit 604847c)
- Low: 9/14 ✅, 5 skipped as non-essential

Feature: Tab Navigation - **REFACTORING COMPLETE**
