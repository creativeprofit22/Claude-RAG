'use client';

import { DocumentCard } from './DocumentCard.js';
import { EmptyState } from '../shared/EmptyState.js';
import type { DocumentSummary } from '../../types.js';

/** Number of skeleton cards to show while loading */
const DEFAULT_SKELETON_COUNT = 6;

export interface DocumentListProps {
  documents: DocumentSummary[];
  isLoading?: boolean;
  onDocumentSelect?: (doc: DocumentSummary) => void;
  onDocumentDelete?: (doc: DocumentSummary) => void;
  onDocumentPreview?: (doc: DocumentSummary) => void;
  selectedDocumentId?: string;
  emptyState?: React.ReactNode;
  /** Number of skeleton cards to show while loading */
  skeletonCount?: number;
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
    <EmptyState
      title="No documents found"
      description="Upload documents to start building your knowledge base."
      className="rag-doc-list-empty"
    />
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
  skeletonCount = DEFAULT_SKELETON_COUNT,
}: DocumentListProps) {
  // Show loading skeletons
  // Using stable keys with prefix to avoid React reconciliation issues
  if (isLoading) {
    return (
      <div className="rag-doc-list" aria-busy="true" aria-label="Loading documents">
        {Array.from({ length: skeletonCount }).map((_, index) => (
          <DocumentCardSkeleton key={`doc-skeleton-${index}`} />
        ))}
      </div>
    );
  }

  // Show empty state
  if (documents.length === 0) {
    return <>{emptyState || <DefaultEmptyState />}</>;
  }

  return (
    <div
      className="rag-doc-list"
      role="list"
      aria-label="Document list"
    >
      {documents.map((doc) => (
        <div key={doc.documentId}>
          <DocumentCard
            document={doc}
            isSelected={selectedDocumentId === doc.documentId}
            onSelect={onDocumentSelect}
            onDelete={onDocumentDelete}
            onPreview={onDocumentPreview}
          />
        </div>
      ))}
    </div>
  );
}
