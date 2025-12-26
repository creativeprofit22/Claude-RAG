'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Eye, Trash2, Layers } from 'lucide-react';
import { formatDate } from '../../utils/formatDate.js';
import { getDocumentIcon } from '../../utils/documentIcons.js';
/**
 * DocumentCard - Displays a single document in the list
 */
export function DocumentCard({ document, isSelected = false, onSelect, onDelete, onPreview, }) {
    const Icon = getDocumentIcon(document.type);
    const handleCardClick = () => {
        onSelect?.(document);
    };
    const handlePreviewClick = (e) => {
        e.stopPropagation();
        onPreview?.(document);
    };
    const handleDeleteClick = (e) => {
        e.stopPropagation();
        onDelete?.(document);
    };
    return (_jsxs("div", { className: `rag-doc-card ${isSelected ? 'rag-doc-card-selected' : ''}`, onClick: handleCardClick, role: "button", tabIndex: 0, onKeyDown: (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                handleCardClick();
            }
            else if (e.key === 'Escape') {
                e.target.blur();
            }
        }, children: [_jsx("div", { className: "rag-doc-card-icon", children: _jsx(Icon, { size: 24, "aria-hidden": "true" }) }), _jsxs("div", { className: "rag-doc-card-info", children: [_jsx("h4", { className: "rag-doc-card-name", title: document.documentName, children: document.documentName }), _jsxs("div", { className: "rag-doc-card-meta", children: [_jsx("span", { className: "rag-doc-card-type", children: document.type || 'Document' }), _jsx("span", { className: "rag-doc-card-separator", children: "-" }), _jsxs("span", { className: "rag-doc-card-chunks", children: [_jsx(Layers, { size: 12, "aria-hidden": "true" }), document.chunkCount, " chunks"] })] }), _jsx("span", { className: "rag-doc-card-date", children: formatDate(document.timestamp) })] }), _jsxs("div", { className: "rag-doc-card-actions", children: [onPreview && (_jsx("button", { type: "button", className: "rag-doc-card-action", onClick: handlePreviewClick, onKeyDown: (e) => e.stopPropagation(), title: "Preview document", "aria-label": "Preview document", children: _jsx(Eye, { size: 16 }) })), onDelete && (_jsx("button", { type: "button", className: "rag-doc-card-action rag-doc-card-action-delete", onClick: handleDeleteClick, onKeyDown: (e) => e.stopPropagation(), title: "Delete document", "aria-label": "Delete document", children: _jsx(Trash2, { size: 16 }) }))] })] }));
}
//# sourceMappingURL=DocumentCard.js.map