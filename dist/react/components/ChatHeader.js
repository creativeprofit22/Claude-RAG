'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Trash2, Database } from 'lucide-react';
import { DEFAULT_ACCENT_COLOR } from '../types.js';
export function ChatHeader({ title = 'RAG Assistant', accentColor = DEFAULT_ACCENT_COLOR, isTyping = false, messageCount = 0, onClearChat, }) {
    return (_jsx("div", { className: "rag-chat-header", children: _jsxs("div", { className: "rag-chat-header-content", children: [_jsxs("div", { className: "rag-chat-header-info", children: [_jsx("div", { className: "rag-chat-header-icon", style: { boxShadow: `0 0 20px ${accentColor}20` }, children: _jsx(Database, { size: 20, style: { color: accentColor }, "aria-hidden": "true" }) }), _jsxs("div", { children: [_jsx("h3", { className: "rag-chat-header-title", children: title }), _jsx("p", { className: "rag-chat-header-status", children: isTyping ? 'Thinking...' : 'Ready' })] })] }), messageCount > 0 && onClearChat && (_jsx("button", { type: "button", onClick: onClearChat, className: "rag-chat-header-clear", title: "Clear chat", children: _jsx(Trash2, { size: 16, "aria-hidden": "true" }) }))] }) }));
}
//# sourceMappingURL=ChatHeader.js.map