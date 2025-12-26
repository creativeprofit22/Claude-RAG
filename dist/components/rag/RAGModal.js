import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
/**
 * RAG Documents Management Modal
 */
import { useState, useRef, useEffect } from 'react';
import { X, Upload, FileText, Trash2, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
export function RAGModal({ isOpen, onClose, apiBaseUrl = '/api/rag', itemsPerPage = 5, title = 'RAG Documents', }) {
    const [uploading, setUploading] = useState(false);
    const [loading, setLoading] = useState(false);
    const [documents, setDocuments] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [isDragging, setIsDragging] = useState(false);
    const fileInputRef = useRef(null);
    // Load documents on mount
    useEffect(() => {
        if (isOpen) {
            loadDocuments(true); // Show loading spinner on initial load
        }
    }, [isOpen]);
    // Handle ESC key to close modal
    useEffect(() => {
        const handleEscape = (e) => {
            if (e.key === 'Escape' && isOpen) {
                onClose();
            }
        };
        document.addEventListener('keydown', handleEscape);
        return () => {
            document.removeEventListener('keydown', handleEscape);
        };
    }, [isOpen, onClose]);
    const loadDocuments = async (showLoading = false) => {
        if (showLoading) {
            setLoading(true);
        }
        try {
            const response = await fetch(`${apiBaseUrl}/documents`);
            const data = await response.json();
            if (data.success) {
                setDocuments(data.documents);
            }
        }
        catch (error) {
            console.error('Failed to load documents:', error);
        }
        finally {
            if (showLoading) {
                setLoading(false);
            }
        }
    };
    const handleFileSelect = async (file) => {
        setUploading(true);
        try {
            const formData = new FormData();
            formData.append('file', file);
            const response = await fetch(`${apiBaseUrl}/upload`, {
                method: 'POST',
                body: formData,
            });
            const data = await response.json();
            if (response.ok) {
                await loadDocuments();
                setCurrentPage(1);
            }
            else {
                alert(`Upload failed: ${data.error || 'Unknown error'}`);
            }
        }
        catch (error) {
            alert(`Upload failed: ${error instanceof Error ? error.message : 'Network error'}`);
        }
        finally {
            setUploading(false);
            // Reset file input
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        }
    };
    const handleInputChange = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            handleFileSelect(file);
        }
    };
    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragging(false);
        const file = e.dataTransfer.files[0];
        if (file) {
            handleFileSelect(file);
        }
    };
    const handleDragOver = (e) => {
        e.preventDefault();
        setIsDragging(true);
    };
    const handleDragLeave = () => {
        setIsDragging(false);
    };
    const handleDelete = async (documentId) => {
        try {
            const response = await fetch(`${apiBaseUrl}/documents/${documentId}`, {
                method: 'DELETE',
            });
            if (response.ok) {
                await loadDocuments();
                // Adjust page if needed
                const totalPages = Math.ceil((documents.length - 1) / itemsPerPage);
                if (currentPage > totalPages) {
                    setCurrentPage(Math.max(1, totalPages));
                }
            }
        }
        catch (error) {
            console.error('Delete failed:', error);
        }
    };
    // Truncate filename to 30 characters
    const truncateFilename = (filename, maxLength = 30) => {
        if (filename.length <= maxLength)
            return filename;
        // Try to keep file extension
        const lastDotIndex = filename.lastIndexOf('.');
        if (lastDotIndex > 0 && filename.length - lastDotIndex <= 5) {
            const extension = filename.substring(lastDotIndex);
            const nameWithoutExt = filename.substring(0, lastDotIndex);
            const truncatedName = nameWithoutExt.substring(0, maxLength - extension.length - 3);
            return `${truncatedName}...${extension}`;
        }
        // No extension or extension too long, just truncate
        return filename.substring(0, maxLength - 3) + '...';
    };
    // Pagination
    const totalPages = Math.ceil(documents.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentDocuments = documents.slice(startIndex, endIndex);
    const handleClose = () => {
        onClose();
    };
    if (!isOpen)
        return null;
    return (_jsxs(_Fragment, { children: [_jsx("div", { className: "fixed inset-0 bg-black/50 backdrop-blur-sm z-40" }), _jsx("div", { className: "fixed inset-0 flex items-center justify-center z-50 p-4", onClick: handleClose, children: _jsxs("div", { className: "bg-gray-900 rounded-lg shadow-xl border border-gray-800 w-full max-w-2xl max-h-[80vh] flex flex-col", onClick: (e) => {
                        e.stopPropagation();
                    }, children: [_jsxs("div", { className: "flex items-center justify-between p-6 border-b border-gray-800", children: [_jsx("h1", { className: "text-xl font-semibold", children: title }), _jsx("button", { type: "button", onClick: handleClose, className: "p-2 hover:bg-gray-800 rounded-lg transition-colors", children: _jsx(X, { className: "w-5 h-5" }) })] }), _jsxs("div", { className: "flex-1 overflow-y-auto p-6 space-y-6", children: [_jsxs("div", { className: `border-2 border-dashed rounded-lg p-8 text-center transition-colors ${isDragging
                                        ? 'border-blue-500 bg-blue-500/10'
                                        : 'border-gray-700 hover:border-gray-600'}`, onDrop: handleDrop, onDragOver: handleDragOver, onDragLeave: handleDragLeave, children: [_jsx("input", { ref: fileInputRef, type: "file", onChange: handleInputChange, accept: ".pdf,.docx,.txt,.md,.html,.png,.jpg,.jpeg,.gif,.bmp,.webp", className: "hidden", disabled: uploading }), _jsxs("button", { type: "button", onClick: () => fileInputRef.current?.click(), disabled: uploading, className: "flex flex-col items-center gap-4 mx-auto", children: [uploading ? (_jsx(Loader2, { className: "w-12 h-12 text-blue-500 animate-spin" })) : (_jsx(Upload, { className: "w-12 h-12 text-gray-400" })), _jsxs("div", { className: "space-y-2", children: [_jsx("div", { className: "text-lg font-medium", children: uploading ? 'Processing...' : 'Upload Document' }), _jsx("div", { className: "text-sm text-gray-400", children: "Click or drag files here (PDF, DOCX, TXT, MD, HTML, Images)" })] })] })] }), _jsxs("div", { className: "space-y-3", children: [_jsx("div", { className: "flex items-center justify-between", children: _jsxs("h3", { className: "text-sm font-medium text-gray-400", children: ["Uploaded Documents (", documents.length, ")"] }) }), loading ? (_jsx("div", { className: "flex items-center justify-center py-8", children: _jsx(Loader2, { className: "w-6 h-6 animate-spin text-gray-400" }) })) : documents.length === 0 ? (_jsx("div", { className: "text-center py-8 text-gray-500", children: "No documents uploaded yet" })) : (_jsxs(_Fragment, { children: [_jsx("div", { className: "space-y-2", children: currentDocuments.map((doc) => (_jsxs("div", { className: "flex items-center justify-between p-4 bg-gray-800/50 rounded-lg hover:bg-gray-800 transition-colors", children: [_jsxs("div", { className: "flex items-center gap-3 flex-1 min-w-0", children: [_jsx(FileText, { className: "w-5 h-5 text-blue-400 flex-shrink-0" }), _jsxs("div", { className: "flex-1 min-w-0", children: [_jsx("div", { className: "font-medium truncate", title: doc.documentName || doc.id, children: truncateFilename(doc.documentName || doc.id) }), _jsxs("div", { className: "text-sm text-gray-400", children: [doc.chunkCount, " chunks ", doc.totalTokens.toLocaleString(), " tokens"] })] })] }), _jsx("button", { type: "button", onClick: () => handleDelete(doc.id), className: "p-2 hover:bg-red-500/10 text-red-400 hover:text-red-300 rounded-lg transition-colors flex-shrink-0", "aria-label": "Delete document", children: _jsx(Trash2, { className: "w-4 h-4" }) })] }, doc.id))) }), totalPages > 1 && (_jsxs("div", { className: "flex items-center justify-between pt-4 border-t border-gray-800", children: [_jsxs("div", { className: "text-sm text-gray-400", children: ["Page ", currentPage, " of ", totalPages] }), _jsxs("div", { className: "flex gap-2", children: [_jsx("button", { type: "button", onClick: () => setCurrentPage((p) => Math.max(1, p - 1)), disabled: currentPage === 1, className: "p-2 hover:bg-gray-800 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed", children: _jsx(ChevronLeft, { className: "w-4 h-4" }) }), _jsx("button", { type: "button", onClick: () => setCurrentPage((p) => Math.min(totalPages, p + 1)), disabled: currentPage === totalPages, className: "p-2 hover:bg-gray-800 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed", children: _jsx(ChevronRight, { className: "w-4 h-4" }) })] })] }))] }))] })] })] }) })] }));
}
//# sourceMappingURL=RAGModal.js.map