'use client';

import { FileText } from 'lucide-react';
import { DocumentCard } from './DocumentCard.js';
import type { DocumentSummary } from '../../types.js';

export interface DocumentListProps {
  documents: DocumentSummary[];
  isLoading?: boolean;
  onDocumentSelect?: (doc: DocumentSummary) => void;
  onDocumentDelete?: (doc: DocumentSummary) => void;
  onDocumentPreview?: (doc: DocumentSummary) => void;
  selectedDocumentId?: string;
  emptyState?: React.ReactNode;
}

/**
 * Skeleton loader for document cards
 */
function DocumentCardSkeleton() {
  return (
    <div className="rag-doc-card rag-doc-card-skeleton" aria-hidden="true">
      <div className="rag-doc-card-icon rag-skeleton-pulse" />
      <div className="rag-doc-card-info">
        <div className="rag-skeleton-line rag-skeleton-line-title" />
        <div className="rag-skeleton-line rag-skeleton-line-meta" />
        <div className="rag-skeleton-line rag-skeleton-line-date" />
      </div>
    </div>
  );
}

/**
 * Default empty state component
 */
function DefaultEmptyState() {
  return (
    <div className="rag-doc-list-empty">
      <div className="rag-doc-list-empty-icon">
        <FileText size={48} aria-hidden="true" />
      </div>
      <h3 className="rag-doc-list-empty-title">No documents found</h3>
      <p className="rag-doc-list-empty-description">
        Upload documents to start building your knowledge base.
      </p>
    </div>
  );
}

/**
 * DocumentList - Grid layout of document cards
 */
export function DocumentList({
  documents,
  isLoading = false,
  onDocumentSelect,
  onDocumentDelete,
  onDocumentPreview,
  selectedDocumentId,
  emptyState,
}: DocumentListProps) {
  // Show loading skeletons
  if (isLoading) {
    return (
      <div className="rag-doc-list" aria-busy="true" aria-label="Loading documents">
        {Array.from({ length: 6 }).map((_, index) => (
          <DocumentCardSkeleton key={`skeleton-${index}`} />
        ))}
      </div>
    );
  }

  // Show empty state
  if (documents.length === 0) {
    return <>{emptyState || <DefaultEmptyState />}</>;
  }

  return (
    <div className="rag-doc-list" role="list" aria-label="Document list">
      {documents.map((doc) => (
        <DocumentCard
          key={doc.documentId}
          document={doc}
          isSelected={selectedDocumentId === doc.documentId}
          onSelect={onDocumentSelect}
          onDelete={onDocumentDelete}
          onPreview={onDocumentPreview}
        />
      ))}
    </div>
  );
}
