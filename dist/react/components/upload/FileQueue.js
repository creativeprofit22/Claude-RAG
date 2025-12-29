import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
/**
 * FileQueue - Display and manage queued files for upload
 */
import React, { useCallback, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { FileText, X, Check, AlertCircle, Loader2, Edit2 } from 'lucide-react';
import { ProgressIndicator } from './ProgressIndicator.js';
import { formatFileSize } from '../../utils/format.js';
import { useSkinMotion } from '../../motion/hooks/useSkinMotion.js';
/**
 * Get status icon
 */
function getStatusIcon(status) {
    switch (status) {
        case 'queued':
            return _jsx(FileText, { size: 16, className: "rag-upload-queue-icon queued" });
        case 'uploading':
            return _jsx(Loader2, { size: 16, className: "rag-upload-queue-icon uploading" });
        case 'complete':
            return _jsx(Check, { size: 16, className: "rag-upload-queue-icon complete" });
        case 'error':
            return _jsx(AlertCircle, { size: 16, className: "rag-upload-queue-icon error" });
    }
}
const FileQueueItem = React.memo(function FileQueueItem({ file, fileId, onRemove, onRename, isUploading, }) {
    const [isEditing, setIsEditing] = React.useState(false);
    const [editName, setEditName] = React.useState(file.name);
    const inputRef = React.useRef(null);
    // Sync editName with file.name when not actively editing
    useEffect(() => {
        if (!isEditing) {
            setEditName(file.name);
        }
    }, [file.name, isEditing]);
    const canEdit = file.status === 'queued' && !isUploading;
    const canRemove = file.status !== 'uploading';
    const handleRemove = useCallback(() => onRemove(fileId), [onRemove, fileId]);
    const handleStartEdit = useCallback(() => {
        if (canEdit && onRename) {
            setEditName(file.name);
            setIsEditing(true);
            // Use requestAnimationFrame for safer focus timing (no cleanup needed)
            requestAnimationFrame(() => inputRef.current?.focus());
        }
    }, [canEdit, onRename, file.name]);
    const handleSaveEdit = useCallback(() => {
        if (editName.trim() && editName !== file.name) {
            onRename?.(fileId, editName.trim());
        }
        setIsEditing(false);
    }, [editName, file.name, onRename, fileId]);
    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            handleSaveEdit();
        }
        else if (e.key === 'Escape') {
            setIsEditing(false);
            setEditName(file.name);
        }
    };
    return (_jsxs("div", { className: `rag-upload-queue-item ${file.status}`, children: [_jsxs("div", { className: "rag-upload-queue-item-header", children: [_jsxs("div", { className: "rag-upload-queue-item-info", children: [getStatusIcon(file.status), isEditing ? (_jsx("input", { ref: inputRef, type: "text", value: editName, onChange: (e) => setEditName(e.target.value), onBlur: handleSaveEdit, onKeyDown: handleKeyDown, className: "rag-upload-queue-item-input" })) : (_jsxs("span", { className: `rag-upload-queue-item-name ${canEdit ? 'editable' : ''}`, onClick: handleStartEdit, onKeyDown: (e) => {
                                    if (canEdit && (e.key === 'Enter' || e.key === ' ')) {
                                        e.preventDefault();
                                        handleStartEdit();
                                    }
                                }, tabIndex: canEdit ? 0 : undefined, role: canEdit ? 'button' : undefined, title: file.name, children: [file.name, canEdit && onRename && _jsx(Edit2, { size: 12, className: "edit-icon" })] }))] }), _jsxs("div", { className: "rag-upload-queue-item-actions", children: [_jsx("span", { className: "rag-upload-queue-item-size", children: formatFileSize(file.file.size) }), file.result && (_jsxs("span", { className: "rag-upload-queue-item-chunks", children: [file.result.chunks, " chunks"] })), canRemove && (_jsx("button", { type: "button", onClick: handleRemove, className: "rag-upload-queue-item-remove", "aria-label": "Remove file", children: _jsx(X, { size: 14 }) }))] })] }), file.status === 'uploading' && (_jsx(ProgressIndicator, { progress: file.progress, showStages: false })), file.status === 'error' && file.error && (_jsxs("div", { className: "rag-upload-queue-item-error", children: [_jsx(AlertCircle, { size: 12 }), _jsx("span", { children: file.error })] })), file.warning && (_jsxs("div", { className: "rag-upload-queue-item-warning", children: [_jsx(AlertCircle, { size: 12 }), _jsx("span", { children: file.warning })] }))] }));
});
export function FileQueue({ files, onRemove, onRename, isUploading = false, className = '', }) {
    const { motion: skinMotion } = useSkinMotion();
    if (files.length === 0) {
        return null;
    }
    const counts = files.reduce((acc, f) => {
        acc[f.status] = (acc[f.status] || 0) + 1;
        return acc;
    }, {});
    const { queued: queuedCount = 0, complete: completedCount = 0, error: errorCount = 0 } = counts;
    return (_jsxs("div", { className: `rag-upload-queue ${className}`, children: [_jsxs("div", { className: "rag-upload-queue-header", children: [_jsxs("span", { className: "rag-upload-queue-title", children: ["Files (", files.length, ")"] }), _jsxs("div", { className: "rag-upload-queue-stats", children: [queuedCount > 0 && (_jsxs("span", { className: "rag-upload-queue-stat queued", children: [queuedCount, " queued"] })), completedCount > 0 && (_jsxs("span", { className: "rag-upload-queue-stat complete", children: [completedCount, " complete"] })), errorCount > 0 && (_jsxs("span", { className: "rag-upload-queue-stat error", children: [errorCount, " failed"] }))] })] }), _jsx(motion.div, { className: "rag-upload-queue-list", variants: skinMotion.list, initial: "hidden", animate: "visible", children: _jsx(AnimatePresence, { mode: "popLayout", children: files.map((file) => (_jsx(motion.div, { variants: skinMotion.card, initial: "hidden", animate: "visible", exit: "exit", layout: true, children: _jsx(FileQueueItem, { file: file, fileId: file.id, onRemove: onRemove, onRename: onRename, isUploading: isUploading }) }, file.id))) }) })] }));
}
//# sourceMappingURL=FileQueue.js.map