import type { DocumentSummary } from '../../types.js';
export interface DocumentCardProps {
    document: DocumentSummary;
    isSelected?: boolean;
    onSelect?: (doc: DocumentSummary) => void;
    onDelete?: (doc: DocumentSummary) => void;
    onPreview?: (doc: DocumentSummary) => void;
}
/**
 * DocumentCard - Displays a single document in the list
 */
export declare function DocumentCard({ document, isSelected, onSelect, onDelete, onPreview, }: DocumentCardProps): import("react/jsx-runtime").JSX.Element;
//# sourceMappingURL=DocumentCard.d.ts.map