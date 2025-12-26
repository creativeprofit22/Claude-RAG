import type { Category } from '../types.js';
interface UseCategoriesOptions {
    /** API endpoint base URL (default: /api/rag) */
    endpoint?: string;
    /** Custom headers for API requests */
    headers?: Record<string, string>;
    /** Auto-fetch categories on mount (default: true) */
    autoFetch?: boolean;
}
interface UseCategoriesReturn {
    /** List of all categories */
    categories: Category[];
    /** Loading state */
    isLoading: boolean;
    /** Error message if any */
    error: string | null;
    /** Refetch categories from server */
    refetch: () => Promise<void>;
    /** Create a new category */
    createCategory: (name: string, color: string, icon?: string) => Promise<Category | null>;
    /** Update an existing category */
    updateCategory: (id: string, updates: Partial<Omit<Category, 'id'>>) => Promise<Category | null>;
    /** Delete a category */
    deleteCategory: (id: string) => Promise<boolean>;
    /** Get a category by ID */
    getCategoryById: (id: string) => Category | undefined;
}
/**
 * Hook for managing categories through the API.
 * Provides CRUD operations and local state management.
 */
export declare function useCategories(options?: UseCategoriesOptions): UseCategoriesReturn;
export default useCategories;
//# sourceMappingURL=useCategories.d.ts.map