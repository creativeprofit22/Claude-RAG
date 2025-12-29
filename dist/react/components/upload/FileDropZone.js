import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
/**
 * FileDropZone - Drag and drop area for file uploads
 */
import { useState, useCallback, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Upload, FileText, AlertCircle } from 'lucide-react';
import { SUPPORTED_EXTENSIONS, SUPPORTED_MIME_TYPES } from '../../../shared/file-types.js';
import { useSkinMotion } from '../../motion/hooks/useSkinMotion.js';
/**
 * Check if a file is acceptable by MIME type or extension
 */
function isAcceptableFile(file) {
    const ext = '.' + file.name.split('.').pop()?.toLowerCase();
    return SUPPORTED_MIME_TYPES.includes(file.type) ||
        SUPPORTED_EXTENSIONS.includes(ext);
}
export function FileDropZone({ onFilesSelected, accept = [...SUPPORTED_EXTENSIONS, ...SUPPORTED_MIME_TYPES].join(','), multiple = true, disabled = false, className = '', }) {
    const [isDragging, setIsDragging] = useState(false);
    const [error, setError] = useState(null);
    const [showSuccess, setShowSuccess] = useState(false);
    const inputRef = useRef(null);
    const { motion: skinMotion, reducedMotion } = useSkinMotion();
    const handleDragEnter = useCallback((e) => {
        e.preventDefault();
        e.stopPropagation();
        if (!disabled) {
            setIsDragging(true);
            setError(null);
        }
    }, [disabled]);
    const handleDragLeave = useCallback((e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
    }, []);
    const handleDragOver = useCallback((e) => {
        e.preventDefault();
        e.stopPropagation();
    }, []);
    const processFiles = useCallback((fileList) => {
        if (!fileList || fileList.length === 0)
            return;
        const files = Array.from(fileList);
        const validFiles = files.filter(isAcceptableFile);
        const invalidCount = files.length - validFiles.length;
        if (invalidCount > 0) {
            setError(`${invalidCount} file(s) skipped. Supported: PDF, DOCX, TXT, MD, HTML, XLSX, XLS, CSV`);
        }
        else {
            setError(null);
        }
        if (validFiles.length > 0) {
            if (!multiple && validFiles.length > 1) {
                onFilesSelected([validFiles[0]]);
            }
            else {
                onFilesSelected(validFiles);
            }
            // Trigger success pulse animation
            setShowSuccess(true);
        }
        // Note: onFilesSelected is included in deps; ensure parent memoizes it with useCallback
    }, [multiple, onFilesSelected]);
    const handleDrop = useCallback((e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
        if (disabled)
            return;
        processFiles(e.dataTransfer.files);
    }, [disabled, processFiles]);
    const handleInputChange = useCallback((e) => {
        processFiles(e.target.files);
        // Reset input so same file can be selected again
        if (inputRef.current) {
            inputRef.current.value = '';
        }
    }, [processFiles]);
    const handleClick = useCallback(() => {
        if (!disabled) {
            inputRef.current?.click();
        }
    }, [disabled]);
    const handleKeyDown = useCallback((e) => {
        if ((e.key === 'Enter' || e.key === ' ') && !disabled) {
            e.preventDefault();
            inputRef.current?.click();
        }
    }, [disabled]);
    // Reset success pulse after animation completes
    useEffect(() => {
        if (showSuccess) {
            const timer = setTimeout(() => setShowSuccess(false), 2000);
            return () => clearTimeout(timer);
        }
    }, [showSuccess]);
    return (_jsxs(motion.div, { className: `rag-upload-dropzone ${isDragging ? 'dragging' : ''} ${showSuccess ? 'success' : ''} ${disabled ? 'disabled' : ''} ${className}`, onDragEnter: handleDragEnter, onDragLeave: handleDragLeave, onDragOver: handleDragOver, onDrop: handleDrop, onClick: handleClick, onKeyDown: handleKeyDown, role: "button", tabIndex: disabled ? -1 : 0, "aria-label": "Drop files here or click to select", whileHover: !disabled && !reducedMotion ? skinMotion.hover : undefined, whileTap: !disabled && !reducedMotion ? skinMotion.tap : undefined, children: [_jsx("input", { ref: inputRef, type: "file", accept: accept, multiple: multiple, onChange: handleInputChange, disabled: disabled, className: "rag-upload-input", "aria-hidden": "true" }), _jsxs("div", { className: "rag-upload-dropzone-content", children: [_jsx("div", { className: `rag-upload-dropzone-icon ${isDragging ? 'active' : ''}`, children: isDragging ? _jsx(FileText, { size: 32 }) : _jsx(Upload, { size: 32 }) }), _jsxs("div", { className: "rag-upload-dropzone-text", children: [_jsx("span", { className: "rag-upload-dropzone-title", children: isDragging ? 'Drop files here' : 'Drop files here or click to select' }), _jsx("span", { className: "rag-upload-dropzone-subtitle", children: "PDF, DOCX, Excel, CSV, TXT, MD, HTML" })] })] }), error && (_jsxs("div", { className: "rag-upload-dropzone-error", children: [_jsx(AlertCircle, { size: 14 }), _jsx("span", { children: error })] }))] }));
}
//# sourceMappingURL=FileDropZone.js.map