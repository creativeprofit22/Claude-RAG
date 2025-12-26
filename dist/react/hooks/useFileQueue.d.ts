/**
 * Hook for managing a queue of files for upload
 */
import { type UploadProgress, type UploadResult, type UploadOptions } from './useUploadStream.js';
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
/**
 * Hook for managing a queue of files to upload sequentially
 */
export declare function useFileQueue(options?: UseFileQueueOptions): UseFileQueueReturn;
//# sourceMappingURL=useFileQueue.d.ts.map