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
export declare const DocumentCard: import("react").NamedExoticComponent<DocumentCardProps>;
//# sourceMappingURL=DocumentCard.d.ts.map