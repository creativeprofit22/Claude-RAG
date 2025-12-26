interface UseApiKeyConfigOptions {
    /** Base API endpoint (default: /api/rag) */
    endpoint?: string;
    /** Custom headers for API requests */
    headers?: Record<string, string>;
}
interface UseApiKeyConfigReturn {
    /** Current API key (from localStorage) */
    apiKey: string;
    /** Whether the server has a key configured */
    isConfigured: boolean;
    /** Loading state */
    isLoading: boolean;
    /** Error message */
    error: string | null;
    /** Save API key to server and localStorage */
    saveApiKey: (key: string) => Promise<boolean>;
    /** Clear API key from localStorage (doesn't affect server) */
    clearLocalKey: () => void;
    /** Check server status */
    checkStatus: () => Promise<void>;
}
/**
 * Hook for managing Gemini API key configuration
 * - Stores key in localStorage for persistence
 * - Syncs with server via POST /api/rag/config/gemini-key
 * - Checks status via GET /api/rag/config/gemini-key/status
 */
export declare function useApiKeyConfig(options?: UseApiKeyConfigOptions): UseApiKeyConfigReturn;
export {};
//# sourceMappingURL=useApiKeyConfig.d.ts.map