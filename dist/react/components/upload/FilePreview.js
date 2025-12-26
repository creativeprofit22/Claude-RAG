import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
/**
 * FilePreview - Preview of file content with chunk estimation
 */
import { useEffect, useState } from 'react';
import { FileText, Hash, Clock, AlertTriangle } from 'lucide-react';
import { formatFileSize } from '../../utils/format.js';
const FILE_TYPE_LABELS = {
    pdf: 'PDF',
    docx: 'DOCX',
    txt: 'Text',
    md: 'Markdown',
    html: 'HTML',
    htm: 'HTML',
};
/**
 * Get file type label from extension
 */
function getFileTypeLabel(file) {
    const ext = file.name.split('.').pop()?.toLowerCase() || '';
    return FILE_TYPE_LABELS[ext] ?? (ext.toUpperCase() || 'File');
}
export function FilePreview({ file, preview, estimatedChunks, maxPreviewLength = 500, className = '', estimateEndpoint = '/api/rag/upload/estimate', onEstimate, }) {
    const [estimate, setEstimate] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    // Fetch chunk estimate when preview is available
    useEffect(() => {
        if (!preview || estimatedChunks !== undefined)
            return;
        const fetchEstimate = async () => {
            setIsLoading(true);
            try {
                const response = await fetch(estimateEndpoint, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ text: preview }),
                });
                if (response.ok) {
                    const data = await response.json();
                    setEstimate(data);
                    onEstimate?.(data);
                }
            }
            catch {
                // Silently fail - estimate is optional
            }
            finally {
                setIsLoading(false);
            }
        };
        fetchEstimate();
    }, [preview, estimatedChunks, onEstimate]);
    const displayedPreview = preview
        ? preview.length > maxPreviewLength
            ? preview.slice(0, maxPreviewLength) + '...'
            : preview
        : null;
    const chunks = estimatedChunks ?? estimate?.estimatedChunks;
    const isLargeFile = file.size > 5 * 1024 * 1024; // > 5MB
    return (_jsxs("div", { className: `rag-upload-preview ${className}`, children: [_jsxs("div", { className: "rag-upload-preview-header", children: [_jsx("div", { className: "rag-upload-preview-icon", children: _jsx(FileText, { size: 20 }) }), _jsxs("div", { className: "rag-upload-preview-meta", children: [_jsx("span", { className: "rag-upload-preview-name", title: file.name, children: file.name }), _jsxs("div", { className: "rag-upload-preview-details", children: [_jsx("span", { className: "rag-upload-preview-type", children: getFileTypeLabel(file) }), _jsx("span", { className: "rag-upload-preview-size", children: formatFileSize(file.size) }), chunks !== undefined && (_jsxs("span", { className: "rag-upload-preview-chunks", children: [_jsx(Hash, { size: 12 }), "~", chunks, " chunks"] })), isLoading && (_jsxs("span", { className: "rag-upload-preview-loading", children: [_jsx(Clock, { size: 12 }), "Estimating..."] }))] })] })] }), isLargeFile && (_jsxs("div", { className: "rag-upload-preview-warning", children: [_jsx(AlertTriangle, { size: 14 }), _jsx("span", { children: "Large file - processing may take a moment" })] })), displayedPreview && (_jsx("div", { className: "rag-upload-preview-content", children: _jsx("pre", { children: displayedPreview }) })), !preview && !isLargeFile && (_jsx("div", { className: "rag-upload-preview-empty", children: "Preview will be available after processing" }))] }));
}
//# sourceMappingURL=FilePreview.js.map