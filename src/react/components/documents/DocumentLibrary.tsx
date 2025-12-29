'use client';

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

  // Upload modal state
  const [isUploadOpen, setIsUploadOpen] = useState(false);

  const handleUploadComplete = () => {
    refetch();
  };

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
    <motion.div
      className={`rag-document-library ${className}`}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Header */}
      <motion.header className="rag-library-header" variants={itemVariants}>
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
        <button
          type="button"
          onClick={() => setIsUploadOpen(true)}
          className="rag-library-upload-btn"
          style={{ backgroundColor: accentColor }}
        >
          <Upload size={16} />
          Upload
        </button>
      </motion.header>

      {/* Error Banner */}
      {displayError && <ErrorBanner error={displayError} onDismiss={dismissError} />}

      {/* Search Bar */}
      <motion.div variants={itemVariants}>
        <DocumentSearch
          value={searchQuery}
          onChange={setSearchQuery}
          sortBy={sortBy}
          onSortByChange={setSortBy}
          sortOrder={sortOrder}
          onSortOrderChange={setSortOrder}
          placeholder="Search documents..."
        />
      </motion.div>

      {/* Document Grid */}
      <motion.div className="rag-library-content" variants={itemVariants}>
        <DocumentList
          documents={filteredDocuments}
          isLoading={isLoading}
          onDocumentSelect={onDocumentSelect ? handleDocumentSelect : undefined}
          onDocumentDelete={handleDeleteRequest}
          onDocumentPreview={handlePreview}
          emptyState={emptyState || defaultEmptyState}
        />
      </motion.div>

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

      {/* Upload Modal */}
      <UploadModal
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
        onUploadComplete={handleUploadComplete}
        endpoint={endpoint}
        headers={headers}
      />
    </motion.div>
  );
}
