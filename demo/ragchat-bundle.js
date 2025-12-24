/**
 * RAGChat Browser Bundle
 * Self-contained React component for browser use
 */

const { useState, useRef, useEffect, useCallback } = React;

// Default accent color
const DEFAULT_ACCENT_COLOR = '#6366f1';

// Lucide icons (from CDN)
const createIcon = (paths, size = 24, color = 'currentColor') => {
  return React.createElement('svg', {
    xmlns: 'http://www.w3.org/2000/svg',
    width: size,
    height: size,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: color,
    strokeWidth: 2,
    strokeLinecap: 'round',
    strokeLinejoin: 'round'
  }, paths.map((d, i) => React.createElement('path', { key: i, d })));
};

const Database = ({ size = 24, style }) => createIcon([
  'M12 3c4.97 0 9 1.79 9 4s-4.03 4-9 4-9-1.79-9-4 4.03-4 9-4Z',
  'M3 7v10c0 2.21 4.03 4 9 4s9-1.79 9-4V7',
  'M3 12c0 2.21 4.03 4 9 4s9-1.79 9-4'
], size, style?.color);

const Send = ({ size = 24, style }) => createIcon([
  'M22 2 11 13',
  'M22 2l-7 20-4-9-9-4 20-7z'
], size, style?.color);

const Trash2 = ({ size = 24 }) => createIcon([
  'M3 6h18',
  'M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6',
  'M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2',
  'M10 11v6',
  'M14 11v6'
], size);

const X = ({ size = 24 }) => createIcon([
  'M18 6 6 18',
  'M6 6l12 12'
], size);

const AlertCircle = ({ size = 24 }) => createIcon([
  'M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z',
  'M12 8v4',
  'M12 16h.01'
], size);

const ChevronDown = ({ size = 24 }) => createIcon([
  'M6 9l6 6 6-6'
], size);

const ChevronUp = ({ size = 24 }) => createIcon([
  'M18 15l-6-6-6 6'
], size);

const FileText = ({ size = 24 }) => createIcon([
  'M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z',
  'M14 2v6h6',
  'M16 13H8',
  'M16 17H8',
  'M10 9H8'
], size);

