'use client';

import { FileText, ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';
import { m, AnimatePresence } from 'framer-motion';
import { DEFAULT_ACCENT_COLOR, type ChatMessage } from '../types.js';
import { LoadingDots } from './LoadingDots.js';
import { useSkinMotion } from '../motion/hooks/useSkinMotion.js';

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
  const { motion } = useSkinMotion();

  const time = message.timestamp.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  });

  const sources = message.sources ?? [];
  const hasSources = showSources && sources.length > 0;

  return (
    <m.div
      className={`rag-message ${isUser ? 'rag-message-user' : 'rag-message-assistant'}`}
      initial="hidden"
      animate="visible"
      exit="exit"
      variants={motion.message}
    >
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

            <AnimatePresence>
              {sourcesExpanded && (
                <m.div
                  className="rag-sources-list"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={motion.transition.default}
                >
                  {sources.map((source, i) => (
                    <m.div
                      key={`${source.documentId}-${source.chunkIndex}-${i}`}
                      className="rag-source-item"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ ...motion.transition.fast, delay: i * motion.stagger.children }}
                    >
                      <div className="rag-source-header">
                        <span className="rag-source-badge" style={{ backgroundColor: `${accentColor}20`, color: accentColor }}>
                          [{i + 1}]
                        </span>
                        <span className="rag-source-name">{source.documentName}</span>
                        <span className="rag-source-chunk">Chunk {source.chunkIndex}</span>
                      </div>
                      <p className="rag-source-snippet">{source.snippet}</p>
                    </m.div>
                  ))}
                </m.div>
              )}
            </AnimatePresence>
          </div>
        )}

        {/* Timestamp */}
        <m.span
          className="rag-message-time"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ ...motion.transition.slow, delay: 0.3 }}
        >
          {time}
        </m.span>
      </div>
    </m.div>
  );
}
