'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, Library, X, FileText } from 'lucide-react';
import { useSkinMotion } from './motion/hooks/useSkinMotion.js';
import { useSkinDetect } from './motion/hooks/useSkinDetect.js';
import { RAGChat } from './RAGChat.js';
import { DocumentLibrary } from './components/documents/DocumentLibrary.js';
import { LibraryPreloader } from './components/library/Preloader/LibraryPreloader.js';
import { DEFAULT_ACCENT_COLOR } from './types.js';
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
export function RAGInterface({ endpoint = '/api/rag', headers, chatTitle = 'RAG Assistant', documentsTitle = 'Document Library', accentColor = DEFAULT_ACCENT_COLOR, defaultView = 'chat', showDocumentLibrary = true, placeholder = 'Ask a question about your documents...', showSources = true, systemPrompt, topK, responder, className = '', onDocumentSelect, chatEmptyState, documentsEmptyState, showPreloader = true, preloaderWelcomeText, preloaderSoundEnabled = true, }) {
    const [activeView, setActiveView] = useState(defaultView);
    const [scopedDocument, setScopedDocument] = useState(null);
    const [preloaderComplete, setPreloaderComplete] = useState(false);
    const { motion: skinMotion } = useSkinMotion();
    const skin = useSkinDetect();
    // Handle document selection from library
    const handleDocumentSelect = useCallback((doc) => {
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
        return (_jsx(LibraryPreloader, { onComplete: handlePreloaderComplete, welcomeText: preloaderWelcomeText, soundEnabled: preloaderSoundEnabled }));
    }
    return (_jsxs("div", { className: `rag-interface ${className}`, children: [showDocumentLibrary && (_jsxs("nav", { className: "rag-interface-tabs", role: "tablist", "aria-label": "RAG Interface views", children: [_jsxs("button", { type: "button", role: "tab", id: "rag-tab-chat", "aria-selected": activeView === 'chat', "aria-controls": "rag-tabpanel-chat", className: `rag-interface-tab ${activeView === 'chat' ? 'rag-interface-tab--active' : ''}`, onClick: () => setActiveView('chat'), style: activeView === 'chat' ? { borderColor: accentColor, color: accentColor } : undefined, children: [_jsx(MessageSquare, { size: 16, "aria-hidden": "true" }), _jsx("span", { children: "Chat" }), scopedDocument && (_jsx("span", { className: "rag-interface-tab-badge", style: { backgroundColor: `${accentColor}20`, color: accentColor }, children: "1" }))] }), _jsxs("button", { type: "button", role: "tab", id: "rag-tab-documents", "aria-selected": activeView === 'documents', "aria-controls": "rag-tabpanel-documents", className: `rag-interface-tab ${activeView === 'documents' ? 'rag-interface-tab--active' : ''}`, onClick: () => setActiveView('documents'), style: activeView === 'documents' ? { borderColor: accentColor, color: accentColor } : undefined, children: [_jsx(Library, { size: 16, "aria-hidden": "true" }), _jsx("span", { children: "Documents" })] })] })), scopedDocument && activeView === 'chat' && (_jsxs("div", { className: "rag-interface-scope", children: [_jsxs("div", { className: "rag-interface-scope-info", children: [_jsx(FileText, { size: 14, style: { color: accentColor }, "aria-hidden": "true" }), _jsx("span", { className: "rag-interface-scope-label", children: "Querying:" }), _jsx("span", { className: "rag-interface-scope-name", children: scopedDocument.documentName })] }), _jsxs("button", { type: "button", className: "rag-interface-scope-clear", onClick: handleClearScope, "aria-label": "Clear document filter", title: "Query all documents", children: [_jsx(X, { size: 14 }), _jsx("span", { children: "Clear" })] })] })), _jsx("div", { className: "rag-interface-content", children: _jsx(AnimatePresence, { mode: "wait", children: activeView === 'chat' ? (_jsx(motion.div, { role: "tabpanel", id: "rag-tabpanel-chat", "aria-labelledby": "rag-tab-chat", style: { display: 'contents' }, initial: skinMotion.card.hidden, animate: skinMotion.card.visible, exit: skinMotion.card.exit, transition: skinMotion.transition.fast, children: _jsx(RAGChat, { endpoint: chatEndpoint, headers: headers, title: chatTitle, accentColor: accentColor, placeholder: scopedDocument
                                ? `Ask about "${scopedDocument.documentName}"...`
                                : placeholder, showSources: showSources, systemPrompt: systemPrompt, topK: topK, documentId: scopedDocument?.documentId, responder: responder, emptyState: chatEmptyState }) }, "chat")) : (_jsx(motion.div, { role: "tabpanel", id: "rag-tabpanel-documents", "aria-labelledby": "rag-tab-documents", style: { display: 'contents' }, initial: skinMotion.card.hidden, animate: skinMotion.card.visible, exit: skinMotion.card.exit, transition: skinMotion.transition.fast, children: _jsx(DocumentLibrary, { endpoint: endpoint, headers: headers, title: documentsTitle, accentColor: accentColor, onDocumentSelect: handleDocumentSelect, emptyState: documentsEmptyState }) }, "documents")) }) })] }));
}
//# sourceMappingURL=RAGInterface.js.map