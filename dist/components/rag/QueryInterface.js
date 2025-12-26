import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
/**
 * RAG query interface
 */
import { useState } from 'react';
import { Send, Loader2 } from 'lucide-react';
export function QueryInterface({ queryEndpoint = '/api/rag/query', placeholder = 'Ask a question about your documents...', onQueryResult, onQueryError, }) {
    const [query, setQuery] = useState('');
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!query.trim() || loading)
            return;
        setLoading(true);
        try {
            const response = await fetch(queryEndpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ query }),
            });
            const data = await response.json();
            const queryResult = {
                answer: data.answer,
                sources: data.sources,
            };
            setResult(queryResult);
            onQueryResult?.(queryResult);
        }
        catch (error) {
            console.error('Query failed:', error);
            onQueryError?.(error instanceof Error ? error : new Error('Query failed'));
        }
        finally {
            setLoading(false);
        }
    };
    return (_jsxs("div", { className: "space-y-4", children: [_jsxs("form", { onSubmit: handleSubmit, className: "flex gap-2", children: [_jsx("input", { type: "text", value: query, onChange: (e) => setQuery(e.target.value), placeholder: placeholder, className: "flex-1 px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg", disabled: loading }), _jsx("button", { type: "submit", disabled: loading || !query.trim(), className: "px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg disabled:opacity-50", children: loading ? (_jsx(Loader2, { className: "w-5 h-5 animate-spin" })) : (_jsx(Send, { className: "w-5 h-5" })) })] }), result && (_jsxs("div", { className: "space-y-4", children: [_jsxs("div", { className: "p-4 bg-gray-800 rounded-lg", children: [_jsx("div", { className: "font-medium mb-2", children: "Answer:" }), _jsx("div", { className: "text-gray-300", children: result.answer })] }), result.sources.length > 0 && (_jsxs("div", { className: "space-y-2", children: [_jsx("div", { className: "font-medium", children: "Sources:" }), result.sources.map((source, i) => (_jsxs("div", { className: "p-3 bg-gray-800/50 rounded text-sm", children: [_jsxs("div", { className: "font-medium text-blue-400", children: ["[", i + 1, "] ", source.documentName, source.pageNumber && ` (Page ${source.pageNumber})`] }), _jsx("div", { className: "text-gray-400 mt-1", children: source.snippet })] }, i)))] }))] }))] }));
}
//# sourceMappingURL=QueryInterface.js.map