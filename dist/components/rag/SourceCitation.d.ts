export interface Source {
    documentId: string;
    documentName: string;
    chunkIndex: number;
    pageNumber?: number;
    snippet: string;
}
export interface SourceCitationProps {
    sources: Source[];
    /** Custom class name for the container */
    className?: string;
}
export declare function SourceCitation({ sources, className }: SourceCitationProps): import("react/jsx-runtime").JSX.Element | null;
//# sourceMappingURL=SourceCitation.d.ts.map