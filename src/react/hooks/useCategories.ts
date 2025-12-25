'use client';

import { useCallback, useMemo } from 'react';
import type { Category } from '../types.js';
import { useAPIResource, createApiMutation } from './useAPIResource.js';
import { validateApiArrayResponse } from './useDocuments.js';

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

// Category field validator
const validateCategoryItem = (c: Record<string, unknown>): void => {
  if (typeof c.id !== 'string' || typeof c.name !== 'string' || typeof c.color !== 'string') {
    throw new Error('Invalid category: missing required properties (id, name, color)');
  }
};

// Transform API response to extract categories array
const transformCategoriesResponse = (data: unknown): Category[] => {
  return validateApiArrayResponse<Category>(data, 'categories', validateCategoryItem);
};

/**
 * Hook for managing categories through the API.
 * Provides CRUD operations and local state management.
 */
export function useCategories(options: UseCategoriesOptions = {}): UseCategoriesReturn {
  const {
    endpoint = '/api/rag',
    headers = {},
    autoFetch = true,
  } = options;

  // Use base API resource hook for core fetching logic
  const {
    data: categories,
    isLoading,
    error,
    refetch,
    setData: setCategories,
    setError,
    stableHeaders,
  } = useAPIResource<Category>({
    fetchUrl: `${endpoint}/categories`,
    headers,
    autoFetch,
    transformResponse: transformCategoriesResponse,
  });

  // Create mutation executor for CRUD operations
  const mutate = useMemo(
    () => createApiMutation({ endpoint, stableHeaders, setError }),
    [endpoint, stableHeaders, setError]
  );

  // Create a new category
  const createCategory = useCallback(async (
    name: string,
    color: string,
    icon?: string
  ): Promise<Category | null> => {
    const data = await mutate<{ category: Category }>({
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
  const updateCategory = useCallback(async (
    id: string,
    updates: Partial<Omit<Category, 'id'>>
  ): Promise<Category | null> => {
    const data = await mutate<{ category: Category }>({
      path: `/categories/${encodeURIComponent(id)}`,
      method: 'PATCH',
      body: updates as Record<string, unknown>,
      errorMessage: 'Failed to update category',
    });

    if (data) {
      setCategories((prev) =>
        prev.map((cat) => (cat.id === id ? data.category : cat))
      );
      return data.category;
    }
    return null;
  }, [mutate, setCategories]);

  // Delete a category
  const deleteCategory = useCallback(async (id: string): Promise<boolean> => {
    const data = await mutate<{ success: boolean }>({
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
  const getCategoryById = useCallback((id: string): Category | undefined => {
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
