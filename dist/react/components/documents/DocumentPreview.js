'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useMemo } from 'react';
import { X, FileText, Calendar, Layers, MessageSquare, ExternalLink } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { DEFAULT_ACCENT_COLOR } from '../../types.js';
import { useModal } from '../../hooks/useModal.js';
import { useSkinMotion } from '../../motion/hooks/useSkinMotion.js';
import { formatDate } from '../../utils/formatDate.js';
/**
 * Get file type display label from document type or name
 */
function getFileType(docDetails) {
    if (docDetails.type)
        return docDetails.type.toUpperCase();
    const ext = docDetails.documentName.split('.').pop();
    return ext ? ext.toUpperCase() : 'FILE';
}
/**
 * DocumentPreview - Modal overlay showing document details and chunk snippets
 */
export function DocumentPreview({ document: docDetails, isOpen = true, isLoading = false, onClose, onQueryDocument, accentColor = DEFAULT_ACCENT_COLOR, }) {
    const { handleBackdropClick } = useModal({ onClose, isOpen });
    const { motion: skinMotion } = useSkinMotion();
    // Memoize accent color styles to avoid object recreation on each render
    const accentStyles = useMemo(() => ({
        iconContainer: { backgroundColor: `${accentColor}20`, borderColor: `${accentColor}40` },
        icon: { color: accentColor },
        badge: { backgroundColor: `${accentColor}20`, color: accentColor },
        primaryBtn: { backgroundColor: accentColor },
    }), [accentColor]);
    return (_jsx(AnimatePresence, { mode: "wait", children: isOpen && (_jsx(motion.div, { className: "curator-overlay rag-preview-overlay", initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 }, onClick: handleBackdropClick, role: "dialog", "aria-modal": "true", "aria-labelledby": "preview-dialog-title", children: _jsxs(motion.div, { className: "rag-preview-modal", variants: skinMotion.modal, initial: "hidden", animate: "visible", exit: "exit", onClick: (e) => e.stopPropagation(), children: [_jsxs("div", { className: "rag-preview-header", children: [_jsxs("div", { className: "rag-preview-title-section", children: [_jsx("div", { className: "rag-preview-icon", style: accentStyles.iconContainer, children: _jsx(FileText, { size: 24, style: accentStyles.icon, "aria-hidden": "true" }) }), _jsxs("div", { className: "rag-preview-title-info", children: [_jsx("h2", { id: "preview-dialog-title", className: "rag-preview-title", children: docDetails.documentName }), _jsx("span", { className: "rag-preview-type-badge", style: accentStyles.badge, children: getFileType(docDetails) })] })] }), _jsx("button", { type: "button", onClick: onClose, className: "curator-btn curator-btn-icon rag-preview-close", "aria-label": "Close preview", children: _jsx(X, { size: 20 }) })] }), _jsxs("div", { className: "rag-preview-metadata", children: [_jsxs("div", { className: "rag-preview-meta-item", children: [_jsx(Calendar, { size: 14, "aria-hidden": "true" }), _jsx("span", { children: formatDate(docDetails.timestamp, 'datetime') })] }), _jsxs("div", { className: "rag-preview-meta-item", children: [_jsx(Layers, { size: 14, "aria-hidden": "true" }), _jsxs("span", { children: [docDetails.chunkCount, " chunks"] })] }), docDetails.source && (_jsxs("div", { className: "rag-preview-meta-item", children: [_jsx(ExternalLink, { size: 14, "aria-hidden": "true" }), _jsx("span", { children: docDetails.source })] }))] }), _jsxs("div", { className: "rag-preview-chunks-container", children: [_jsx("h3", { className: "rag-preview-chunks-title", children: "Document Chunks" }), isLoading ? (_jsxs("div", { className: "rag-preview-loading", children: [_jsx("div", { className: "rag-preview-skeleton" }), _jsx("div", { className: "rag-preview-skeleton" }), _jsx("div", { className: "rag-preview-skeleton" })] })) : docDetails.chunks && docDetails.chunks.length > 0 ? (_jsx("div", { className: "rag-preview-chunks-list", children: docDetails.chunks.map((chunk) => (_jsxs("div", { className: "rag-preview-chunk", children: [_jsx("div", { className: "rag-preview-chunk-header", children: _jsxs("span", { className: "rag-preview-chunk-index", children: ["Chunk ", chunk.chunkIndex + 1] }) }), _jsx("p", { className: "rag-preview-chunk-text", children: chunk.snippet })] }, chunk.chunkIndex))) })) : (_jsx("div", { className: "rag-preview-no-chunks", children: _jsx("p", { children: "No chunk previews available" }) }))] }), _jsxs("div", { className: "rag-preview-footer", children: [_jsx("button", { type: "button", onClick: onClose, className: "rag-preview-btn rag-preview-btn-secondary", children: "Close" }), onQueryDocument && (_jsxs("button", { type: "button", onClick: () => onQueryDocument(docDetails), className: "rag-preview-btn rag-preview-btn-primary", style: accentStyles.primaryBtn, children: [_jsx(MessageSquare, { size: 16, "aria-hidden": "true" }), "Chat about this document"] }))] })] }) }, "document-preview")) }));
}
//# sourceMappingURL=DocumentPreview.js.map