// Styles (injected once)
const injectStyles = (() => {
  let injected = false;
  return () => {
    if (injected) return;
    injected = true;

    const css = `
      .rag-chat { display: flex; flex-direction: column; height: 100%; background-color: #0a0a0f; color: #ffffff; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; }
      .rag-chat-header { flex-shrink: 0; padding: 1rem 1.5rem; border-bottom: 1px solid rgba(255,255,255,0.1); background: linear-gradient(to right, rgba(255,255,255,0.05), transparent); }
      .rag-chat-header-content { display: flex; align-items: center; justify-content: space-between; }
      .rag-chat-header-info { display: flex; align-items: center; gap: 0.75rem; }
      .rag-chat-header-icon { padding: 0.5rem; border-radius: 0.75rem; background-color: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); }
      .rag-chat-header-title { font-size: 0.875rem; font-weight: 600; color: #ffffff; margin: 0; }
      .rag-chat-header-status { font-size: 0.75rem; color: #9ca3af; margin: 0; }
      .rag-chat-header-clear { padding: 0.5rem; border-radius: 0.5rem; background-color: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); color: #9ca3af; cursor: pointer; transition: all 0.2s; }
      .rag-chat-header-clear:hover { background-color: rgba(255,255,255,0.1); color: #ef4444; }
      .rag-chat-messages { flex: 1; overflow-y: auto; padding: 1.5rem; display: flex; flex-direction: column; gap: 0.25rem; }
      .rag-empty-state { display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100%; text-align: center; padding: 2rem; }
      .rag-empty-icon { padding: 1rem; border-radius: 1rem; background-color: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); margin-bottom: 1rem; }
      .rag-empty-title { font-size: 1.125rem; font-weight: 600; color: #ffffff; margin: 0 0 0.5rem 0; }
      .rag-empty-description { font-size: 0.875rem; color: #9ca3af; max-width: 20rem; margin: 0; }
      .rag-message { display: flex; margin-bottom: 1rem; }
      .rag-message-user { justify-content: flex-end; }
      .rag-message-assistant { justify-content: flex-start; }
      .rag-message-content { display: flex; flex-direction: column; max-width: 75%; }
      .rag-message-content-user { align-items: flex-end; }
      .rag-message-content-assistant { align-items: flex-start; }
      .rag-message-bubble { padding: 0.75rem 1rem; backdrop-filter: blur(8px); transition: all 0.2s; }
      .rag-message-bubble-user { background: linear-gradient(to bottom right, rgba(255,255,255,0.1), rgba(255,255,255,0.05)); border: 1px solid rgba(255,255,255,0.1); border-radius: 1rem 1rem 0.25rem 1rem; }
      .rag-message-bubble-assistant { background-color: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); border-radius: 1rem 1rem 1rem 0.25rem; }
      .rag-message-text { font-size: 0.875rem; color: #ffffff; line-height: 1.6; white-space: pre-wrap; word-break: break-word; margin: 0; }
      .rag-message-time { font-size: 0.75rem; color: #6b7280; margin-top: 0.25rem; padding: 0 0.5rem; }
      .rag-message-sources { margin-top: 0.5rem; width: 100%; }
      .rag-sources-toggle { display: flex; align-items: center; gap: 0.5rem; padding: 0.375rem 0.75rem; font-size: 0.75rem; color: #9ca3af; background-color: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); border-radius: 0.5rem; cursor: pointer; transition: all 0.2s; }
      .rag-sources-toggle:hover { background-color: rgba(255,255,255,0.1); color: #ffffff; }
      .rag-sources-list { margin-top: 0.5rem; display: flex; flex-direction: column; gap: 0.5rem; }
      .rag-source-item { padding: 0.75rem; background-color: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.05); border-radius: 0.5rem; }
      .rag-source-header { display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.375rem; }
      .rag-source-badge { padding: 0.125rem 0.375rem; font-size: 0.625rem; font-weight: 600; border-radius: 0.25rem; }
      .rag-source-name { font-size: 0.75rem; font-weight: 500; color: #ffffff; }
      .rag-source-chunk { font-size: 0.625rem; color: #6b7280; margin-left: auto; }
      .rag-source-snippet { font-size: 0.75rem; color: #9ca3af; line-height: 1.5; margin: 0; }
      .rag-typing-indicator { display: flex; align-items: center; gap: 0.5rem; padding: 0.75rem 1rem; background-color: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); border-radius: 1rem 1rem 1rem 0.25rem; max-width: 5rem; }
      .rag-typing-dots { display: flex; gap: 0.25rem; }
      .rag-typing-dot { width: 0.5rem; height: 0.5rem; border-radius: 50%; animation: rag-bounce 1s infinite; }
      @keyframes rag-bounce { 0%, 60%, 100% { transform: translateY(0); } 30% { transform: translateY(-0.375rem); } }
      .rag-chat-input-container { flex-shrink: 0; padding: 1rem 1.5rem; border-top: 1px solid rgba(255,255,255,0.1); background: linear-gradient(to right, rgba(255,255,255,0.05), transparent); }
      .rag-chat-input-wrapper { display: flex; align-items: flex-end; gap: 0.75rem; }
      .rag-chat-input { flex: 1; background-color: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); border-radius: 0.75rem; padding: 0.75rem 1rem; font-size: 0.875rem; color: #ffffff; outline: none; transition: all 0.2s; }
      .rag-chat-input::placeholder { color: #6b7280; }
      .rag-chat-input:focus { border-color: rgba(255,255,255,0.2); }
      .rag-chat-input:disabled { opacity: 0.5; cursor: not-allowed; }
      .rag-chat-send-button { padding: 0.75rem; border-radius: 0.75rem; background-color: rgba(255,255,255,0.05); border: none; color: #6b7280; cursor: pointer; transition: all 0.2s; display: flex; align-items: center; justify-content: center; }
      .rag-chat-send-button:hover:not(:disabled) { transform: scale(1.05); }
      .rag-chat-send-button:active:not(:disabled) { transform: scale(0.95); }
      .rag-chat-send-button:disabled { opacity: 0.4; cursor: not-allowed; }
      .rag-chat-send-button:not(:disabled) { color: #ffffff; }
      .rag-error-banner { display: flex; align-items: center; gap: 0.5rem; padding: 0.75rem 1rem; background-color: rgba(239,68,68,0.1); border-bottom: 1px solid rgba(239,68,68,0.2); color: #fca5a5; font-size: 0.875rem; }
      .rag-error-dismiss { background: none; border: none; color: inherit; cursor: pointer; padding: 0.25rem; margin-left: auto; opacity: 0.7; }
      .rag-error-dismiss:hover { opacity: 1; }
      .rag-chat-messages::-webkit-scrollbar { width: 6px; }
      .rag-chat-messages::-webkit-scrollbar-track { background: transparent; }
      .rag-chat-messages::-webkit-scrollbar-thumb { background-color: rgba(255,255,255,0.1); border-radius: 3px; }
      .rag-chat-messages::-webkit-scrollbar-thumb:hover { background-color: rgba(255,255,255,0.2); }
    `;

    const style = document.createElement('style');
    style.textContent = css;
    document.head.appendChild(style);
  };
})();

