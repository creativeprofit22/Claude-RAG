'use client';

import { useState, useCallback, useRef } from 'react';
import type { DocumentSummary, DocumentDetails } from '../types.js';

export interface UseDocumentLibraryStateOptions {
  getDocumentDetails: (documentId: string) => Promise<DocumentDetails | null>;
  deleteDocument: (documentId: string) => Promise<boolean>;
  refetch: () => void;
  onDocumentSelect?: (doc: DocumentSummary) => void;
}

export interface UseDocumentLibraryStateReturn {
  // Preview state
  previewDoc: DocumentDetails | null;
  previewLoading: boolean;
  handlePreview: (doc: DocumentSummary) => Promise<void>;
  handleClosePreview: () => void;
  handleQueryDocument: (doc: DocumentDetails) => void;

  // Delete state
  deleteDoc: DocumentSummary | null;
  isDeleting: boolean;
  handleDeleteRequest: (doc: DocumentSummary) => void;
  handleConfirmDelete: () => Promise<void>;
  handleCancelDelete: () => void;

  // Error state
  localError: string | null;
  dismissError: () => void;

  // Selection
  handleDocumentSelect: (doc: DocumentSummary) => void;
}

/**
 * Hook to manage DocumentLibrary UI state
 * Handles preview, delete, and error state management
 */
export function useDocumentLibraryState({
  getDocumentDetails,
  deleteDocument,
  refetch,
  onDocumentSelect,
}: UseDocumentLibraryStateOptions): UseDocumentLibraryStateReturn {
  // Keep refetch ref for error recovery
  const refetchRef = useRef(refetch);
  refetchRef.current = refetch;

  // Preview state
  const [previewDoc, setPreviewDoc] = useState<DocumentDetails | null>(null);
  const [previewLoading, setPreviewLoading] = useState(false);

  // Delete state
  const [deleteDoc, setDeleteDoc] = useState<DocumentSummary | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Error state
  const [localError, setLocalError] = useState<string | null>(null);

  // Handle document preview
  const handlePreview = useCallback(
    async (doc: DocumentSummary) => {
      setPreviewLoading(true);
      setLocalError(null);

      try {
        const details = await getDocumentDetails(doc.documentId);
        if (details) {
          setPreviewDoc(details);
        } else {
          // Fallback to summary if details fetch fails
          setPreviewDoc({
            ...doc,
            chunks: [],
          });
        }
      } catch {
        setLocalError('Failed to load document details');
      } finally {
        setPreviewLoading(false);
      }
    },
    [getDocumentDetails]
  );

  // Handle document deletion request
  const handleDeleteRequest = useCallback((doc: DocumentSummary) => {
    setDeleteDoc(doc);
  }, []);

  // Handle confirmed deletion
  const handleConfirmDelete = useCallback(async () => {
    if (!deleteDoc) return;

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
      } else {
        // Refetch to ensure state is synced after failed delete
        refetchRef.current();
      }
    } catch {
      setLocalError('Failed to delete document');
      // Refetch to ensure state is synced after error
      refetchRef.current();
    } finally {
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
  const handleQueryDocument = useCallback(
    (doc: DocumentDetails) => {
      setPreviewDoc(null);
      onDocumentSelect?.(doc);
    },
    [onDocumentSelect]
  );

  // Handle document selection from list
  const handleDocumentSelect = useCallback(
    (doc: DocumentSummary) => {
      onDocumentSelect?.(doc);
    },
    [onDocumentSelect]
  );

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
