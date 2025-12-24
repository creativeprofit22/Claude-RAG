# Refactor Report: Demo UI Page

Generated: 2025-12-23
Feature: Demo UI Page (1 of 1)
Source: reports/bugs-demo-ui.md

## Scope
Files analyzed:
- demo/index.html
- demo/ragchat-bundle.js
- src/server.ts

## High Priority (Tech Debt / DRY)

| # | Location | Issue | Suggested Fix | Effort |
|---|----------|-------|---------------|--------|
| 1 | src/server.ts:236-240, 279-283, 329-333 | DRY violation: identical try-catch for req.json() parsing in 3 handlers | Extract `parseJsonBody(req)` helper that returns Result type or throws | S |
| 2 | src/server.ts:41-69 | DRY violation: validateOptionalString/Number/Boolean are nearly identical | Create generic `validateOptional<T>(value, fieldName, typeGuard)` function | S |
| 3 | src/server.ts:443-463 | Route dispatch uses repetitive if-else chain | Refactor to router pattern with route-to-handler mapping | M |
| 4 | demo/index.html:7-410 | 410 lines of inline CSS embedded in HTML | Extract to separate demo/styles.css file, add `<link>` tag | M |

## Medium Priority (Code Clarity)

| # | Location | Issue | Suggested Fix | Effort |
|---|----------|-------|---------------|--------|
| 1 | src/server.ts:187, 221 | Default responder ternary duplicated | Extract `getDefaultResponder(claude, gemini)` helper | S |
| 2 | demo/index.html:639-642 | DOM queries for status elements repeated in checkHealth | Cache DOM references once at module scope | S |
| 3 | demo/ragchat-bundle.js:33-76 | Icon components are verbose with repeated pattern | Create icon registry object: `{name: elements}` with factory function | S |
| 4 | demo/index.html:508 | API_BASE hardcoded to localhost:3000 | Use relative URL or derive from window.location | S |
| 5 | demo/ragchat-bundle.js:85-143 | 60-line CSS string embedded in JS | Consider separate CSS file or CSS module pattern | M |

## Low Priority (Nice-to-Have)

| # | Location | Issue | Suggested Fix | Effort |
|---|----------|-------|---------------|--------|
| 1 | demo/index.html:464-467, 570-573 | SVG file icon duplicated inline | Extract to reusable function or template | S |
| 2 | demo/ragchat-bundle.js:289, 331 | Date.now() used for message IDs | Use crypto.randomUUID() for better uniqueness | S |
| 3 | src/server.ts:502-538 | Multiple console.log for startup banner | Consolidate to single structured startup log | S |
| 4 | demo/ragchat-bundle.js:234-236 | formatTime defined inside MessageBubble | Move to module-level utility function | S |
| 5 | src/server.ts:30 | Magic number 10MB payload limit | Extract to named constant with comment | S |

## Summary
- High: 4 refactors (2 Small, 2 Medium)
- Medium: 5 refactors (4 Small, 1 Medium)
- Low: 5 refactors (5 Small, 0 Medium)
- Total: 14 refactors
