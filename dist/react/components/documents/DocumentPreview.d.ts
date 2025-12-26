import type { DocumentDetails } from '../../types.js';
export interface DocumentPreviewProps {
    document: DocumentDetails;
    isLoading?: boolean;
    onClose: () => void;
    onQueryDocument?: (doc: DocumentDetails) => void;
    accentColor?: string;
}
/**
 * DocumentPreview - Modal overlay showing document details and chunk snippets
 */
export declare function DocumentPreview({ document: docDetails, isLoading, onClose, onQueryDocument, accentColor, }: DocumentPreviewProps): import("react/jsx-runtime").JSX.Element;
//# sourceMappingURL=DocumentPreview.d.ts.map