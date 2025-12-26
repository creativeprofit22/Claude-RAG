import type { DocumentSummary, DocumentDetails } from '../types.js';
type SortField = 'name' | 'date' | 'chunks';
type SortOrder = 'asc' | 'desc';
/**
 * Sort documents by the specified field and order.
 * Extracted to reduce inline complexity in useMemo.
 */
export declare function sortDocuments(docs: DocumentSummary[], sortBy: SortField, sortOrder: SortOrder): DocumentSummary[];
/**
 * Validate an API response that contains an array under a specific field.
 * Reduces duplication across transform functions in hooks.
 */
export declare function validateApiArrayResponse<T>(data: unknown, fieldName: string, validateItem: (item: Record<string, unknown>) => void): T[];
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
    searchQuery: string;
    setSearchQuery: (query: string) => void;
    sortBy: 'name' | 'date' | 'chunks';
    setSortBy: (sort: 'name' | 'date' | 'chunks') => void;
    sortOrder: 'asc' | 'desc';
    setSortOrder: (order: 'asc' | 'desc') => void;
    /** Documents filtered and sorted based on current state */
    filteredDocuments: DocumentSummary[];
}
export declare function useDocuments(options?: UseDocumentsOptions): UseDocumentsReturn;
export {};
//# sourceMappingURL=useDocuments.d.ts.map