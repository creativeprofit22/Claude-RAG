'use client';

import { useState, useCallback } from 'react';
import { MessageSquare, Library, X, FileText } from 'lucide-react';
import { useSkinDetect } from './motion/hooks/useSkinDetect.js';
import { RAGChat, type RAGChatProps } from './RAGChat.js';
import { DocumentLibrary, type DocumentLibraryProps } from './components/documents/DocumentLibrary.js';
import { LibraryPreloader } from './components/library/Preloader/LibraryPreloader.js';
import { DEFAULT_ACCENT_COLOR, type DocumentSummary } from './types.js';

export type RAGInterfaceView = 'chat' | 'documents';

export interface RAGInterfaceProps {
  /** API endpoint base URL (default: /api/rag) */
  endpoint?: string;
  /** Custom headers for API requests */
  headers?: Record<string, string>;
  /** Chat title */
  chatTitle?: string;
  /** Documents title */
  documentsTitle?: string;
  /** Accent color for interactive elements */
  accentColor?: string;
  /** Initial view to show */
  defaultView?: RAGInterfaceView;
  /** Show document library tab */
  showDocumentLibrary?: boolean;
  /** Chat placeholder text */
  placeholder?: string;
  /** Show source citations */
  showSources?: boolean;
  /** System prompt for chat */
  systemPrompt?: string;
  /** Number of chunks to retrieve */
  topK?: number;
  /** Override responder (claude or gemini) */
  responder?: 'claude' | 'gemini';
  /** Additional CSS class */
  className?: string;
  /** Callback when document is selected for querying */
  onDocumentSelect?: (doc: DocumentSummary | null) => void;
  /** Custom empty state for chat */
  chatEmptyState?: React.ReactNode;
  /** Custom empty state for documents */
  documentsEmptyState?: React.ReactNode;
  /** Show preloader animation for library skin (default: true) */
  showPreloader?: boolean;
  /** Custom welcome text for preloader (default: "Welcome to the Library...") */
  preloaderWelcomeText?: string;
  /** Enable preloader sound effects (default: true) */
  preloaderSoundEnabled?: boolean;
}

/**
 * RAGInterface - Unified chat and document library interface
 *
 * Provides tab navigation between Chat and Documents views with document scoping.
 * When a document is selected from the library, queries are filtered to that document.
 *
 * @example
 * ```tsx
 * import { RAGInterface } from 'claude-rag/react';
 * import 'claude-rag/react/styles.css';
 *
 * <RAGInterface
 *   endpoint="/api/rag"
 *   chatTitle="Document Assistant"
 *   accentColor="#10b981"
 * />
 * ```
 */
