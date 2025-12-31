import type { DocumentDetails } from '../../types.js';
export interface DocumentPreviewProps {
    document: DocumentDetails;
    isOpen?: boolean;
    isLoading?: boolean;
    onClose: () => void;
    onQueryDocument?: (doc: DocumentDetails) => void;
    accentColor?: string;
}
/**
 * DocumentPreview - Modal overlay showing document details and chunk snippets
 */
export declare function DocumentPreview({ document: docDetails, isOpen, isLoading, onClose, onQueryDocument, accentColor, }: DocumentPreviewProps): import("react/jsx-runtime").JSX.Element | null;
//# sourceMappingURL=DocumentPreview.d.ts.map