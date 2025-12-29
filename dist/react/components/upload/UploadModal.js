import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
/**
 * UploadModal - Enhanced upload modal with file queue and category selection
 */
import { useCallback, useEffect, useRef, useState } from 'react';
import { X, Upload, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useFileQueue } from '../../hooks/useFileQueue.js';
import { useCategories } from '../../hooks/useCategories.js';
import { useModal } from '../../hooks/useModal.js';
import { useSkinMotion } from '../../motion/hooks/useSkinMotion.js';
import { FileDropZone } from './FileDropZone.js';
import { FileQueue } from './FileQueue.js';
import { CategoryFilter } from '../categories/CategoryFilter.js';
export function UploadModal({ isOpen, onClose, onUploadComplete, endpoint = '/api/rag', headers = {}, className = '', }) {
    const { handleBackdropClick } = useModal({ onClose, isOpen });
    const { motion: skinMotion } = useSkinMotion();
    // Category management - use stable endpoint reference to prevent race conditions
    const { categories, isLoading: categoriesLoading, refetch: refetchCategories } = useCategories({
        endpoint,
        headers,
        autoFetch: false, // Manual control to prevent race conditions
    });
    // Fetch categories when modal opens, abort if it closes before completing
    useEffect(() => {
        if (!isOpen)
            return;
        const abortController = new AbortController();
        // Fetch categories with cancellation support
        const fetchCategories = async () => {
            // Yield to event loop to allow rapid open/close to settle
            await Promise.resolve();
            if (!abortController.signal.aborted) {
                refetchCategories();
            }
        };
        fetchCategories();
        return () => {
            abortController.abort();
        };
    }, [isOpen, refetchCategories]);
    const [selectedCategoryId, setSelectedCategoryId] = useState(null);
    // Ref to track latest files state for stale closure prevention
    const filesRef = useRef([]);
    // File queue management
    const { files, addFiles, removeFile, updateFileName, clearAll, startUpload, cancelUpload, isUploading, hasFiles, completedCount, } = useFileQueue({
        endpoint: `${endpoint}/upload/stream`,
        headers,
        onAllComplete: () => {
            if (onUploadComplete) {
                // Use ref to get current files, avoiding stale closure
                const completedFiles = filesRef.current.filter((f) => f.status === 'complete');
                onUploadComplete(completedFiles);
            }
        },
    });
    // Keep ref in sync with files state
    useEffect(() => {
        filesRef.current = files;
    }, [files]);
    // Handle file selection
    const handleFilesSelected = useCallback((newFiles) => {
        addFiles(newFiles);
    }, [addFiles]);
    // Start upload with selected category
    const handleStartUpload = useCallback(async () => {
        await startUpload({
            categoryIds: selectedCategoryId ? [selectedCategoryId] : undefined,
        });
    }, [startUpload, selectedCategoryId]);
    // Handle close
    const handleClose = useCallback(() => {
        if (isUploading) {
            cancelUpload();
        }
        clearAll();
        setSelectedCategoryId(null);
        onClose();
    }, [isUploading, cancelUpload, clearAll, onClose]);
    // Reset on open
    useEffect(() => {
        if (isOpen) {
            clearAll();
            setSelectedCategoryId(null);
        }
    }, [isOpen, clearAll]);
    const queuedCount = files.filter((f) => f.status === 'queued').length;
    const canUpload = queuedCount > 0 && !isUploading;
    return (_jsx(AnimatePresence, { mode: "wait", children: isOpen && (_jsx(motion.div, { className: `curator-overlay rag-upload-modal-overlay ${className}`, initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 }, onClick: handleBackdropClick, role: "dialog", "aria-modal": "true", "aria-labelledby": "upload-modal-title", children: _jsxs(motion.div, { className: "rag-upload-modal", variants: skinMotion.modal, initial: "hidden", animate: "visible", exit: "exit", onClick: (e) => e.stopPropagation(), children: [_jsxs("div", { className: "rag-upload-modal-header", children: [_jsxs("div", { className: "rag-upload-modal-title-row", children: [_jsx(Upload, { size: 20 }), _jsx("h2", { id: "upload-modal-title", children: "Upload Documents" })] }), _jsx("button", { type: "button", onClick: handleClose, className: "rag-upload-modal-close", "aria-label": "Close", children: _jsx(X, { size: 20 }) })] }), _jsxs("div", { className: "rag-upload-modal-content", children: [_jsx(FileDropZone, { onFilesSelected: handleFilesSelected, disabled: isUploading, multiple: true }), hasFiles && (_jsx(FileQueue, { files: files, onRemove: removeFile, onRename: updateFileName, isUploading: isUploading })), hasFiles && categories.length > 0 && (_jsxs("div", { className: "rag-upload-modal-category", children: [_jsx("label", { className: "rag-upload-modal-label", children: "Assign to category (optional)" }), _jsx(CategoryFilter, { categories: categories, selected: selectedCategoryId, onChange: setSelectedCategoryId, mode: "dropdown", placeholder: "Select a category..." })] }))] }), _jsxs("div", { className: "rag-upload-modal-footer", children: [_jsx("button", { type: "button", onClick: handleClose, className: "rag-upload-modal-btn secondary", children: "Cancel" }), _jsx("button", { type: "button", onClick: handleStartUpload, className: "rag-upload-modal-btn primary", disabled: !canUpload, children: isUploading ? (_jsxs(_Fragment, { children: [_jsx(Loader2, { size: 16, className: "spin" }), "Uploading..."] })) : (_jsxs(_Fragment, { children: [_jsx(Upload, { size: 16 }), "Upload ", queuedCount > 0 ? `(${queuedCount})` : ''] })) })] }), completedCount > 0 && !isUploading && (_jsxs("div", { className: "rag-upload-modal-success", children: ["Successfully uploaded ", completedCount, " file", completedCount !== 1 ? 's' : ''] }))] }) })) }));
}
//# sourceMappingURL=UploadModal.js.map