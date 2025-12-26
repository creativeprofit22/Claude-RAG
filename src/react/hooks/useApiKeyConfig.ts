'use client';

import { useState, useEffect, useCallback, useRef, useMemo } from 'react';

const STORAGE_KEY = 'rag-gemini-api-key';
const EMPTY_HEADERS: Record<string, string> = {};

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
export function useApiKeyConfig(options: UseApiKeyConfigOptions = {}): UseApiKeyConfigReturn {
  const { endpoint = '/api/rag', headers } = options;
  // Memoize headers to prevent infinite re-render loops from object reference changes
  const stableHeaders = useMemo(() => headers ?? EMPTY_HEADERS, [headers]);

  const [apiKey, setApiKey] = useState<string>('');
  const [isConfigured, setIsConfigured] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const abortRef = useRef<AbortController | null>(null);

  // Load from localStorage on mount (with error handling for private browsing)
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setApiKey(stored);
      }
    } catch {
      // localStorage may be unavailable (private browsing, etc.)
    }
  }, []);

  // Check server status
  const checkStatus = useCallback(async () => {
    abortRef.current?.abort();
    abortRef.current = new AbortController();

    try {
      const res = await fetch(`${endpoint}/config/gemini-key/status`, {
        headers: stableHeaders,
        signal: abortRef.current.signal,
      });
      if (res.ok) {
        const data = await res.json();
        setIsConfigured(data.configured);
      }
    } catch (err) {
      if (err instanceof Error && err.name !== 'AbortError') {
        console.error('Failed to check API key status:', err);
      }
    }
  }, [endpoint, stableHeaders]);

  // Check status on mount
  useEffect(() => {
    checkStatus();
    return () => abortRef.current?.abort();
  }, [checkStatus]);

  // Cross-tab localStorage sync
  useEffect(() => {
    const handleStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY) {
        setApiKey(e.newValue || '');
        // Re-check server status when key changes in another tab
        checkStatus();
      }
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, [checkStatus]);

  // Save API key to server
  const saveApiKey = useCallback(async (key: string): Promise<boolean> => {
    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch(`${endpoint}/config/gemini-key`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...stableHeaders,
        },
        body: JSON.stringify({ apiKey: key }),
      });

      // Handle non-JSON responses gracefully
      let data: { error?: string };
      try {
        data = await res.json();
      } catch {
        data = { error: `Server error: ${res.status} ${res.statusText}` };
      }

      if (!res.ok) {
        setError(data.error || 'Failed to save API key');
        return false;
      }

      // Save to localStorage on success (with error handling)
      try {
        localStorage.setItem(STORAGE_KEY, key);
      } catch {
        // localStorage may be unavailable
      }
      setApiKey(key);
      setIsConfigured(true);
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save API key');
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [endpoint, stableHeaders]);

  // Clear local key
  const clearLocalKey = useCallback(() => {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // localStorage may be unavailable
    }
    setApiKey('');
  }, []);

  return {
    apiKey,
    isConfigured,
    isLoading,
    error,
    saveApiKey,
    clearLocalKey,
    checkStatus,
  };
}
