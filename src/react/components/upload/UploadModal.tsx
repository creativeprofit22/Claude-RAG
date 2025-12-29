/**
 * UploadModal - Enhanced upload modal with file queue and category selection
 */

import React, { useCallback, useEffect } from 'react';
import { X, Upload, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useFileQueue, type QueuedFile } from '../../hooks/useFileQueue.js';
import { useCategories } from '../../hooks/useCategories.js';
import { useModal } from '../../hooks/useModal.js';
import { useSkinMotion } from '../../motion/hooks/useSkinMotion.js';
import { FileDropZone } from './FileDropZone.js';
import { FileQueue } from './FileQueue.js';
import { CategoryFilter } from '../categories/CategoryFilter.js';

export interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUploadComplete?: (files: QueuedFile[]) => void;
  endpoint?: string;
  headers?: Record<string, string>;
  className?: string;
}

export function UploadModal({
  isOpen,
  onClose,
  onUploadComplete,
  endpoint = '/api/rag',
  headers = {},
  className = '',
}: UploadModalProps): React.ReactElement | null {
  const { handleBackdropClick } = useModal({ onClose, isOpen });
  const { motion: skinMotion } = useSkinMotion();

  // Category management - use stable endpoint reference to prevent race conditions
  const { categories, isLoading: categoriesLoading, refetch: refetchCategories } = useCategories({
    endpoint,
    headers,
    autoFetch: false, // Manual control to prevent race conditions
  });

  // Fetch categories when modal opens, abort if it closes before completing
  React.useEffect(() => {
    if (!isOpen) return;

    const abortController = new AbortController();

    // Fetch categories with cancellation support
    const fetchCategories = async () => {
      // Yield to event loop to allow rapid open/close to settle
      await Promise.resolve();
      if (!abortController.signal.aborted) {
        refetchCategories();
      }
    };
    fetchCategories();

    return () => {
      abortController.abort();
    };
  }, [isOpen, refetchCategories]);

  const [selectedCategoryId, setSelectedCategoryId] = React.useState<string | null>(null);

  // File queue management
  const {
    files,
    addFiles,
    removeFile,
    updateFileName,
    clearAll,
    startUpload,
    cancelUpload,
    isUploading,
    hasFiles,
    completedCount,
  } = useFileQueue({
    endpoint: `${endpoint}/upload/stream`,
    headers,
    onAllComplete: (results) => {
      if (onUploadComplete) {
        const completedFiles = files.filter((f) => f.status === 'complete');
        onUploadComplete(completedFiles);
      }
    },
  });

  // Handle file selection
  const handleFilesSelected = useCallback((newFiles: File[]) => {
    addFiles(newFiles);
  }, [addFiles]);

  // Start upload with selected category
  const handleStartUpload = useCallback(async () => {
    await startUpload({
      categoryIds: selectedCategoryId ? [selectedCategoryId] : undefined,
    });
  }, [startUpload, selectedCategoryId]);

  // Handle close
  const handleClose = useCallback(() => {
    if (isUploading) {
      cancelUpload();
    }
    clearAll();
    setSelectedCategoryId(null);
    onClose();
  }, [isUploading, cancelUpload, clearAll, onClose]);

  // Reset on open
  useEffect(() => {
    if (isOpen) {
      clearAll();
      setSelectedCategoryId(null);
    }
  }, [isOpen, clearAll]);

  const queuedCount = files.filter((f) => f.status === 'queued').length;
  const canUpload = queuedCount > 0 && !isUploading;

  return (
    <AnimatePresence mode="wait">
      {isOpen && (
        <motion.div
          className={`curator-overlay rag-upload-modal-overlay ${className}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleBackdropClick}
          role="dialog"
          aria-modal="true"
          aria-labelledby="upload-modal-title"
        >
          <motion.div
            className="rag-upload-modal"
            variants={skinMotion.modal}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={(e) => e.stopPropagation()}
          >
        {/* Header */}
        <div className="rag-upload-modal-header">
          <div className="rag-upload-modal-title-row">
            <Upload size={20} />
            <h2 id="upload-modal-title">Upload Documents</h2>
          </div>
          <button
            type="button"
            onClick={handleClose}
            className="rag-upload-modal-close"
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="rag-upload-modal-content">
          {/* Drop zone */}
          <FileDropZone
            onFilesSelected={handleFilesSelected}
            disabled={isUploading}
            multiple
          />

          {/* File queue */}
          {hasFiles && (
            <FileQueue
              files={files}
              onRemove={removeFile}
              onRename={updateFileName}
              isUploading={isUploading}
            />
          )}

          {/* Category selection */}
          {hasFiles && categories.length > 0 && (
            <div className="rag-upload-modal-category">
              <label className="rag-upload-modal-label">
                Assign to category (optional)
              </label>
              <CategoryFilter
                categories={categories}
                selected={selectedCategoryId}
                onChange={setSelectedCategoryId}
                mode="dropdown"
                placeholder="Select a category..."
              />
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="rag-upload-modal-footer">
          <button
            type="button"
            onClick={handleClose}
            className="rag-upload-modal-btn secondary"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleStartUpload}
            className="rag-upload-modal-btn primary"
            disabled={!canUpload}
          >
            {isUploading ? (
              <>
                <Loader2 size={16} className="spin" />
                Uploading...
              </>
            ) : (
              <>
                <Upload size={16} />
                Upload {queuedCount > 0 ? `(${queuedCount})` : ''}
              </>
            )}
          </button>
        </div>

        {/* Completion message */}
        {completedCount > 0 && !isUploading && (
          <div className="rag-upload-modal-success">
            Successfully uploaded {completedCount} file{completedCount !== 1 ? 's' : ''}
          </div>
        )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
