/**
 * Hook for streaming file uploads with SSE progress
 */
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
/**
 * Hook for uploading files with SSE progress streaming
 */
export declare function useUploadStream(options?: UseUploadStreamOptions): UseUploadStreamReturn;
//# sourceMappingURL=useUploadStream.d.ts.map