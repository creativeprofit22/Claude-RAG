'use client';

import { useState, useCallback, useRef, useMemo, useEffect } from 'react';
import type { ChatMessage, RAGChatConfig, RAGQueryResponse, RAGChatState, RAGChatActions } from '../types.js';

let idCounter = 0;
function generateId(): string {
  return `msg_${Date.now()}_${++idCounter}_${Math.random().toString(36).slice(2, 8)}`;
}

export function useRAGChat(config: RAGChatConfig = {}): RAGChatState & RAGChatActions {
  const {
    endpoint = '/api/rag/query',
    headers = {},
    systemPrompt,
    topK,
    documentId,
    responder,
  } = config;

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Stabilize headers to prevent infinite rerenders from inline objects
  const headersJson = JSON.stringify(headers);
  const stableHeaders = useMemo(() => headers, [headersJson]);

  // AbortController ref to cancel in-flight requests
  const abortControllerRef = useRef<AbortController | null>(null);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      abortControllerRef.current?.abort();
    };
  }, []);

  // Clear messages when documentId changes (new document scope)
  useEffect(() => {
    setMessages([]);
    setError(null);
  }, [documentId]);

  const sendMessage = useCallback(async (content: string) => {
    if (!content.trim()) return;

    // Abort any in-flight request
    abortControllerRef.current?.abort();
    abortControllerRef.current = new AbortController();

    // Add user message
    const userMessage: ChatMessage = {
      id: generateId(),
      role: 'user',
      content: content.trim(),
      timestamp: new Date(),
    };

    // Add loading message for assistant
    const loadingMessage: ChatMessage = {
      id: generateId(),
      role: 'assistant',
      content: '',
      timestamp: new Date(),
      isLoading: true,
    };

    setMessages((prev) => [...prev, userMessage, loadingMessage]);
    setIsTyping(true);
    setError(null);

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...stableHeaders,
        },
        body: JSON.stringify({
          query: content.trim(),
          ...(systemPrompt && { systemPrompt }),
          ...(topK && { topK }),
          ...(documentId && { documentId }),
          ...(responder && { responder }),
        }),
        signal: abortControllerRef.current.signal,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Request failed: ${response.status}`);
      }

      const data: RAGQueryResponse = await response.json();

      // Replace loading message with actual response
      const assistantMessage: ChatMessage = {
        id: loadingMessage.id,
        role: 'assistant',
        content: data.answer,
        timestamp: new Date(),
        sources: data.sources,
      };

      setMessages((prev) =>
        prev.map((msg) => (msg.id === loadingMessage.id ? assistantMessage : msg))
      );
    } catch (err) {
      // Ignore abort errors - they're intentional
      if (err instanceof Error && err.name === 'AbortError') {
        return;
      }

      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      setError(errorMessage);

      // Replace loading message with error message
      const errorAssistantMessage: ChatMessage = {
        id: loadingMessage.id,
        role: 'assistant',
        content: `Sorry, I encountered an error: ${errorMessage}`,
        timestamp: new Date(),
      };

      setMessages((prev) =>
        prev.map((msg) => (msg.id === loadingMessage.id ? errorAssistantMessage : msg))
      );
    } finally {
      setIsTyping(false);
    }
  }, [endpoint, stableHeaders, systemPrompt, topK, documentId, responder]);

  const clearChat = useCallback(() => {
    setMessages([]);
    setError(null);
  }, []);

  return {
    messages,
    isTyping,
    error,
    sendMessage,
    clearChat,
    setError,
  };
}
