# Bug Report: Demo UI Page

Generated: 2025-12-24
Feature: Demo UI Page (1 of 1)

## Scope
Files analyzed:
- demo/index.html
- demo/ragchat-bundle.js
- src/server.ts

## High Priority
| # | Location | Description | Impact |
|---|----------|-------------|--------|
| 1 | demo/index.html:567 | XSS vulnerability: `${file.name}` is inserted directly into innerHTML without escaping | Malicious filenames like `<img onerror=alert(1)>` could execute arbitrary JS |
| 2 | demo/index.html:687 | ReactDOM.createRoot called on every control change, causing memory leak and state loss | Each render creates a new React root, losing chat history and causing performance degradation |
| 3 | src/server.ts:460 | Path traversal vulnerability: user-controlled pathname used in file path without sanitization | Attackers could access files outside demo directory via `../` sequences |

## Medium Priority
| # | Location | Description | Impact |
|---|----------|-------------|--------|
| 1 | demo/index.html:671 | Form submit dispatch doesn't actually trigger send - event is cancelable and form uses custom submit handler | Sample question buttons don't work - they set input value but message isn't sent |
| 2 | demo/ragchat-bundle.js:309 | Error response parsing may throw on non-JSON error responses | If server returns non-JSON 500 error, `res.json()` throws and original error is lost |
| 3 | demo/index.html:596 | PDF files read as text will produce garbage content | User sees "Supports: .pdf" but PDFs aren't binary-decoded, just read as corrupted text |
| 4 | src/server.ts:249-253 | handleUpload doesn't wrap addDocument in try-catch | Embedding/database errors crash the request with generic 500 instead of meaningful error |

## Low Priority
| # | Location | Description | Impact |
|---|----------|-------------|--------|
| 1 | demo/index.html:627 | Unused variable `chatRef` declared but never assigned or used | Dead code, minor clutter |
| 2 | demo/ragchat-bundle.js:23 | All SVG paths use same `<path>` element, but some icons need `<polyline>`, `<line>`, `<circle>` | Some icons may not render correctly (Send icon polyline, AlertCircle circle) |
| 3 | demo/index.html:653 | Document count fetch doesn't handle failure - docCount stays at previous value | If documents endpoint fails, stale count displayed without indication |
| 4 | src/server.ts:33 | CORS_ORIGIN set to `*` in production would be a security risk | Acceptable for dev but should be locked down for production use |

## Summary
- High: 3 bugs
- Medium: 4 bugs
- Low: 4 bugs
- Total: 11 bugs
