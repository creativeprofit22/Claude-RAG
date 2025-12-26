export interface Document {
    id: string;
    chunkCount: number;
    totalTokens: number;
    documentName?: string;
}
export interface RAGModalProps {
    isOpen: boolean;
    onClose: () => void;
    /** Base API endpoint (default: /api/rag) */
    apiBaseUrl?: string;
    /** Number of items per page (default: 5) */
    itemsPerPage?: number;
    /** Modal title (default: RAG Documents) */
    title?: string;
}
export declare function RAGModal({ isOpen, onClose, apiBaseUrl, itemsPerPage, title, }: RAGModalProps): import("react/jsx-runtime").JSX.Element | null;
//# sourceMappingURL=RAGModal.d.ts.map