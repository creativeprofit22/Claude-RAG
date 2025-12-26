'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { FileText, ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';
import { DEFAULT_ACCENT_COLOR } from '../types.js';
import { LoadingDots } from './LoadingDots.js';
export function MessageBubble({ message, accentColor = DEFAULT_ACCENT_COLOR, showSources = true, }) {
    const isUser = message.role === 'user';
    const [sourcesExpanded, setSourcesExpanded] = useState(false);
    const time = message.timestamp.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
    });
    const sources = message.sources ?? [];
    const hasSources = showSources && sources.length > 0;
    return (_jsx("div", { className: `rag-message ${isUser ? 'rag-message-user' : 'rag-message-assistant'}`, children: _jsxs("div", { className: `rag-message-content ${isUser ? 'rag-message-content-user' : 'rag-message-content-assistant'}`, children: [_jsx("div", { className: `rag-message-bubble ${isUser ? 'rag-message-bubble-user' : 'rag-message-bubble-assistant'}`, style: isUser
                        ? {
                            boxShadow: `0 0 20px ${accentColor}15`,
                            borderColor: `${accentColor}20`,
                        }
                        : undefined, children: message.isLoading ? (_jsx("div", { className: "rag-message-loading", children: _jsx(LoadingDots, { accentColor: accentColor }) })) : (_jsx("p", { className: "rag-message-text", children: message.content })) }), hasSources && !message.isLoading && (_jsxs("div", { className: "rag-message-sources", children: [_jsxs("button", { onClick: () => setSourcesExpanded(!sourcesExpanded), className: "rag-sources-toggle", children: [_jsx(FileText, { size: 14 }), _jsxs("span", { children: [sources.length, " source", sources.length > 1 ? 's' : ''] }), sourcesExpanded ? _jsx(ChevronUp, { size: 14 }) : _jsx(ChevronDown, { size: 14 })] }), sourcesExpanded && (_jsx("div", { className: "rag-sources-list", children: sources.map((source, i) => (_jsxs("div", { className: "rag-source-item", children: [_jsxs("div", { className: "rag-source-header", children: [_jsxs("span", { className: "rag-source-badge", style: { backgroundColor: `${accentColor}20`, color: accentColor }, children: ["[", i + 1, "]"] }), _jsx("span", { className: "rag-source-name", children: source.documentName }), _jsxs("span", { className: "rag-source-chunk", children: ["Chunk ", source.chunkIndex] })] }), _jsx("p", { className: "rag-source-snippet", children: source.snippet })] }, `${source.documentId}-${source.chunkIndex}-${i}`))) }))] })), _jsx("span", { className: "rag-message-time", children: time })] }) }));
}
//# sourceMappingURL=MessageBubble.js.map