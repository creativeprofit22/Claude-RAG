/**
 * FilePreview - Preview of file content with chunk estimation
 */

import React, { useEffect, useState } from 'react';
import { FileText, Hash, Clock, AlertTriangle } from 'lucide-react';
import { formatFileSize } from '../../utils/format.js';

export interface FilePreviewProps {
  file: File;
  preview?: string;
  estimatedChunks?: number;
  maxPreviewLength?: number;
  className?: string;
  estimateEndpoint?: string;
  onEstimate?: (estimate: { wordCount: number; estimatedChunks: number }) => void;
}

interface ChunkEstimate {
  wordCount: number;
  estimatedChunks: number;
  chunkSize: number;
  chunkOverlap: number;
}

const FILE_TYPE_LABELS: Record<string, string> = {
  pdf: 'PDF',
  docx: 'DOCX',
  txt: 'Text',
  md: 'Markdown',
  html: 'HTML',
  htm: 'HTML',
};

/**
 * Get file type label from extension
 */
function getFileTypeLabel(file: File): string {
  const ext = file.name.split('.').pop()?.toLowerCase() || '';
  return FILE_TYPE_LABELS[ext] ?? (ext.toUpperCase() || 'File');
}

export function FilePreview({
  file,
  preview,
  estimatedChunks,
  maxPreviewLength = 500,
  className = '',
  estimateEndpoint = '/api/rag/upload/estimate',
  onEstimate,
}: FilePreviewProps): React.ReactElement {
  const [estimate, setEstimate] = useState<ChunkEstimate | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch chunk estimate when preview is available
  useEffect(() => {
    if (!preview || estimatedChunks !== undefined) return;

    const fetchEstimate = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(estimateEndpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text: preview }),
        });

        if (response.ok) {
          const data = await response.json();
          setEstimate(data);
          onEstimate?.(data);
        }
      } catch {
        // Silently fail - estimate is optional
      } finally {
        setIsLoading(false);
      }
    };

    fetchEstimate();
  }, [preview, estimatedChunks, onEstimate]);

  const displayedPreview = preview
    ? preview.length > maxPreviewLength
      ? preview.slice(0, maxPreviewLength) + '...'
      : preview
    : null;

  const chunks = estimatedChunks ?? estimate?.estimatedChunks;
  const isLargeFile = file.size > 5 * 1024 * 1024; // > 5MB

  return (
    <div className={`rag-upload-preview ${className}`}>
      {/* File info header */}
      <div className="rag-upload-preview-header">
        <div className="rag-upload-preview-icon">
          <FileText size={20} />
        </div>
        <div className="rag-upload-preview-meta">
          <span className="rag-upload-preview-name" title={file.name}>
            {file.name}
          </span>
          <div className="rag-upload-preview-details">
            <span className="rag-upload-preview-type">{getFileTypeLabel(file)}</span>
            <span className="rag-upload-preview-size">{formatFileSize(file.size)}</span>
            {chunks !== undefined && (
              <span className="rag-upload-preview-chunks">
                <Hash size={12} />
                ~{chunks} chunks
              </span>
            )}
            {isLoading && (
              <span className="rag-upload-preview-loading">
                <Clock size={12} />
                Estimating...
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Warning for large files */}
      {isLargeFile && (
        <div className="rag-upload-preview-warning">
          <AlertTriangle size={14} />
          <span>Large file - processing may take a moment</span>
        </div>
      )}

      {/* Text preview */}
      {displayedPreview && (
        <div className="rag-upload-preview-content">
          <pre>{displayedPreview}</pre>
        </div>
      )}

      {/* No preview available */}
      {!preview && !isLargeFile && (
        <div className="rag-upload-preview-empty">
          Preview will be available after processing
        </div>
      )}
    </div>
  );
}
