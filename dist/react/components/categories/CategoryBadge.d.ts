import type { Category } from '../../types.js';
export interface CategoryBadgeProps {
    /** The category to display */
    category: Category;
    /** Size variant of the badge */
    size?: 'sm' | 'md';
    /** Callback when remove button is clicked. If provided, shows X button. */
    onRemove?: () => void;
    /** Additional CSS class names */
    className?: string;
}
/**
 * Small colored badge displaying a category name.
 * Optionally shows an X button to remove the category.
 */
export declare function CategoryBadge({ category, size, onRemove, className, }: CategoryBadgeProps): import("react/jsx-runtime").JSX.Element;
export default CategoryBadge;
//# sourceMappingURL=CategoryBadge.d.ts.map