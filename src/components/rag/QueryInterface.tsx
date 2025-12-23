/**
 * RAG query interface
 */
import React, { useState } from 'react';
import { Send, Loader2 } from 'lucide-react';

export interface Source {
  documentName: string;
  pageNumber?: number;
  snippet: string;
}

export interface QueryResult {
  answer: string;
  sources: Source[];
}

export interface QueryInterfaceProps {
  /** API endpoint for querying documents (default: /api/rag/query) */
  queryEndpoint?: string;
  /** Placeholder text for the input field */
  placeholder?: string;
  /** Callback when query result is received */
  onQueryResult?: (result: QueryResult) => void;
  /** Callback when query fails */
  onQueryError?: (error: Error) => void;
}

export function QueryInterface({
  queryEndpoint = '/api/rag/query',
  placeholder = 'Ask a question about your documents...',
  onQueryResult,
  onQueryError,
}: QueryInterfaceProps) {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<QueryResult | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim() || loading) return;

    setLoading(true);
    try {
      const response = await fetch(queryEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query }),
      });

      const data = await response.json();
      const queryResult: QueryResult = {
        answer: data.answer,
        sources: data.sources,
      };
      setResult(queryResult);
      onQueryResult?.(queryResult);
    } catch (error) {
      console.error('Query failed:', error);
      onQueryError?.(error instanceof Error ? error : new Error('Query failed'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={placeholder}
          className="flex-1 px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg"
          disabled={loading}
        />
        <button
          type="submit"
          disabled={loading || !query.trim()}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg disabled:opacity-50"
        >
          {loading ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <Send className="w-5 h-5" />
          )}
        </button>
      </form>

      {result && (
        <div className="space-y-4">
          <div className="p-4 bg-gray-800 rounded-lg">
            <div className="font-medium mb-2">Answer:</div>
            <div className="text-gray-300">{result.answer}</div>
          </div>

          {result.sources.length > 0 && (
            <div className="space-y-2">
              <div className="font-medium">Sources:</div>
              {result.sources.map((source, i) => (
                <div key={i} className="p-3 bg-gray-800/50 rounded text-sm">
                  <div className="font-medium text-blue-400">
                    [{i + 1}] {source.documentName}
                    {source.pageNumber && ` (Page ${source.pageNumber})`}
                  </div>
                  <div className="text-gray-400 mt-1">{source.snippet}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
