import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { FileText } from 'lucide-react';
export function SourceCitation({ sources, className = '' }) {
    if (sources.length === 0) {
        return null;
    }
    return (_jsxs("div", { className: `mt-4 space-y-2 ${className}`, children: [_jsx("div", { className: "text-sm font-medium text-gray-400", children: "Sources:" }), sources.map((source, index) => (_jsxs("div", { className: "flex gap-3 p-3 bg-gray-800/50 rounded-lg text-sm", children: [_jsx("div", { className: "flex-shrink-0", children: _jsx(FileText, { className: "w-4 h-4 text-blue-400" }) }), _jsxs("div", { className: "flex-1 min-w-0", children: [_jsxs("div", { className: "font-medium text-blue-400 truncate", children: ["[", index + 1, "] ", source.documentName, source.pageNumber && (_jsxs("span", { className: "text-gray-400 ml-1", children: ["(Page ", source.pageNumber, ")"] }))] }), _jsx("div", { className: "text-gray-400 mt-1 line-clamp-2", children: source.snippet })] })] }, `${source.documentId}-${source.chunkIndex}`)))] }));
}
//# sourceMappingURL=SourceCitation.js.map