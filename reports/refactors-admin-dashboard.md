# Refactor Report: Admin Dashboard (Phase 5)

Generated: 2025-12-25
Feature: Admin Dashboard (Phase 5)
Source: reports/bugs-admin-dashboard.md

## Scope
Files analyzed:
- src/react/components/admin/AdminDashboard.tsx
- src/server.ts
- src/react/styles.css

---

## High Priority (Tech Debt / DRY)

| # | Location | Issue | Suggested Fix | Effort |
|---|----------|-------|---------------|--------|
| 1 | AdminDashboard.tsx:307-376 | Service status items repeat identical pattern 4x (icon + span + className + status check) | Extract `ServiceStatusItem` component with props: `icon`, `label`, `status`, `meta` | S |
| 2 | AdminDashboard.tsx:197-250 | Stat cards repeat same structure 4x (icon, value, label, meta) | Extract `StatCard` component with props: `icon`, `iconColor`, `value`, `label`, `meta?` | S |
| 3 | server.ts:317,336,1075 | `checkClaudeCodeAvailable()` called 4x per request cycle with no caching | Add TTL memoization (5-30s cache) to avoid repeated subprocess spawns | M |
| 4 | AdminDashboard.tsx:182-184 | Health status icon uses 3 repeated ternaries | Use lookup object: `{ healthy: CheckCircle, degraded: AlertCircle, unhealthy: XCircle }` | S |

---

## Medium Priority (Code Clarity)

| # | Location | Issue | Suggested Fix | Effort |
|---|----------|-------|---------------|--------|
| 5 | AdminDashboard.tsx:33-62 | Utility functions (`formatBytes`, `formatRelativeTime`) in component file | Move to `src/react/utils/formatters.ts` for reuse | S |
| 6 | server.ts:959-1069 | `AdminStats` and `AdminHealth` interfaces defined inline in server | Move to `src/types.ts` for shared typing | S |
| 7 | server.ts:984-1052,1074-1133 | `handleAdminStats` and `handleAdminHealth` both call `getDocumentSummaries()` | Consider combining into single endpoint or shared data fetch | M |
| 8 | AdminDashboard.tsx:263-266,389-392 | Skeleton loader arrays `[1,2,3,4].map()` magic numbers | Define `SKELETON_COUNT = 4` constant for clarity | S |

---

## Low Priority (Nice-to-Have)

| # | Location | Issue | Suggested Fix | Effort |
|---|----------|-------|---------------|--------|
| 9 | server.ts | File is 1288 lines - large single module | Split into modules: `routes/admin.ts`, `routes/documents.ts`, `routes/categories.ts` | L |
| 10 | styles.css:2177-2671 | Admin dashboard styles ~500 lines in monolithic CSS | Extract to `admin-dashboard.css` and import | M |
| 11 | AdminDashboard.tsx:147,161 | Inline styles with template literals for colors | Consider CSS custom property approach or styled helper | S |

---

## Summary
- High: 4 refactors (4 Small, 0 Medium, 0 Large)
- Medium: 4 refactors (3 Small, 1 Medium)
- Low: 3 refactors (1 Small, 1 Medium, 1 Large)
- Total: 11 refactors
