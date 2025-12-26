/**
 * ApiKeyConfigBar - Compact bar for Gemini API key configuration
 * Shows status and opens SettingsModal for configuration
 */

import React, { useState } from 'react';
import { Settings, CheckCircle, AlertCircle } from 'lucide-react';
import { useApiKeyConfig } from '../../hooks/useApiKeyConfig.js';
import { SettingsModal } from './SettingsModal.js';

export interface ApiKeyConfigBarProps {
  endpoint?: string;
  /** Responders endpoint for testing connection (default: /api/responders) */
  respondersEndpoint?: string;
  headers?: Record<string, string>;
}

export function ApiKeyConfigBar({
  endpoint = '/api/rag',
  respondersEndpoint = '/api/responders',
  headers = {},
}: ApiKeyConfigBarProps): React.ReactElement {
  const { apiKey, isConfigured, isLoading, error, saveApiKey, clearLocalKey, checkStatus } = useApiKeyConfig({ endpoint, headers });
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <div className="rag-api-config-bar">
        <div className="rag-api-config-info">
          {isConfigured ? (
            <>
              <CheckCircle size={14} className="rag-api-config-icon configured" />
              <span className="rag-api-config-text">Gemini API configured</span>
            </>
          ) : (
            <>
              <AlertCircle size={14} className="rag-api-config-icon not-configured" />
              <span className="rag-api-config-text">Gemini API not configured</span>
            </>
          )}
        </div>
        <button
          className="rag-api-config-btn"
          onClick={() => setIsModalOpen(true)}
        >
          <Settings size={14} />
          {isConfigured ? 'Update API Key' : 'Configure API Key'}
        </button>
      </div>

      <SettingsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfigured={checkStatus}
        endpoint={endpoint}
        respondersEndpoint={respondersEndpoint}
        headers={headers}
        apiKeyState={{ apiKey, isConfigured, isLoading, error, saveApiKey, clearLocalKey, checkStatus }}
      />
    </>
  );
}

export default ApiKeyConfigBar;
