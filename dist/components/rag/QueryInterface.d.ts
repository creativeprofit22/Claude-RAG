export interface Source {
    documentName: string;
    pageNumber?: number;
    snippet: string;
}
export interface QueryResult {
    answer: string;
    sources: Source[];
}
export interface QueryInterfaceProps {
    /** API endpoint for querying documents (default: /api/rag/query) */
    queryEndpoint?: string;
    /** Placeholder text for the input field */
    placeholder?: string;
    /** Callback when query result is received */
    onQueryResult?: (result: QueryResult) => void;
    /** Callback when query fails */
    onQueryError?: (error: Error) => void;
}
export declare function QueryInterface({ queryEndpoint, placeholder, onQueryResult, onQueryError, }: QueryInterfaceProps): import("react/jsx-runtime").JSX.Element;
//# sourceMappingURL=QueryInterface.d.ts.map