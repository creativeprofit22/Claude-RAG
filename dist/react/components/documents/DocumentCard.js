'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { memo, useCallback } from 'react';
import { Eye, Trash2, Layers } from 'lucide-react';
import { formatDate } from '../../utils/formatDate.js';
import { getDocumentIcon } from '../../utils/documentIcons.js';
/**
 * DocumentCard - Displays a single document in the list
 */
export const DocumentCard = memo(function DocumentCard({ document, isSelected = false, onSelect, onDelete, onPreview, }) {
    const Icon = getDocumentIcon(document.type);
    const handleCardClick = useCallback(() => {
        onSelect?.(document);
    }, [onSelect, document]);
    const handlePreviewClick = useCallback((e) => {
        e.stopPropagation();
        onPreview?.(document);
    }, [onPreview, document]);
    const handleDeleteClick = useCallback((e) => {
        e.stopPropagation();
        onDelete?.(document);
    }, [onDelete, document]);
    const handleKeyDown = useCallback((e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onSelect?.(document);
        }
        else if (e.key === 'Escape') {
            e.target.blur();
        }
    }, [onSelect, document]);
    return (_jsxs("div", { className: `rag-doc-card ${isSelected ? 'rag-doc-card--selected' : ''}`, onClick: handleCardClick, role: "button", tabIndex: 0, "aria-pressed": isSelected, onKeyDown: handleKeyDown, children: [_jsx("div", { className: "rag-doc-card-icon", children: _jsx(Icon, { size: 24, "aria-hidden": "true" }) }), _jsxs("div", { className: "rag-doc-card-info", children: [_jsx("h4", { className: "rag-doc-card-name", title: document.documentName, children: document.documentName }), _jsxs("div", { className: "rag-doc-card-meta", children: [_jsx("span", { className: "rag-doc-card-type", children: document.type || 'Document' }), _jsx("span", { className: "rag-doc-card-separator", children: "-" }), _jsxs("span", { className: "rag-doc-card-chunks", children: [_jsx(Layers, { size: 12, "aria-hidden": "true" }), document.chunkCount, " chunks"] })] }), _jsx("span", { className: "rag-doc-card-date", children: formatDate(document.timestamp) })] }), _jsxs("div", { className: "rag-doc-card-actions", children: [onPreview && (_jsx("button", { type: "button", className: "rag-doc-card-action", onClick: handlePreviewClick, onKeyDown: (e) => e.stopPropagation(), title: "Preview document", "aria-label": "Preview document", children: _jsx(Eye, { size: 16 }) })), onDelete && (_jsx("button", { type: "button", className: "rag-doc-card-action rag-doc-card-action-delete", onClick: handleDeleteClick, onKeyDown: (e) => e.stopPropagation(), title: "Delete document", "aria-label": "Delete document", children: _jsx(Trash2, { size: 16 }) }))] })] }));
});
//# sourceMappingURL=DocumentCard.js.map