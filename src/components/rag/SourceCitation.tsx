/**
 * Source citation component
 */
import React from 'react';
import { FileText } from 'lucide-react';

export interface Source {
  documentId: string;
  documentName: string;
  chunkIndex: number;
  pageNumber?: number;
  snippet: string;
}

export interface SourceCitationProps {
  sources: Source[];
  /** Custom class name for the container */
  className?: string;
}

export function SourceCitation({ sources, className = '' }: SourceCitationProps) {
  if (sources.length === 0) {
    return null;
  }

  return (
    <div className={`mt-4 space-y-2 ${className}`}>
      <div className="text-sm font-medium text-gray-400">Sources:</div>
      {sources.map((source, index) => (
        <div
          key={`${source.documentId}-${source.chunkIndex}`}
          className="flex gap-3 p-3 bg-gray-800/50 rounded-lg text-sm"
        >
          <div className="flex-shrink-0">
            <FileText className="w-4 h-4 text-blue-400" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="font-medium text-blue-400 truncate">
              [{index + 1}] {source.documentName}
              {source.pageNumber && (
                <span className="text-gray-400 ml-1">
                  (Page {source.pageNumber})
                </span>
              )}
            </div>
            <div className="text-gray-400 mt-1 line-clamp-2">
              {source.snippet}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
