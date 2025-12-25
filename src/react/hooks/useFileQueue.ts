/**
 * Hook for managing a queue of files for upload
 */

import { useState, useCallback, useRef } from 'react';
import { useUploadStream, type UploadProgress, type UploadResult, type UploadOptions } from './useUploadStream.js';

export type FileStatus = 'queued' | 'uploading' | 'complete' | 'error';

export interface QueuedFile {
  id: string;
  file: File;
  name: string;
  status: FileStatus;
  progress: UploadProgress;
  error?: string;
  warning?: string;
  result?: UploadResult;
  preview?: string;
  estimatedChunks?: number;
}

export interface UseFileQueueOptions {
  endpoint?: string;
  headers?: Record<string, string>;
  onFileComplete?: (file: QueuedFile, result: UploadResult) => void;
  onAllComplete?: (results: UploadResult[]) => void;
  onError?: (file: QueuedFile, error: string) => void;
}

export interface UseFileQueueReturn {
  files: QueuedFile[];
  addFiles: (files: File[]) => void;
  removeFile: (id: string) => void;
  updateFileName: (id: string, name: string) => void;
  clearCompleted: () => void;
  clearAll: () => void;
  startUpload: (options?: UploadOptions) => Promise<void>;
  cancelUpload: () => void;
  isUploading: boolean;
  hasFiles: boolean;
  completedCount: number;
  errorCount: number;
}

const generateId = () => `file_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

const INITIAL_PROGRESS: UploadProgress = { stage: 'idle', percent: 0 };

/**
 * Hook for managing a queue of files to upload sequentially
 */
export function useFileQueue(options: UseFileQueueOptions = {}): UseFileQueueReturn {
  const {
    endpoint,
    headers,
    onFileComplete,
    onAllComplete,
    onError,
  } = options;

  const [files, setFiles] = useState<QueuedFile[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const cancelRef = useRef(false);
  const currentFileIdRef = useRef<string | null>(null);
  const lastErrorRef = useRef<string | null>(null);
  // Ref to get current files state to avoid stale closure in startUpload
  const filesRef = useRef<QueuedFile[]>(files);
  filesRef.current = files;

  const { upload, cancel } = useUploadStream({
    endpoint,
    headers,
    onProgress: (progress) => {
      const fileId = currentFileIdRef.current;
      if (fileId) {
        setFiles((prev) =>
          prev.map((f) => (f.id === fileId ? { ...f, progress } : f))
        );
      }
    },
    onError: (error) => {
      lastErrorRef.current = error;
    },
    onWarning: (message) => {
      const fileId = currentFileIdRef.current;
      if (fileId) {
        setFiles((prev) =>
          prev.map((f) => (f.id === fileId ? { ...f, warning: message } : f))
        );
      }
    },
  });

  // Add files to the queue (skips duplicates by name)
  const addFiles = useCallback((newFiles: File[]) => {
    setFiles((prev) => {
      const existingNames = new Set(prev.map((f) => f.name));
      const uniqueFiles = newFiles.filter((file) => !existingNames.has(file.name));

      if (uniqueFiles.length === 0) return prev;

      const queuedFiles: QueuedFile[] = uniqueFiles.map((file) => ({
        id: generateId(),
        file,
        name: file.name,
        status: 'queued' as FileStatus,
        progress: INITIAL_PROGRESS,
        // Preview generated lazily when needed to avoid memory overhead
      }));

      return [...prev, ...queuedFiles];
    });
  }, []);

  // Remove a file from the queue
  const removeFile = useCallback((id: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== id));
  }, []);

  // Update file name (preserves original extension if new name lacks one)
  const updateFileName = useCallback((id: string, name: string) => {
    setFiles((prev) =>
      prev.map((f) => {
        if (f.id !== id) return f;
        // Preserve original extension if new name doesn't have one
        const originalExt = f.file.name.includes('.') ? f.file.name.slice(f.file.name.lastIndexOf('.')) : '';
        const newHasExt = name.includes('.');
        const finalName = newHasExt ? name : name + originalExt;
        return { ...f, name: finalName };
      })
    );
  }, []);

  // Clear completed files
  const clearCompleted = useCallback(() => {
    setFiles((prev) => prev.filter((f) => f.status !== 'complete'));
  }, []);

  // Clear all files
  const clearAll = useCallback(() => {
    if (!isUploading) {
      setFiles([]);
    }
  }, [isUploading]);

  // Start uploading files sequentially
  const startUpload = useCallback(async (uploadOptions?: UploadOptions) => {
    setIsUploading(true);
    cancelRef.current = false;

    const results: UploadResult[] = [];
    // Use ref to get current files state, avoiding stale closure
    const pendingFiles = filesRef.current.filter((f) => f.status === 'queued');

    for (const queuedFile of pendingFiles) {
      if (cancelRef.current) break;

      // Track current file for progress/error callbacks
      currentFileIdRef.current = queuedFile.id;
      lastErrorRef.current = null;

      // Mark file as uploading
      setFiles((prev) =>
        prev.map((f) =>
          f.id === queuedFile.id
            ? { ...f, status: 'uploading' as FileStatus, progress: { stage: 'reading', percent: 0 } }
            : f
        )
      );

      // Upload the file
      const result = await upload(queuedFile.file, {
        name: queuedFile.name,
        ...uploadOptions,
      });

      if (result) {
        // Success
        results.push(result);
        setFiles((prev) =>
          prev.map((f) =>
            f.id === queuedFile.id
              ? {
                  ...f,
                  status: 'complete' as FileStatus,
                  progress: { stage: 'complete', percent: 100 },
                  result,
                }
              : f
          )
        );
        onFileComplete?.({ ...queuedFile, status: 'complete', result }, result);
      } else {
        // Error or cancelled - use actual error message
        const errorMessage = lastErrorRef.current || 'Upload failed';
        setFiles((prev) =>
          prev.map((f) =>
            f.id === queuedFile.id
              ? {
                  ...f,
                  status: 'error' as FileStatus,
                  progress: { stage: 'error', percent: 0 },
                  error: errorMessage,
                }
              : f
          )
        );
        onError?.({ ...queuedFile, status: 'error', error: errorMessage }, errorMessage);
      }

      currentFileIdRef.current = null;
    }

    setIsUploading(false);

    if (results.length > 0) {
      onAllComplete?.(results);
    }
  }, [upload, onFileComplete, onAllComplete, onError]);

  // Cancel current upload
  const cancelUpload = useCallback(() => {
    cancelRef.current = true;
    cancel();
  }, [cancel]);

  return {
    files,
    addFiles,
    removeFile,
    updateFileName,
    clearCompleted,
    clearAll,
    startUpload,
    cancelUpload,
    isUploading,
    hasFiles: files.length > 0,
    completedCount: files.filter((f) => f.status === 'complete').length,
    errorCount: files.filter((f) => f.status === 'error').length,
  };
}
