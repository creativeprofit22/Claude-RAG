/**
 * FileQueue - Display and manage queued files for upload
 */

import React from 'react';
import { FileText, X, Check, AlertCircle, Loader2, Edit2 } from 'lucide-react';
import type { QueuedFile, FileStatus } from '../../hooks/useFileQueue.js';
import { ProgressIndicator } from './ProgressIndicator.js';
import { formatFileSize } from '../../utils/format.js';

export interface FileQueueProps {
  files: QueuedFile[];
  onRemove: (id: string) => void;
  onRename?: (id: string, name: string) => void;
  isUploading?: boolean;
  className?: string;
}

interface FileQueueItemProps {
  file: QueuedFile;
  onRemove: () => void;
  onRename?: (name: string) => void;
  isUploading?: boolean;
}

/**
 * Get status icon
 */
function getStatusIcon(status: FileStatus): React.ReactNode {
  switch (status) {
    case 'queued':
      return <FileText size={16} className="rag-upload-queue-icon queued" />;
    case 'uploading':
      return <Loader2 size={16} className="rag-upload-queue-icon uploading" />;
    case 'complete':
      return <Check size={16} className="rag-upload-queue-icon complete" />;
    case 'error':
      return <AlertCircle size={16} className="rag-upload-queue-icon error" />;
  }
}

function FileQueueItem({
  file,
  onRemove,
  onRename,
  isUploading,
}: FileQueueItemProps): React.ReactElement {
  const [isEditing, setIsEditing] = React.useState(false);
  const [editName, setEditName] = React.useState(file.name);
  const inputRef = React.useRef<HTMLInputElement>(null);

  const canEdit = file.status === 'queued' && !isUploading;
  const canRemove = file.status !== 'uploading';

  const handleStartEdit = () => {
    if (canEdit && onRename) {
      setEditName(file.name);
      setIsEditing(true);
      setTimeout(() => inputRef.current?.focus(), 0);
    }
  };

  const handleSaveEdit = () => {
    if (editName.trim() && editName !== file.name) {
      onRename?.(editName.trim());
    }
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSaveEdit();
    } else if (e.key === 'Escape') {
      setIsEditing(false);
      setEditName(file.name);
    }
  };

  return (
    <div className={`rag-upload-queue-item ${file.status}`}>
      <div className="rag-upload-queue-item-header">
        <div className="rag-upload-queue-item-info">
          {getStatusIcon(file.status)}

          {isEditing ? (
            <input
              ref={inputRef}
              type="text"
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              onBlur={handleSaveEdit}
              onKeyDown={handleKeyDown}
              className="rag-upload-queue-item-input"
            />
          ) : (
            <span
              className={`rag-upload-queue-item-name ${canEdit ? 'editable' : ''}`}
              onClick={handleStartEdit}
              title={file.name}
            >
              {file.name}
              {canEdit && onRename && <Edit2 size={12} className="edit-icon" />}
            </span>
          )}
        </div>

        <div className="rag-upload-queue-item-actions">
          <span className="rag-upload-queue-item-size">
            {formatFileSize(file.file.size)}
          </span>

          {file.result && (
            <span className="rag-upload-queue-item-chunks">
              {file.result.chunks} chunks
            </span>
          )}

          {canRemove && (
            <button
              type="button"
              onClick={onRemove}
              className="rag-upload-queue-item-remove"
              aria-label="Remove file"
            >
              <X size={14} />
            </button>
          )}
        </div>
      </div>

      {/* Progress bar for uploading files */}
      {file.status === 'uploading' && (
        <ProgressIndicator progress={file.progress} showStages={false} />
      )}

      {/* Error message */}
      {file.status === 'error' && file.error && (
        <div className="rag-upload-queue-item-error">
          <AlertCircle size={12} />
          <span>{file.error}</span>
        </div>
      )}

      {/* Warning message */}
      {file.warning && (
        <div className="rag-upload-queue-item-warning">
          <AlertCircle size={12} />
          <span>{file.warning}</span>
        </div>
      )}
    </div>
  );
}

export function FileQueue({
  files,
  onRemove,
  onRename,
  isUploading = false,
  className = '',
}: FileQueueProps): React.ReactElement | null {
  if (files.length === 0) {
    return null;
  }

  const queuedCount = files.filter((f) => f.status === 'queued').length;
  const completedCount = files.filter((f) => f.status === 'complete').length;
  const errorCount = files.filter((f) => f.status === 'error').length;

  return (
    <div className={`rag-upload-queue ${className}`}>
      <div className="rag-upload-queue-header">
        <span className="rag-upload-queue-title">
          Files ({files.length})
        </span>
        <div className="rag-upload-queue-stats">
          {queuedCount > 0 && (
            <span className="rag-upload-queue-stat queued">{queuedCount} queued</span>
          )}
          {completedCount > 0 && (
            <span className="rag-upload-queue-stat complete">{completedCount} complete</span>
          )}
          {errorCount > 0 && (
            <span className="rag-upload-queue-stat error">{errorCount} failed</span>
          )}
        </div>
      </div>

      <div className="rag-upload-queue-list">
        {files.map((file) => (
          <FileQueueItem
            key={file.id}
            file={file}
            onRemove={() => onRemove(file.id)}
            onRename={onRename ? (name) => onRename(file.id, name) : undefined}
            isUploading={isUploading}
          />
        ))}
      </div>
    </div>
  );
}
