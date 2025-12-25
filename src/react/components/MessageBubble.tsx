'use client';

import { FileText, ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';
import { DEFAULT_ACCENT_COLOR, type ChatMessage } from '../types.js';
import { LoadingDots } from './LoadingDots.js';

interface MessageBubbleProps {
  message: ChatMessage;
  accentColor?: string;
  showSources?: boolean;
}

export function MessageBubble({
  message,
  accentColor = DEFAULT_ACCENT_COLOR,
  showSources = true,
}: MessageBubbleProps) {
  const isUser = message.role === 'user';
  const [sourcesExpanded, setSourcesExpanded] = useState(false);

  const time = message.timestamp.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  });

  const sources = message.sources ?? [];
  const hasSources = showSources && sources.length > 0;

  return (
    <div className={`rag-message ${isUser ? 'rag-message-user' : 'rag-message-assistant'}`}>
      <div className={`rag-message-content ${isUser ? 'rag-message-content-user' : 'rag-message-content-assistant'}`}>
        {/* Message bubble */}
        <div
          className={`rag-message-bubble ${isUser ? 'rag-message-bubble-user' : 'rag-message-bubble-assistant'}`}
          style={
            isUser
              ? {
                  boxShadow: `0 0 20px ${accentColor}15`,
                  borderColor: `${accentColor}20`,
                }
              : undefined
          }
        >
          {message.isLoading ? (
            <div className="rag-message-loading">
              <LoadingDots accentColor={accentColor} />
            </div>
          ) : (
            <p className="rag-message-text">{message.content}</p>
          )}
        </div>

        {/* Sources accordion */}
        {hasSources && !message.isLoading && (
          <div className="rag-message-sources">
            <button
              onClick={() => setSourcesExpanded(!sourcesExpanded)}
              className="rag-sources-toggle"
            >
              <FileText size={14} />
              <span>{sources.length} source{sources.length > 1 ? 's' : ''}</span>
              {sourcesExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            </button>

            {sourcesExpanded && (
              <div className="rag-sources-list">
                {sources.map((source, i) => (
                  <div key={`${source.documentId}-${source.chunkIndex}-${i}`} className="rag-source-item">
                    <div className="rag-source-header">
                      <span className="rag-source-badge" style={{ backgroundColor: `${accentColor}20`, color: accentColor }}>
                        [{i + 1}]
                      </span>
                      <span className="rag-source-name">{source.documentName}</span>
                      <span className="rag-source-chunk">Chunk {source.chunkIndex}</span>
                    </div>
                    <p className="rag-source-snippet">{source.snippet}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Timestamp */}
        <span className="rag-message-time">{time}</span>
      </div>
    </div>
  );
}