// Loading dots component
function LoadingDots({ color = DEFAULT_ACCENT_COLOR }) {
  return React.createElement('div', { className: 'rag-typing-dots' },
    [0, 1, 2].map(i =>
      React.createElement('span', {
        key: i,
        className: 'rag-typing-dot',
        style: { backgroundColor: color, animationDelay: `${i * 0.15}s` }
      })
    )
  );
}

// Typing indicator
function TypingIndicator({ accentColor = DEFAULT_ACCENT_COLOR }) {
  return React.createElement('div', { className: 'rag-typing-indicator' },
    React.createElement(LoadingDots, { color: accentColor })
  );
}

// Chat header
function ChatHeader({ title, accentColor, isTyping, messageCount, onClearChat }) {
  return React.createElement('div', { className: 'rag-chat-header' },
    React.createElement('div', { className: 'rag-chat-header-content' },
      React.createElement('div', { className: 'rag-chat-header-info' },
        React.createElement('div', { className: 'rag-chat-header-icon' },
          React.createElement(Database, { size: 20, style: { color: accentColor } })
        ),
        React.createElement('div', null,
          React.createElement('h2', { className: 'rag-chat-header-title' }, title),
          React.createElement('p', { className: 'rag-chat-header-status' },
            isTyping ? 'Thinking...' : `${messageCount} messages`
          )
        )
      ),
      messageCount > 0 && React.createElement('button', {
        type: 'button',
        className: 'rag-chat-header-clear',
        onClick: onClearChat,
        'aria-label': 'Clear chat'
      }, React.createElement(Trash2, { size: 16 }))
    )
  );
}

// Chat input
function ChatInput({ placeholder, accentColor, onSendMessage, disabled }) {
  const [value, setValue] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (value.trim() && !disabled) {
      onSendMessage(value.trim());
      setValue('');
    }
  };

  return React.createElement('div', { className: 'rag-chat-input-container' },
    React.createElement('form', { onSubmit: handleSubmit, className: 'rag-chat-input-wrapper' },
      React.createElement('input', {
        type: 'text',
        className: 'rag-chat-input',
        placeholder,
        value,
        onChange: (e) => setValue(e.target.value),
        disabled
      }),
      React.createElement('button', {
        type: 'submit',
        className: 'rag-chat-send-button',
        disabled: disabled || !value.trim(),
        style: value.trim() ? { backgroundColor: accentColor } : {}
      }, React.createElement(Send, { size: 18 }))
    )
  );
}

