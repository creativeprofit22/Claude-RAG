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
export declare function useAPIResource<T>(options: UseAPIResourceOptions<T>): UseAPIResourceReturn<T>;
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
export declare function createApiMutation(options: CreateApiMutationOptions): <T>(config: MutationConfig) => Promise<T | null>;
export {};
//# sourceMappingURL=useAPIResource.d.ts.map