import type { Category } from '../../types.js';
export interface CategoryFilterProps {
    /** List of available categories */
    categories: Category[];
    /** Currently selected category ID (null for "All") */
    selected: string | null;
    /** Callback when selection changes */
    onChange: (categoryId: string | null) => void;
    /** Display mode: 'dropdown' or 'buttons' */
    mode?: 'dropdown' | 'buttons';
    /** Placeholder text for dropdown mode */
    placeholder?: string;
    /** Additional CSS class names */
    className?: string;
}
/**
 * Category filter component that allows filtering by a single category.
 * Supports dropdown or button group display modes.
 */
export declare function CategoryFilter({ categories, selected, onChange, mode, placeholder, className, }: CategoryFilterProps): import("react/jsx-runtime").JSX.Element;
export default CategoryFilter;
//# sourceMappingURL=CategoryFilter.d.ts.map