'use client';

import { useState, useEffect, useCallback, useMemo, useRef } from 'react';

interface UseAPIResourceOptions<T> {
  /** API endpoint URL for fetching the resource */
  fetchUrl: string;
  /** Custom headers for API requests */
  headers?: Record<string, string>;
  /** Auto-fetch on mount (default: true) */
  autoFetch?: boolean;
  /** Transform the API response to extract the data array */
  transformResponse: (data: unknown) => T[];
}

interface UseAPIResourceReturn<T> {
  /** List of resources */
  data: T[];
  /** Loading state */
  isLoading: boolean;
  /** Error message if any */
  error: string | null;
  /** Refetch from server */
  refetch: () => Promise<void>;
  /** Set data directly (for optimistic updates) */
  setData: React.Dispatch<React.SetStateAction<T[]>>;
  /** Set error directly */
  setError: React.Dispatch<React.SetStateAction<string | null>>;
  /** Stable headers reference */
  stableHeaders: Record<string, string>;
}

/**
 * Base hook for API resource fetching with common patterns:
 * - AbortController for request cancellation
 * - Headers stabilization via useMemo + JSON.stringify
 * - refetchRef pattern to avoid infinite loops
 * - Error handling with AbortError filtering
 * - Loading state management
 */
export function useAPIResource<T>(options: UseAPIResourceOptions<T>): UseAPIResourceReturn<T> {
  const {
    fetchUrl,
    headers = {},
    autoFetch = true,
    transformResponse,
  } = options;

  // Core state
  const [data, setData] = useState<T[]>([]);
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

  // Fetch resource
  const refetch = useCallback(async () => {
    // Abort any in-flight request
    abortControllerRef.current?.abort();
    abortControllerRef.current = new AbortController();

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(fetchUrl, {
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

      const responseData = await response.json();
      setData(transformResponse(responseData));
    } catch (err) {
      // Ignore abort errors - they're intentional
      if (err instanceof Error && err.name === 'AbortError') {
        return;
      }

      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch data';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [fetchUrl, stableHeaders, transformResponse]);

  // Keep refetchRef updated
  refetchRef.current = refetch;

  // Auto-fetch on mount (use ref to avoid infinite loop)
  useEffect(() => {
    if (autoFetch) {
      refetchRef.current?.();
    }
  }, [autoFetch]);

  return {
    data,
    isLoading,
    error,
    refetch,
    setData,
    setError,
    stableHeaders,
  };
}

/**
 * Options for creating an API mutation function
 */
interface CreateApiMutationOptions {
  /** Base API endpoint URL */
  endpoint: string;
  /** Stable headers from useAPIResource */
  stableHeaders: Record<string, string>;
  /** Error setter from useAPIResource */
  setError: React.Dispatch<React.SetStateAction<string | null>>;
}

/**
 * Configuration for a specific mutation call
 */
interface MutationConfig {
  /** URL path segment to append to endpoint */
  path: string;
  /** HTTP method */
  method: 'POST' | 'PATCH' | 'DELETE';
  /** Request body (will be JSON.stringify'd) */
  body?: Record<string, unknown>;
  /** Default error message if request fails */
  errorMessage: string;
}

/**
 * Create a reusable mutation executor that handles common fetch patterns:
 * - Error clearing before request
 * - JSON headers and body handling
 * - Error response parsing
 * - Error state management
 *
 * Returns the JSON response on success, or null on failure.
 */
export function createApiMutation(options: CreateApiMutationOptions) {
  const { endpoint, stableHeaders, setError } = options;

  return async <T>(config: MutationConfig): Promise<T | null> => {
    const { path, method, body, errorMessage } = config;
    setError(null);

    try {
      const response = await fetch(`${endpoint}${path}`, {
        method,
        headers: {
          'Content-Type': 'application/json',
          ...stableHeaders,
        },
        ...(body && { body: JSON.stringify(body) }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Request failed: ${response.status}`);
      }

      return await response.json() as T;
    } catch (err) {
      const message = err instanceof Error ? err.message : errorMessage;
      setError(message);
      return null;
    }
  };
}
