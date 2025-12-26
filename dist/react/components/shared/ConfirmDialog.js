'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { AlertTriangle, X } from 'lucide-react';
import { useModal } from '../../hooks/useModal.js';
/**
 * ConfirmDialog - Simple confirmation modal for destructive actions
 */
export function ConfirmDialog({ title, message, confirmLabel = 'Confirm', cancelLabel = 'Cancel', onConfirm, onCancel, isDestructive = false, }) {
    const { handleBackdropClick } = useModal({ onClose: onCancel });
    return (_jsx("div", { className: "rag-confirm-overlay", onClick: handleBackdropClick, role: "dialog", "aria-modal": "true", "aria-labelledby": "confirm-dialog-title", children: _jsxs("div", { className: "rag-confirm-dialog", children: [_jsxs("div", { className: "rag-confirm-header", children: [_jsxs("div", { className: "rag-confirm-title-row", children: [isDestructive && (_jsx("div", { className: "rag-confirm-icon rag-confirm-icon-destructive", children: _jsx(AlertTriangle, { size: 20, "aria-hidden": "true" }) })), _jsx("h3", { id: "confirm-dialog-title", className: "rag-confirm-title", children: title })] }), _jsx("button", { type: "button", onClick: onCancel, className: "rag-confirm-close", "aria-label": "Close dialog", children: _jsx(X, { size: 18 }) })] }), _jsx("div", { className: "rag-confirm-body", children: _jsx("p", { className: "rag-confirm-message", children: message }) }), _jsxs("div", { className: "rag-confirm-actions", children: [_jsx("button", { type: "button", onClick: onCancel, className: "rag-confirm-btn rag-confirm-btn-cancel", children: cancelLabel }), _jsx("button", { type: "button", onClick: onConfirm, className: `rag-confirm-btn ${isDestructive ? 'rag-confirm-btn-destructive' : 'rag-confirm-btn-confirm'}`, children: confirmLabel })] })] }) }));
}
//# sourceMappingURL=ConfirmDialog.js.map