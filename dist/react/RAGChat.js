'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useRef, useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Database } from 'lucide-react';
import { useSkinMotion } from './motion/hooks/useSkinMotion.js';
import { useSkinDetect } from './motion/hooks/useSkinDetect.js';
import { ChatHeader } from './components/ChatHeader.js';
import { ChatInput } from './components/ChatInput.js';
import { TypewriterInput } from './components/library/index.js';
import { MessageBubble } from './components/MessageBubble.js';
import { TypingIndicator } from './components/TypingIndicator.js';
import { EmptyState } from './components/shared/EmptyState.js';
import { ErrorBanner } from './components/shared/ErrorBanner.js';
import { InkFilters } from './components/library/InkEffects/InkFilters.js';
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
    const { motion: skinMotion } = useSkinMotion();
    const skin = useSkinDetect();
    // TypewriterInput state (controlled component)
    const [typewriterValue, setTypewriterValue] = useState('');
    // Mobile detection for keyboard visibility
    const [isMobile, setIsMobile] = useState(false);
    useEffect(() => {
        const mediaQuery = window.matchMedia('(max-width: 768px)');
        setIsMobile(mediaQuery.matches);
        const handler = (e) => setIsMobile(e.matches);
        mediaQuery.addEventListener('change', handler);
        return () => mediaQuery.removeEventListener('change', handler);
    }, []);
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
    // TypewriterInput submit handler - clears value after send
    const handleTypewriterSubmit = useCallback((value) => {
        const trimmed = value.trim();
        if (!trimmed || isTyping)
            return;
        sendMessage(trimmed);
        setTypewriterValue('');
    }, [sendMessage, isTyping]);
    const defaultEmptyState = (_jsx(EmptyState, { icon: Database, iconSize: 48, iconColor: accentColor, iconShadow: `0 0 30px ${accentColor}15`, title: "Start a conversation", description: "Ask questions about your documents. Get instant, accurate answers with source citations." }));
    return (_jsxs("div", { className: `rag-chat ${className}`, children: [skin === 'library' && _jsx(InkFilters, {}), _jsx(ChatHeader, { title: title, accentColor: accentColor, isTyping: isTyping, messageCount: messages.length, onClearChat: clearChat }), error && _jsx(ErrorBanner, { error: error, onDismiss: () => setError(null) }), _jsx("div", { ref: messagesContainerRef, className: "rag-chat-messages", children: messages.length === 0 ? (_jsx(motion.div, { initial: skinMotion.modal.hidden, animate: skinMotion.modal.visible, transition: skinMotion.transition.default, children: emptyState || defaultEmptyState })) : (_jsxs(AnimatePresence, { mode: "popLayout", children: [messages.map((message) => (_jsx(MessageBubble, { message: message, accentColor: accentColor, showSources: showSources }, message.id))), isTyping && _jsx(TypingIndicator, { accentColor: accentColor }, "typing-indicator")] })) }), skin === 'library' ? (_jsx(TypewriterInput, { value: typewriterValue, onChange: setTypewriterValue, onSubmit: handleTypewriterSubmit, placeholder: placeholder, disabled: isTyping, soundEnabled: true, showKeyboard: !isMobile })) : (_jsx(ChatInput, { placeholder: placeholder, accentColor: accentColor, onSendMessage: sendMessage, disabled: isTyping }))] }));
}
//# sourceMappingURL=RAGChat.js.map