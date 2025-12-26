# Refactor Report: In-App Gemini API Key Input

Date: 2025-12-26

## Files Analyzed
- `src/server.ts` (lines 1270-1314)
- `src/react/hooks/useApiKeyConfig.ts`
- `src/react/components/settings/SettingsModal.tsx`
- `src/react/components/settings/ApiKeyConfigBar.tsx`

---

## HIGH Priority

### 1. Duplicate Hook Instances (DRY violation)
**Location:** `ApiKeyConfigBar.tsx:20`, `SettingsModal.tsx:29`

**Issue:** Both components call `useApiKeyConfig()` independently. When `SettingsModal` renders inside `ApiKeyConfigBar`, two hook instances run simultaneously:
- Two fetch calls to `/config/gemini-key/status` on mount
- Two separate AbortController lifecycles
- Duplicate state management for identical data

**Impact:** Wasted network requests, potential race conditions, unnecessary complexity.

**Fix:** Lift hook call to `ApiKeyConfigBar` and pass state as props to `SettingsModal`, OR create a Context provider.

```tsx
// Option A: Props drilling (simpler)
// ApiKeyConfigBar passes hook return values to SettingsModal

// Option B: Context (if used in more places)
// Create ApiKeyConfigProvider that wraps both components
```

---

### 2. Magic Numbers in Server Validation
**Location:** `server.ts:1289`

**Issue:** Key validation uses inline magic values:
```ts
if (!apiKey.startsWith('AIza') || apiKey.length !== 39)
```

**Impact:** Unclear intent, harder to update if Google changes format.

**Fix:** Extract to named constants:
```ts
const GOOGLE_AI_KEY_PREFIX = 'AIza';
const GOOGLE_AI_KEY_LENGTH = 39;
```

---

## MEDIUM Priority

### 3. Unnecessary Wrapper Function
**Location:** `ApiKeyConfigBar.tsx:23-25`

**Issue:**
```tsx
const handleConfigured = () => {
  checkStatus();
};
```

**Impact:** Extra function allocation every render for no benefit.

**Fix:** Pass `checkStatus` directly:
```tsx
onConfigured={checkStatus}
```

---

### 4. Missing respondersEndpoint Prop Pass-Through
**Location:** `ApiKeyConfigBar.tsx:52-58`

**Issue:** `ApiKeyConfigBar` renders `SettingsModal` but doesn't expose/forward `respondersEndpoint` prop. Users of `ApiKeyConfigBar` can't configure the test connection endpoint.

**Impact:** Limited flexibility; inconsistent API between direct `SettingsModal` use and `ApiKeyConfigBar` use.

**Fix:** Add `respondersEndpoint` to `ApiKeyConfigBarProps` and pass through.

---

## LOW Priority (Deferred from Validation)

### 5. Missing Focus Trap in Modal
**Location:** `SettingsModal.tsx`

**Issue:** Modal doesn't trap keyboard focus. Tab can escape to background elements.

**Fix:** Add focus-trap-react or manual focus management.

---

### 6. Missing Aria Labels
**Location:** `SettingsModal.tsx:176-183`

**Issue:** Toggle visibility button has aria-label but input lacks aria-describedby linking to description.

**Fix:** Add `id` to description paragraph, `aria-describedby` to input.

---

### 7. No Cross-Tab localStorage Sync
**Location:** `useApiKeyConfig.ts`

**Issue:** If user sets API key in one tab, other tabs won't reflect the change until refresh.

**Fix:** Add `storage` event listener:
```ts
useEffect(() => {
  const handleStorage = (e: StorageEvent) => {
    if (e.key === STORAGE_KEY) {
      setApiKey(e.newValue || '');
    }
  };
  window.addEventListener('storage', handleStorage);
  return () => window.removeEventListener('storage', handleStorage);
}, []);
```

---

## Summary

| Priority | Issue | Effort |
|----------|-------|--------|
| HIGH | Duplicate hook instances | Medium |
| HIGH | Magic numbers in validation | Low |
| MEDIUM | Unnecessary wrapper function | Low |
| MEDIUM | Missing respondersEndpoint prop | Low |
| LOW | Focus trap | Medium |
| LOW | Aria labels | Low |
| LOW | Cross-tab sync | Low |

**Recommended order:** #2 → #3 → #4 → #1 → #7 → #6 → #5

Items #2, #3, #4 are quick wins. Item #1 requires more thought on architecture (props vs Context). Items #5-#7 are polish.
