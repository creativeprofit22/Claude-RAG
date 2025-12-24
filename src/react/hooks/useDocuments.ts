'use client';

import { useState, useCallback, useMemo } from 'react';
import type { DocumentSummary, DocumentDetails } from '../types.js';
import { useAPIResource } from './useAPIResource.js';

interface UseDocumentsOptions {
  /** API endpoint base URL (default: /api/rag) */
  endpoint?: string;
  /** Custom headers for API requests */
  headers?: Record<string, string>;
  /** Auto-fetch documents on mount (default: true) */
  autoFetch?: boolean;
}

interface UseDocumentsReturn {
  /** List of all documents */
  documents: DocumentSummary[];
  /** Loading state */
  isLoading: boolean;
  /** Error message if any */
  error: string | null;
  /** Refetch documents from server */
  refetch: () => Promise<void>;
  /** Delete a document by ID */
  deleteDocument: (id: string) => Promise<boolean>;
  /** Get full document details including chunks */
  getDocumentDetails: (id: string) => Promise<DocumentDetails | null>;
  // Filtering/sorting (client-side)
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  sortBy: 'name' | 'date' | 'chunks';
  setSortBy: (sort: 'name' | 'date' | 'chunks') => void;
  sortOrder: 'asc' | 'desc';
  setSortOrder: (order: 'asc' | 'desc') => void;
  /** Documents filtered and sorted based on current state */
  filteredDocuments: DocumentSummary[];
}

// Transform API response to extract documents array
const transformDocumentsResponse = (data: unknown): DocumentSummary[] => {
  return (data as { documents?: DocumentSummary[] })?.documents || [];
};

export function useDocuments(options: UseDocumentsOptions = {}): UseDocumentsReturn {
  const {
    endpoint = '/api/rag',
    headers = {},
    autoFetch = true,
  } = options;

  // Use base API resource hook for core fetching logic
  const {
    data: documents,
    isLoading,
    error,
    refetch,
    setData: setDocuments,
    setError,
    stableHeaders,
  } = useAPIResource<DocumentSummary>({
    fetchUrl: `${endpoint}/documents/details`,
    headers,
    autoFetch,
    transformResponse: transformDocumentsResponse,
  });

  // Filtering/sorting state
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'name' | 'date' | 'chunks'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  // Delete a document
  const deleteDocument = useCallback(async (id: string): Promise<boolean> => {
    try {
      const response = await fetch(`${endpoint}/documents/${encodeURIComponent(id)}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          ...stableHeaders,
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Delete failed: ${response.status}`);
      }

      // Optimistically remove from local state
      setDocuments((prev) => prev.filter((doc) => doc.documentId !== id));
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete document';
      setError(errorMessage);
      return false;
    }
  }, [endpoint, stableHeaders, setDocuments, setError]);

  // Get full document details
  const getDocumentDetails = useCallback(async (id: string): Promise<DocumentDetails | null> => {
    try {
      const response = await fetch(`${endpoint}/documents/${encodeURIComponent(id)}/details`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...stableHeaders,
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Request failed: ${response.status}`);
      }

      return await response.json();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch document details';
      setError(errorMessage);
      return null;
    }
  }, [endpoint, stableHeaders, setError]);

  // Filtered and sorted documents (client-side)
  const filteredDocuments = useMemo(() => {
    let result = [...documents];

    // Filter by search query (case-insensitive match on documentName)
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter((doc) =>
        doc.documentName.toLowerCase().includes(query)
      );
    }

    // Sort
    result.sort((a, b) => {
      let comparison = 0;

      switch (sortBy) {
        case 'name':
          comparison = a.documentName.localeCompare(b.documentName);
          break;
        case 'date':
          comparison = a.timestamp - b.timestamp;
          break;
        case 'chunks':
          comparison = a.chunkCount - b.chunkCount;
          break;
      }

      return sortOrder === 'asc' ? comparison : -comparison;
    });

    return result;
  }, [documents, searchQuery, sortBy, sortOrder]);

  return {
    documents,
    isLoading,
    error,
    refetch,
    deleteDocument,
    getDocumentDetails,
    searchQuery,
    setSearchQuery,
    sortBy,
    setSortBy,
    sortOrder,
    setSortOrder,
    filteredDocuments,
  };
}
