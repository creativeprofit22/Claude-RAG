# Bug Report: Admin Dashboard (Phase 5)

Generated: 2025-12-25

## Summary
Analyzed 3 files for bugs in the Admin Dashboard feature.

---

## High Priority

| ID | File | Line | Issue | Impact |
|----|------|------|-------|--------|
| H1 | AdminDashboard.tsx | 93-100 | No AbortController for fetch requests - if user triggers manual refresh while auto-refresh is pending, stale responses could overwrite fresh data | Data inconsistency |
| H2 | AdminDashboard.tsx | 134 | `.spin` CSS class referenced but animation not defined in styles.css | Refresh button animation broken |
| H3 | server.ts | 1066-1125 | Claude CLI availability check spawns subprocess with no timeout - could hang indefinitely | Server endpoint blocks |

---

## Medium Priority

| ID | File | Line | Issue | Impact |
|----|------|------|-------|--------|
| M1 | AdminDashboard.tsx | 42-53 | `formatRelativeTime()` doesn't validate timestamp - negative or 0 values produce incorrect output | UI shows wrong time |
| M2 | AdminDashboard.tsx | 96-99 | Interval cleanup only happens on unmount - changing `refreshInterval` prop doesn't clear old interval | Multiple intervals stack |
| M3 | server.ts | 1020-1024 | Storage estimation hardcodes 768 dimensions - may not match actual embedding model dimensions | Inaccurate storage display |
| M4 | server.ts | 984-1044 | `handleAdminStats()` no try/catch around database calls - errors bubble up as 500 | Poor error messaging |

---

## Low Priority

| ID | File | Line | Issue | Impact |
|----|------|------|-------|--------|
| L1 | AdminDashboard.tsx | 132 | `--accent` CSS variable set inline but no fallback if CSS doesn't support custom properties | Minor styling issue |
| L2 | AdminDashboard.tsx | 187-188 | `toLocaleString()` on undefined if stats load fails mid-render (race condition) | Potential crash |
| L3 | styles.css | 2177+ | No dark/light mode detection - assumes dark theme only | UX limitation |

---

## Reproduction Steps

### H1 - Stale Response Race Condition
1. Load AdminDashboard
2. Click Refresh button rapidly
3. Observe responses arriving out of order

### H2 - Missing Spin Animation
1. Load AdminDashboard
2. Click Refresh button
3. Observe no spinning animation on the RefreshCw icon

### H3 - CLI Timeout
1. Block claude CLI (e.g., network issue)
2. Call `/api/rag/admin/health`
3. Request hangs indefinitely

---

## Recommended Fixes

### H1 - Add AbortController
```tsx
const fetchData = useCallback(async (signal?: AbortSignal) => {
  const [statsRes, healthRes] = await Promise.all([
    fetch(`${endpoint}/admin/stats`, { signal }),
    fetch(`${endpoint}/admin/health`, { signal }),
  ]);
  // ...
}, [endpoint]);

useEffect(() => {
  const controller = new AbortController();
  fetchData(controller.signal);
  // cleanup
  return () => controller.abort();
}, [fetchData]);
```

### H2 - Add Spin Animation
```css
@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.spin {
  animation: spin 1s linear infinite;
}
```

### H3 - Add CLI Timeout
```typescript
const claudeProcess = Bun.spawn(['claude', '--version'], {
  timeout: 5000, // 5 second timeout
});
```
