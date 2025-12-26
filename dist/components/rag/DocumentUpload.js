import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
/**
 * Document upload component
 */
import { useState, useRef } from 'react';
import { Upload, AlertCircle, Loader2 } from 'lucide-react';
export function DocumentUpload({ uploadEndpoint = '/api/rag/upload', onUploadSuccess, onUploadError, }) {
    const [uploading, setUploading] = useState(false);
    const [progress, setProgress] = useState('');
    const [error, setError] = useState(null);
    const fileInputRef = useRef(null);
    const handleFileSelect = async (e) => {
        const file = e.target.files?.[0];
        if (!file)
            return;
        setUploading(true);
        setError(null);
        setProgress('Reading file...');
        try {
            const formData = new FormData();
            formData.append('file', file);
            setProgress('Processing document...');
            const response = await fetch(uploadEndpoint, {
                method: 'POST',
                body: formData,
            });
            if (!response.ok) {
                throw new Error('Upload failed');
            }
            await response.json();
            setProgress('Document processed successfully!');
            setTimeout(() => {
                setUploading(false);
                setProgress('');
                onUploadSuccess?.();
            }, 2000);
        }
        catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Upload failed';
            setError(errorMessage);
            setUploading(false);
            onUploadError?.(errorMessage);
        }
        // Reset file input
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };
    return (_jsxs("div", { className: "border-2 border-dashed border-gray-700 rounded-lg p-8 text-center", children: [_jsx("input", { ref: fileInputRef, type: "file", onChange: handleFileSelect, accept: ".pdf,.docx,.txt,.md,.html,.png,.jpg,.jpeg,.gif,.bmp,.webp", className: "hidden", disabled: uploading }), _jsxs("button", { onClick: () => fileInputRef.current?.click(), disabled: uploading, className: "flex flex-col items-center gap-4 mx-auto", children: [uploading ? (_jsx(Loader2, { className: "w-12 h-12 text-blue-500 animate-spin" })) : (_jsx(Upload, { className: "w-12 h-12 text-gray-400" })), _jsxs("div", { className: "space-y-2", children: [_jsx("div", { className: "text-lg font-medium", children: uploading ? progress : 'Upload Document' }), _jsx("div", { className: "text-sm text-gray-400", children: "Supports PDF, DOCX, TXT, MD, HTML, Images (PNG, JPG, GIF, BMP, WEBP)" })] })] }), error && (_jsxs("div", { className: "mt-4 flex items-center gap-2 text-red-500 text-sm", children: [_jsx(AlertCircle, { className: "w-4 h-4" }), error] }))] }));
}
//# sourceMappingURL=DocumentUpload.js.map