import { type RAGChatConfig } from './types.js';
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
export declare function RAGChat({ endpoint, headers, placeholder, title, accentColor, showSources, systemPrompt, topK, documentId, responder, className, emptyState, }: RAGChatProps): import("react/jsx-runtime").JSX.Element;
//# sourceMappingURL=RAGChat.d.ts.map