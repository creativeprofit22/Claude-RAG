import { type DocumentSummary } from '../../types.js';
export interface DocumentLibraryProps {
    /** API endpoint base URL (default: /api/rag) */
    endpoint?: string;
    /** Title displayed in the header */
    title?: string;
    /** Additional CSS class */
    className?: string;
    /** Accent color for interactive elements */
    accentColor?: string;
    /** Callback when a document is selected for querying */
    onDocumentSelect?: (doc: DocumentSummary) => void;
    /** Custom empty state component */
    emptyState?: React.ReactNode;
    /** Custom headers for API requests */
    headers?: Record<string, string>;
}
/**
 * DocumentLibrary - Main container for document management
 *
 * Provides search, browsing, preview, and delete functionality for RAG documents.
 *
 * @example
 * ```tsx
 * import { DocumentLibrary } from 'claude-rag/react';
 *
 * // Basic usage
 * <DocumentLibrary endpoint="/api/rag" />
 *
 * // With document selection callback
 * <DocumentLibrary
 *   endpoint="/api/rag"
 *   title="My Documents"
 *   accentColor="#10b981"
 *   onDocumentSelect={(doc) => console.log('Selected:', doc)}
 * />
 * ```
 */
export declare function DocumentLibrary({ endpoint, title, className, accentColor, onDocumentSelect, emptyState, headers, }: DocumentLibraryProps): import("react/jsx-runtime").JSX.Element;
//# sourceMappingURL=DocumentLibrary.d.ts.map