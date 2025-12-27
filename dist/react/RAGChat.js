'use client';
import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useRef, useEffect } from 'react';
import { Database, X, AlertCircle } from 'lucide-react';
import { ChatHeader } from './components/ChatHeader.js';
import { ChatInput } from './components/ChatInput.js';
import { MessageBubble } from './components/MessageBubble.js';
import { TypingIndicator } from './components/TypingIndicator.js';
import { useRAGChat } from './hooks/useRAGChat.js';
import { DEFAULT_ACCENT_COLOR } from './types.js';
/**
 * RAGChat - Drop-in chat interface for Claude RAG
 *
 * @example
 * ```tsx
 * import { RAGChat } from 'claude-rag/react';
 *
 * // Basic usage
 * <RAGChat endpoint="http://localhost:3000/api/rag/query" />
 *
 * // With customization
 * <RAGChat
 *   endpoint="/api/rag/query"
 *   title="Document Assistant"
 *   accentColor="#10b981"
 *   placeholder="Ask about your documents..."
 *   showSources={true}
 * />
 * ```
 */
export function RAGChat({ endpoint = '/api/rag/query', headers, placeholder = 'Ask a question about your documents...', title = 'RAG Assistant', accentColor = DEFAULT_ACCENT_COLOR, showSources = true, systemPrompt, topK, documentId, responder, className = '', emptyState, }) {
    const messagesContainerRef = useRef(null);
    const { messages, isTyping, error, sendMessage, clearChat, setError, } = useRAGChat({
        endpoint,
        headers,
        systemPrompt,
        topK,
        documentId,
        responder,
    });
    // Auto-scroll to bottom when messages change.
    // Uses hybrid ref+deps pattern: refs track previous values between renders,
    // deps array triggers effect when relevant values change. This prevents scrolling
    // on every render while still catching new messages and typing state transitions.
    // Initialize to 0 so component scrolls on mount if there are existing messages.
    const lastMessageCountRef = useRef(0);
    const wasTypingRef = useRef(isTyping);
    useEffect(() => {
        // Only scroll if message count increased OR isTyping transitioned to true
        const messageCountIncreased = messages.length > lastMessageCountRef.current;
        const typingStarted = isTyping && !wasTypingRef.current;
        const shouldScroll = messageCountIncreased || typingStarted;
        lastMessageCountRef.current = messages.length;
        wasTypingRef.current = isTyping;
        if (shouldScroll && messagesContainerRef.current) {
            // Scroll container directly to avoid scrollIntoView affecting the whole page
            requestAnimationFrame(() => {
                const container = messagesContainerRef.current;
                if (container) {
                    container.scrollTop = container.scrollHeight;
                }
            });
        }
    }, [messages.length, isTyping]);
    const defaultEmptyState = (_jsxs("div", { className: "rag-empty-state", children: [_jsx("div", { className: "rag-empty-icon", style: { boxShadow: `0 0 30px ${accentColor}15` }, children: _jsx(Database, { size: 48, style: { color: accentColor }, "aria-hidden": "true" }) }), _jsx("h3", { className: "rag-empty-title", children: "Start a conversation" }), _jsx("p", { className: "rag-empty-description", children: "Ask questions about your documents. Get instant, accurate answers with source citations." })] }));
    return (_jsxs("div", { className: `rag-chat ${className}`, children: [_jsx(ChatHeader, { title: title, accentColor: accentColor, isTyping: isTyping, messageCount: messages.length, onClearChat: clearChat }), error && (_jsxs("div", { className: "rag-error-banner", role: "alert", children: [_jsx(AlertCircle, { size: 16, "aria-hidden": "true" }), _jsx("span", { children: error }), _jsx("button", { type: "button", onClick: () => setError(null), className: "rag-error-dismiss", "aria-label": "Dismiss error", children: _jsx(X, { size: 14 }) })] })), _jsx("div", { ref: messagesContainerRef, className: "rag-chat-messages", children: messages.length === 0 ? (emptyState || defaultEmptyState) : (_jsxs(_Fragment, { children: [messages.map((message) => (_jsx(MessageBubble, { message: message, accentColor: accentColor, showSources: showSources }, message.id))), isTyping && _jsx(TypingIndicator, { accentColor: accentColor })] })) }), _jsx(ChatInput, { placeholder: placeholder, accentColor: accentColor, onSendMessage: sendMessage, disabled: isTyping })] }));
}
//# sourceMappingURL=RAGChat.js.map