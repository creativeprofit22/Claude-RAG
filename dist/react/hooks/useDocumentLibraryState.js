'use client';
import { useState, useCallback, useRef } from 'react';
/**
 * Hook to manage DocumentLibrary UI state
 * Handles preview, delete, and error state management
 */
export function useDocumentLibraryState({ getDocumentDetails, deleteDocument, refetch, onDocumentSelect, }) {
    // Keep refetch ref for error recovery
    const refetchRef = useRef(refetch);
    refetchRef.current = refetch;
    // Preview state
    const [previewDoc, setPreviewDoc] = useState(null);
    const [previewLoading, setPreviewLoading] = useState(false);
    // Delete state
    const [deleteDoc, setDeleteDoc] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false);
    // Error state
    const [localError, setLocalError] = useState(null);
    // Handle document preview
    const handlePreview = useCallback(async (doc) => {
        setPreviewLoading(true);
        setLocalError(null);
        try {
            const details = await getDocumentDetails(doc.documentId);
            if (details) {
                setPreviewDoc(details);
            }
            else {
                // Fallback to summary if details fetch fails
                setPreviewDoc({
                    ...doc,
                    chunks: [],
                });
            }
        }
        catch {
            setLocalError('Failed to load document details');
        }
        finally {
            setPreviewLoading(false);
        }
    }, [getDocumentDetails]);
    // Handle document deletion request
    const handleDeleteRequest = useCallback((doc) => {
        setDeleteDoc(doc);
    }, []);
    // Handle confirmed deletion
    const handleConfirmDelete = useCallback(async () => {
        if (!deleteDoc)
            return;
        setIsDeleting(true);
        setLocalError(null);
        try {
            const success = await deleteDocument(deleteDoc.documentId);
            if (success) {
                setDeleteDoc(null);
                // Close preview if we deleted the previewed document
                if (previewDoc?.documentId === deleteDoc.documentId) {
                    setPreviewDoc(null);
                }
            }
            else {
                // Refetch to ensure state is synced after failed delete
                refetchRef.current();
            }
        }
        catch {
            setLocalError('Failed to delete document');
            // Refetch to ensure state is synced after error
            refetchRef.current();
        }
        finally {
            setIsDeleting(false);
        }
    }, [deleteDoc, deleteDocument, previewDoc?.documentId]);
    // Handle cancel deletion
    const handleCancelDelete = useCallback(() => {
        setDeleteDoc(null);
    }, []);
    // Handle close preview
    const handleClosePreview = useCallback(() => {
        setPreviewDoc(null);
    }, []);
    // Handle query document from preview
    const handleQueryDocument = useCallback((doc) => {
        setPreviewDoc(null);
        onDocumentSelect?.(doc);
    }, [onDocumentSelect]);
    // Handle document selection from list
    const handleDocumentSelect = useCallback((doc) => {
        onDocumentSelect?.(doc);
    }, [onDocumentSelect]);
    // Dismiss error
    const dismissError = useCallback(() => {
        setLocalError(null);
    }, []);
    return {
        previewDoc,
        previewLoading,
        handlePreview,
        handleClosePreview,
        handleQueryDocument,
        deleteDoc,
        isDeleting,
        handleDeleteRequest,
        handleConfirmDelete,
        handleCancelDelete,
        localError,
        dismissError,
        handleDocumentSelect,
    };
}
//# sourceMappingURL=useDocumentLibraryState.js.map