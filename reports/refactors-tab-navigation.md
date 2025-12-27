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

## Low Priority
| # | Location | Issue | Suggested Fix | Effort |
|---|----------|-------|---------------|--------|
| 1 | demo.js:66-70 | Magic number 1024 repeated in formatFileSize | Define BYTES_PER_KB constant | S |
| 2 | demo.js:137-152 | Deep nesting in SSE parser (4 levels) | Extract to async generator parseSSEEvents() | S |
| 3 | demo.js:183-217 | Nested try-catch in checkHealth | Extract fetchDocumentCount() helper | S |
| 4 | demo.js:188-194 | Duplicate status dot class assignment | Create setServerStatus() helper | S |
| 5 | demo.js:232-237 | Magic timeout value setTimeout(..., 0) | Use queueMicrotask with clarifying comment | S |
| 6 | demo.js:23-28 | Inconsistent DOM reference patterns | Group all DOM refs in single object | S |
| 7 | index.html:65,98 | Inline styles on elements | Move to styles.css | S |
| 8 | index.html:36-39 | Boolean select using strings "true"/"false" | Consider checkbox for better semantics | S |
| 9 | index.html:89-96 | Sample questions hardcoded | Generate from JavaScript array | M |
| 10 | index.html:114-118 | CDN dependencies without SRI hashes | Add integrity attributes for security | S |
| 11 | index.html:73 | SVG missing aria attributes | Add aria-hidden="true" | S |
| 12 | styles.css:252-263 | .upload-form button duplicates .btn-primary | Remove duplicate rules | S |
| 13 | styles.css:145,239,282,392 | Inconsistent transition declarations | Standardize to specific properties | S |
| 14 | styles.css:297 | .browse-btn styled as link, name suggests button | Rename to .file-browse-link | S |

## Summary
- High: 6 refactors
- Medium: 11 refactors
- Low: 14 refactors
- Total: 31 refactors

## Recommended Attack Order
1. **CSS Variables** (High #4-6) - Unlocks most CSS fixes, reduces 50+ repetitions
2. **Accessibility** (High #2-3, Medium #7) - Proper label associations, remove inline handlers
3. **State encapsulation** (High #1) - Prevents subtle bugs with mutable global
4. **uploadFiles complexity** (Medium #1) - Highest complexity reduction
5. **JSDoc types** (Medium #3) - Improves maintainability
