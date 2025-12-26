/**
 * SettingsModal - Configure API keys and settings
 */

import React, { useState, useCallback, useEffect, useRef } from 'react';
import { X, Settings, Eye, EyeOff, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { useModal } from '../../hooks/useModal.js';
import { useApiKeyConfig } from '../../hooks/useApiKeyConfig.js';

/** API key state from useApiKeyConfig hook - pass to avoid duplicate hook calls */
export interface ApiKeyState {
  apiKey: string;
  isConfigured: boolean;
  isLoading: boolean;
  error: string | null;
  saveApiKey: (key: string) => Promise<boolean>;
  clearLocalKey: () => void;
  checkStatus: () => Promise<void>;
}

export interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfigured?: () => void;
  endpoint?: string;
  /** Responders endpoint for testing connection (default: /api/responders) */
  respondersEndpoint?: string;
  headers?: Record<string, string>;
  /** Pre-initialized API key state (avoids duplicate hook instance) */
  apiKeyState?: ApiKeyState;
}

export function SettingsModal({
  isOpen,
  onClose,
  onConfigured,
  endpoint = '/api/rag',
  respondersEndpoint = '/api/responders',
  headers = {},
  apiKeyState,
}: SettingsModalProps): React.ReactElement | null {
  const { handleBackdropClick } = useModal({ onClose, isOpen });

  // Use provided state or fall back to internal hook (for standalone usage)
  const internalHookState = useApiKeyConfig({ endpoint, headers });
  const { apiKey, isConfigured, isLoading, error, saveApiKey } = apiKeyState ?? internalHookState;

  const [inputKey, setInputKey] = useState('');
  const [showKey, setShowKey] = useState(false);
  const [testResult, setTestResult] = useState<'success' | 'error' | null>(null);
  const [testLoading, setTestLoading] = useState(false);

  // AbortController ref for cleanup on unmount
  const abortRef = useRef<AbortController | null>(null);
  const isMountedRef = useRef(true);

  // Track mounted state for async operations
  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
      abortRef.current?.abort();
    };
  }, []);

  // Pre-fill input when modal opens
  useEffect(() => {
    if (isOpen) {
      setInputKey(apiKey);
      setTestResult(null);
    }
  }, [isOpen, apiKey]);

  // Test connection by calling responders endpoint
  const handleTestConnection = useCallback(async () => {
    if (!inputKey.trim()) return;

    // Abort any in-flight request
    abortRef.current?.abort();
    abortRef.current = new AbortController();

    setTestLoading(true);
    setTestResult(null);

    try {
      // First save the key
      const saved = await saveApiKey(inputKey.trim());
      if (!saved) {
        if (isMountedRef.current) setTestResult('error');
        return;
      }

      // Then test by fetching responders
      const res = await fetch(respondersEndpoint, {
        headers,
        signal: abortRef.current.signal,
      });

      if (!isMountedRef.current) return;

      if (res.ok) {
        const data = await res.json();
        if (data.available?.gemini?.ready) {
          setTestResult('success');
        } else {
          setTestResult('error');
        }
      } else {
        setTestResult('error');
      }
    } catch (err) {
      if (err instanceof Error && err.name === 'AbortError') return;
      if (isMountedRef.current) setTestResult('error');
    } finally {
      if (isMountedRef.current) setTestLoading(false);
    }
  }, [inputKey, saveApiKey, respondersEndpoint, headers]);

  // Handle save
  const handleSave = useCallback(async () => {
    if (!inputKey.trim()) return;

    const success = await saveApiKey(inputKey.trim());
    if (success) {
      onConfigured?.();
      onClose();
    }
  }, [inputKey, saveApiKey, onConfigured, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="rag-upload-modal-overlay"
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="settings-modal-title"
    >
      <div className="rag-upload-modal" style={{ maxWidth: '28rem' }}>
        {/* Header */}
        <div className="rag-upload-modal-header">
          <div className="rag-upload-modal-title-row">
            <Settings size={20} />
            <h2 id="settings-modal-title">Settings</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rag-upload-modal-close"
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="rag-upload-modal-content">
          <div className="rag-settings-section">
            <label className="rag-settings-label">
              Gemini API Key
              {isConfigured && (
                <span className="rag-settings-configured">
                  <CheckCircle size={12} />
                  Configured
                </span>
              )}
            </label>
            <p id="gemini-key-description" className="rag-settings-description">
              Enter your Google AI API key for embeddings and fallback responses.
              Get one at{' '}
              <a
                href="https://aistudio.google.com/apikey"
                target="_blank"
                rel="noopener noreferrer"
                className="rag-settings-link"
              >
                aistudio.google.com
              </a>
            </p>
            <div className="rag-settings-input-wrapper">
              <input
                type={showKey ? 'text' : 'password'}
                value={inputKey}
                onChange={(e) => setInputKey(e.target.value)}
                placeholder="AIza..."
                className="rag-settings-input"
                disabled={isLoading}
                aria-describedby="gemini-key-description"
              />
              <button
                type="button"
                onClick={() => setShowKey(!showKey)}
                className="rag-settings-toggle"
                aria-label={showKey ? 'Hide key' : 'Show key'}
              >
                {showKey ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>

            {/* Test Connection */}
            <button
              type="button"
              onClick={handleTestConnection}
              disabled={!inputKey.trim() || testLoading}
              className="rag-settings-test-btn"
            >
              {testLoading ? (
                <>
                  <Loader2 size={14} className="spin" />
                  Testing...
                </>
              ) : (
                'Test Connection'
              )}
            </button>

            {/* Test Result */}
            {testResult === 'success' && (
              <div className="rag-settings-result success">
                <CheckCircle size={14} />
                Connection successful! Gemini API is ready.
              </div>
            )}
            {testResult === 'error' && (
              <div className="rag-settings-result error">
                <AlertCircle size={14} />
                Connection failed. Check your API key.
              </div>
            )}
            {error && (
              <div className="rag-settings-result error">
                <AlertCircle size={14} />
                {error}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="rag-upload-modal-footer">
          <button
            type="button"
            onClick={onClose}
            className="rag-upload-modal-btn secondary"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="rag-upload-modal-btn primary"
            disabled={!inputKey.trim() || isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 size={16} className="spin" />
                Saving...
              </>
            ) : (
              'Save'
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export default SettingsModal;
