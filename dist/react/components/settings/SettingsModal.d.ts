/**
 * SettingsModal - Configure API keys and settings
 */
import React from 'react';
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
export declare function SettingsModal({ isOpen, onClose, onConfigured, endpoint, respondersEndpoint, headers, apiKeyState, }: SettingsModalProps): React.ReactElement | null;
export default SettingsModal;
//# sourceMappingURL=SettingsModal.d.ts.map