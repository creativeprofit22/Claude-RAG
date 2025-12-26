'use client';
import { useState, useCallback, useMemo } from 'react';
import { useAPIResource } from './useAPIResource.js';
/**
 * Sort documents by the specified field and order.
 * Extracted to reduce inline complexity in useMemo.
 */
export function sortDocuments(docs, sortBy, sortOrder) {
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
export function validateApiArrayResponse(data, fieldName, validateItem) {
    if (data === null || typeof data !== 'object') {
        throw new Error('Invalid API response: expected an object');
    }
    const response = data;
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
        validateItem(item);
    }
    return response[fieldName];
}
// Document field validator
const validateDocumentItem = (d) => {
    if (typeof d.documentId !== 'string' || typeof d.documentName !== 'string' ||
        typeof d.chunkCount !== 'number' || typeof d.timestamp !== 'number') {
        throw new Error('Invalid document: missing required properties (documentId, documentName, chunkCount, timestamp)');
    }
};
// Transform API response to extract documents array
const transformDocumentsResponse = (data) => {
    return validateApiArrayResponse(data, 'documents', validateDocumentItem);
};
export function useDocuments(options = {}) {
    const { endpoint = '/api/rag', headers = {}, autoFetch = true, } = options;
    // Use base API resource hook for core fetching logic
    const { data: documents, isLoading, error, refetch, setData: setDocuments, setError, stableHeaders, } = useAPIResource({
        fetchUrl: `${endpoint}/documents/details`,
        headers,
        autoFetch,
        transformResponse: transformDocumentsResponse,
    });
    // Filtering/sorting state
    // Default sort: newest documents first (date descending)
    const [searchQuery, setSearchQuery] = useState('');
    const [sortBy, setSortBy] = useState('date');
    const [sortOrder, setSortOrder] = useState('desc');
    // Delete a document
    const deleteDocument = useCallback(async (id) => {
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
        }
        catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to delete document';
            setError(errorMessage);
            return false;
        }
    }, [endpoint, stableHeaders, setDocuments, setError]);
    // Get full document details
    const getDocumentDetails = useCallback(async (id) => {
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
        }
        catch (err) {
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
            result = result.filter((doc) => doc.documentName.toLowerCase().includes(query));
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
//# sourceMappingURL=useDocuments.js.map