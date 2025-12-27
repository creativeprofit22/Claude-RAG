/**
 * Claude RAG - React Component Types
 */

/** Default accent color used across all chat components */
export const DEFAULT_ACCENT_COLOR = '#6366f1';

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
  /** Override responder (claude or gemini) */
  responder?: 'claude' | 'gemini';
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

// ============================================
// Document Management Types
// ============================================

/** Document summary for list views */
export interface DocumentSummary {
  documentId: string;
  documentName: string;
  chunkCount: number;
  timestamp: number;
  source?: string;
  type?: string;
  categories?: string[];
  tags?: string[];
}

/** Full document details with chunks */
export interface DocumentDetails extends DocumentSummary {
  chunks: Array<{ chunkIndex: number; snippet: string }>;
}

/** Category definition for document organization */
export interface Category {
  id: string;
  name: string;
  color: string;
  icon?: string;
}

/** Document library state for UI */
export interface DocumentLibraryState {
  documents: DocumentSummary[];
  isLoading: boolean;
  error: string | null;
  searchQuery: string;
  sortBy: 'name' | 'date' | 'chunks';
  sortOrder: 'asc' | 'desc';
  selectedCategory: string | null;
}

// ============================================
// Admin Dashboard Types
// ============================================

/** Admin statistics response */
export interface AdminStats {
  documents: {
    total: number;
    byCategory: Array<{ categoryId: string; categoryName: string; color: string; count: number }>;
  };
  chunks: {
    total: number;
    averagePerDocument: number;
  };
  storage: {
    estimatedBytes: number;
    estimatedMB: string;
  };
  recentUploads: Array<{
    documentId: string;
    documentName: string;
    timestamp: number;
    chunkCount: number;
  }>;
  timestamp: string;
}

/** Admin health response */
export interface AdminHealth {
  status: 'healthy' | 'degraded' | 'unhealthy';
  services: {
    database: { status: 'up' | 'down'; documentCount: number; chunkCount: number };
    embeddings: { status: 'up' | 'down'; provider: string };
    responders: {
      claude: { available: boolean; configured: boolean };
      gemini: { available: boolean; configured: boolean };
    };
  };
  defaultResponder: 'claude' | 'gemini' | 'none';
  timestamp: string;
}
