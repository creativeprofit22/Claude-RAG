/**
 * Claude RAG - React Components
 *
 * Drop-in chat interface and components for Claude RAG.
 *
 * @example
 * ```tsx
 * import { RAGChat } from 'claude-rag/react';
 * import 'claude-rag/react/styles.css';
 *
 * function App() {
 *   return (
 *     <div style={{ height: '600px' }}>
 *       <RAGChat
 *         endpoint="http://localhost:3000/api/rag/query"
 *         title="Document Assistant"
 *       />
 *     </div>
 *   );
 * }
 * ```
 */

// Main component
export { RAGChat } from './RAGChat.js';
export type { RAGChatProps } from './RAGChat.js';

// Individual components for custom implementations
export { ChatHeader } from './components/ChatHeader.js';
export { ChatInput } from './components/ChatInput.js';
export { MessageBubble } from './components/MessageBubble.js';
export { TypingIndicator } from './components/TypingIndicator.js';

// Hook for custom implementations
export { useRAGChat } from './hooks/useRAGChat.js';

// Types
export type {
  ChatMessage,
  MessageSource,
  RAGQueryResponse,
  RAGChatConfig,
  RAGChatState,
  RAGChatActions,
  RAGChatContextValue,
} from './types.js';
