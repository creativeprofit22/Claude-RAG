export interface DocumentSearchProps {
    value: string;
    onChange: (value: string) => void;
    sortBy: 'name' | 'date' | 'chunks';
    onSortByChange: (sort: 'name' | 'date' | 'chunks') => void;
    sortOrder: 'asc' | 'desc';
    onSortOrderChange: (order: 'asc' | 'desc') => void;
    placeholder?: string;
}
/**
 * DocumentSearch - Search input with sort controls
 */
export declare function DocumentSearch({ value, onChange, sortBy, onSortByChange, sortOrder, onSortOrderChange, placeholder, }: DocumentSearchProps): import("react/jsx-runtime").JSX.Element;
//# sourceMappingURL=DocumentSearch.d.ts.map