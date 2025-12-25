/**
 * Hook for streaming file uploads with SSE progress
 */

import { useState, useCallback, useRef } from 'react';

export type UploadStage = 'idle' | 'reading' | 'extracting' | 'chunking' | 'embedding' | 'storing' | 'complete' | 'error';

export interface UploadProgress {
  stage: UploadStage;
  percent: number;
  current?: number;
  total?: number;
  chunkCount?: number;
}

export interface UploadResult {
  documentId: string;
  chunks: number;
  name: string;
}

export interface UploadOptions {
  name?: string;
  categoryIds?: string[];
  tags?: string[];
}

export interface UseUploadStreamOptions {
  endpoint?: string;
  headers?: Record<string, string>;
  onProgress?: (progress: UploadProgress) => void;
  onComplete?: (result: UploadResult) => void;
  onError?: (error: string) => void;
  onWarning?: (message: string) => void;
}

export interface UseUploadStreamReturn {
  upload: (file: File, options?: UploadOptions) => Promise<UploadResult | null>;
  cancel: () => void;
  isUploading: boolean;
  progress: UploadProgress;
  error: string | null;
  warning: string | null;
}

const INITIAL_PROGRESS: UploadProgress = { stage: 'idle', percent: 0 };

/**
 * Hook for uploading files with SSE progress streaming
 */
export function useUploadStream(options: UseUploadStreamOptions = {}): UseUploadStreamReturn {
  const {
    endpoint = '/api/rag/upload/stream',
    headers = {},
    onProgress,
    onComplete,
    onError,
    onWarning,
  } = options;

  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState<UploadProgress>(INITIAL_PROGRESS);
  const [error, setError] = useState<string | null>(null);
  const [warning, setWarning] = useState<string | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const upload = useCallback(async (file: File, uploadOptions?: UploadOptions): Promise<UploadResult | null> => {
    // Reset state
    setIsUploading(true);
    setError(null);
    setWarning(null);
    setProgress({ stage: 'reading', percent: 0 });

    // Create abort controller for cancellation
    abortControllerRef.current = new AbortController();

    try {
      // Build form data
      const formData = new FormData();
      formData.append('file', file);
      if (uploadOptions?.name) {
        formData.append('name', uploadOptions.name);
      }
      if (uploadOptions?.categoryIds) {
        formData.append('categoryIds', JSON.stringify(uploadOptions.categoryIds));
      }
      if (uploadOptions?.tags) {
        formData.append('tags', JSON.stringify(uploadOptions.tags));
      }

      // Start SSE request
      const response = await fetch(endpoint, {
        method: 'POST',
        headers,
        body: formData,
        signal: abortControllerRef.current.signal,
      });

      if (!response.ok) {
        throw new Error(`Upload failed: ${response.statusText}`);
      }

      if (!response.body) {
        throw new Error('No response body');
      }

      // Read SSE stream
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';
      let result: UploadResult | null = null;

      while (true) {
        const { done, value } = await reader.read();

        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        let currentEventType = '';

        for (const line of lines) {
          if (line.startsWith('event: ')) {
            currentEventType = line.slice(7).trim();
            continue;
          }

          if (line.startsWith('data: ')) {
            const data = JSON.parse(line.slice(6));

            // Use event type from event: line for dispatch
            switch (currentEventType) {
              case 'progress': {
                const progressUpdate: UploadProgress = {
                  stage: data.stage,
                  percent: data.percent,
                  current: data.current,
                  total: data.total,
                  chunkCount: data.chunkCount,
                };
                setProgress(progressUpdate);
                onProgress?.(progressUpdate);
                break;
              }
              case 'complete': {
                result = {
                  documentId: data.documentId,
                  chunks: data.chunks,
                  name: data.name,
                };
                setProgress({ stage: 'complete', percent: 100 });
                onComplete?.(result);
                break;
              }
              case 'warning': {
                setWarning(data.message);
                onWarning?.(data.message);
                break;
              }
              case 'error': {
                throw new Error(data.message);
              }
              default: {
                // Fallback to data structure inference for backwards compatibility
                if ('stage' in data) {
                  const progressUpdate: UploadProgress = {
                    stage: data.stage,
                    percent: data.percent,
                    current: data.current,
                    total: data.total,
                    chunkCount: data.chunkCount,
                  };
                  setProgress(progressUpdate);
                  onProgress?.(progressUpdate);
                } else if ('documentId' in data) {
                  result = {
                    documentId: data.documentId,
                    chunks: data.chunks,
                    name: data.name,
                  };
                  setProgress({ stage: 'complete', percent: 100 });
                  onComplete?.(result);
                } else if ('message' in data) {
                  throw new Error(data.message);
                }
              }
            }

            currentEventType = ''; // Reset after processing data
          }
        }
      }

      return result;
    } catch (err) {
      if (err instanceof Error && err.name === 'AbortError') {
        setError('Upload cancelled');
        setProgress({ stage: 'error', percent: 0 });
        return null;
      }

      const errorMessage = err instanceof Error ? err.message : 'Upload failed';
      setError(errorMessage);
      setProgress({ stage: 'error', percent: 0 });
      onError?.(errorMessage);
      return null;
    } finally {
      setIsUploading(false);
      abortControllerRef.current = null;
    }
  }, [endpoint, headers, onProgress, onComplete, onError, onWarning]);

  const cancel = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
  }, []);

  return {
    upload,
    cancel,
    isUploading,
    progress,
    error,
    warning,
  };
}
