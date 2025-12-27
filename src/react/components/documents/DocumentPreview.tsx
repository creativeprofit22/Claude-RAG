'use client';

import { X, FileText, Calendar, Layers, MessageSquare, ExternalLink } from 'lucide-react';
import type { DocumentDetails } from '../../types.js';
import { DEFAULT_ACCENT_COLOR } from '../../types.js';
import { useModal } from '../../hooks/useModal.js';
import { formatDate } from '../../utils/formatDate.js';

/**
 * Get file type display label from document type or name
 */
function getFileType(docDetails: DocumentDetails): string {
  if (docDetails.type) return docDetails.type.toUpperCase();
  const ext = docDetails.documentName.split('.').pop();
  return ext ? ext.toUpperCase() : 'FILE';
}

export interface DocumentPreviewProps {
  document: DocumentDetails;
  isLoading?: boolean;
  onClose: () => void;
  onQueryDocument?: (doc: DocumentDetails) => void;
  accentColor?: string;
}

/**
 * DocumentPreview - Modal overlay showing document details and chunk snippets
 */
export function DocumentPreview({
  document: docDetails,
  isLoading = false,
  onClose,
  onQueryDocument,
  accentColor = DEFAULT_ACCENT_COLOR,
}: DocumentPreviewProps) {
  const { handleBackdropClick } = useModal({ onClose });

  return (
    <div
      className="curator-overlay rag-preview-overlay"
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="preview-dialog-title"
    >
      <div className="rag-preview-modal">
        {/* Header */}
        <div className="rag-preview-header">
          <div className="rag-preview-title-section">
            <div
              className="rag-preview-icon"
              style={{ backgroundColor: `${accentColor}20`, borderColor: `${accentColor}40` }}
            >
              <FileText size={24} style={{ color: accentColor }} aria-hidden="true" />
            </div>
            <div className="rag-preview-title-info">
              <h2 id="preview-dialog-title" className="rag-preview-title">
                {docDetails.documentName}
              </h2>
              <span
                className="rag-preview-type-badge"
                style={{ backgroundColor: `${accentColor}20`, color: accentColor }}
              >
                {getFileType(docDetails)}
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="curator-btn curator-btn-icon rag-preview-close"
            aria-label="Close preview"
          >
            <X size={20} />
          </button>
        </div>

        {/* Metadata */}
        <div className="rag-preview-metadata">
          <div className="rag-preview-meta-item">
            <Calendar size={14} aria-hidden="true" />
            <span>{formatDate(docDetails.timestamp, 'datetime')}</span>
          </div>
          <div className="rag-preview-meta-item">
            <Layers size={14} aria-hidden="true" />
            <span>{docDetails.chunkCount} chunks</span>
          </div>
          {docDetails.source && (
            <div className="rag-preview-meta-item">
              <ExternalLink size={14} aria-hidden="true" />
              <span>{docDetails.source}</span>
            </div>
          )}
        </div>

        {/* Chunks List */}
        <div className="rag-preview-chunks-container">
          <h3 className="rag-preview-chunks-title">Document Chunks</h3>

          {isLoading ? (
            <div className="rag-preview-loading">
              <div className="rag-preview-skeleton" />
              <div className="rag-preview-skeleton" />
              <div className="rag-preview-skeleton" />
            </div>
          ) : docDetails.chunks && docDetails.chunks.length > 0 ? (
            <div className="rag-preview-chunks-list">
              {docDetails.chunks.map((chunk) => (
                <div key={chunk.chunkIndex} className="rag-preview-chunk">
                  <div className="rag-preview-chunk-header">
                    <span className="rag-preview-chunk-index">
                      Chunk {chunk.chunkIndex + 1}
                    </span>
                  </div>
                  <p className="rag-preview-chunk-text">{chunk.snippet}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="rag-preview-no-chunks">
              <p>No chunk previews available</p>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="rag-preview-footer">
          <button
            type="button"
            onClick={onClose}
            className="rag-preview-btn rag-preview-btn-secondary"
          >
            Close
          </button>
          {onQueryDocument && (
            <button
              type="button"
              onClick={() => onQueryDocument(docDetails)}
              className="rag-preview-btn rag-preview-btn-primary"
              style={{ backgroundColor: accentColor }}
            >
              <MessageSquare size={16} aria-hidden="true" />
              Chat about this document
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
