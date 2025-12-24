# Bug Report: React Chat UI

Generated: 2025-12-23
Feature: React Chat UI

## Scope
Files analyzed:
- src/react/RAGChat.tsx
- src/react/hooks/useRAGChat.ts
- src/react/types.ts
- src/react/components/ChatHeader.tsx
- src/react/components/ChatInput.tsx
- src/react/components/MessageBubble.tsx
- src/react/components/TypingIndicator.tsx

## High Priority (Fixed 2025-12-23)
| # | Location | Description | Fix |
|---|----------|-------------|-----|
| 1 | useRAGChat.ts:23-25 | `headers` object in useCallback deps causes infinite rerenders | Stabilized with JSON.stringify + useMemo |
| 2 | useRAGChat.ts:27-35 | No AbortController for fetch requests | Added AbortController with cleanup on unmount |

## Medium Priority (Fixed 2025-12-23)
| # | Location | Description | Fix |
|---|----------|-------------|-----|
| 1 | RAGChat.tsx:100-114 | `error` from useRAGChat is destructured but never displayed | Added error banner with dismiss button |
| 2 | MessageBubble.tsx:71 | Using array index as React key for sources | Changed to `${source.documentId}-${source.chunkIndex}` |
| 3 | ChatInput.tsx:58 | Button missing `type="button"` attribute | Added `type="button"` to send button |

## Low Priority (Fixed 2025-12-23)
| # | Location | Description | Fix |
|---|----------|-------------|-----|
| 1 | useRAGChat.ts:6-8 | `generateId()` could theoretically collide in same millisecond | Added monotonic counter to ID generation |
| 2 | MessageBubble.tsx:64,70 | Non-null assertions on sources after hasSources check | Extracted `sources` variable with nullish coalescing |

## Summary
- High: 2 bugs (Fixed 2025-12-23)
- Medium: 3 bugs (Fixed 2025-12-23)
- Low: 2 bugs (Fixed 2025-12-23)
- Total: 7 bugs - **All resolved**
