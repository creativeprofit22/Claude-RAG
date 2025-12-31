'use client';

import { memo, useCallback } from 'react';
import { Eye, Trash2, Layers } from 'lucide-react';
import type { DocumentSummary } from '../../types.js';
import { formatDate } from '../../utils/formatDate.js';
import { getDocumentIcon } from '../../utils/documentIcons.js';

export interface DocumentCardProps {
  document: DocumentSummary;
  isSelected?: boolean;
  onSelect?: (doc: DocumentSummary) => void;
  onDelete?: (doc: DocumentSummary) => void;
  onPreview?: (doc: DocumentSummary) => void;
}

/**
 * DocumentCard - Displays a single document in the list
 */
export const DocumentCard = memo(function DocumentCard({
  document,
  isSelected = false,
  onSelect,
  onDelete,
  onPreview,
}: DocumentCardProps) {
  const Icon = getDocumentIcon(document.type);

  const handleCardClick = useCallback(() => {
    onSelect?.(document);
  }, [onSelect, document]);

  const handlePreviewClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    onPreview?.(document);
  }, [onPreview, document]);

  const handleDeleteClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete?.(document);
  }, [onDelete, document]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onSelect?.(document);
    } else if (e.key === 'Escape') {
      (e.target as HTMLElement).blur();
    }
  }, [onSelect, document]);

  return (
    <div
      className={`rag-doc-card ${isSelected ? 'rag-doc-card--selected' : ''}`}
      onClick={handleCardClick}
      role="button"
      tabIndex={0}
      aria-pressed={isSelected}
      onKeyDown={handleKeyDown}
    >
      {/* Document Icon */}
      <div className="rag-doc-card-icon">
        <Icon size={24} aria-hidden="true" />
      </div>

      {/* Document Info */}
      <div className="rag-doc-card-info">
        <h4 className="rag-doc-card-name" title={document.documentName}>
          {document.documentName}
        </h4>
        <div className="rag-doc-card-meta">
          <span className="rag-doc-card-type">
            {document.type || 'Document'}
          </span>
          <span className="rag-doc-card-separator">-</span>
          <span className="rag-doc-card-chunks">
            <Layers size={12} aria-hidden="true" />
            {document.chunkCount} chunks
          </span>
        </div>
        <span className="rag-doc-card-date">
          {formatDate(document.timestamp)}
        </span>
      </div>

      {/* Hover Actions */}
      <div className="rag-doc-card-actions">
        {onPreview && (
          <button
            type="button"
            className="rag-doc-card-action"
            onClick={handlePreviewClick}
            onKeyDown={(e) => e.stopPropagation()}
            title="Preview document"
            aria-label="Preview document"
          >
            <Eye size={16} />
          </button>
        )}
        {onDelete && (
          <button
            type="button"
            className="rag-doc-card-action rag-doc-card-action-delete"
            onClick={handleDeleteClick}
            onKeyDown={(e) => e.stopPropagation()}
            title="Delete document"
            aria-label="Delete document"
          >
            <Trash2 size={16} />
          </button>
        )}
      </div>
    </div>
  );
});