// Message bubble
function MessageBubble({ message, accentColor, showSources }) {
  const [sourcesOpen, setSourcesOpen] = useState(false);
  const isUser = message.role === 'user';
  const hasSources = showSources && message.sources && message.sources.length > 0;

  const formatTime = (date) => {
    return new Date(date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return React.createElement('div', { className: `rag-message rag-message-${message.role}` },
    React.createElement('div', { className: `rag-message-content rag-message-content-${message.role}` },
      React.createElement('div', {
        className: `rag-message-bubble rag-message-bubble-${message.role}`,
        style: isUser ? { borderColor: `${accentColor}40` } : {}
      },
        message.isLoading
          ? React.createElement(LoadingDots, { color: accentColor })
          : React.createElement('p', { className: 'rag-message-text' }, message.content)
      ),
      React.createElement('span', { className: 'rag-message-time' }, formatTime(message.timestamp)),
      hasSources && React.createElement('div', { className: 'rag-message-sources' },
        React.createElement('button', {
          type: 'button',
          className: 'rag-sources-toggle',
          onClick: () => setSourcesOpen(!sourcesOpen)
        },
          React.createElement(FileText, { size: 14 }),
          `${message.sources.length} sources`,
          sourcesOpen ? React.createElement(ChevronUp, { size: 14 }) : React.createElement(ChevronDown, { size: 14 })
        ),
        sourcesOpen && React.createElement('div', { className: 'rag-sources-list' },
          message.sources.map((source, i) =>
            React.createElement('div', { key: i, className: 'rag-source-item' },
              React.createElement('div', { className: 'rag-source-header' },
                React.createElement('span', {
                  className: 'rag-source-badge',
                  style: { backgroundColor: `${accentColor}20`, color: accentColor }
                }, i + 1),
                React.createElement('span', { className: 'rag-source-name' }, source.documentName),
                React.createElement('span', { className: 'rag-source-chunk' }, `chunk ${source.chunkIndex}`)
              ),
              React.createElement('p', { className: 'rag-source-snippet' },
                source.snippet.length > 200 ? source.snippet.slice(0, 200) + '...' : source.snippet
              )
            )
          )
        )
      )
    )
  );
}

// useRAGChat hook
function useRAGChat({ endpoint, headers, systemPrompt, topK, documentId }) {
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [error, setError] = useState(null);

  const sendMessage = useCallback(async (content) => {
    const userMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setIsTyping(true);
    setError(null);

    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...headers
        },
        body: JSON.stringify({
          query: content,
          systemPrompt,
          topK,
          documentId
        })
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || `Request failed: ${res.status}`);
      }

      const data = await res.json();

      const assistantMessage = {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        content: data.answer,
        timestamp: new Date(),
        sources: data.sources
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsTyping(false);
    }
  }, [endpoint, headers, systemPrompt, topK, documentId]);

  const clearChat = useCallback(() => {
    setMessages([]);
    setError(null);
  }, []);

  return { messages, isTyping, error, sendMessage, clearChat, setError };
}

// Main RAGChat component
export function RAGChat({
  endpoint = '/api/rag/query',
  headers,
  placeholder = 'Ask a question about your documents...',
  title = 'RAG Assistant',
  accentColor = DEFAULT_ACCENT_COLOR,
  showSources = true,
  systemPrompt,
  topK,
  documentId,
  className = '',
  emptyState
}) {
  // Inject styles on first render
  useEffect(() => { injectStyles(); }, []);

  const messagesEndRef = useRef(null);
  const { messages, isTyping, error, sendMessage, clearChat, setError } = useRAGChat({
    endpoint,
    headers,
    systemPrompt,
    topK,
    documentId
  });

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const defaultEmptyState = React.createElement('div', { className: 'rag-empty-state' },
    React.createElement('div', { className: 'rag-empty-icon', style: { boxShadow: `0 0 30px ${accentColor}15` } },
      React.createElement(Database, { size: 48, style: { color: accentColor } })
    ),
    React.createElement('h3', { className: 'rag-empty-title' }, 'Start a conversation'),
    React.createElement('p', { className: 'rag-empty-description' },
      'Ask questions about your documents. Get instant, accurate answers with source citations.'
    )
  );

  return React.createElement('div', { className: `rag-chat ${className}` },
    React.createElement(ChatHeader, { title, accentColor, isTyping, messageCount: messages.length, onClearChat: clearChat }),
    error && React.createElement('div', { className: 'rag-error-banner', role: 'alert' },
      React.createElement(AlertCircle, { size: 16 }),
      React.createElement('span', null, error),
      React.createElement('button', {
        type: 'button',
        className: 'rag-error-dismiss',
        onClick: () => setError(null),
        'aria-label': 'Dismiss error'
      }, React.createElement(X, { size: 14 }))
    ),
    React.createElement('div', { className: 'rag-chat-messages' },
      messages.length === 0
        ? (emptyState || defaultEmptyState)
        : React.createElement(React.Fragment, null,
            messages.map(msg => React.createElement(MessageBubble, {
              key: msg.id,
              message: msg,
              accentColor,
              showSources
            })),
            isTyping && React.createElement(TypingIndicator, { accentColor }),
            React.createElement('div', { ref: messagesEndRef })
          )
    ),
    React.createElement(ChatInput, { placeholder, accentColor, onSendMessage: sendMessage, disabled: isTyping })
  );
}
