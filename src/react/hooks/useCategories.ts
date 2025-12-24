'use client';

import { useState, useEffect, useCallback, useMemo, useRef, type MutableRefObject } from 'react';
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
export function useCategories(options: UseCategoriesOptions = {}): UseCategoriesReturn {
  const {
    endpoint = '/api/rag',
    headers = {},
    autoFetch = true,
  } = options;

  // Core state
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Stabilize headers to prevent infinite rerenders from inline objects
  const headersJson = JSON.stringify(headers);
  const stableHeaders = useMemo(() => headers, [headersJson]);

  // AbortController ref to cancel in-flight requests
  const abortControllerRef = useRef<AbortController | null>(null);

  // Ref to store latest refetch to avoid infinite loop in auto-fetch effect
  const refetchRef = useRef<(() => Promise<void>) | null>(null);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      abortControllerRef.current?.abort();
    };
  }, []);

  // Fetch all categories
  const refetch = useCallback(async () => {
    // Abort any in-flight request
    abortControllerRef.current?.abort();
    abortControllerRef.current = new AbortController();

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`${endpoint}/categories`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...stableHeaders,
        },
        signal: abortControllerRef.current.signal,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Request failed: ${response.status}`);
      }

      const data = await response.json();
      // API returns { categories: Category[], count: number }
      setCategories(data.categories || []);
    } catch (err) {
      // Ignore abort errors - they're intentional
      if (err instanceof Error && err.name === 'AbortError') {
        return;
      }

      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch categories';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [endpoint, stableHeaders]);

  // Keep refetchRef updated
  refetchRef.current = refetch;

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
  }, [endpoint, stableHeaders]);

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
  }, [endpoint, stableHeaders]);

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
  }, [endpoint, stableHeaders]);

  // Get a category by ID (from local state)
  const getCategoryById = useCallback((id: string): Category | undefined => {
    return categories.find((cat) => cat.id === id);
  }, [categories]);

  // Auto-fetch on mount (use ref to avoid infinite loop)
  useEffect(() => {
    if (autoFetch) {
      refetchRef.current?.();
    }
  }, [autoFetch]);

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
