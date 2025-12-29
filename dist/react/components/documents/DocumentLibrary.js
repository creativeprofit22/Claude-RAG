'use client';
import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Library, Upload } from 'lucide-react';
import { DocumentSearch } from './DocumentSearch.js';
import { DocumentList } from './DocumentList.js';
import { DocumentPreview } from './DocumentPreview.js';
import { ConfirmDialog } from '../shared/ConfirmDialog.js';
import { EmptyState } from '../shared/EmptyState.js';
import { ErrorBanner } from '../shared/ErrorBanner.js';
import { UploadModal } from '../upload/UploadModal.js';
import { useDocuments } from '../../hooks/useDocuments.js';
import { useDocumentLibraryState } from '../../hooks/useDocumentLibraryState.js';
import { useSkinMotion } from '../../motion/hooks/useSkinMotion.js';
import { DEFAULT_ACCENT_COLOR } from '../../types.js';
/**
 * DocumentLibrary - Main container for document management
 *
 * Provides search, browsing, preview, and delete functionality for RAG documents.
 *
 * @example
 * ```tsx
 * import { DocumentLibrary } from 'claude-rag/react';
 *
 * // Basic usage
 * <DocumentLibrary endpoint="/api/rag" />
 *
 * // With document selection callback
 * <DocumentLibrary
 *   endpoint="/api/rag"
 *   title="My Documents"
 *   accentColor="#10b981"
 *   onDocumentSelect={(doc) => console.log('Selected:', doc)}
 * />
 * ```
 */
export function DocumentLibrary({ endpoint = '/api/rag', title = 'Document Library', className = '', accentColor = DEFAULT_ACCENT_COLOR, onDocumentSelect, emptyState, headers, }) {
    // Motion configuration from skin
    const { motion: motionConfig } = useSkinMotion();
    // Container orchestration variants
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: motionConfig.stagger.children,
                delayChildren: 0.1,
            },
        },
    };
    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: motionConfig.transition.default,
        },
    };
    // Document state from hook
    const { documents, filteredDocuments, isLoading, error, refetch, deleteDocument, getDocumentDetails, searchQuery, setSearchQuery, sortBy, setSortBy, sortOrder, setSortOrder, } = useDocuments({ endpoint, headers });
    // UI state management
    const { previewDoc, previewLoading, handlePreview, handleClosePreview, handleQueryDocument, deleteDoc, isDeleting, handleDeleteRequest, handleConfirmDelete, handleCancelDelete, localError, dismissError, handleDocumentSelect, } = useDocumentLibraryState({
        getDocumentDetails,
        deleteDocument,
        refetch,
        onDocumentSelect,
    });
    // Upload modal state
    const [isUploadOpen, setIsUploadOpen] = useState(false);
    const handleUploadComplete = () => {
        refetch();
    };
    // Combined error state
    const displayError = localError || error;
    // Default empty state
    const defaultEmptyState = (_jsx(EmptyState, { title: "No documents yet", description: "Upload documents to start building your knowledge base.", iconColor: accentColor, iconShadow: `0 0 30px ${accentColor}15`, className: "rag-library-empty" }));
    return (_jsxs(motion.div, { className: `rag-document-library ${className}`, variants: containerVariants, initial: "hidden", animate: "visible", children: [_jsxs(motion.header, { className: "rag-library-header", variants: itemVariants, children: [_jsxs("div", { className: "rag-library-header-info", children: [_jsx("div", { className: "rag-library-header-icon", style: { backgroundColor: `${accentColor}15`, borderColor: `${accentColor}30` }, children: _jsx(Library, { size: 20, style: { color: accentColor }, "aria-hidden": "true" }) }), _jsxs("div", { className: "rag-library-header-text", children: [_jsx("h2", { className: "rag-library-title", children: title }), _jsx("span", { className: "rag-library-count", children: isLoading ? ('Loading...') : (_jsxs(_Fragment, { children: [_jsx("span", { className: "rag-library-count-number", children: documents.length }), ' ', documents.length === 1 ? 'document' : 'documents'] })) })] })] }), _jsxs("button", { type: "button", onClick: () => setIsUploadOpen(true), className: "rag-library-upload-btn", style: { backgroundColor: accentColor }, children: [_jsx(Upload, { size: 16 }), "Upload"] })] }), displayError && _jsx(ErrorBanner, { error: displayError, onDismiss: dismissError }), _jsx(motion.div, { variants: itemVariants, children: _jsx(DocumentSearch, { value: searchQuery, onChange: setSearchQuery, sortBy: sortBy, onSortByChange: setSortBy, sortOrder: sortOrder, onSortOrderChange: setSortOrder, placeholder: "Search documents..." }) }), _jsx(motion.div, { className: "rag-library-content", variants: itemVariants, children: _jsx(DocumentList, { documents: filteredDocuments, isLoading: isLoading, onDocumentSelect: onDocumentSelect ? handleDocumentSelect : undefined, onDocumentDelete: handleDeleteRequest, onDocumentPreview: handlePreview, emptyState: emptyState || defaultEmptyState }) }), previewDoc && (_jsx(DocumentPreview, { document: previewDoc, isLoading: previewLoading, onClose: handleClosePreview, onQueryDocument: onDocumentSelect ? handleQueryDocument : undefined, accentColor: accentColor })), deleteDoc && (_jsx(ConfirmDialog, { title: "Delete Document", message: `Are you sure you want to delete "${deleteDoc.documentName}"? This action cannot be undone.`, confirmLabel: isDeleting ? 'Deleting...' : 'Delete', cancelLabel: "Cancel", onConfirm: handleConfirmDelete, onCancel: handleCancelDelete, isDestructive: true })), _jsx(UploadModal, { isOpen: isUploadOpen, onClose: () => setIsUploadOpen(false), onUploadComplete: handleUploadComplete, endpoint: endpoint, headers: headers })] }));
}
//# sourceMappingURL=DocumentLibrary.js.map