/**
 * Hook for streaming file uploads with SSE progress
 */
import { useState, useCallback, useRef } from 'react';
// Type guards for SSE event data
function isProgressData(data) {
    return typeof data === 'object' && data !== null && 'stage' in data && 'percent' in data;
}
function isCompleteData(data) {
    return typeof data === 'object' && data !== null && 'documentId' in data && 'chunks' in data;
}
function isMessageData(data) {
    return typeof data === 'object' && data !== null && 'message' in data;
}
const INITIAL_PROGRESS = { stage: 'idle', percent: 0 };
/**
 * Create UploadProgress object from SSE progress data
 */
function createProgressUpdate(data) {
    return {
        stage: data.stage,
        percent: data.percent,
        current: data.current,
        total: data.total,
        chunkCount: data.chunkCount,
    };
}
/**
 * Create UploadResult object from SSE complete data
 */
function createUploadResult(data) {
    return {
        documentId: data.documentId,
        chunks: data.chunks,
        name: data.name,
    };
}
/**
 * Hook for uploading files with SSE progress streaming
 */
export function useUploadStream(options = {}) {
    const { endpoint = '/api/rag/upload/stream', headers = {}, onProgress, onComplete, onError, onWarning, } = options;
    const [isUploading, setIsUploading] = useState(false);
    const [progress, setProgress] = useState(INITIAL_PROGRESS);
    const [error, setError] = useState(null);
    const [warning, setWarning] = useState(null);
    const abortControllerRef = useRef(null);
    // Track active reader for cleanup on abort/unmount
    const activeReaderRef = useRef(null);
    const upload = useCallback(async (file, uploadOptions) => {
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
            // Store reader ref for cleanup on abort/unmount
            activeReaderRef.current = reader;
            const decoder = new TextDecoder();
            let buffer = '';
            let result = null;
            while (true) {
                const { done, value } = await reader.read();
                if (done)
                    break;
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
                                if (!isProgressData(data))
                                    break;
                                const progressUpdate = createProgressUpdate(data);
                                setProgress(progressUpdate);
                                onProgress?.(progressUpdate);
                                break;
                            }
                            case 'complete': {
                                if (!isCompleteData(data))
                                    break;
                                result = createUploadResult(data);
                                setProgress({ stage: 'complete', percent: 100 });
                                onComplete?.(result);
                                break;
                            }
                            case 'warning': {
                                if (!isMessageData(data))
                                    break;
                                setWarning(data.message);
                                onWarning?.(data.message);
                                break;
                            }
                            case 'error': {
                                if (!isMessageData(data))
                                    break;
                                throw new Error(data.message);
                            }
                            default: {
                                // Fallback to data structure inference for backwards compatibility
                                if (isProgressData(data)) {
                                    const progressUpdate = createProgressUpdate(data);
                                    setProgress(progressUpdate);
                                    onProgress?.(progressUpdate);
                                }
                                else if (isCompleteData(data)) {
                                    result = createUploadResult(data);
                                    setProgress({ stage: 'complete', percent: 100 });
                                    onComplete?.(result);
                                }
                                else if (isMessageData(data)) {
                                    throw new Error(data.message);
                                }
                            }
                        }
                        currentEventType = ''; // Reset after processing data
                    }
                }
            }
            return result;
        }
        catch (err) {
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
        }
        finally {
            setIsUploading(false);
            abortControllerRef.current = null;
            // Clean up reader reference
            activeReaderRef.current = null;
        }
    }, [endpoint, headers, onProgress, onComplete, onError, onWarning]);
    const cancel = useCallback(() => {
        // Cancel the active reader to prevent memory leak
        if (activeReaderRef.current) {
            activeReaderRef.current.cancel().catch(() => {
                // Ignore cancel errors (already closed, etc.)
            });
            activeReaderRef.current = null;
        }
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
//# sourceMappingURL=useUploadStream.js.map