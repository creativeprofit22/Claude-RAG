'use client';

import { Trash2, Database } from 'lucide-react';
import { DEFAULT_ACCENT_COLOR } from '../types.js';

export interface ChatHeaderProps {
  title?: string;
  accentColor?: string;
  isTyping?: boolean;
  messageCount?: number;
  onClearChat?: () => void;
}

export function ChatHeader({
  title = 'RAG Assistant',
  accentColor = DEFAULT_ACCENT_COLOR,
  isTyping = false,
  messageCount = 0,
  onClearChat,
}: ChatHeaderProps) {
  return (
    <div className="rag-chat-header">
      <div className="rag-chat-header-content">
        {/* Icon and Title */}
        <div className="rag-chat-header-info">
          <div
            className="rag-chat-header-icon"
            style={{ boxShadow: `0 0 20px ${accentColor}20` }}
          >
            <Database
              size={20}
              style={{ color: accentColor }}
              aria-hidden="true"
            />
          </div>
          <div>
            <h3 className="rag-chat-header-title">{title}</h3>
            <p className="rag-chat-header-status">
              {isTyping ? 'Thinking...' : 'Ready'}
            </p>
          </div>
        </div>

        {/* Clear Chat Button */}
        {messageCount > 0 && onClearChat && (
          <button
            type="button"
            onClick={onClearChat}
            className="curator-btn curator-btn-icon rag-chat-header-clear"
            title="Clear chat"
          >
            <Trash2 size={16} aria-hidden="true" />
          </button>
        )}
      </div>
    </div>
  );
}
