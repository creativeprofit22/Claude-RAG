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

// Main components
export { RAGChat } from './RAGChat.js';
export type { RAGChatProps } from './RAGChat.js';

export { RAGInterface } from './RAGInterface.js';
export type { RAGInterfaceProps, RAGInterfaceView } from './RAGInterface.js';

// Document Library
export { DocumentLibrary } from './components/documents/DocumentLibrary.js';
export type { DocumentLibraryProps } from './components/documents/DocumentLibrary.js';

// Individual components for custom implementations
export { ChatHeader } from './components/ChatHeader.js';
export { ChatInput } from './components/ChatInput.js';
export { MessageBubble } from './components/MessageBubble.js';
export { TypingIndicator } from './components/TypingIndicator.js';

// Category components
export { CategoryBadge, CategoryFilter } from './components/categories/index.js';
export type { CategoryBadgeProps, CategoryFilterProps } from './components/categories/index.js';

// Upload components
export { UploadModal, FileDropZone, FileQueue, FilePreview, ProgressIndicator } from './components/upload/index.js';
export type { UploadModalProps, FileDropZoneProps, FileQueueProps, FilePreviewProps, ProgressIndicatorProps } from './components/upload/index.js';

// Hooks for custom implementations
export { useRAGChat } from './hooks/useRAGChat.js';
export { useDocuments } from './hooks/useDocuments.js';
export { useCategories } from './hooks/useCategories.js';
export { useUploadStream, useFileQueue } from './hooks/index.js';
export type { UploadProgress, UploadResult, UploadOptions, UploadStage, QueuedFile, FileStatus } from './hooks/index.js';

// Types
export type {
  ChatMessage,
  MessageSource,
  RAGQueryResponse,
  RAGChatConfig,
  RAGChatState,
  RAGChatActions,
  Category,
  DocumentSummary,
  DocumentDetails,
  DocumentLibraryState,
} from './types.js';
