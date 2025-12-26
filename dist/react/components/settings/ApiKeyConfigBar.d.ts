/**
 * ApiKeyConfigBar - Compact bar for Gemini API key configuration
 * Shows status and opens SettingsModal for configuration
 */
import React from 'react';
export interface ApiKeyConfigBarProps {
    endpoint?: string;
    /** Responders endpoint for testing connection (default: /api/responders) */
    respondersEndpoint?: string;
    headers?: Record<string, string>;
}
export declare function ApiKeyConfigBar({ endpoint, respondersEndpoint, headers, }: ApiKeyConfigBarProps): React.ReactElement;
export default ApiKeyConfigBar;
//# sourceMappingURL=ApiKeyConfigBar.d.ts.map