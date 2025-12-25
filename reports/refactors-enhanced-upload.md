# Refactor Report: Enhanced Upload (Phase 4)

**Generated**: 2025-12-25
**Feature**: Enhanced Upload with SSE progress streaming, PDF/DOCX extraction, multi-file queue
**Source**: reports/bugs-enhanced-upload.md

## Scope

Files analyzed:
- `src/react/components/upload/UploadModal.tsx`
- `src/react/components/upload/FileDropZone.tsx`
- `src/react/components/upload/FileQueue.tsx`
- `src/react/components/upload/FilePreview.tsx`
- `src/react/components/upload/ProgressIndicator.tsx`
- `src/react/components/upload/index.ts`
- `src/react/hooks/useUploadStream.ts`
- `src/react/hooks/useFileQueue.ts`
- `src/extractors/pdf.ts`
- `src/extractors/docx.ts`
- `src/extractors/index.ts`
- `src/server.ts`

---

## High Priority (Tech Debt / DRY)

| # | Location | Issue | Suggested Fix | Effort |
|---|----------|-------|---------------|--------|
| 1 | FileQueue.tsx:28-32, FilePreview.tsx:27-31 | `formatFileSize` duplicated | Extract to shared `src/react/utils/format.ts` | S |
| 2 | FileDropZone.tsx:16-24, extractors/index.ts:24 | ACCEPTED_TYPES/EXTENSIONS duplicated across client and server | Export from extractors/index.ts and import in FileDropZone, or create shared constants file | M |
| 3 | server.ts:413-414, 425-426, 449-450, 463-464, 478-479 | SSE flush delay pattern `await new Promise(resolve => setTimeout(resolve, 10)); controller.close();` repeated 5 times | Extract to helper `closeSSEWithFlush(controller)` | S |
| 4 | server.ts:393-523 | `handleUploadStream` is 130 lines with nested try-catch and multiple stages | Split into: `parseUploadForm()`, `validateAndExtract()`, `processUpload()` | M |

---

## Medium Priority (Code Clarity)

| # | Location | Issue | Suggested Fix | Effort | Status |
|---|----------|-------|---------------|--------|--------|
| 5 | useUploadStream.ts:132 | SSE data parsed with JSON.parse has implicit `any` type | Add type guard or zod validation for SSE event data | M | ✅ Done |
| 6 | FilePreview.tsx:67 | Hardcoded endpoint `/api/rag/upload/estimate` | Add `endpoint` prop and construct URL like UploadModal does | S | ✅ Done |
| 7 | pdf.ts:37 | Magic number `100` for scanned PDF detection threshold | Extract to constant `MIN_CHARS_PER_PAGE = 100` | S | ✅ Done |
| 8 | server.ts:467 | Magic number `50` for low text content warning | Extract to constant `MIN_CONTENT_LENGTH = 50` | S | ✅ Done |
| 9 | FilePreview.tsx:36-47 | `getFileTypeLabel` switch statement pattern | Convert to lookup object for consistency | S | ✅ Done |

---

## Low Priority (Nice-to-Have)

| # | Location | Issue | Suggested Fix | Effort |
|---|----------|-------|---------------|--------|
| 10 | extractors/index.ts:25 | `SupportedExtension` type defined but never used | Remove unused type | S |
| 11 | useFileQueue.ts:93 | `addFiles` marked `async` but has no await operations | Remove `async` keyword | S |
| 12 | ProgressIndicator.tsx:22-31, 33 | `STAGE_ORDER` is separate from `STAGES` | Derive order from STAGES keys or merge into single source of truth | S |
| 13 | FileDropZone.tsx:29-38 | `isAcceptableFile` does separate MIME and extension checks | Simplify to single check using shared constants | S |

---

## Summary

| Priority | Count | Done | Remaining |
|----------|-------|------|-----------|
| High     | 4     | 4    | 0         |
| Medium   | 5     | 5    | 0         |
| Low      | 4     | 0    | 4         |
| **Total**| **13**| **9**| **4**     |

**Recommendation**: Start with High priority items #1 and #3 (quick DRY wins), then tackle #4 (handleUploadStream complexity) which has the most impact on maintainability.
