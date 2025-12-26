'use client';
import { useCallback, useMemo } from 'react';
import { useAPIResource, createApiMutation } from './useAPIResource.js';
import { validateApiArrayResponse } from './useDocuments.js';
// Category field validator
const validateCategoryItem = (c) => {
    if (typeof c.id !== 'string' || typeof c.name !== 'string' || typeof c.color !== 'string') {
        throw new Error('Invalid category: missing required properties (id, name, color)');
    }
};
// Transform API response to extract categories array
const transformCategoriesResponse = (data) => {
    return validateApiArrayResponse(data, 'categories', validateCategoryItem);
};
/**
 * Hook for managing categories through the API.
 * Provides CRUD operations and local state management.
 */
export function useCategories(options = {}) {
    const { endpoint = '/api/rag', headers = {}, autoFetch = true, } = options;
    // Use base API resource hook for core fetching logic
    const { data: categories, isLoading, error, refetch, setData: setCategories, setError, stableHeaders, } = useAPIResource({
        fetchUrl: `${endpoint}/categories`,
        headers,
        autoFetch,
        transformResponse: transformCategoriesResponse,
    });
    // Create mutation executor for CRUD operations
    const mutate = useMemo(() => createApiMutation({ endpoint, stableHeaders, setError }), [endpoint, stableHeaders, setError]);
    // Create a new category
    const createCategory = useCallback(async (name, color, icon) => {
        const data = await mutate({
            path: '/categories',
            method: 'POST',
            body: { name, color, icon },
            errorMessage: 'Failed to create category',
        });
        if (data) {
            setCategories((prev) => [...prev, data.category]);
            return data.category;
        }
        return null;
    }, [mutate, setCategories]);
    // Update an existing category
    const updateCategory = useCallback(async (id, updates) => {
        const data = await mutate({
            path: `/categories/${encodeURIComponent(id)}`,
            method: 'PATCH',
            body: updates,
            errorMessage: 'Failed to update category',
        });
        if (data) {
            setCategories((prev) => prev.map((cat) => (cat.id === id ? data.category : cat)));
            return data.category;
        }
        return null;
    }, [mutate, setCategories]);
    // Delete a category
    const deleteCategory = useCallback(async (id) => {
        const data = await mutate({
            path: `/categories/${encodeURIComponent(id)}`,
            method: 'DELETE',
            errorMessage: 'Failed to delete category',
        });
        if (data) {
            setCategories((prev) => prev.filter((cat) => cat.id !== id));
            return true;
        }
        return false;
    }, [mutate, setCategories]);
    // Get a category by ID (from local state)
    const getCategoryById = useCallback((id) => {
        return categories.find((cat) => cat.id === id);
    }, [categories]);
    return {
        categories,
        isLoading,
        error,
        refetch,
        createCategory,
        updateCategory,
        deleteCategory,
        getCategoryById,
    };
}
export default useCategories;
//# sourceMappingURL=useCategories.js.map