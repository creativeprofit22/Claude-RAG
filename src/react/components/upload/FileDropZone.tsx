/**
 * FileDropZone - Drag and drop area for file uploads
 */

import React, { useState, useCallback, useRef } from 'react';
import { Upload, FileText, AlertCircle } from 'lucide-react';
import { SUPPORTED_EXTENSIONS, SUPPORTED_MIME_TYPES } from '../../../extractors/index.js';

export interface FileDropZoneProps {
  onFilesSelected: (files: File[]) => void;
  accept?: string;
  multiple?: boolean;
  disabled?: boolean;
  className?: string;
}

/**
 * Check if a file is acceptable by MIME type or extension
 */
function isAcceptableFile(file: File): boolean {
  const ext = '.' + file.name.split('.').pop()?.toLowerCase();
  return (SUPPORTED_MIME_TYPES as readonly string[]).includes(file.type) ||
         (SUPPORTED_EXTENSIONS as readonly string[]).includes(ext);
}

export function FileDropZone({
  onFilesSelected,
  accept = SUPPORTED_EXTENSIONS.join(','),
  multiple = true,
  disabled = false,
  className = '',
}: FileDropZoneProps): React.ReactElement {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!disabled) {
      setIsDragging(true);
      setError(null);
    }
  }, [disabled]);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const processFiles = useCallback((fileList: FileList | null) => {
    if (!fileList || fileList.length === 0) return;

    const files = Array.from(fileList);
    const validFiles = files.filter(isAcceptableFile);
    const invalidCount = files.length - validFiles.length;

    if (invalidCount > 0) {
      setError(`${invalidCount} file(s) skipped. Supported: PDF, DOCX, TXT, MD, HTML`);
    } else {
      setError(null);
    }

    if (validFiles.length > 0) {
      if (!multiple && validFiles.length > 1) {
        onFilesSelected([validFiles[0]]);
      } else {
        onFilesSelected(validFiles);
      }
    }
  }, [multiple, onFilesSelected]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (disabled) return;

    processFiles(e.dataTransfer.files);
  }, [disabled, processFiles]);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    processFiles(e.target.files);
    // Reset input so same file can be selected again
    if (inputRef.current) {
      inputRef.current.value = '';
    }
  }, [processFiles]);

  const handleClick = useCallback(() => {
    if (!disabled) {
      inputRef.current?.click();
    }
  }, [disabled]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if ((e.key === 'Enter' || e.key === ' ') && !disabled) {
      e.preventDefault();
      inputRef.current?.click();
    }
  }, [disabled]);

  return (
    <div
      className={`rag-upload-dropzone ${isDragging ? 'dragging' : ''} ${disabled ? 'disabled' : ''} ${className}`}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      role="button"
      tabIndex={disabled ? -1 : 0}
      aria-label="Drop files here or click to select"
    >
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        multiple={multiple}
        onChange={handleInputChange}
        disabled={disabled}
        className="rag-upload-input"
        aria-hidden="true"
      />

      <div className="rag-upload-dropzone-content">
        <div className={`rag-upload-dropzone-icon ${isDragging ? 'active' : ''}`}>
          {isDragging ? <FileText size={32} /> : <Upload size={32} />}
        </div>

        <div className="rag-upload-dropzone-text">
          <span className="rag-upload-dropzone-title">
            {isDragging ? 'Drop files here' : 'Drop files here or click to select'}
          </span>
          <span className="rag-upload-dropzone-subtitle">
            PDF, DOCX, TXT, MD, HTML supported
          </span>
        </div>
      </div>

      {error && (
        <div className="rag-upload-dropzone-error">
          <AlertCircle size={14} />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
}
