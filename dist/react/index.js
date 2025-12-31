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
export { RAGInterface } from './RAGInterface.js';
// Document Library
export { DocumentLibrary } from './components/documents/DocumentLibrary.js';
// Individual components for custom implementations
export { ChatHeader } from './components/ChatHeader.js';
export { ChatInput } from './components/ChatInput.js';
export { MessageBubble } from './components/MessageBubble.js';
export { TypingIndicator } from './components/TypingIndicator.js';
// Category components
export { CategoryBadge, CategoryFilter } from './components/categories/index.js';
// Upload components
export { UploadModal, FileDropZone, FileQueue, FilePreview, ProgressIndicator } from './components/upload/index.js';
// Admin Dashboard
export { AdminDashboard } from './components/admin/index.js';
// Settings
export { SettingsModal } from './components/settings/SettingsModal.js';
export { ApiKeyConfigBar } from './components/settings/ApiKeyConfigBar.js';
// Hooks for custom implementations
export { useRAGChat } from './hooks/useRAGChat.js';
export { useDocuments } from './hooks/useDocuments.js';
export { useCategories } from './hooks/useCategories.js';
export { useUploadStream, useFileQueue, useApiKeyConfig } from './hooks/index.js';
// Library Skin V2 Components
export * from './components/library/index.js';
// Cyberpunk Skin Components
export * from './components/cyberpunk/index.js';
//# sourceMappingURL=index.js.map