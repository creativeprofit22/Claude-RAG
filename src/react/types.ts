/**
 * Claude RAG - React Component Types
 */

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  sources?: MessageSource[];
  isLoading?: boolean;
}

export interface MessageSource {
  documentId: string;
  documentName: string;
  chunkIndex: number;
  snippet: string;
}

export interface RAGQueryResponse {
  answer: string;
  sources: MessageSource[];
  tokensUsed?: { input: number; output: number };
  timing?: {
    embedding: number;
    search: number;
    response: number;
    total: number;
  };
  responder?: 'claude' | 'gemini';
}

export interface RAGChatConfig {
  /** API endpoint URL (default: /api/rag/query) */
  endpoint?: string;
  /** Custom headers for API requests */
  headers?: Record<string, string>;
  /** Placeholder text for input */
  placeholder?: string;
  /** Title shown in header */
  title?: string;
  /** Accent color (hex) */
  accentColor?: string;
  /** Show sources under messages */
  showSources?: boolean;
  /** System prompt to send with queries */
  systemPrompt?: string;
  /** Number of chunks to retrieve */
  topK?: number;
  /** Filter to specific document */
  documentId?: string;
}

export interface RAGChatState {
  messages: ChatMessage[];
  isTyping: boolean;
  error: string | null;
}

export interface RAGChatActions {
  sendMessage: (content: string) => Promise<void>;
  clearChat: () => void;
  setError: (error: string | null) => void;
}

export type RAGChatContextValue = RAGChatState & RAGChatActions & { config: RAGChatConfig };
