'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useCallback, Component } from 'react';
import { MessageSquare, Library, X, FileText } from 'lucide-react';
import { useSkinDetect } from './motion/hooks/useSkinDetect.js';
import { RAGChat } from './RAGChat.js';
import { DocumentLibrary } from './components/documents/DocumentLibrary.js';
import { LibraryPreloader } from './components/library/Preloader/LibraryPreloader.js';
import { CyberpunkTerminal } from './components/cyberpunk/index.js';
import { DEFAULT_ACCENT_COLOR } from './types.js';
class ThreeJSErrorBoundary extends Component {
    state = { hasError: false, error: null };
    static getDerivedStateFromError(error) { return { hasError: true, error }; }
    componentDidCatch(error, info) { console.error('[CyberpunkTerminal Error]', error, info); }
    render() {
        if (this.state.hasError) {
            return (_jsxs("div", { style: { padding: 20, background: '#1a0a1a', color: '#ff0080', fontFamily: 'monospace', border: '2px solid #ff0080' }, children: [_jsx("h3", { children: "\u26A0\uFE0F 3D Terminal Error" }), _jsx("pre", { style: { whiteSpace: 'pre-wrap', fontSize: 12 }, children: this.state.error?.message }), _jsx("pre", { style: { whiteSpace: 'pre-wrap', fontSize: 10, opacity: 0.7 }, children: this.state.error?.stack }), this.props.fallback] }));
        }
        return this.props.children;
    }
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
export function RAGInterface({ endpoint = '/api/rag', headers, chatTitle = 'RAG Assistant', documentsTitle = 'Document Library', accentColor = DEFAULT_ACCENT_COLOR, defaultView = 'chat', showDocumentLibrary = true, placeholder = 'Ask a question about your documents...', showSources = true, systemPrompt, topK, responder, className = '', onDocumentSelect, chatEmptyState, documentsEmptyState, showPreloader = true, preloaderWelcomeText, preloaderSoundEnabled = true, }) {
    const [activeView, setActiveView] = useState(defaultView);
    const [scopedDocument, setScopedDocument] = useState(null);
    const [preloaderComplete, setPreloaderComplete] = useState(false);
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
    // Cyberpunk skin: Full interface inside CyberpunkTerminal with cyberpunk-styled tabs
    if (skin === 'cyberpunk') {
        const cyberpunkContent = (_jsxs("div", { className: "cyberpunk-tabs-container", children: [showDocumentLibrary && (_jsxs("nav", { className: "cyberpunk-tabs-nav", role: "tablist", "aria-label": "RAG Interface views", children: [_jsxs("button", { type: "button", role: "tab", "aria-selected": activeView === 'chat', "aria-controls": "cyberpunk-chat-panel", id: "cyberpunk-chat-tab", tabIndex: activeView === 'chat' ? 0 : -1, onClick: () => setActiveView('chat'), onKeyDown: (e) => {
                                if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
                                    e.preventDefault();
                                    setActiveView(activeView === 'chat' ? 'documents' : 'chat');
                                }
                            }, className: "cyberpunk-tab-button", "data-active": activeView === 'chat', children: [_jsx(MessageSquare, { size: 14, "aria-hidden": "true" }), _jsx("span", { children: "CHAT" })] }), _jsxs("button", { type: "button", role: "tab", "aria-selected": activeView === 'documents', "aria-controls": "cyberpunk-documents-panel", id: "cyberpunk-documents-tab", tabIndex: activeView === 'documents' ? 0 : -1, onClick: () => setActiveView('documents'), onKeyDown: (e) => {
                                if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
                                    e.preventDefault();
                                    setActiveView(activeView === 'chat' ? 'documents' : 'chat');
                                }
                            }, className: "cyberpunk-tab-button cyberpunk-tab-button--documents", "data-active": activeView === 'documents', children: [_jsx(Library, { size: 14, "aria-hidden": "true" }), _jsx("span", { children: "DOCUMENTS" })] })] })), scopedDocument && activeView === 'chat' && (_jsxs("div", { className: "cyberpunk-scope-indicator", children: [_jsxs("span", { className: "cyberpunk-scope-info", children: [_jsx(FileText, { size: 12, "aria-hidden": "true" }), _jsx("span", { className: "cyberpunk-scope-label", children: "SCOPE:" }), _jsx("span", { children: scopedDocument.documentName })] }), _jsxs("button", { type: "button", onClick: handleClearScope, className: "cyberpunk-scope-clear", "aria-label": `Clear scope: ${scopedDocument.documentName}`, children: [_jsx(X, { size: 10, "aria-hidden": "true" }), "CLEAR"] })] })), _jsx("div", { className: "cyberpunk-content-area", role: "tabpanel", id: activeView === 'chat' ? 'cyberpunk-chat-panel' : 'cyberpunk-documents-panel', "aria-labelledby": activeView === 'chat' ? 'cyberpunk-chat-tab' : 'cyberpunk-documents-tab', children: activeView === 'chat' ? (_jsx(RAGChat, { endpoint: chatEndpoint, headers: headers, title: chatTitle, accentColor: "#00ffff", placeholder: scopedDocument
                            ? `Ask about "${scopedDocument.documentName}"...`
                            : placeholder, showSources: showSources, systemPrompt: systemPrompt, topK: topK, documentId: scopedDocument?.documentId, responder: responder, emptyState: chatEmptyState })) : (_jsx(DocumentLibrary, { endpoint: endpoint, headers: headers, title: documentsTitle, accentColor: "#ff0080", onDocumentSelect: handleDocumentSelect, emptyState: documentsEmptyState })) })] }));
        const cyberpunkFallback = (_jsx("div", { className: `rag-interface cyberpunk-fallback ${className}`, children: cyberpunkContent }));
        return (_jsx(ThreeJSErrorBoundary, { fallback: cyberpunkFallback, children: _jsx(CyberpunkTerminal, { className: className, damageLevel: 0.5, enableEffects: true, children: cyberpunkContent }) }, `error-boundary-${skin}`));
    }
    // Default interface with tabs (for non-cyberpunk skins)
    return (_jsxs("div", { className: `rag-interface ${className}`, children: [showDocumentLibrary && (_jsxs("nav", { className: "rag-interface-tabs", role: "tablist", "aria-label": "RAG Interface views", children: [_jsxs("button", { type: "button", role: "tab", id: "rag-tab-chat", "aria-selected": activeView === 'chat', "aria-controls": "rag-tabpanel-chat", className: `rag-interface-tab ${activeView === 'chat' ? 'rag-interface-tab--active' : ''}`, onClick: () => setActiveView('chat'), style: activeView === 'chat' ? { borderColor: accentColor, color: accentColor } : undefined, children: [_jsx(MessageSquare, { size: 16, "aria-hidden": "true" }), _jsx("span", { children: "Chat" }), scopedDocument && (_jsx("span", { className: "rag-interface-tab-badge", style: { backgroundColor: `${accentColor}20`, color: accentColor }, children: "1" }))] }), _jsxs("button", { type: "button", role: "tab", id: "rag-tab-documents", "aria-selected": activeView === 'documents', "aria-controls": "rag-tabpanel-documents", className: `rag-interface-tab ${activeView === 'documents' ? 'rag-interface-tab--active' : ''}`, onClick: () => setActiveView('documents'), style: activeView === 'documents' ? { borderColor: accentColor, color: accentColor } : undefined, children: [_jsx(Library, { size: 16, "aria-hidden": "true" }), _jsx("span", { children: "Documents" })] })] })), scopedDocument && activeView === 'chat' && (_jsxs("div", { className: "rag-interface-scope", children: [_jsxs("div", { className: "rag-interface-scope-info", children: [_jsx(FileText, { size: 14, style: { color: accentColor }, "aria-hidden": "true" }), _jsx("span", { className: "rag-interface-scope-label", children: "Querying:" }), _jsx("span", { className: "rag-interface-scope-name", children: scopedDocument.documentName })] }), _jsxs("button", { type: "button", className: "rag-interface-scope-clear", onClick: handleClearScope, "aria-label": "Clear document filter", title: "Query all documents", children: [_jsx(X, { size: 14 }), _jsx("span", { children: "Clear" })] })] })), _jsx("div", { className: "rag-interface-content", children: activeView === 'chat' ? (_jsx("div", { role: "tabpanel", id: "rag-tabpanel-chat", "aria-labelledby": "rag-tab-chat", className: "rag-interface-tabpanel", children: _jsx(RAGChat, { endpoint: chatEndpoint, headers: headers, title: chatTitle, accentColor: accentColor, placeholder: scopedDocument
                            ? `Ask about "${scopedDocument.documentName}"...`
                            : placeholder, showSources: showSources, systemPrompt: systemPrompt, topK: topK, documentId: scopedDocument?.documentId, responder: responder, emptyState: chatEmptyState }) })) : (_jsx("div", { role: "tabpanel", id: "rag-tabpanel-documents", "aria-labelledby": "rag-tab-documents", className: "rag-interface-tabpanel", children: _jsx(DocumentLibrary, { endpoint: endpoint, headers: headers, title: documentsTitle, accentColor: accentColor, onDocumentSelect: handleDocumentSelect, emptyState: documentsEmptyState }) })) })] }));
}
//# sourceMappingURL=RAGInterface.js.map