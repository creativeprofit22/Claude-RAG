import type { DocumentSummary, DocumentDetails } from '../types.js';
export interface UseDocumentLibraryStateOptions {
    getDocumentDetails: (documentId: string) => Promise<DocumentDetails | null>;
    deleteDocument: (documentId: string) => Promise<boolean>;
    refetch: () => void;
    onDocumentSelect?: (doc: DocumentSummary) => void;
}
export interface UseDocumentLibraryStateReturn {
    previewDoc: DocumentDetails | null;
    previewLoading: boolean;
    handlePreview: (doc: DocumentSummary) => Promise<void>;
    handleClosePreview: () => void;
    handleQueryDocument: (doc: DocumentDetails) => void;
    deleteDoc: DocumentSummary | null;
    isDeleting: boolean;
    handleDeleteRequest: (doc: DocumentSummary) => void;
    handleConfirmDelete: () => Promise<void>;
    handleCancelDelete: () => void;
    localError: string | null;
    dismissError: () => void;
    handleDocumentSelect: (doc: DocumentSummary) => void;
}
/**
 * Hook to manage DocumentLibrary UI state
 * Handles preview, delete, and error state management
 */
export declare function useDocumentLibraryState({ getDocumentDetails, deleteDocument, refetch, onDocumentSelect, }: UseDocumentLibraryStateOptions): UseDocumentLibraryStateReturn;
//# sourceMappingURL=useDocumentLibraryState.d.ts.map