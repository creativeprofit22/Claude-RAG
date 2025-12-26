export interface DocumentUploadProps {
    /** API endpoint for uploading documents (default: /api/rag/upload) */
    uploadEndpoint?: string;
    /** Callback when upload succeeds */
    onUploadSuccess?: () => void;
    /** Callback with error message when upload fails */
    onUploadError?: (error: string) => void;
}
export declare function DocumentUpload({ uploadEndpoint, onUploadSuccess, onUploadError, }: DocumentUploadProps): import("react/jsx-runtime").JSX.Element;
//# sourceMappingURL=DocumentUpload.d.ts.map