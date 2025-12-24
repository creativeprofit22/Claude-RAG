'use client';

import { FileText, FileCode, FileJson, File, Eye, Trash2, Layers } from 'lucide-react';
import type { DocumentSummary } from '../../types.js';

export interface DocumentCardProps {
  document: DocumentSummary;
  isSelected?: boolean;
  onSelect?: (doc: DocumentSummary) => void;
  onDelete?: (doc: DocumentSummary) => void;
  onPreview?: (doc: DocumentSummary) => void;
}

/**
 * Get the appropriate icon for a document type
 */
function getDocumentIcon(type?: string) {
  switch (type?.toLowerCase()) {
    case 'markdown':
    case 'md':
      return FileText;
    case 'code':
    case 'typescript':
    case 'javascript':
    case 'python':
    case 'ts':
    case 'tsx':
    case 'js':
    case 'jsx':
    case 'py':
      return FileCode;
    case 'json':
      return FileJson;
    default:
      return File;
  }
}

/**
 * Format a timestamp to a readable date string
 */
function formatDate(timestamp: number): string {
  const date = new Date(timestamp);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

/**
 * DocumentCard - Displays a single document in the list
 */
export function DocumentCard({
  document,
  isSelected = false,
  onSelect,
  onDelete,
  onPreview,
}: DocumentCardProps) {
  const Icon = getDocumentIcon(document.type);

  const handleCardClick = () => {
    onSelect?.(document);
  };

  const handlePreviewClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onPreview?.(document);
  };

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete?.(document);
  };

  return (
    <div
      className={`rag-doc-card ${isSelected ? 'rag-doc-card-selected' : ''}`}
      onClick={handleCardClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleCardClick();
        }
      }}
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
            title="Delete document"
            aria-label="Delete document"
          >
            <Trash2 size={16} />
          </button>
        )}
      </div>
    </div>
  );
}
