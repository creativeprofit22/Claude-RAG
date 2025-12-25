'use client';

import { useCallback } from 'react';
import type { Category } from '../types.js';
import { useAPIResource } from './useAPIResource.js';

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

// Transform API response to extract categories array
const transformCategoriesResponse = (data: unknown): Category[] => {
  // Validate response shape before casting
  if (data === null || typeof data !== 'object') {
    throw new Error('Invalid API response: expected an object');
  }

  const response = data as Record<string, unknown>;

  // If no categories property, return empty array (valid empty state)
  if (!('categories' in response)) {
    return [];
  }

  if (!Array.isArray(response.categories)) {
    throw new Error('Invalid API response: categories must be an array');
  }

  // Validate each category has required properties
  for (const cat of response.categories) {
    if (typeof cat !== 'object' || cat === null) {
      throw new Error('Invalid category: expected an object');
    }
    const c = cat as Record<string, unknown>;
    if (typeof c.id !== 'string' || typeof c.name !== 'string' || typeof c.color !== 'string') {
      throw new Error('Invalid category: missing required properties (id, name, color)');
    }
  }

  return response.categories as Category[];
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

  // Create a new category
  const createCategory = useCallback(async (
    name: string,
    color: string,
    icon?: string
  ): Promise<Category | null> => {
    setError(null);

    try {
      const response = await fetch(`${endpoint}/categories`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...stableHeaders,
        },
        body: JSON.stringify({ name, color, icon }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Request failed: ${response.status}`);
      }

      const data = await response.json();
      const newCategory = data.category as Category;

      // Optimistically add to local state
      setCategories((prev) => [...prev, newCategory]);

      return newCategory;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create category';
      setError(errorMessage);
      return null;
    }
  }, [endpoint, stableHeaders, setCategories, setError]);

  // Update an existing category
  const updateCategory = useCallback(async (
    id: string,
    updates: Partial<Omit<Category, 'id'>>
  ): Promise<Category | null> => {
    setError(null);

    try {
      const response = await fetch(`${endpoint}/categories/${encodeURIComponent(id)}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          ...stableHeaders,
        },
        body: JSON.stringify(updates),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Request failed: ${response.status}`);
      }

      const data = await response.json();
      const updatedCategory = data.category as Category;

      // Update local state
      setCategories((prev) =>
        prev.map((cat) => (cat.id === id ? updatedCategory : cat))
      );

      return updatedCategory;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update category';
      setError(errorMessage);
      return null;
    }
  }, [endpoint, stableHeaders, setCategories, setError]);

  // Delete a category
  const deleteCategory = useCallback(async (id: string): Promise<boolean> => {
    setError(null);

    try {
      const response = await fetch(`${endpoint}/categories/${encodeURIComponent(id)}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          ...stableHeaders,
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Request failed: ${response.status}`);
      }

      // Optimistically remove from local state
      setCategories((prev) => prev.filter((cat) => cat.id !== id));

      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete category';
      setError(errorMessage);
      return false;
    }
  }, [endpoint, stableHeaders, setCategories, setError]);

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
