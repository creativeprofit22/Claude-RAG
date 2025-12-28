'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { FileText, ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';
import { m, AnimatePresence } from 'framer-motion';
import { DEFAULT_ACCENT_COLOR } from '../types.js';
import { LoadingDots } from './LoadingDots.js';
import { useSkinMotion } from '../motion/hooks/useSkinMotion.js';
export function MessageBubble({ message, accentColor = DEFAULT_ACCENT_COLOR, showSources = true, }) {
    const isUser = message.role === 'user';
    const [sourcesExpanded, setSourcesExpanded] = useState(false);
    const { motion } = useSkinMotion();
    const time = message.timestamp.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
    });
    const sources = message.sources ?? [];
    const hasSources = showSources && sources.length > 0;
    return (_jsx(m.div, { className: `rag-message ${isUser ? 'rag-message-user' : 'rag-message-assistant'}`, initial: "hidden", animate: "visible", exit: "exit", variants: motion.message, children: _jsxs("div", { className: `rag-message-content ${isUser ? 'rag-message-content-user' : 'rag-message-content-assistant'}`, children: [_jsx("div", { className: `rag-message-bubble ${isUser ? 'rag-message-bubble-user' : 'rag-message-bubble-assistant'}`, style: isUser
                        ? {
                            boxShadow: `0 0 20px ${accentColor}15`,
                            borderColor: `${accentColor}20`,
                        }
                        : undefined, children: message.isLoading ? (_jsx("div", { className: "rag-message-loading", children: _jsx(LoadingDots, { accentColor: accentColor }) })) : (_jsx("p", { className: "rag-message-text", children: message.content })) }), hasSources && !message.isLoading && (_jsxs("div", { className: "rag-message-sources", children: [_jsxs("button", { onClick: () => setSourcesExpanded(!sourcesExpanded), className: "rag-sources-toggle", children: [_jsx(FileText, { size: 14 }), _jsxs("span", { children: [sources.length, " source", sources.length > 1 ? 's' : ''] }), sourcesExpanded ? _jsx(ChevronUp, { size: 14 }) : _jsx(ChevronDown, { size: 14 })] }), _jsx(AnimatePresence, { children: sourcesExpanded && (_jsx(m.div, { className: "rag-sources-list", initial: { height: 0, opacity: 0 }, animate: { height: 'auto', opacity: 1 }, exit: { height: 0, opacity: 0 }, transition: motion.transition.default, children: sources.map((source, i) => (_jsxs(m.div, { className: "rag-source-item", initial: { opacity: 0, x: -10 }, animate: { opacity: 1, x: 0 }, transition: { ...motion.transition.fast, delay: i * motion.stagger.children }, children: [_jsxs("div", { className: "rag-source-header", children: [_jsxs("span", { className: "rag-source-badge", style: { backgroundColor: `${accentColor}20`, color: accentColor }, children: ["[", i + 1, "]"] }), _jsx("span", { className: "rag-source-name", children: source.documentName }), _jsxs("span", { className: "rag-source-chunk", children: ["Chunk ", source.chunkIndex] })] }), _jsx("p", { className: "rag-source-snippet", children: source.snippet })] }, `${source.documentId}-${source.chunkIndex}-${i}`))) })) })] })), _jsx(m.span, { className: "rag-message-time", initial: { opacity: 0 }, animate: { opacity: 1 }, transition: { ...motion.transition.slow, delay: 0.3 }, children: time })] }) }));
}
//# sourceMappingURL=MessageBubble.js.map