export function RAGInterface({
  endpoint = '/api/rag',
  headers,
  chatTitle = 'RAG Assistant',
  documentsTitle = 'Document Library',
  accentColor = DEFAULT_ACCENT_COLOR,
  defaultView = 'chat',
  showDocumentLibrary = true,
  placeholder = 'Ask a question about your documents...',
  showSources = true,
  systemPrompt,
  topK,
  responder,
  className = '',
  onDocumentSelect,
  chatEmptyState,
  documentsEmptyState,
  showPreloader = true,
  preloaderWelcomeText,
  preloaderSoundEnabled = true,
}: RAGInterfaceProps) {
  const [activeView, setActiveView] = useState<RAGInterfaceView>(defaultView);
  const [scopedDocument, setScopedDocument] = useState<DocumentSummary | null>(null);
  const [preloaderComplete, setPreloaderComplete] = useState(false);
  const skin = useSkinDetect();

  // Handle document selection from library
  const handleDocumentSelect = useCallback((doc: DocumentSummary) => {
    setScopedDocument(doc);
    setActiveView('chat');
    onDocumentSelect?.(doc);
  }, [onDocumentSelect]);

  // Clear document scope
  const handleClearScope = useCallback(() => {
    setScopedDocument(null);
    onDocumentSelect?.(null);
  }, [onDocumentSelect]);

  // Build chat endpoint with query path
  const chatEndpoint = `${endpoint}/query`;

  // Handle preloader completion
  const handlePreloaderComplete = useCallback(() => {
    setPreloaderComplete(true);
  }, []);

  // Show preloader for library skin on first visit (if enabled)
  // LibraryPreloader handles localStorage check internally via usePreloaderState
  const shouldShowPreloader = showPreloader && skin === 'library' && !preloaderComplete;

  if (shouldShowPreloader) {
    return (
      <LibraryPreloader
        onComplete={handlePreloaderComplete}
        welcomeText={preloaderWelcomeText}
        soundEnabled={preloaderSoundEnabled}
      />
    );
  }

  return (
    <div className={`rag-interface ${className}`}>
      {/* Tab Navigation */}
      {showDocumentLibrary && (
        <nav className="rag-interface-tabs" role="tablist" aria-label="RAG Interface views">
          <button
            type="button"
            role="tab"
            id="rag-tab-chat"
            aria-selected={activeView === 'chat'}
            aria-controls="rag-tabpanel-chat"
            className={`rag-interface-tab ${activeView === 'chat' ? 'rag-interface-tab--active' : ''}`}
            onClick={() => setActiveView('chat')}
            style={activeView === 'chat' ? { borderColor: accentColor, color: accentColor } : undefined}
          >
            <MessageSquare size={16} aria-hidden="true" />
            <span>Chat</span>
            {scopedDocument && (
              <span
                className="rag-interface-tab-badge"
                style={{ backgroundColor: `${accentColor}20`, color: accentColor }}
              >
                1
              </span>
            )}
          </button>
          <button
            type="button"
            role="tab"
            id="rag-tab-documents"
            aria-selected={activeView === 'documents'}
            aria-controls="rag-tabpanel-documents"
            className={`rag-interface-tab ${activeView === 'documents' ? 'rag-interface-tab--active' : ''}`}
            onClick={() => setActiveView('documents')}
            style={activeView === 'documents' ? { borderColor: accentColor, color: accentColor } : undefined}
          >
            <Library size={16} aria-hidden="true" />
            <span>Documents</span>
          </button>
        </nav>
      )}

      {/* Document Scope Indicator */}
      {scopedDocument && activeView === 'chat' && (
        <div className="rag-interface-scope">
          <div className="rag-interface-scope-info">
            <FileText size={14} style={{ color: accentColor }} aria-hidden="true" />
            <span className="rag-interface-scope-label">Querying:</span>
            <span className="rag-interface-scope-name">{scopedDocument.documentName}</span>
          </div>
          <button
            type="button"
            className="rag-interface-scope-clear"
            onClick={handleClearScope}
            aria-label="Clear document filter"
            title="Query all documents"
          >
            <X size={14} />
            <span>Clear</span>
          </button>
        </div>
      )}

      {/* View Content */}
      <div className="rag-interface-content">
        {activeView === 'chat' ? (
          <div
            role="tabpanel"
            id="rag-tabpanel-chat"
            aria-labelledby="rag-tab-chat"
            className="rag-interface-tabpanel"
          >
            <RAGChat
              endpoint={chatEndpoint}
              headers={headers}
              title={chatTitle}
              accentColor={accentColor}
              placeholder={scopedDocument
                ? `Ask about "${scopedDocument.documentName}"...`
                : placeholder}
              showSources={showSources}
              systemPrompt={systemPrompt}
              topK={topK}
              documentId={scopedDocument?.documentId}
              responder={responder}
              emptyState={chatEmptyState}
            />
          </div>
        ) : (
          <div
            role="tabpanel"
            id="rag-tabpanel-documents"
            aria-labelledby="rag-tab-documents"
            className="rag-interface-tabpanel"
          >
            <DocumentLibrary
              endpoint={endpoint}
              headers={headers}
              title={documentsTitle}
              accentColor={accentColor}
              onDocumentSelect={handleDocumentSelect}
              emptyState={documentsEmptyState}
            />
          </div>
        )}
      </div>
    </div>
  );
}
