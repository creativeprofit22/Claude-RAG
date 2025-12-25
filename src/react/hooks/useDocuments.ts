'use client';

import { useState, useCallback, useMemo } from 'react';
import type { DocumentSummary, DocumentDetails } from '../types.js';
import { useAPIResource } from './useAPIResource.js';

type SortField = 'name' | 'date' | 'chunks';
type SortOrder = 'asc' | 'desc';

/**
 * Sort documents by the specified field and order.
 * Extracted to reduce inline complexity in useMemo.
 */
export function sortDocuments(
  docs: DocumentSummary[],
  sortBy: SortField,
  sortOrder: SortOrder
): DocumentSummary[] {
  return [...docs].sort((a, b) => {
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
}

/**
 * Validate an API response that contains an array under a specific field.
 * Reduces duplication across transform functions in hooks.
 */
export function validateApiArrayResponse<T>(
  data: unknown,
  fieldName: string,
  validateItem: (item: Record<string, unknown>) => void
): T[] {
  if (data === null || typeof data !== 'object') {
    throw new Error('Invalid API response: expected an object');
  }

  const response = data as Record<string, unknown>;

  if (!(fieldName in response)) {
    return [];
  }

  if (!Array.isArray(response[fieldName])) {
    throw new Error(`Invalid API response: ${fieldName} must be an array`);
  }

  for (const item of response[fieldName]) {
    if (typeof item !== 'object' || item === null) {
      throw new Error(`Invalid ${fieldName} item: expected an object`);
    }
    validateItem(item as Record<string, unknown>);
  }

  return response[fieldName] as T[];
}

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

// Document field validator
const validateDocumentItem = (d: Record<string, unknown>): void => {
  if (typeof d.documentId !== 'string' || typeof d.documentName !== 'string' ||
      typeof d.chunkCount !== 'number' || typeof d.timestamp !== 'number') {
    throw new Error('Invalid document: missing required properties (documentId, documentName, chunkCount, timestamp)');
  }
};

// Transform API response to extract documents array
const transformDocumentsResponse = (data: unknown): DocumentSummary[] => {
  return validateApiArrayResponse<DocumentSummary>(data, 'documents', validateDocumentItem);
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
  // Default sort: newest documents first (date descending)
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
    let result = documents;

    // Filter by search query (case-insensitive match on documentName)
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter((doc) =>
        doc.documentName.toLowerCase().includes(query)
      );
    }

    return sortDocuments(result, sortBy, sortOrder);
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
