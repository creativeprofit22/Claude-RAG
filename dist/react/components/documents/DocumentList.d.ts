import type { DocumentSummary } from '../../types.js';
export interface DocumentListProps {
    documents: DocumentSummary[];
    isLoading?: boolean;
    onDocumentSelect?: (doc: DocumentSummary) => void;
    onDocumentDelete?: (doc: DocumentSummary) => void;
    onDocumentPreview?: (doc: DocumentSummary) => void;
    selectedDocumentId?: string;
    emptyState?: React.ReactNode;
    /** Number of skeleton cards to show while loading */
    skeletonCount?: number;
}
/**
 * DocumentList - Grid layout of document cards
 */
export declare function DocumentList({ documents, isLoading, onDocumentSelect, onDocumentDelete, onDocumentPreview, selectedDocumentId, emptyState, skeletonCount, }: DocumentListProps): import("react/jsx-runtime").JSX.Element;
//# sourceMappingURL=DocumentList.d.ts.map