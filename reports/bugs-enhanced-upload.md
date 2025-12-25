# Bug Report: Enhanced Upload (Phase 4)

**Generated**: 2025-12-25
**Feature**: Enhanced Upload with SSE progress streaming, PDF/DOCX extraction, multi-file queue
**Files Analyzed**:
- `src/react/components/upload/*` (5 components + index)
- `src/react/hooks/useUploadStream.ts`
- `src/react/hooks/useFileQueue.ts`
- `src/extractors/*` (pdf.ts, docx.ts, index.ts)
- `src/server.ts` (upload endpoints)

---

## High Priority

### 1. SSE Event Type Detection is Fragile
**File**: `src/react/hooks/useUploadStream.ts:123-160`
**Issue**: The SSE parser ignores the `event:` line and infers event type from data structure. If server adds a new field or changes structure, detection breaks.

**Current Logic**:
```typescript
if ('stage' in data) { /* progress */ }
else if ('documentId' in data) { /* complete */ }
else if ('message' in data && data.isScanned !== undefined) { /* warning */ }
else if ('message' in data) { /* error */ }
```

**Risk**:
- A progress event with `message` field would be misinterpreted as error
- Warning detection relies on `isScanned` being present, but server could send other warnings

**Fix**: Track the `event:` line and use it for dispatch instead of data structure heuristics.

---

### 2. Race Condition in useFileQueue Progress Updates
**File**: `src/react/hooks/useFileQueue.ts:143-150`
**Issue**: The `useUploadStream` hook manages its own progress state, but `useFileQueue` doesn't subscribe to it. Individual file progress is only updated when setting status to "uploading" (line 147), not during actual upload progress.

**Impact**: Progress bar for individual files doesn't animate - it just shows stage "reading" then jumps to complete/error.

**Fix**: Pass `onProgress` callback to `useUploadStream` that updates the specific file's progress in `useFileQueue` state.

---

### 3. Error Message Not Propagated to QueuedFile
**File**: `src/react/hooks/useFileQueue.ts:176-188`
**Issue**: When upload fails, error message is hardcoded to "Upload failed" instead of using actual error from `useUploadStream`.

**Current**:
```typescript
error: 'Upload failed', // Hardcoded
```

**Impact**: User never sees actual error message (e.g., "Unsupported file type: image/png")

**Fix**: Access error state from `useUploadStream` and pass it to the file state.

---

## Medium Priority

### 4. Empty Text Extraction Not Handled Gracefully
**File**: `src/server.ts:446`
**Issue**: If extracted text is under 50 chars, server sends a warning but continues to process. If text is completely empty, `addDocumentWithProgress` will still run, potentially creating empty document entries.

**Risk**: Documents with zero meaningful content get indexed.

**Fix**: Check if `extractedText.trim().length === 0` and return error instead of warning.

---

### 5. JSON Parse Error Not Caught for categoryIds/tags
**File**: `src/server.ts:417-418`
**Issue**: `JSON.parse()` on `categoryIdsRaw` and `tagsRaw` could throw if client sends malformed JSON. No try/catch wrapper.

**Current**:
```typescript
const categoryIds = categoryIdsRaw ? JSON.parse(categoryIdsRaw) : undefined;
const tags = tagsRaw ? JSON.parse(tagsRaw) : undefined;
```

**Impact**: Server returns 500 error instead of helpful validation error.

**Fix**: Wrap in try/catch and send SSE error event with clear message.

---

### 6. SSE Stream Not Flushed on Early Return
**File**: `src/server.ts:412-415, 435-440, 454-459`
**Issue**: When sending error and closing controller, there's no flush. Browser may not receive last SSE event before connection closes.

**Fix**: Consider adding small delay or explicit flush before `controller.close()`.

---

### 7. File Name Extension Not Preserved on Rename
**File**: `src/react/hooks/useFileQueue.ts:114-118`
**Issue**: `updateFileName` allows user to rename file without preserving extension. User could rename "report.pdf" to "report" and lose type info.

**Risk**: After rename, MIME type detection may fail on server.

**Fix**: Either auto-append original extension or validate that renamed file keeps valid extension.

---

### 8. PDF Date Parsing May Fail
**File**: `src/extractors/pdf.ts:46`
**Issue**: `new Date(result.info.CreationDate)` may return Invalid Date if PDF has non-standard date format. No validation.

**Current**:
```typescript
creationDate: result.info?.CreationDate ? new Date(result.info.CreationDate) : undefined,
```

**Impact**: Metadata has invalid date object.

**Fix**: Validate date and fallback to undefined if invalid.

---

## Low Priority

### 9. Duplicate Files Can Be Queued
**File**: `src/react/hooks/useFileQueue.ts:90-106`
**Issue**: No check for duplicate files (same name or content). User can drag same file multiple times.

**Impact**: User confusion, wasted processing.

**Fix**: Check if file with same name already exists in queue and skip/warn.

---

### 10. Large File Preview Reads Entire Slice into Memory
**File**: `src/react/hooks/useFileQueue.ts:79`
**Issue**: For text files, reads first 10KB into memory for preview. If many large text files are queued, memory usage adds up.

**Risk**: Minor - 10KB is reasonable, but multiplied by many files could be noticeable.

**Fix**: Consider lazy loading previews only when file is selected.

---

### 11. Cancel Button Doesn't Disable During Non-Uploading State
**File**: `src/react/components/upload/UploadModal.tsx:166-170`
**Issue**: Cancel button is disabled when `isUploading` is true, but this is backwards - cancel should be enabled during upload, not disabled.

**Actual Behavior**: Looking at code, `disabled={isUploading}` prevents cancel during upload, which is wrong UX.

**Fix**: Remove the `disabled` prop or invert logic.

---

### 12. Unused `extractDOCXWithHTML` Function
**File**: `src/extractors/docx.ts:36-49`
**Issue**: The `extractDOCXWithHTML` function is defined but never used. Only `extractDOCX` is imported.

**Impact**: Dead code.

**Fix**: Either use it for preview feature or remove it.

---

### 13. HTML Content Not Stripped for RAG
**File**: `src/extractors/index.ts:109-114`
**Issue**: HTML files are decoded directly to text without stripping tags. HTML markup gets indexed as content.

**Current**:
```typescript
case 'text/html': {
  const text = new TextDecoder().decode(buffer);
  return { text: text.trim() };
}
```

**Impact**: Search queries may match HTML tags instead of content.

**Fix**: Strip HTML tags before returning text.

---

## Summary

| Priority | Count | Issues |
|----------|-------|--------|
| High     | 3     | SSE parsing, progress updates, error propagation |
| Medium   | 5     | Empty text, JSON parse, stream flush, file rename, date parsing |
| Low      | 5     | Duplicates, memory, cancel button, dead code, HTML stripping |

**Recommendation**: Fix High priority issues first as they directly impact user experience.
