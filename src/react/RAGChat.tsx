'use client';

import { useRef, useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Database, type LucideIcon } from 'lucide-react';
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
import { DEFAULT_ACCENT_COLOR, type RAGChatConfig } from './types.js';

export interface RAGChatProps extends RAGChatConfig {
  /** Additional CSS class */
  className?: string;
  /** Custom empty state component */
  emptyState?: React.ReactNode;
}

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
export function RAGChat({
  endpoint = '/api/rag/query',
  headers,
  placeholder = 'Ask a question about your documents...',
  title = 'RAG Assistant',
  accentColor = DEFAULT_ACCENT_COLOR,
  showSources = true,
  systemPrompt,
  topK,
  documentId,
  responder,
  className = '',
  emptyState,
}: RAGChatProps) {
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  const { motion: skinMotion } = useSkinMotion();
  const skin = useSkinDetect();

  // TypewriterInput state (controlled component)
  const [typewriterValue, setTypewriterValue] = useState('');

  // Mobile detection for keyboard visibility
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const mediaQuery = window.matchMedia('(max-width: 768px)');
    setIsMobile(mediaQuery.matches);
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  const {
    messages,
    isTyping,
    error,
    sendMessage,
    clearChat,
    setError,
  } = useRAGChat({
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
  const handleTypewriterSubmit = useCallback(
    (value: string) => {
      const trimmed = value.trim();
      if (!trimmed || isTyping) return;
      sendMessage(trimmed);
      setTypewriterValue('');
    },
    [sendMessage, isTyping]
  );

  const defaultEmptyState = (
    <EmptyState
      icon={Database}
      iconSize={48}
      iconColor={accentColor}
      iconShadow={`0 0 30px ${accentColor}15`}
      title="Start a conversation"
      description="Ask questions about your documents. Get instant, accurate answers with source citations."
    />
  );

  return (
    <div className={`rag-chat ${className}`}>
      {/* SVG Filters for Library Skin InkEffects - must be in DOM for filters to work */}
      {skin === 'library' && <InkFilters />}

      {/* Header */}
      <ChatHeader
        title={title}
        accentColor={accentColor}
        isTyping={isTyping}
        messageCount={messages.length}
        onClearChat={clearChat}
      />

      {/* Error Banner */}
      {error && <ErrorBanner error={error} onDismiss={() => setError(null)} />}

      {/* Messages Area */}
      <div ref={messagesContainerRef} className="rag-chat-messages">
        {messages.length === 0 ? (
          <motion.div
            initial={skinMotion.modal.hidden}
            animate={skinMotion.modal.visible}
            transition={skinMotion.transition.default}
          >
            {emptyState || defaultEmptyState}
          </motion.div>
        ) : (
          <AnimatePresence mode="popLayout">
            {messages.map((message) => (
              <MessageBubble
                key={message.id}
                message={message}
                accentColor={accentColor}
                showSources={showSources}
              />
            ))}
            {isTyping && <TypingIndicator key="typing-indicator" accentColor={accentColor} />}
          </AnimatePresence>
        )}
      </div>

      {/* Input Area */}
      {skin === 'library' ? (
        <TypewriterInput
          value={typewriterValue}
          onChange={setTypewriterValue}
          onSubmit={handleTypewriterSubmit}
          placeholder={placeholder}
          disabled={isTyping}
          soundEnabled={true}
          showKeyboard={!isMobile}
        />
      ) : (
        <ChatInput
          placeholder={placeholder}
          accentColor={accentColor}
          onSendMessage={sendMessage}
          disabled={isTyping}
        />
      )}
    </div>
  );
}
