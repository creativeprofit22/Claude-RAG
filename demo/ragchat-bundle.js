/**
 * RAGChat Browser Bundle
 * Self-contained React component for browser use
 */

const { useState, useRef, useEffect, useCallback } = React;

// Default accent color
const DEFAULT_ACCENT_COLOR = '#6366f1';

// Icon registry - centralized icon element definitions
const ICON_REGISTRY = {
  Database: [
    'M12 3c4.97 0 9 1.79 9 4s-4.03 4-9 4-9-1.79-9-4 4.03-4 9-4Z',
    'M3 7v10c0 2.21 4.03 4 9 4s9-1.79 9-4V7',
    'M3 12c0 2.21 4.03 4 9 4s9-1.79 9-4'
  ],
  Send: [
    { type: 'line', x1: 22, y1: 2, x2: 11, y2: 13 },
    { type: 'polygon', points: '22 2 15 22 11 13 2 9 22 2' }
  ],
  Trash2: [
    { type: 'polyline', points: '3 6 5 6 21 6' },
    'M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2',
    { type: 'line', x1: 10, y1: 11, x2: 10, y2: 17 },
    { type: 'line', x1: 14, y1: 11, x2: 14, y2: 17 }
  ],
  X: [
    { type: 'line', x1: 18, y1: 6, x2: 6, y2: 18 },
    { type: 'line', x1: 6, y1: 6, x2: 18, y2: 18 }
  ],
  AlertCircle: [
    { type: 'circle', cx: 12, cy: 12, r: 10 },
    { type: 'line', x1: 12, y1: 8, x2: 12, y2: 12 },
    { type: 'line', x1: 12, y1: 16, x2: 12.01, y2: 16 }
  ],
  ChevronDown: [{ type: 'polyline', points: '6 9 12 15 18 9' }],
  ChevronUp: [{ type: 'polyline', points: '18 15 12 9 6 15' }],
  FileText: [
    'M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z',
    { type: 'polyline', points: '14 2 14 8 20 8' },
    { type: 'line', x1: 16, y1: 13, x2: 8, y2: 13 },
    { type: 'line', x1: 16, y1: 17, x2: 8, y2: 17 },
    { type: 'line', x1: 10, y1: 9, x2: 8, y2: 9 }
  ]
};

// Icon factory - creates SVG element from registry entry
const createIcon = (elements, size = 24, color = 'currentColor') => {
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
  }, elements.map((el, i) => {
    if (typeof el === 'string') {
      return React.createElement('path', { key: i, d: el });
    }
    const { type, ...props } = el;
    return React.createElement(type, { key: i, ...props });
  }));
};

// Icon component factory
const createIconComponent = (name) => ({ size = 24, style } = {}) =>
  createIcon(ICON_REGISTRY[name], size, style?.color);

// Generated icon components
const Database = createIconComponent('Database');
const Send = createIconComponent('Send');
const Trash2 = createIconComponent('Trash2');
const X = createIconComponent('X');
const AlertCircle = createIconComponent('AlertCircle');
const ChevronDown = createIconComponent('ChevronDown');
const ChevronUp = createIconComponent('ChevronUp');
const FileText = createIconComponent('FileText');

// Styles injection - loads external CSS file or falls back to inline
const injectStyles = (() => {
  let injected = false;
  return () => {
    if (injected) return;
    // Check if styles already loaded (e.g., via <link> in HTML)
    if (document.querySelector('link[href*="ragchat.css"]')) {
      injected = true;
      return;
    }
    injected = true;

    // Inject link to external CSS file
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = '/demo/ragchat.css';
    document.head.appendChild(link);
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

// Format timestamp for display
const formatTime = (date) => {
  return new Date(date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

// Message bubble
function MessageBubble({ message, accentColor, showSources }) {
  const [sourcesOpen, setSourcesOpen] = useState(false);
  const isUser = message.role === 'user';
  const hasSources = showSources && message.sources && message.sources.length > 0;

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
      id: crypto.randomUUID(),
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
        let errorMessage = `Request failed: ${res.status}`;
        try {
          const errData = await res.json();
          if (errData.error) {
            errorMessage = errData.error;
          }
        } catch {
          // Server returned non-JSON error response, use generic message
        }
        throw new Error(errorMessage);
      }

      const data = await res.json();

      const assistantMessage = {
        id: crypto.randomUUID(),
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
