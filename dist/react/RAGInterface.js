'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useCallback } from 'react';
import { MessageSquare, Library, X, FileText } from 'lucide-react';
import { RAGChat } from './RAGChat.js';
import { DocumentLibrary } from './components/documents/DocumentLibrary.js';
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
export function RAGInterface({ endpoint = '/api/rag', headers, chatTitle = 'RAG Assistant', documentsTitle = 'Document Library', accentColor = DEFAULT_ACCENT_COLOR, defaultView = 'chat', showDocumentLibrary = true, placeholder = 'Ask a question about your documents...', showSources = true, systemPrompt, topK, responder, className = '', onDocumentSelect, chatEmptyState, documentsEmptyState, }) {
    const [activeView, setActiveView] = useState(defaultView);
    const [scopedDocument, setScopedDocument] = useState(null);
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
    return (_jsxs("div", { className: `rag-interface ${className}`, children: [showDocumentLibrary && (_jsxs("nav", { className: "rag-interface-tabs", role: "tablist", children: [_jsxs("button", { type: "button", role: "tab", "aria-selected": activeView === 'chat', className: `rag-interface-tab ${activeView === 'chat' ? 'rag-interface-tab--active' : ''}`, onClick: () => setActiveView('chat'), style: activeView === 'chat' ? { borderColor: accentColor, color: accentColor } : undefined, children: [_jsx(MessageSquare, { size: 16, "aria-hidden": "true" }), _jsx("span", { children: "Chat" }), scopedDocument && (_jsx("span", { className: "rag-interface-tab-badge", style: { backgroundColor: `${accentColor}20`, color: accentColor }, children: "1" }))] }), _jsxs("button", { type: "button", role: "tab", "aria-selected": activeView === 'documents', className: `rag-interface-tab ${activeView === 'documents' ? 'rag-interface-tab--active' : ''}`, onClick: () => setActiveView('documents'), style: activeView === 'documents' ? { borderColor: accentColor, color: accentColor } : undefined, children: [_jsx(Library, { size: 16, "aria-hidden": "true" }), _jsx("span", { children: "Documents" })] })] })), scopedDocument && activeView === 'chat' && (_jsxs("div", { className: "rag-interface-scope", children: [_jsxs("div", { className: "rag-interface-scope-info", children: [_jsx(FileText, { size: 14, style: { color: accentColor }, "aria-hidden": "true" }), _jsx("span", { className: "rag-interface-scope-label", children: "Querying:" }), _jsx("span", { className: "rag-interface-scope-name", children: scopedDocument.documentName })] }), _jsxs("button", { type: "button", className: "rag-interface-scope-clear", onClick: handleClearScope, "aria-label": "Clear document filter", title: "Query all documents", children: [_jsx(X, { size: 14 }), _jsx("span", { children: "Clear" })] })] })), _jsx("div", { className: "rag-interface-content", children: activeView === 'chat' ? (_jsx(RAGChat, { endpoint: chatEndpoint, headers: headers, title: chatTitle, accentColor: accentColor, placeholder: scopedDocument
                        ? `Ask about "${scopedDocument.documentName}"...`
                        : placeholder, showSources: showSources, systemPrompt: systemPrompt, topK: topK, documentId: scopedDocument?.documentId, responder: responder, emptyState: chatEmptyState })) : (_jsx(DocumentLibrary, { endpoint: endpoint, headers: headers, title: documentsTitle, accentColor: accentColor, onDocumentSelect: handleDocumentSelect, emptyState: documentsEmptyState })) })] }));
}
//# sourceMappingURL=RAGInterface.js.map