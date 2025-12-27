import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
/**
 * SettingsModal - Configure API keys and settings
 */
import { useState, useCallback, useEffect, useRef } from 'react';
import { X, Settings, Eye, EyeOff, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { useModal } from '../../hooks/useModal.js';
import { useApiKeyConfig } from '../../hooks/useApiKeyConfig.js';
export function SettingsModal({ isOpen, onClose, onConfigured, endpoint = '/api/rag', respondersEndpoint = '/api/responders', headers = {}, apiKeyState, }) {
    const { handleBackdropClick } = useModal({ onClose, isOpen });
    // Use provided state or fall back to internal hook (for standalone usage)
    const internalHookState = useApiKeyConfig({ endpoint, headers });
    const { apiKey, isConfigured, isLoading, error, saveApiKey } = apiKeyState ?? internalHookState;
    const [inputKey, setInputKey] = useState('');
    const [showKey, setShowKey] = useState(false);
    const [testResult, setTestResult] = useState(null);
    const [testLoading, setTestLoading] = useState(false);
    // AbortController ref for cleanup on unmount
    const abortRef = useRef(null);
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
        if (!inputKey.trim())
            return;
        // Abort any in-flight request
        abortRef.current?.abort();
        abortRef.current = new AbortController();
        setTestLoading(true);
        setTestResult(null);
        try {
            // First save the key
            const saved = await saveApiKey(inputKey.trim());
            if (!saved) {
                if (isMountedRef.current)
                    setTestResult('error');
                return;
            }
            // Then test by fetching responders
            const res = await fetch(respondersEndpoint, {
                headers,
                signal: abortRef.current.signal,
            });
            if (!isMountedRef.current)
                return;
            if (res.ok) {
                const data = await res.json();
                if (data.available?.gemini?.ready) {
                    setTestResult('success');
                }
                else {
                    setTestResult('error');
                }
            }
            else {
                setTestResult('error');
            }
        }
        catch (err) {
            if (err instanceof Error && err.name === 'AbortError')
                return;
            if (isMountedRef.current)
                setTestResult('error');
        }
        finally {
            if (isMountedRef.current)
                setTestLoading(false);
        }
    }, [inputKey, saveApiKey, respondersEndpoint, headers]);
    // Handle save
    const handleSave = useCallback(async () => {
        if (!inputKey.trim())
            return;
        const success = await saveApiKey(inputKey.trim());
        if (success) {
            onConfigured?.();
            onClose();
        }
    }, [inputKey, saveApiKey, onConfigured, onClose]);
    if (!isOpen)
        return null;
    return (_jsx("div", { className: "curator-overlay rag-upload-modal-overlay", onClick: handleBackdropClick, role: "dialog", "aria-modal": "true", "aria-labelledby": "settings-modal-title", children: _jsxs("div", { className: "rag-upload-modal", style: { maxWidth: '28rem' }, children: [_jsxs("div", { className: "rag-upload-modal-header", children: [_jsxs("div", { className: "rag-upload-modal-title-row", children: [_jsx(Settings, { size: 20 }), _jsx("h2", { id: "settings-modal-title", children: "Settings" })] }), _jsx("button", { type: "button", onClick: onClose, className: "rag-upload-modal-close", "aria-label": "Close", children: _jsx(X, { size: 20 }) })] }), _jsx("div", { className: "rag-upload-modal-content", children: _jsxs("div", { className: "rag-settings-section", children: [_jsxs("label", { className: "rag-settings-label", children: ["Gemini API Key", isConfigured && (_jsxs("span", { className: "rag-settings-configured", children: [_jsx(CheckCircle, { size: 12 }), "Configured"] }))] }), _jsxs("p", { id: "gemini-key-description", className: "rag-settings-description", children: ["Enter your Google AI API key for embeddings and fallback responses. Get one at", ' ', _jsx("a", { href: "https://aistudio.google.com/apikey", target: "_blank", rel: "noopener noreferrer", className: "rag-settings-link", children: "aistudio.google.com" })] }), _jsxs("div", { className: "rag-settings-input-wrapper", children: [_jsx("input", { type: showKey ? 'text' : 'password', value: inputKey, onChange: (e) => setInputKey(e.target.value), placeholder: "AIza...", className: "rag-settings-input", disabled: isLoading, "aria-describedby": "gemini-key-description" }), _jsx("button", { type: "button", onClick: () => setShowKey(!showKey), className: "rag-settings-toggle", "aria-label": showKey ? 'Hide key' : 'Show key', children: showKey ? _jsx(EyeOff, { size: 16 }) : _jsx(Eye, { size: 16 }) })] }), _jsx("button", { type: "button", onClick: handleTestConnection, disabled: !inputKey.trim() || testLoading, className: "rag-settings-test-btn", children: testLoading ? (_jsxs(_Fragment, { children: [_jsx(Loader2, { size: 14, className: "spin" }), "Testing..."] })) : ('Test Connection') }), testResult === 'success' && (_jsxs("div", { className: "rag-settings-result success", children: [_jsx(CheckCircle, { size: 14 }), "Connection successful! Gemini API is ready."] })), testResult === 'error' && (_jsxs("div", { className: "rag-settings-result error", children: [_jsx(AlertCircle, { size: 14 }), "Connection failed. Check your API key."] })), error && (_jsxs("div", { className: "rag-settings-result error", children: [_jsx(AlertCircle, { size: 14 }), error] }))] }) }), _jsxs("div", { className: "rag-upload-modal-footer", children: [_jsx("button", { type: "button", onClick: onClose, className: "rag-upload-modal-btn secondary", children: "Cancel" }), _jsx("button", { type: "button", onClick: handleSave, className: "rag-upload-modal-btn primary", disabled: !inputKey.trim() || isLoading, children: isLoading ? (_jsxs(_Fragment, { children: [_jsx(Loader2, { size: 16, className: "spin" }), "Saving..."] })) : ('Save') })] })] }) }));
}
export default SettingsModal;
//# sourceMappingURL=SettingsModal.js.map