'use client';
import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { DocumentCard } from './DocumentCard.js';
import { EmptyState } from '../shared/EmptyState.js';
/** Number of skeleton cards to show while loading */
const DEFAULT_SKELETON_COUNT = 6;
/**
 * Skeleton loader for document cards
 */
function DocumentCardSkeleton() {
    return (_jsxs("div", { className: "rag-doc-card rag-doc-card-skeleton", "aria-hidden": "true", children: [_jsx("div", { className: "rag-doc-card-icon rag-skeleton-pulse" }), _jsxs("div", { className: "rag-doc-card-info", children: [_jsx("div", { className: "rag-skeleton-line rag-skeleton-line-title" }), _jsx("div", { className: "rag-skeleton-line rag-skeleton-line-meta" }), _jsx("div", { className: "rag-skeleton-line rag-skeleton-line-date" })] })] }));
}
/**
 * Default empty state component
 */
function DefaultEmptyState() {
    return (_jsx(EmptyState, { title: "No documents found", description: "Upload documents to start building your knowledge base.", className: "rag-doc-list-empty" }));
}
/**
 * DocumentList - Grid layout of document cards
 */
export function DocumentList({ documents, isLoading = false, onDocumentSelect, onDocumentDelete, onDocumentPreview, selectedDocumentId, emptyState, skeletonCount = DEFAULT_SKELETON_COUNT, }) {
    // Show loading skeletons
    // Using stable keys with prefix to avoid React reconciliation issues
    if (isLoading) {
        return (_jsx("div", { className: "rag-doc-list", "aria-busy": "true", "aria-label": "Loading documents", children: Array.from({ length: skeletonCount }).map((_, index) => (_jsx(DocumentCardSkeleton, {}, `doc-skeleton-${index}`))) }));
    }
    // Show empty state
    if (documents.length === 0) {
        return _jsx(_Fragment, { children: emptyState || _jsx(DefaultEmptyState, {}) });
    }
    return (_jsx("div", { className: "rag-doc-list", role: "list", "aria-label": "Document list", children: documents.map((doc) => (_jsx(DocumentCard, { document: doc, isSelected: selectedDocumentId === doc.documentId, onSelect: onDocumentSelect, onDelete: onDocumentDelete, onPreview: onDocumentPreview }, doc.documentId))) }));
}
//# sourceMappingURL=DocumentList.js.map