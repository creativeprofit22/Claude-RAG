'use client';
import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
/**
 * Base hook for API resource fetching with common patterns:
 * - AbortController for request cancellation
 * - Headers stabilization via useMemo + JSON.stringify
 * - refetchRef pattern to avoid infinite loops
 * - Error handling with AbortError filtering
 * - Loading state management
 */
export function useAPIResource(options) {
    const { fetchUrl, headers = {}, autoFetch = true, transformResponse, } = options;
    // Core state
    const [data, setData] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    // Stabilize headers to prevent infinite rerenders from inline objects.
    // Problem: Inline `headers={{ key: 'value' }}` creates new object each render,
    // causing useCallback/useEffect to re-run infinitely.
    // Solution: JSON.stringify creates a primitive key for useMemo comparison,
    // so stableHeaders only updates when actual header content changes.
    const headersJson = JSON.stringify(headers);
    const stableHeaders = useMemo(() => headers, [headersJson]);
    // AbortController ref to cancel in-flight requests
    const abortControllerRef = useRef(null);
    // Ref to store latest refetch to avoid infinite loop in auto-fetch effect
    const refetchRef = useRef(null);
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
        }
        catch (err) {
            // Ignore abort errors - they're intentional
            if (err instanceof Error && err.name === 'AbortError') {
                return;
            }
            const errorMessage = err instanceof Error ? err.message : 'Failed to fetch data';
            setError(errorMessage);
        }
        finally {
            setIsLoading(false);
        }
    }, [fetchUrl, stableHeaders, transformResponse]);
    // Keep refetchRef updated
    refetchRef.current = refetch;
    // Auto-fetch on mount and when fetchUrl changes (use ref to avoid infinite loop from refetch identity changes)
    useEffect(() => {
        if (autoFetch) {
            refetchRef.current?.();
        }
    }, [autoFetch, fetchUrl]);
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
 * Create a reusable mutation executor that handles common fetch patterns:
 * - Error clearing before request
 * - JSON headers and body handling
 * - Error response parsing
 * - Error state management
 *
 * Returns the JSON response on success, or null on failure.
 */
export function createApiMutation(options) {
    const { endpoint, stableHeaders, setError } = options;
    return async (config) => {
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
            return await response.json();
        }
        catch (err) {
            const message = err instanceof Error ? err.message : errorMessage;
            setError(message);
            return null;
        }
    };
}
//# sourceMappingURL=useAPIResource.js.map