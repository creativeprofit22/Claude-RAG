'use client';

import { Library, AlertCircle, X } from 'lucide-react';
import { DocumentSearch } from './DocumentSearch.js';
import { DocumentList } from './DocumentList.js';
import { DocumentPreview } from './DocumentPreview.js';
import { ConfirmDialog } from '../shared/ConfirmDialog.js';
import { EmptyState } from '../shared/EmptyState.js';
import { useDocuments } from '../../hooks/useDocuments.js';
import { useDocumentLibraryState } from '../../hooks/useDocumentLibraryState.js';
import { DEFAULT_ACCENT_COLOR, type DocumentSummary } from '../../types.js';

export interface DocumentLibraryProps {
  /** API endpoint base URL (default: /api/rag) */
  endpoint?: string;
  /** Title displayed in the header */
  title?: string;
  /** Additional CSS class */
  className?: string;
  /** Accent color for interactive elements */
  accentColor?: string;
  /** Callback when a document is selected for querying */
  onDocumentSelect?: (doc: DocumentSummary) => void;
  /** Custom empty state component */
  emptyState?: React.ReactNode;
  /** Custom headers for API requests */
  headers?: Record<string, string>;
}

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
export function DocumentLibrary({
  endpoint = '/api/rag',
  title = 'Document Library',
  className = '',
  accentColor = DEFAULT_ACCENT_COLOR,
  onDocumentSelect,
  emptyState,
  headers,
}: DocumentLibraryProps) {
  // Document state from hook
  const {
    documents,
    filteredDocuments,
    isLoading,
    error,
    refetch,
    deleteDocument,
    getDocumentDetails,
    searchQuery,
    setSearchQuery,
    sortBy,
    setSortBy,
    sortOrder,
    setSortOrder,
  } = useDocuments({ endpoint, headers });

  // UI state management
  const {
    previewDoc,
    previewLoading,
    handlePreview,
    handleClosePreview,
    handleQueryDocument,
    deleteDoc,
    isDeleting,
    handleDeleteRequest,
    handleConfirmDelete,
    handleCancelDelete,
    localError,
    dismissError,
    handleDocumentSelect,
  } = useDocumentLibraryState({
    getDocumentDetails,
    deleteDocument,
    refetch,
    onDocumentSelect,
  });

  // Combined error state
  const displayError = localError || error;

  // Default empty state
  const defaultEmptyState = (
    <EmptyState
      title="No documents yet"
      description="Upload documents to start building your knowledge base."
      iconColor={accentColor}
      iconShadow={`0 0 30px ${accentColor}15`}
      className="rag-library-empty"
    />
  );

  return (
    <div className={`rag-document-library ${className}`}>
      {/* Header */}
      <header className="rag-library-header">
        <div className="rag-library-header-info">
          <div
            className="rag-library-header-icon"
            style={{ backgroundColor: `${accentColor}15`, borderColor: `${accentColor}30` }}
          >
            <Library size={20} style={{ color: accentColor }} aria-hidden="true" />
          </div>
          <div className="rag-library-header-text">
            <h2 className="rag-library-title">{title}</h2>
            <span className="rag-library-count">
              {isLoading ? (
                'Loading...'
              ) : (
                <>
                  <span className="rag-library-count-number">{documents.length}</span>{' '}
                  {documents.length === 1 ? 'document' : 'documents'}
                </>
              )}
            </span>
          </div>
        </div>
      </header>

      {/* Error Banner */}
      {displayError && (
        <div className="rag-library-error" role="alert">
          <AlertCircle size={16} aria-hidden="true" />
          <span>{displayError}</span>
          <button
            type="button"
            onClick={dismissError}
            className="rag-library-error-dismiss"
            aria-label="Dismiss error"
          >
            <X size={14} />
          </button>
        </div>
      )}

      {/* Search Bar */}
      <DocumentSearch
        value={searchQuery}
        onChange={setSearchQuery}
        sortBy={sortBy}
        onSortByChange={setSortBy}
        sortOrder={sortOrder}
        onSortOrderChange={setSortOrder}
        placeholder="Search documents..."
      />

      {/* Document Grid */}
      <div className="rag-library-content">
        <DocumentList
          documents={filteredDocuments}
          isLoading={isLoading}
          onDocumentSelect={onDocumentSelect ? handleDocumentSelect : undefined}
          onDocumentDelete={handleDeleteRequest}
          onDocumentPreview={handlePreview}
          emptyState={emptyState || defaultEmptyState}
        />
      </div>

      {/* Preview Modal */}
      {previewDoc && (
        <DocumentPreview
          document={previewDoc}
          isLoading={previewLoading}
          onClose={handleClosePreview}
          onQueryDocument={onDocumentSelect ? handleQueryDocument : undefined}
          accentColor={accentColor}
        />
      )}

      {/* Delete Confirmation Dialog */}
      {deleteDoc && (
        <ConfirmDialog
          title="Delete Document"
          message={`Are you sure you want to delete "${deleteDoc.documentName}"? This action cannot be undone.`}
          confirmLabel={isDeleting ? 'Deleting...' : 'Delete'}
          cancelLabel="Cancel"
          onConfirm={handleConfirmDelete}
          onCancel={handleCancelDelete}
          isDestructive
        />
      )}
    </div>
  );
}
