import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
/**
 * ApiKeyConfigBar - Compact bar for Gemini API key configuration
 * Shows status and opens SettingsModal for configuration
 */
import { useState } from 'react';
import { Settings, CheckCircle, AlertCircle } from 'lucide-react';
import { useApiKeyConfig } from '../../hooks/useApiKeyConfig.js';
import { SettingsModal } from './SettingsModal.js';
export function ApiKeyConfigBar({ endpoint = '/api/rag', respondersEndpoint = '/api/responders', headers = {}, }) {
    const { apiKey, isConfigured, isLoading, error, saveApiKey, clearLocalKey, checkStatus } = useApiKeyConfig({ endpoint, headers });
    const [isModalOpen, setIsModalOpen] = useState(false);
    return (_jsxs(_Fragment, { children: [_jsxs("div", { className: "rag-api-config-bar", children: [_jsx("div", { className: "rag-api-config-info", children: isConfigured ? (_jsxs(_Fragment, { children: [_jsx(CheckCircle, { size: 14, className: "rag-api-config-icon configured" }), _jsx("span", { className: "rag-api-config-text", children: "Gemini API configured" })] })) : (_jsxs(_Fragment, { children: [_jsx(AlertCircle, { size: 14, className: "rag-api-config-icon not-configured" }), _jsx("span", { className: "rag-api-config-text", children: "Gemini API not configured" })] })) }), _jsxs("button", { className: "rag-api-config-btn", onClick: () => setIsModalOpen(true), children: [_jsx(Settings, { size: 14 }), isConfigured ? 'Update API Key' : 'Configure API Key'] })] }), _jsx(SettingsModal, { isOpen: isModalOpen, onClose: () => setIsModalOpen(false), onConfigured: checkStatus, endpoint: endpoint, respondersEndpoint: respondersEndpoint, headers: headers, apiKeyState: { apiKey, isConfigured, isLoading, error, saveApiKey, clearLocalKey, checkStatus } })] }));
}
export default ApiKeyConfigBar;
//# sourceMappingURL=ApiKeyConfigBar.js.map