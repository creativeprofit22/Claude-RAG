'use client';

import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import type { DocumentSummary, DocumentDetails } from '../types.js';

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

export function useDocuments(options: UseDocumentsOptions = {}): UseDocumentsReturn {
  const {
    endpoint = '/api/rag',
    headers = {},
    autoFetch = true,
  } = options;

  // Core state
  const [documents, setDocuments] = useState<DocumentSummary[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Filtering/sorting state
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'name' | 'date' | 'chunks'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  // Stabilize headers to prevent infinite rerenders from inline objects
  const headersJson = JSON.stringify(headers);
  const stableHeaders = useMemo(() => headers, [headersJson]);

  // AbortController ref to cancel in-flight requests
  const abortControllerRef = useRef<AbortController | null>(null);

  // Ref to store latest refetch to avoid infinite loop in auto-fetch effect
  const refetchRef = useRef<(() => Promise<void>) | null>(null);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      abortControllerRef.current?.abort();
    };
  }, []);

  // Fetch all documents
  const refetch = useCallback(async () => {
    // Abort any in-flight request
    abortControllerRef.current?.abort();
    abortControllerRef.current = new AbortController();

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`${endpoint}/documents/details`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...stableHeaders,
        },
        signal: abortControllerRef.current.signal,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Request failed: ${response.status}`);
      }

      const data = await response.json();
      // API returns { documents: DocumentSummary[] }
      setDocuments(data.documents || []);
    } catch (err) {
      // Ignore abort errors - they're intentional
      if (err instanceof Error && err.name === 'AbortError') {
        return;
      }

      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch documents';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [endpoint, stableHeaders]);

  // Keep refetchRef updated
  refetchRef.current = refetch;

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
  }, [endpoint, stableHeaders]);

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
  }, [endpoint, stableHeaders]);

  // Auto-fetch on mount (use ref to avoid infinite loop)
  useEffect(() => {
    if (autoFetch) {
      refetchRef.current?.();
    }
  }, [autoFetch]);

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
