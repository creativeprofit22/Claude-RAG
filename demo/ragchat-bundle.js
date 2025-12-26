"use strict";
var RAGBundle = (() => {
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

  // demo/browser-entry.tsx
  var browser_entry_exports = {};
  __export(browser_entry_exports, {
    AdminDashboard: () => AdminDashboard,
    CategoryBadge: () => CategoryBadge,
    CategoryFilter: () => CategoryFilter,
    ChatHeader: () => ChatHeader,
    ChatInput: () => ChatInput,
    DocumentLibrary: () => DocumentLibrary,
    FileDropZone: () => FileDropZone,
    FilePreview: () => FilePreview,
    FileQueue: () => FileQueue,
    MessageBubble: () => MessageBubble,
    ProgressIndicator: () => ProgressIndicator,
    RAGChat: () => RAGChat,
    RAGInterface: () => RAGInterface,
    TypingIndicator: () => TypingIndicator,
    UploadModal: () => UploadModal,
    useCategories: () => useCategories,
    useDocuments: () => useDocuments,
    useFileQueue: () => useFileQueue,
    useRAGChat: () => useRAGChat,
    useUploadStream: () => useUploadStream
  });

  // demo/react-shim.js
  var React = window.React;
  var react_shim_default = React;
  var {
    useState,
    useEffect,
    useRef,
    useCallback,
    useMemo,
    useContext,
    useReducer,
    useLayoutEffect,
    useImperativeHandle,
    useDebugValue,
    createContext,
    createElement,
    cloneElement,
    isValidElement,
    Children,
    Fragment,
    StrictMode,
    Suspense,
    lazy,
    memo,
    forwardRef,
    createRef,
    Component,
    PureComponent
  } = React;

  // demo/lucide-shim.js
  var lucide = window.lucide;
  var React2 = window.React;
  function createIconComponent(iconDef) {
    const IconComponent = function(props) {
      const {
        size = 24,
        strokeWidth = 2,
        color = "currentColor",
        className = "",
        ...rest
      } = props;
      const childrenDef = iconDef[2] || [];
      const children = childrenDef.map(
        (el, i) => React2.createElement(el[0], { key: i, ...el[1] })
      );
      return React2.createElement("svg", {
        xmlns: "http://www.w3.org/2000/svg",
        width: size,
        height: size,
        viewBox: "0 0 24 24",
        fill: "none",
        stroke: color,
        strokeWidth,
        strokeLinecap: "round",
        strokeLinejoin: "round",
        className,
        ...rest
      }, ...children);
    };
    return IconComponent;
  }
  var Activity = createIconComponent(lucide.Activity);
  var AlertCircle = createIconComponent(lucide.AlertCircle);
  var AlertTriangle = createIconComponent(lucide.AlertTriangle);
  var ArrowDown = createIconComponent(lucide.ArrowDown);
  var ArrowUp = createIconComponent(lucide.ArrowUp);
  var ArrowUpDown = createIconComponent(lucide.ArrowUpDown);
  var BarChart3 = createIconComponent(lucide.BarChart3);
  var Calendar = createIconComponent(lucide.Calendar);
  var Check = createIconComponent(lucide.Check);
  var CheckCircle = createIconComponent(lucide.CheckCircle);
  var ChevronDown = createIconComponent(lucide.ChevronDown);
  var ChevronUp = createIconComponent(lucide.ChevronUp);
  var Clock = createIconComponent(lucide.Clock);
  var Cpu = createIconComponent(lucide.Cpu);
  var Database = createIconComponent(lucide.Database);
  var Edit2 = createIconComponent(lucide.Edit2);
  var ExternalLink = createIconComponent(lucide.ExternalLink);
  var Eye = createIconComponent(lucide.Eye);
  var File = createIconComponent(lucide.File);
  var FileCode = createIconComponent(lucide.FileCode);
  var FileJson = createIconComponent(lucide.FileJson);
  var FileText = createIconComponent(lucide.FileText);
  var HardDrive = createIconComponent(lucide.HardDrive);
  var Hash = createIconComponent(lucide.Hash);
  var Layers = createIconComponent(lucide.Layers);
  var Library = createIconComponent(lucide.Library);
  var Loader2 = createIconComponent(lucide.Loader2);
  var MessageSquare = createIconComponent(lucide.MessageSquare);
  var RefreshCw = createIconComponent(lucide.RefreshCw);
  var Search = createIconComponent(lucide.Search);
  var Send = createIconComponent(lucide.Send);
  var Sparkles = createIconComponent(lucide.Sparkles);
  var Trash2 = createIconComponent(lucide.Trash2);
  var Upload = createIconComponent(lucide.Upload);
  var X = createIconComponent(lucide.X);
  var XCircle = createIconComponent(lucide.XCircle);

  // src/react/types.ts
  var DEFAULT_ACCENT_COLOR = "#6366f1";

  // demo/jsx-runtime-shim.js
  var React3 = window.React;
  function jsx(type, props, key) {
    const { children, ...rest } = props || {};
    if (key !== void 0) {
      rest.key = key;
    }
    if (children !== void 0) {
      if (Array.isArray(children)) {
        return React3.createElement(type, rest, ...children);
      }
      return React3.createElement(type, rest, children);
    }
    return React3.createElement(type, rest);
  }
  function jsxs(type, props, key) {
    return jsx(type, props, key);
  }
  var Fragment2 = React3.Fragment;

  // src/react/components/ChatHeader.tsx
  function ChatHeader({
    title = "RAG Assistant",
    accentColor = DEFAULT_ACCENT_COLOR,
    isTyping = false,
    messageCount = 0,
    onClearChat
  }) {
    return /* @__PURE__ */ jsx("div", { className: "rag-chat-header", children: /* @__PURE__ */ jsxs("div", { className: "rag-chat-header-content", children: [
      /* @__PURE__ */ jsxs("div", { className: "rag-chat-header-info", children: [
        /* @__PURE__ */ jsx(
          "div",
          {
            className: "rag-chat-header-icon",
            style: { boxShadow: `0 0 20px ${accentColor}20` },
            children: /* @__PURE__ */ jsx(
              Database,
              {
                size: 20,
                style: { color: accentColor },
                "aria-hidden": "true"
              }
            )
          }
        ),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("h3", { className: "rag-chat-header-title", children: title }),
          /* @__PURE__ */ jsx("p", { className: "rag-chat-header-status", children: isTyping ? "Thinking..." : "Ready" })
        ] })
      ] }),
      messageCount > 0 && onClearChat && /* @__PURE__ */ jsx(
        "button",
        {
          type: "button",
          onClick: onClearChat,
          className: "rag-chat-header-clear",
          title: "Clear chat",
          children: /* @__PURE__ */ jsx(Trash2, { size: 16, "aria-hidden": "true" })
        }
      )
    ] }) });
  }

  // src/react/components/ChatInput.tsx
  function ChatInput({
    placeholder = "Ask a question about your documents...",
    accentColor = DEFAULT_ACCENT_COLOR,
    onSendMessage,
    disabled = false
  }) {
    const [inputValue, setInputValue] = useState("");
    const inputRef = useRef(null);
    const handleSend = () => {
      if (!inputValue.trim() || !onSendMessage || disabled) return;
      onSendMessage(inputValue.trim());
      setInputValue("");
      inputRef.current?.focus();
    };
    const handleKeyDown = (e) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        handleSend();
      }
    };
    const hasInput = inputValue.trim().length > 0;
    return /* @__PURE__ */ jsx("div", { className: "rag-chat-input-container", children: /* @__PURE__ */ jsxs("div", { className: "rag-chat-input-wrapper", children: [
      /* @__PURE__ */ jsx(
        "input",
        {
          ref: inputRef,
          type: "text",
          value: inputValue,
          onChange: (e) => setInputValue(e.target.value),
          onKeyDown: handleKeyDown,
          placeholder,
          disabled,
          className: "rag-chat-input",
          style: {
            boxShadow: hasInput ? `0 0 0 1px ${accentColor}40, 0 0 20px ${accentColor}10` : void 0
          }
        }
      ),
      /* @__PURE__ */ jsx(
        "button",
        {
          type: "button",
          onClick: handleSend,
          disabled: !hasInput || disabled,
          className: "rag-chat-send-button",
          style: {
            backgroundColor: hasInput ? accentColor : void 0,
            boxShadow: hasInput ? `0 4px 14px 0 ${accentColor}40` : void 0
          },
          title: "Send message",
          children: /* @__PURE__ */ jsx(Send, { size: 18, "aria-hidden": "true" })
        }
      )
    ] }) });
  }

  // src/react/components/LoadingDots.tsx
  var DOT_DELAYS = [0, 150, 300];
  function LoadingDots({
    accentColor = DEFAULT_ACCENT_COLOR,
    className = "rag-loading-dots",
    dotClassName = "rag-loading-dot"
  }) {
    return /* @__PURE__ */ jsx("div", { className, children: DOT_DELAYS.map((delay) => /* @__PURE__ */ jsx(
      "div",
      {
        className: dotClassName,
        style: {
          backgroundColor: accentColor,
          animationDelay: `${delay}ms`
        }
      },
      delay
    )) });
  }

  // src/react/components/MessageBubble.tsx
  function MessageBubble({
    message,
    accentColor = DEFAULT_ACCENT_COLOR,
    showSources = true
  }) {
    const isUser = message.role === "user";
    const [sourcesExpanded, setSourcesExpanded] = useState(false);
    const time = message.timestamp.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit"
    });
    const sources = message.sources ?? [];
    const hasSources = showSources && sources.length > 0;
    return /* @__PURE__ */ jsx("div", { className: `rag-message ${isUser ? "rag-message-user" : "rag-message-assistant"}`, children: /* @__PURE__ */ jsxs("div", { className: `rag-message-content ${isUser ? "rag-message-content-user" : "rag-message-content-assistant"}`, children: [
      /* @__PURE__ */ jsx(
        "div",
        {
          className: `rag-message-bubble ${isUser ? "rag-message-bubble-user" : "rag-message-bubble-assistant"}`,
          style: isUser ? {
            boxShadow: `0 0 20px ${accentColor}15`,
            borderColor: `${accentColor}20`
          } : void 0,
          children: message.isLoading ? /* @__PURE__ */ jsx("div", { className: "rag-message-loading", children: /* @__PURE__ */ jsx(LoadingDots, { accentColor }) }) : /* @__PURE__ */ jsx("p", { className: "rag-message-text", children: message.content })
        }
      ),
      hasSources && !message.isLoading && /* @__PURE__ */ jsxs("div", { className: "rag-message-sources", children: [
        /* @__PURE__ */ jsxs(
          "button",
          {
            onClick: () => setSourcesExpanded(!sourcesExpanded),
            className: "rag-sources-toggle",
            children: [
              /* @__PURE__ */ jsx(FileText, { size: 14 }),
              /* @__PURE__ */ jsxs("span", { children: [
                sources.length,
                " source",
                sources.length > 1 ? "s" : ""
              ] }),
              sourcesExpanded ? /* @__PURE__ */ jsx(ChevronUp, { size: 14 }) : /* @__PURE__ */ jsx(ChevronDown, { size: 14 })
            ]
          }
        ),
        sourcesExpanded && /* @__PURE__ */ jsx("div", { className: "rag-sources-list", children: sources.map((source, i) => /* @__PURE__ */ jsxs("div", { className: "rag-source-item", children: [
          /* @__PURE__ */ jsxs("div", { className: "rag-source-header", children: [
            /* @__PURE__ */ jsxs("span", { className: "rag-source-badge", style: { backgroundColor: `${accentColor}20`, color: accentColor }, children: [
              "[",
              i + 1,
              "]"
            ] }),
            /* @__PURE__ */ jsx("span", { className: "rag-source-name", children: source.documentName }),
            /* @__PURE__ */ jsxs("span", { className: "rag-source-chunk", children: [
              "Chunk ",
              source.chunkIndex
            ] })
          ] }),
          /* @__PURE__ */ jsx("p", { className: "rag-source-snippet", children: source.snippet })
        ] }, `${source.documentId}-${source.chunkIndex}-${i}`)) })
      ] }),
      /* @__PURE__ */ jsx("span", { className: "rag-message-time", children: time })
    ] }) });
  }

  // src/react/components/TypingIndicator.tsx
  function TypingIndicator({ accentColor = DEFAULT_ACCENT_COLOR }) {
    return /* @__PURE__ */ jsx("div", { className: "rag-typing-indicator", children: /* @__PURE__ */ jsx(
      LoadingDots,
      {
        accentColor,
        className: "rag-typing-dots",
        dotClassName: "rag-typing-dot"
      }
    ) });
  }

  // src/react/hooks/useRAGChat.ts
  var idCounter = 0;
  function generateId() {
    return `msg_${Date.now()}_${++idCounter}_${Math.random().toString(36).slice(2, 8)}`;
  }
  function useRAGChat(config = {}) {
    const {
      endpoint = "/api/rag/query",
      headers = {},
      systemPrompt,
      topK,
      documentId
    } = config;
    const [messages, setMessages] = useState([]);
    const [isTyping, setIsTyping] = useState(false);
    const [error, setError] = useState(null);
    const headersJson = JSON.stringify(headers);
    const stableHeaders = useMemo(() => headers, [headersJson]);
    const abortControllerRef = useRef(null);
    useEffect(() => {
      return () => {
        abortControllerRef.current?.abort();
      };
    }, []);
    const sendMessage = useCallback(async (content) => {
      if (!content.trim()) return;
      abortControllerRef.current?.abort();
      abortControllerRef.current = new AbortController();
      const userMessage = {
        id: generateId(),
        role: "user",
        content: content.trim(),
        timestamp: /* @__PURE__ */ new Date()
      };
      const loadingMessage = {
        id: generateId(),
        role: "assistant",
        content: "",
        timestamp: /* @__PURE__ */ new Date(),
        isLoading: true
      };
      setMessages((prev) => [...prev, userMessage, loadingMessage]);
      setIsTyping(true);
      setError(null);
      try {
        const response = await fetch(endpoint, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...stableHeaders
          },
          body: JSON.stringify({
            query: content.trim(),
            ...systemPrompt && { systemPrompt },
            ...topK && { topK },
            ...documentId && { documentId }
          }),
          signal: abortControllerRef.current.signal
        });
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.error || `Request failed: ${response.status}`);
        }
        const data = await response.json();
        const assistantMessage = {
          id: loadingMessage.id,
          role: "assistant",
          content: data.answer,
          timestamp: /* @__PURE__ */ new Date(),
          sources: data.sources
        };
        setMessages(
          (prev) => prev.map((msg) => msg.id === loadingMessage.id ? assistantMessage : msg)
        );
      } catch (err) {
        if (err instanceof Error && err.name === "AbortError") {
          return;
        }
        const errorMessage = err instanceof Error ? err.message : "An error occurred";
        setError(errorMessage);
        const errorAssistantMessage = {
          id: loadingMessage.id,
          role: "assistant",
          content: `Sorry, I encountered an error: ${errorMessage}`,
          timestamp: /* @__PURE__ */ new Date()
        };
        setMessages(
          (prev) => prev.map((msg) => msg.id === loadingMessage.id ? errorAssistantMessage : msg)
        );
      } finally {
        setIsTyping(false);
      }
    }, [endpoint, stableHeaders, systemPrompt, topK, documentId]);
    const clearChat = useCallback(() => {
      setMessages([]);
      setError(null);
    }, []);
    return {
      messages,
      isTyping,
      error,
      sendMessage,
      clearChat,
      setError
    };
  }

  // src/react/RAGChat.tsx
  function RAGChat({
    endpoint = "/api/rag/query",
    headers,
    placeholder = "Ask a question about your documents...",
    title = "RAG Assistant",
    accentColor = DEFAULT_ACCENT_COLOR,
    showSources = true,
    systemPrompt,
    topK,
    documentId,
    className = "",
    emptyState
  }) {
    const messagesContainerRef = useRef(null);
    const {
      messages,
      isTyping,
      error,
      sendMessage,
      clearChat,
      setError
    } = useRAGChat({
      endpoint,
      headers,
      systemPrompt,
      topK,
      documentId
    });
    const lastMessageCountRef = useRef(0);
    const wasTypingRef = useRef(isTyping);
    useEffect(() => {
      const messageCountIncreased = messages.length > lastMessageCountRef.current;
      const typingStarted = isTyping && !wasTypingRef.current;
      const shouldScroll = messageCountIncreased || typingStarted;
      lastMessageCountRef.current = messages.length;
      wasTypingRef.current = isTyping;
      if (shouldScroll && messagesContainerRef.current) {
        requestAnimationFrame(() => {
          const container = messagesContainerRef.current;
          if (container) {
            container.scrollTop = container.scrollHeight;
          }
        });
      }
    }, [messages.length, isTyping]);
    const defaultEmptyState = /* @__PURE__ */ jsxs("div", { className: "rag-empty-state", children: [
      /* @__PURE__ */ jsx(
        "div",
        {
          className: "rag-empty-icon",
          style: { boxShadow: `0 0 30px ${accentColor}15` },
          children: /* @__PURE__ */ jsx(Database, { size: 48, style: { color: accentColor }, "aria-hidden": "true" })
        }
      ),
      /* @__PURE__ */ jsx("h3", { className: "rag-empty-title", children: "Start a conversation" }),
      /* @__PURE__ */ jsx("p", { className: "rag-empty-description", children: "Ask questions about your documents. Get instant, accurate answers with source citations." })
    ] });
    return /* @__PURE__ */ jsxs("div", { className: `rag-chat ${className}`, children: [
      /* @__PURE__ */ jsx(
        ChatHeader,
        {
          title,
          accentColor,
          isTyping,
          messageCount: messages.length,
          onClearChat: clearChat
        }
      ),
      error && /* @__PURE__ */ jsxs("div", { className: "rag-error-banner", role: "alert", children: [
        /* @__PURE__ */ jsx(AlertCircle, { size: 16, "aria-hidden": "true" }),
        /* @__PURE__ */ jsx("span", { children: error }),
        /* @__PURE__ */ jsx(
          "button",
          {
            type: "button",
            onClick: () => setError(null),
            className: "rag-error-dismiss",
            "aria-label": "Dismiss error",
            children: /* @__PURE__ */ jsx(X, { size: 14 })
          }
        )
      ] }),
      /* @__PURE__ */ jsx("div", { ref: messagesContainerRef, className: "rag-chat-messages", children: messages.length === 0 ? emptyState || defaultEmptyState : /* @__PURE__ */ jsxs(Fragment2, { children: [
        messages.map((message) => /* @__PURE__ */ jsx(
          MessageBubble,
          {
            message,
            accentColor,
            showSources
          },
          message.id
        )),
        isTyping && /* @__PURE__ */ jsx(TypingIndicator, { accentColor })
      ] }) }),
      /* @__PURE__ */ jsx(
        ChatInput,
        {
          placeholder,
          accentColor,
          onSendMessage: sendMessage,
          disabled: isTyping
        }
      )
    ] });
  }

  // src/react/components/shared/Dropdown.tsx
  function Dropdown({
    options,
    value,
    onChange,
    icon,
    className = "",
    triggerClassName = "",
    menuClassName = "",
    optionClassName = ""
  }) {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);
    useEffect(() => {
      function handleClickOutside(event) {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
          setIsOpen(false);
        }
      }
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);
    useEffect(() => {
      function handleKeyDown(event) {
        if (event.key === "Escape" && isOpen) {
          setIsOpen(false);
        }
      }
      document.addEventListener("keydown", handleKeyDown);
      return () => document.removeEventListener("keydown", handleKeyDown);
    }, [isOpen]);
    const handleSelect = (optionValue) => {
      onChange(optionValue);
      setIsOpen(false);
    };
    const currentLabel = options.find((opt) => opt.value === value)?.label || "";
    return /* @__PURE__ */ jsxs("div", { className: `rag-dropdown ${className}`, ref: dropdownRef, children: [
      /* @__PURE__ */ jsxs(
        "button",
        {
          type: "button",
          className: `rag-dropdown-trigger ${triggerClassName}`,
          onClick: () => setIsOpen(!isOpen),
          "aria-haspopup": "listbox",
          "aria-expanded": isOpen,
          children: [
            icon,
            /* @__PURE__ */ jsx("span", { children: currentLabel }),
            /* @__PURE__ */ jsx(
              ChevronDown,
              {
                size: 14,
                className: `rag-dropdown-chevron ${isOpen ? "rag-dropdown-chevron-open" : ""}`,
                "aria-hidden": "true"
              }
            )
          ]
        }
      ),
      isOpen && /* @__PURE__ */ jsx("div", { className: `rag-dropdown-menu ${menuClassName}`, role: "listbox", children: options.map((option) => /* @__PURE__ */ jsx(
        "button",
        {
          type: "button",
          className: `rag-dropdown-option ${value === option.value ? "rag-dropdown-option-active" : ""} ${optionClassName}`,
          onClick: () => handleSelect(option.value),
          role: "option",
          "aria-selected": value === option.value,
          children: option.label
        },
        option.value
      )) })
    ] });
  }

  // src/react/components/documents/DocumentSearch.tsx
  var SORT_OPTIONS = [
    { value: "name", label: "Name" },
    { value: "date", label: "Date" },
    { value: "chunks", label: "Size" }
  ];
  function DocumentSearch({
    value,
    onChange,
    sortBy,
    onSortByChange,
    sortOrder,
    onSortOrderChange,
    placeholder = "Search documents..."
  }) {
    const [localValue, setLocalValue] = useState(value);
    const debounceRef = useRef(null);
    const onChangeRef = useRef(onChange);
    onChangeRef.current = onChange;
    const valueRef = useRef(value);
    valueRef.current = value;
    useEffect(() => {
      setLocalValue(value);
    }, [value]);
    useEffect(() => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
      debounceRef.current = setTimeout(() => {
        if (localValue !== valueRef.current) {
          onChangeRef.current(localValue);
        }
      }, 300);
      return () => {
        if (debounceRef.current) {
          clearTimeout(debounceRef.current);
        }
      };
    }, [localValue]);
    const handleInputChange = (e) => {
      setLocalValue(e.target.value);
    };
    const toggleSortOrder = () => {
      onSortOrderChange(sortOrder === "asc" ? "desc" : "asc");
    };
    const SortIcon = sortOrder === "asc" ? ArrowUp : ArrowDown;
    return /* @__PURE__ */ jsxs("div", { className: "rag-doc-search", children: [
      /* @__PURE__ */ jsxs("div", { className: "rag-doc-search-input-wrapper", children: [
        /* @__PURE__ */ jsx(
          Search,
          {
            size: 16,
            className: "rag-doc-search-icon",
            "aria-hidden": "true"
          }
        ),
        /* @__PURE__ */ jsx(
          "input",
          {
            type: "text",
            className: "rag-doc-search-input",
            placeholder,
            value: localValue,
            onChange: handleInputChange,
            "aria-label": "Search documents"
          }
        )
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "rag-doc-search-sort", children: [
        /* @__PURE__ */ jsx(
          Dropdown,
          {
            options: SORT_OPTIONS,
            value: sortBy,
            onChange: onSortByChange,
            icon: /* @__PURE__ */ jsx(ArrowUpDown, { size: 14, "aria-hidden": "true" }),
            className: "rag-doc-sort-dropdown",
            triggerClassName: "rag-doc-sort-trigger",
            menuClassName: "rag-doc-sort-menu",
            optionClassName: "rag-doc-sort-option"
          }
        ),
        /* @__PURE__ */ jsx(
          "button",
          {
            type: "button",
            className: "rag-doc-sort-order",
            onClick: toggleSortOrder,
            title: `Sort ${sortOrder === "asc" ? "ascending" : "descending"}`,
            "aria-label": `Sort ${sortOrder === "asc" ? "ascending" : "descending"}`,
            children: /* @__PURE__ */ jsx(SortIcon, { size: 16 })
          }
        )
      ] })
    ] });
  }

  // src/react/utils/formatDate.ts
  var FORMAT_OPTIONS = {
    short: {
      month: "short",
      day: "numeric",
      year: "numeric"
    },
    full: {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric"
    },
    datetime: {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    }
  };
  function formatDate(timestamp, format = "short") {
    const date = new Date(timestamp);
    return date.toLocaleDateString("en-US", FORMAT_OPTIONS[format]);
  }

  // src/react/utils/documentIcons.ts
  function getDocumentIcon(type) {
    switch (type?.toLowerCase()) {
      case "markdown":
      case "md":
        return FileText;
      case "code":
      case "typescript":
      case "javascript":
      case "python":
      case "ts":
      case "tsx":
      case "js":
      case "jsx":
      case "py":
        return FileCode;
      case "json":
        return FileJson;
      default:
        return File;
    }
  }

  // src/react/components/documents/DocumentCard.tsx
  function DocumentCard({
    document: document2,
    isSelected = false,
    onSelect,
    onDelete,
    onPreview
  }) {
    const Icon = getDocumentIcon(document2.type);
    const handleCardClick = () => {
      onSelect?.(document2);
    };
    const handlePreviewClick = (e) => {
      e.stopPropagation();
      onPreview?.(document2);
    };
    const handleDeleteClick = (e) => {
      e.stopPropagation();
      onDelete?.(document2);
    };
    return /* @__PURE__ */ jsxs(
      "div",
      {
        className: `rag-doc-card ${isSelected ? "rag-doc-card-selected" : ""}`,
        onClick: handleCardClick,
        role: "button",
        tabIndex: 0,
        onKeyDown: (e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            handleCardClick();
          } else if (e.key === "Escape") {
            e.target.blur();
          }
        },
        children: [
          /* @__PURE__ */ jsx("div", { className: "rag-doc-card-icon", children: /* @__PURE__ */ jsx(Icon, { size: 24, "aria-hidden": "true" }) }),
          /* @__PURE__ */ jsxs("div", { className: "rag-doc-card-info", children: [
            /* @__PURE__ */ jsx("h4", { className: "rag-doc-card-name", title: document2.documentName, children: document2.documentName }),
            /* @__PURE__ */ jsxs("div", { className: "rag-doc-card-meta", children: [
              /* @__PURE__ */ jsx("span", { className: "rag-doc-card-type", children: document2.type || "Document" }),
              /* @__PURE__ */ jsx("span", { className: "rag-doc-card-separator", children: "-" }),
              /* @__PURE__ */ jsxs("span", { className: "rag-doc-card-chunks", children: [
                /* @__PURE__ */ jsx(Layers, { size: 12, "aria-hidden": "true" }),
                document2.chunkCount,
                " chunks"
              ] })
            ] }),
            /* @__PURE__ */ jsx("span", { className: "rag-doc-card-date", children: formatDate(document2.timestamp) })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "rag-doc-card-actions", children: [
            onPreview && /* @__PURE__ */ jsx(
              "button",
              {
                type: "button",
                className: "rag-doc-card-action",
                onClick: handlePreviewClick,
                onKeyDown: (e) => e.stopPropagation(),
                title: "Preview document",
                "aria-label": "Preview document",
                children: /* @__PURE__ */ jsx(Eye, { size: 16 })
              }
            ),
            onDelete && /* @__PURE__ */ jsx(
              "button",
              {
                type: "button",
                className: "rag-doc-card-action rag-doc-card-action-delete",
                onClick: handleDeleteClick,
                onKeyDown: (e) => e.stopPropagation(),
                title: "Delete document",
                "aria-label": "Delete document",
                children: /* @__PURE__ */ jsx(Trash2, { size: 16 })
              }
            )
          ] })
        ]
      }
    );
  }

  // src/react/components/shared/EmptyState.tsx
  function EmptyState({
    icon: Icon = FileText,
    iconSize = 48,
    iconColor,
    iconShadow,
    title,
    description,
    className = ""
  }) {
    const iconStyle = {
      ...iconColor && { color: iconColor },
      ...iconShadow && { boxShadow: iconShadow }
    };
    return /* @__PURE__ */ jsxs("div", { className: `rag-empty-state ${className}`, children: [
      /* @__PURE__ */ jsx("div", { className: "rag-empty-state-icon", style: iconShadow ? { boxShadow: iconShadow } : void 0, children: /* @__PURE__ */ jsx(Icon, { size: iconSize, style: iconColor ? { color: iconColor } : void 0, "aria-hidden": "true" }) }),
      /* @__PURE__ */ jsx("h3", { className: "rag-empty-state-title", children: title }),
      /* @__PURE__ */ jsx("p", { className: "rag-empty-state-description", children: description })
    ] });
  }

  // src/react/components/documents/DocumentList.tsx
  var DEFAULT_SKELETON_COUNT = 6;
  function DocumentCardSkeleton() {
    return /* @__PURE__ */ jsxs("div", { className: "rag-doc-card rag-doc-card-skeleton", "aria-hidden": "true", children: [
      /* @__PURE__ */ jsx("div", { className: "rag-doc-card-icon rag-skeleton-pulse" }),
      /* @__PURE__ */ jsxs("div", { className: "rag-doc-card-info", children: [
        /* @__PURE__ */ jsx("div", { className: "rag-skeleton-line rag-skeleton-line-title" }),
        /* @__PURE__ */ jsx("div", { className: "rag-skeleton-line rag-skeleton-line-meta" }),
        /* @__PURE__ */ jsx("div", { className: "rag-skeleton-line rag-skeleton-line-date" })
      ] })
    ] });
  }
  function DefaultEmptyState() {
    return /* @__PURE__ */ jsx(
      EmptyState,
      {
        title: "No documents found",
        description: "Upload documents to start building your knowledge base.",
        className: "rag-doc-list-empty"
      }
    );
  }
  function DocumentList({
    documents,
    isLoading = false,
    onDocumentSelect,
    onDocumentDelete,
    onDocumentPreview,
    selectedDocumentId,
    emptyState,
    skeletonCount = DEFAULT_SKELETON_COUNT
  }) {
    if (isLoading) {
      return /* @__PURE__ */ jsx("div", { className: "rag-doc-list", "aria-busy": "true", "aria-label": "Loading documents", children: Array.from({ length: skeletonCount }).map((_, index) => /* @__PURE__ */ jsx(DocumentCardSkeleton, {}, `doc-skeleton-${index}`)) });
    }
    if (documents.length === 0) {
      return /* @__PURE__ */ jsx(Fragment2, { children: emptyState || /* @__PURE__ */ jsx(DefaultEmptyState, {}) });
    }
    return /* @__PURE__ */ jsx("div", { className: "rag-doc-list", role: "list", "aria-label": "Document list", children: documents.map((doc) => /* @__PURE__ */ jsx(
      DocumentCard,
      {
        document: doc,
        isSelected: selectedDocumentId === doc.documentId,
        onSelect: onDocumentSelect,
        onDelete: onDocumentDelete,
        onPreview: onDocumentPreview
      },
      doc.documentId
    )) });
  }

  // src/react/hooks/useModal.ts
  function useModal({ onClose, isOpen = true }) {
    const onCloseRef = useRef(onClose);
    onCloseRef.current = onClose;
    useEffect(() => {
      if (!isOpen) return;
      const handleKeyDown = (e) => {
        if (e.key === "Escape") {
          onCloseRef.current();
        }
      };
      document.addEventListener("keydown", handleKeyDown, { passive: true });
      document.body.style.overflow = "hidden";
      return () => {
        document.removeEventListener("keydown", handleKeyDown);
        document.body.style.overflow = "";
      };
    }, [isOpen]);
    const handleBackdropClick = useCallback(
      (e) => {
        if (e.target === e.currentTarget) {
          onCloseRef.current();
        }
      },
      []
    );
    return { handleBackdropClick };
  }

  // src/react/components/documents/DocumentPreview.tsx
  function getFileType(docDetails) {
    if (docDetails.type) return docDetails.type.toUpperCase();
    const ext = docDetails.documentName.split(".").pop();
    return ext ? ext.toUpperCase() : "FILE";
  }
  function DocumentPreview({
    document: docDetails,
    isLoading = false,
    onClose,
    onQueryDocument,
    accentColor = DEFAULT_ACCENT_COLOR
  }) {
    const { handleBackdropClick } = useModal({ onClose });
    return /* @__PURE__ */ jsx(
      "div",
      {
        className: "rag-preview-overlay",
        onClick: handleBackdropClick,
        role: "dialog",
        "aria-modal": "true",
        "aria-labelledby": "preview-dialog-title",
        children: /* @__PURE__ */ jsxs("div", { className: "rag-preview-modal", children: [
          /* @__PURE__ */ jsxs("div", { className: "rag-preview-header", children: [
            /* @__PURE__ */ jsxs("div", { className: "rag-preview-title-section", children: [
              /* @__PURE__ */ jsx(
                "div",
                {
                  className: "rag-preview-icon",
                  style: { backgroundColor: `${accentColor}20`, borderColor: `${accentColor}40` },
                  children: /* @__PURE__ */ jsx(FileText, { size: 24, style: { color: accentColor }, "aria-hidden": "true" })
                }
              ),
              /* @__PURE__ */ jsxs("div", { className: "rag-preview-title-info", children: [
                /* @__PURE__ */ jsx("h2", { id: "preview-dialog-title", className: "rag-preview-title", children: docDetails.documentName }),
                /* @__PURE__ */ jsx(
                  "span",
                  {
                    className: "rag-preview-type-badge",
                    style: { backgroundColor: `${accentColor}20`, color: accentColor },
                    children: getFileType(docDetails)
                  }
                )
              ] })
            ] }),
            /* @__PURE__ */ jsx(
              "button",
              {
                type: "button",
                onClick: onClose,
                className: "rag-preview-close",
                "aria-label": "Close preview",
                children: /* @__PURE__ */ jsx(X, { size: 20 })
              }
            )
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "rag-preview-metadata", children: [
            /* @__PURE__ */ jsxs("div", { className: "rag-preview-meta-item", children: [
              /* @__PURE__ */ jsx(Calendar, { size: 14, "aria-hidden": "true" }),
              /* @__PURE__ */ jsx("span", { children: formatDate(docDetails.timestamp, "datetime") })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "rag-preview-meta-item", children: [
              /* @__PURE__ */ jsx(Layers, { size: 14, "aria-hidden": "true" }),
              /* @__PURE__ */ jsxs("span", { children: [
                docDetails.chunkCount,
                " chunks"
              ] })
            ] }),
            docDetails.source && /* @__PURE__ */ jsxs("div", { className: "rag-preview-meta-item", children: [
              /* @__PURE__ */ jsx(ExternalLink, { size: 14, "aria-hidden": "true" }),
              /* @__PURE__ */ jsx("span", { children: docDetails.source })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "rag-preview-chunks-container", children: [
            /* @__PURE__ */ jsx("h3", { className: "rag-preview-chunks-title", children: "Document Chunks" }),
            isLoading ? /* @__PURE__ */ jsxs("div", { className: "rag-preview-loading", children: [
              /* @__PURE__ */ jsx("div", { className: "rag-preview-skeleton" }),
              /* @__PURE__ */ jsx("div", { className: "rag-preview-skeleton" }),
              /* @__PURE__ */ jsx("div", { className: "rag-preview-skeleton" })
            ] }) : docDetails.chunks && docDetails.chunks.length > 0 ? /* @__PURE__ */ jsx("div", { className: "rag-preview-chunks-list", children: docDetails.chunks.map((chunk) => /* @__PURE__ */ jsxs("div", { className: "rag-preview-chunk", children: [
              /* @__PURE__ */ jsx("div", { className: "rag-preview-chunk-header", children: /* @__PURE__ */ jsxs("span", { className: "rag-preview-chunk-index", children: [
                "Chunk ",
                chunk.chunkIndex + 1
              ] }) }),
              /* @__PURE__ */ jsx("p", { className: "rag-preview-chunk-text", children: chunk.snippet })
            ] }, chunk.chunkIndex)) }) : /* @__PURE__ */ jsx("div", { className: "rag-preview-no-chunks", children: /* @__PURE__ */ jsx("p", { children: "No chunk previews available" }) })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "rag-preview-footer", children: [
            /* @__PURE__ */ jsx(
              "button",
              {
                type: "button",
                onClick: onClose,
                className: "rag-preview-btn rag-preview-btn-secondary",
                children: "Close"
              }
            ),
            onQueryDocument && /* @__PURE__ */ jsxs(
              "button",
              {
                type: "button",
                onClick: () => onQueryDocument(docDetails),
                className: "rag-preview-btn rag-preview-btn-primary",
                style: { backgroundColor: accentColor },
                children: [
                  /* @__PURE__ */ jsx(MessageSquare, { size: 16, "aria-hidden": "true" }),
                  "Chat about this document"
                ]
              }
            )
          ] })
        ] })
      }
    );
  }

  // src/react/components/shared/ConfirmDialog.tsx
  function ConfirmDialog({
    title,
    message,
    confirmLabel = "Confirm",
    cancelLabel = "Cancel",
    onConfirm,
    onCancel,
    isDestructive = false
  }) {
    const { handleBackdropClick } = useModal({ onClose: onCancel });
    return /* @__PURE__ */ jsx(
      "div",
      {
        className: "rag-confirm-overlay",
        onClick: handleBackdropClick,
        role: "dialog",
        "aria-modal": "true",
        "aria-labelledby": "confirm-dialog-title",
        children: /* @__PURE__ */ jsxs("div", { className: "rag-confirm-dialog", children: [
          /* @__PURE__ */ jsxs("div", { className: "rag-confirm-header", children: [
            /* @__PURE__ */ jsxs("div", { className: "rag-confirm-title-row", children: [
              isDestructive && /* @__PURE__ */ jsx("div", { className: "rag-confirm-icon rag-confirm-icon-destructive", children: /* @__PURE__ */ jsx(AlertTriangle, { size: 20, "aria-hidden": "true" }) }),
              /* @__PURE__ */ jsx("h3", { id: "confirm-dialog-title", className: "rag-confirm-title", children: title })
            ] }),
            /* @__PURE__ */ jsx(
              "button",
              {
                type: "button",
                onClick: onCancel,
                className: "rag-confirm-close",
                "aria-label": "Close dialog",
                children: /* @__PURE__ */ jsx(X, { size: 18 })
              }
            )
          ] }),
          /* @__PURE__ */ jsx("div", { className: "rag-confirm-body", children: /* @__PURE__ */ jsx("p", { className: "rag-confirm-message", children: message }) }),
          /* @__PURE__ */ jsxs("div", { className: "rag-confirm-actions", children: [
            /* @__PURE__ */ jsx(
              "button",
              {
                type: "button",
                onClick: onCancel,
                className: "rag-confirm-btn rag-confirm-btn-cancel",
                children: cancelLabel
              }
            ),
            /* @__PURE__ */ jsx(
              "button",
              {
                type: "button",
                onClick: onConfirm,
                className: `rag-confirm-btn ${isDestructive ? "rag-confirm-btn-destructive" : "rag-confirm-btn-confirm"}`,
                children: confirmLabel
              }
            )
          ] })
        ] })
      }
    );
  }

  // src/react/hooks/useUploadStream.ts
  function isProgressData(data) {
    return typeof data === "object" && data !== null && "stage" in data && "percent" in data;
  }
  function isCompleteData(data) {
    return typeof data === "object" && data !== null && "documentId" in data && "chunks" in data;
  }
  function isMessageData(data) {
    return typeof data === "object" && data !== null && "message" in data;
  }
  var INITIAL_PROGRESS = { stage: "idle", percent: 0 };
  function createProgressUpdate(data) {
    return {
      stage: data.stage,
      percent: data.percent,
      current: data.current,
      total: data.total,
      chunkCount: data.chunkCount
    };
  }
  function createUploadResult(data) {
    return {
      documentId: data.documentId,
      chunks: data.chunks,
      name: data.name
    };
  }
  function useUploadStream(options = {}) {
    const {
      endpoint = "/api/rag/upload/stream",
      headers = {},
      onProgress,
      onComplete,
      onError,
      onWarning
    } = options;
    const [isUploading, setIsUploading] = useState(false);
    const [progress, setProgress] = useState(INITIAL_PROGRESS);
    const [error, setError] = useState(null);
    const [warning, setWarning] = useState(null);
    const abortControllerRef = useRef(null);
    const activeReaderRef = useRef(null);
    const upload = useCallback(async (file, uploadOptions) => {
      setIsUploading(true);
      setError(null);
      setWarning(null);
      setProgress({ stage: "reading", percent: 0 });
      abortControllerRef.current = new AbortController();
      try {
        const formData = new FormData();
        formData.append("file", file);
        if (uploadOptions?.name) {
          formData.append("name", uploadOptions.name);
        }
        if (uploadOptions?.categoryIds) {
          formData.append("categoryIds", JSON.stringify(uploadOptions.categoryIds));
        }
        if (uploadOptions?.tags) {
          formData.append("tags", JSON.stringify(uploadOptions.tags));
        }
        const response = await fetch(endpoint, {
          method: "POST",
          headers,
          body: formData,
          signal: abortControllerRef.current.signal
        });
        if (!response.ok) {
          throw new Error(`Upload failed: ${response.statusText}`);
        }
        if (!response.body) {
          throw new Error("No response body");
        }
        const reader = response.body.getReader();
        activeReaderRef.current = reader;
        const decoder = new TextDecoder();
        let buffer = "";
        let result = null;
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split("\n");
          buffer = lines.pop() || "";
          let currentEventType = "";
          for (const line of lines) {
            if (line.startsWith("event: ")) {
              currentEventType = line.slice(7).trim();
              continue;
            }
            if (line.startsWith("data: ")) {
              const data = JSON.parse(line.slice(6));
              switch (currentEventType) {
                case "progress": {
                  if (!isProgressData(data)) break;
                  const progressUpdate = createProgressUpdate(data);
                  setProgress(progressUpdate);
                  onProgress?.(progressUpdate);
                  break;
                }
                case "complete": {
                  if (!isCompleteData(data)) break;
                  result = createUploadResult(data);
                  setProgress({ stage: "complete", percent: 100 });
                  onComplete?.(result);
                  break;
                }
                case "warning": {
                  if (!isMessageData(data)) break;
                  setWarning(data.message);
                  onWarning?.(data.message);
                  break;
                }
                case "error": {
                  if (!isMessageData(data)) break;
                  throw new Error(data.message);
                }
                default: {
                  if (isProgressData(data)) {
                    const progressUpdate = createProgressUpdate(data);
                    setProgress(progressUpdate);
                    onProgress?.(progressUpdate);
                  } else if (isCompleteData(data)) {
                    result = createUploadResult(data);
                    setProgress({ stage: "complete", percent: 100 });
                    onComplete?.(result);
                  } else if (isMessageData(data)) {
                    throw new Error(data.message);
                  }
                }
              }
              currentEventType = "";
            }
          }
        }
        return result;
      } catch (err) {
        if (err instanceof Error && err.name === "AbortError") {
          setError("Upload cancelled");
          setProgress({ stage: "error", percent: 0 });
          return null;
        }
        const errorMessage = err instanceof Error ? err.message : "Upload failed";
        setError(errorMessage);
        setProgress({ stage: "error", percent: 0 });
        onError?.(errorMessage);
        return null;
      } finally {
        setIsUploading(false);
        abortControllerRef.current = null;
        activeReaderRef.current = null;
      }
    }, [endpoint, headers, onProgress, onComplete, onError, onWarning]);
    const cancel = useCallback(() => {
      if (activeReaderRef.current) {
        activeReaderRef.current.cancel().catch(() => {
        });
        activeReaderRef.current = null;
      }
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    }, []);
    return {
      upload,
      cancel,
      isUploading,
      progress,
      error,
      warning
    };
  }

  // src/react/hooks/useFileQueue.ts
  var generateId2 = () => `file_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
  var INITIAL_PROGRESS2 = { stage: "idle", percent: 0 };
  function markFileComplete(files, fileId, result) {
    return files.map(
      (f) => f.id === fileId ? {
        ...f,
        status: "complete",
        progress: { stage: "complete", percent: 100 },
        result
      } : f
    );
  }
  function markFileError(files, fileId, errorMessage) {
    return files.map(
      (f) => f.id === fileId ? {
        ...f,
        status: "error",
        progress: { stage: "error", percent: 0 },
        error: errorMessage
      } : f
    );
  }
  function useFileQueue(options = {}) {
    const {
      endpoint,
      headers,
      onFileComplete,
      onAllComplete,
      onError
    } = options;
    const [files, setFiles] = useState([]);
    const [isUploading, setIsUploading] = useState(false);
    const cancelRef = useRef(false);
    const currentFileIdRef = useRef(null);
    const lastErrorRef = useRef(null);
    const filesRef = useRef(files);
    filesRef.current = files;
    const { upload, cancel } = useUploadStream({
      endpoint,
      headers,
      onProgress: (progress) => {
        const fileId = currentFileIdRef.current;
        if (fileId) {
          setFiles(
            (prev) => prev.map((f) => f.id === fileId ? { ...f, progress } : f)
          );
        }
      },
      onError: (error) => {
        lastErrorRef.current = error;
      },
      onWarning: (message) => {
        const fileId = currentFileIdRef.current;
        if (fileId) {
          setFiles(
            (prev) => prev.map((f) => f.id === fileId ? { ...f, warning: message } : f)
          );
        }
      }
    });
    const addFiles = useCallback((newFiles) => {
      setFiles((prev) => {
        const existingNames = new Set(prev.map((f) => f.name));
        const uniqueFiles = newFiles.filter((file) => !existingNames.has(file.name));
        if (uniqueFiles.length === 0) return prev;
        const queuedFiles = uniqueFiles.map((file) => ({
          id: generateId2(),
          file,
          name: file.name,
          status: "queued",
          progress: INITIAL_PROGRESS2
          // Preview generated lazily when needed to avoid memory overhead
        }));
        return [...prev, ...queuedFiles];
      });
    }, []);
    const removeFile = useCallback((id) => {
      setFiles((prev) => prev.filter((f) => f.id !== id));
    }, []);
    const updateFileName = useCallback((id, name) => {
      setFiles(
        (prev) => prev.map((f) => {
          if (f.id !== id) return f;
          const originalExt = f.file.name.includes(".") ? f.file.name.slice(f.file.name.lastIndexOf(".")) : "";
          const newHasExt = name.includes(".");
          const finalName = newHasExt ? name : name + originalExt;
          return { ...f, name: finalName };
        })
      );
    }, []);
    const clearCompleted = useCallback(() => {
      setFiles((prev) => prev.filter((f) => f.status !== "complete"));
    }, []);
    const clearAll = useCallback(() => {
      if (!isUploading) {
        setFiles([]);
      }
    }, [isUploading]);
    const startUpload = useCallback(async (uploadOptions) => {
      setIsUploading(true);
      cancelRef.current = false;
      const results = [];
      const pendingFiles = filesRef.current.filter((f) => f.status === "queued");
      for (const queuedFile of pendingFiles) {
        if (cancelRef.current) break;
        currentFileIdRef.current = queuedFile.id;
        lastErrorRef.current = null;
        setFiles(
          (prev) => prev.map(
            (f) => f.id === queuedFile.id ? { ...f, status: "uploading", progress: { stage: "reading", percent: 0 } } : f
          )
        );
        const result = await upload(queuedFile.file, {
          name: queuedFile.name,
          ...uploadOptions
        });
        if (result) {
          results.push(result);
          setFiles((prev) => markFileComplete(prev, queuedFile.id, result));
          onFileComplete?.({ ...queuedFile, status: "complete", result }, result);
        } else {
          const errorMessage = lastErrorRef.current || "Upload failed";
          setFiles((prev) => markFileError(prev, queuedFile.id, errorMessage));
          onError?.({ ...queuedFile, status: "error", error: errorMessage }, errorMessage);
        }
        currentFileIdRef.current = null;
      }
      setIsUploading(false);
      if (results.length > 0) {
        onAllComplete?.(results);
      }
    }, [upload, onFileComplete, onAllComplete, onError]);
    const cancelUpload = useCallback(() => {
      cancelRef.current = true;
      cancel();
    }, [cancel]);
    return {
      files,
      addFiles,
      removeFile,
      updateFileName,
      clearCompleted,
      clearAll,
      startUpload,
      cancelUpload,
      isUploading,
      hasFiles: files.length > 0,
      completedCount: files.filter((f) => f.status === "complete").length,
      errorCount: files.filter((f) => f.status === "error").length
    };
  }

  // src/react/hooks/useAPIResource.ts
  function useAPIResource(options) {
    const {
      fetchUrl,
      headers = {},
      autoFetch = true,
      transformResponse
    } = options;
    const [data, setData] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const headersJson = JSON.stringify(headers);
    const stableHeaders = useMemo(() => headers, [headersJson]);
    const abortControllerRef = useRef(null);
    const refetchRef = useRef(null);
    useEffect(() => {
      return () => {
        abortControllerRef.current?.abort();
      };
    }, []);
    const refetch = useCallback(async () => {
      abortControllerRef.current?.abort();
      abortControllerRef.current = new AbortController();
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch(fetchUrl, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            ...stableHeaders
          },
          signal: abortControllerRef.current.signal
        });
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.error || `Request failed: ${response.status}`);
        }
        const responseData = await response.json();
        setData(transformResponse(responseData));
      } catch (err) {
        if (err instanceof Error && err.name === "AbortError") {
          return;
        }
        const errorMessage = err instanceof Error ? err.message : "Failed to fetch data";
        setError(errorMessage);
      } finally {
        setIsLoading(false);
      }
    }, [fetchUrl, stableHeaders, transformResponse]);
    refetchRef.current = refetch;
    useEffect(() => {
      if (autoFetch) {
        refetchRef.current?.();
      }
    }, [autoFetch, fetchUrl]);
    return {
      data,
      isLoading,
      error,
      refetch,
      setData,
      setError,
      stableHeaders
    };
  }
  function createApiMutation(options) {
    const { endpoint, stableHeaders, setError } = options;
    return async (config) => {
      const { path, method, body, errorMessage } = config;
      setError(null);
      try {
        const response = await fetch(`${endpoint}${path}`, {
          method,
          headers: {
            "Content-Type": "application/json",
            ...stableHeaders
          },
          ...body && { body: JSON.stringify(body) }
        });
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.error || `Request failed: ${response.status}`);
        }
        return await response.json();
      } catch (err) {
        const message = err instanceof Error ? err.message : errorMessage;
        setError(message);
        return null;
      }
    };
  }

  // src/react/hooks/useDocuments.ts
  function sortDocuments(docs, sortBy, sortOrder) {
    return [...docs].sort((a, b) => {
      let comparison = 0;
      switch (sortBy) {
        case "name":
          comparison = a.documentName.localeCompare(b.documentName);
          break;
        case "date":
          comparison = a.timestamp - b.timestamp;
          break;
        case "chunks":
          comparison = a.chunkCount - b.chunkCount;
          break;
      }
      return sortOrder === "asc" ? comparison : -comparison;
    });
  }
  function validateApiArrayResponse(data, fieldName, validateItem) {
    if (data === null || typeof data !== "object") {
      throw new Error("Invalid API response: expected an object");
    }
    const response = data;
    if (!(fieldName in response)) {
      return [];
    }
    if (!Array.isArray(response[fieldName])) {
      throw new Error(`Invalid API response: ${fieldName} must be an array`);
    }
    for (const item of response[fieldName]) {
      if (typeof item !== "object" || item === null) {
        throw new Error(`Invalid ${fieldName} item: expected an object`);
      }
      validateItem(item);
    }
    return response[fieldName];
  }
  var validateDocumentItem = (d) => {
    if (typeof d.documentId !== "string" || typeof d.documentName !== "string" || typeof d.chunkCount !== "number" || typeof d.timestamp !== "number") {
      throw new Error("Invalid document: missing required properties (documentId, documentName, chunkCount, timestamp)");
    }
  };
  var transformDocumentsResponse = (data) => {
    return validateApiArrayResponse(data, "documents", validateDocumentItem);
  };
  function useDocuments(options = {}) {
    const {
      endpoint = "/api/rag",
      headers = {},
      autoFetch = true
    } = options;
    const {
      data: documents,
      isLoading,
      error,
      refetch,
      setData: setDocuments,
      setError,
      stableHeaders
    } = useAPIResource({
      fetchUrl: `${endpoint}/documents/details`,
      headers,
      autoFetch,
      transformResponse: transformDocumentsResponse
    });
    const [searchQuery, setSearchQuery] = useState("");
    const [sortBy, setSortBy] = useState("date");
    const [sortOrder, setSortOrder] = useState("desc");
    const deleteDocument = useCallback(async (id) => {
      try {
        const response = await fetch(`${endpoint}/documents/${encodeURIComponent(id)}`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            ...stableHeaders
          }
        });
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.error || `Delete failed: ${response.status}`);
        }
        setDocuments((prev) => prev.filter((doc) => doc.documentId !== id));
        return true;
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Failed to delete document";
        setError(errorMessage);
        return false;
      }
    }, [endpoint, stableHeaders, setDocuments, setError]);
    const getDocumentDetails = useCallback(async (id) => {
      try {
        const response = await fetch(`${endpoint}/documents/${encodeURIComponent(id)}/details`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            ...stableHeaders
          }
        });
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.error || `Request failed: ${response.status}`);
        }
        return await response.json();
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Failed to fetch document details";
        setError(errorMessage);
        return null;
      }
    }, [endpoint, stableHeaders, setError]);
    const filteredDocuments = useMemo(() => {
      let result = documents;
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        result = result.filter(
          (doc) => doc.documentName.toLowerCase().includes(query)
        );
      }
      return sortDocuments(result, sortBy, sortOrder);
    }, [documents, searchQuery, sortBy, sortOrder]);
    return {
      documents,
      isLoading,
      error,
      refetch,
      deleteDocument,
      getDocumentDetails,
      searchQuery,
      setSearchQuery,
      sortBy,
      setSortBy,
      sortOrder,
      setSortOrder,
      filteredDocuments
    };
  }

  // src/react/hooks/useCategories.ts
  var validateCategoryItem = (c) => {
    if (typeof c.id !== "string" || typeof c.name !== "string" || typeof c.color !== "string") {
      throw new Error("Invalid category: missing required properties (id, name, color)");
    }
  };
  var transformCategoriesResponse = (data) => {
    return validateApiArrayResponse(data, "categories", validateCategoryItem);
  };
  function useCategories(options = {}) {
    const {
      endpoint = "/api/rag",
      headers = {},
      autoFetch = true
    } = options;
    const {
      data: categories,
      isLoading,
      error,
      refetch,
      setData: setCategories,
      setError,
      stableHeaders
    } = useAPIResource({
      fetchUrl: `${endpoint}/categories`,
      headers,
      autoFetch,
      transformResponse: transformCategoriesResponse
    });
    const mutate = useMemo(
      () => createApiMutation({ endpoint, stableHeaders, setError }),
      [endpoint, stableHeaders, setError]
    );
    const createCategory = useCallback(async (name, color, icon) => {
      const data = await mutate({
        path: "/categories",
        method: "POST",
        body: { name, color, icon },
        errorMessage: "Failed to create category"
      });
      if (data) {
        setCategories((prev) => [...prev, data.category]);
        return data.category;
      }
      return null;
    }, [mutate, setCategories]);
    const updateCategory = useCallback(async (id, updates) => {
      const data = await mutate({
        path: `/categories/${encodeURIComponent(id)}`,
        method: "PATCH",
        body: updates,
        errorMessage: "Failed to update category"
      });
      if (data) {
        setCategories(
          (prev) => prev.map((cat) => cat.id === id ? data.category : cat)
        );
        return data.category;
      }
      return null;
    }, [mutate, setCategories]);
    const deleteCategory = useCallback(async (id) => {
      const data = await mutate({
        path: `/categories/${encodeURIComponent(id)}`,
        method: "DELETE",
        errorMessage: "Failed to delete category"
      });
      if (data) {
        setCategories((prev) => prev.filter((cat) => cat.id !== id));
        return true;
      }
      return false;
    }, [mutate, setCategories]);
    const getCategoryById = useCallback((id) => {
      return categories.find((cat) => cat.id === id);
    }, [categories]);
    return {
      categories,
      isLoading,
      error,
      refetch,
      createCategory,
      updateCategory,
      deleteCategory,
      getCategoryById
    };
  }

  // src/shared/file-types.ts
  var SUPPORTED_EXTENSIONS = [".pdf", ".docx", ".txt", ".md", ".html", ".htm", ".xlsx", ".xls", ".csv"];
  var SUPPORTED_MIME_TYPES = [
    "application/pdf",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "text/plain",
    "text/markdown",
    "text/html",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    // .xlsx
    "application/vnd.ms-excel",
    // .xls
    "text/csv"
    // .csv
  ];

  // src/react/components/upload/FileDropZone.tsx
  function isAcceptableFile(file) {
    const ext = "." + file.name.split(".").pop()?.toLowerCase();
    return SUPPORTED_MIME_TYPES.includes(file.type) || SUPPORTED_EXTENSIONS.includes(ext);
  }
  function FileDropZone({
    onFilesSelected,
    accept = [...SUPPORTED_EXTENSIONS, ...SUPPORTED_MIME_TYPES].join(","),
    multiple = true,
    disabled = false,
    className = ""
  }) {
    const [isDragging, setIsDragging] = useState(false);
    const [error, setError] = useState(null);
    const inputRef = useRef(null);
    const handleDragEnter = useCallback((e) => {
      e.preventDefault();
      e.stopPropagation();
      if (!disabled) {
        setIsDragging(true);
        setError(null);
      }
    }, [disabled]);
    const handleDragLeave = useCallback((e) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);
    }, []);
    const handleDragOver = useCallback((e) => {
      e.preventDefault();
      e.stopPropagation();
    }, []);
    const processFiles = useCallback((fileList) => {
      if (!fileList || fileList.length === 0) return;
      const files = Array.from(fileList);
      const validFiles = files.filter(isAcceptableFile);
      const invalidCount = files.length - validFiles.length;
      if (invalidCount > 0) {
        setError(`${invalidCount} file(s) skipped. Supported: PDF, DOCX, TXT, MD, HTML, XLSX, XLS, CSV`);
      } else {
        setError(null);
      }
      if (validFiles.length > 0) {
        if (!multiple && validFiles.length > 1) {
          onFilesSelected([validFiles[0]]);
        } else {
          onFilesSelected(validFiles);
        }
      }
    }, [multiple, onFilesSelected]);
    const handleDrop = useCallback((e) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);
      if (disabled) return;
      processFiles(e.dataTransfer.files);
    }, [disabled, processFiles]);
    const handleInputChange = useCallback((e) => {
      processFiles(e.target.files);
      if (inputRef.current) {
        inputRef.current.value = "";
      }
    }, [processFiles]);
    const handleClick = useCallback(() => {
      if (!disabled) {
        inputRef.current?.click();
      }
    }, [disabled]);
    const handleKeyDown = useCallback((e) => {
      if ((e.key === "Enter" || e.key === " ") && !disabled) {
        e.preventDefault();
        inputRef.current?.click();
      }
    }, [disabled]);
    return /* @__PURE__ */ jsxs(
      "div",
      {
        className: `rag-upload-dropzone ${isDragging ? "dragging" : ""} ${disabled ? "disabled" : ""} ${className}`,
        onDragEnter: handleDragEnter,
        onDragLeave: handleDragLeave,
        onDragOver: handleDragOver,
        onDrop: handleDrop,
        onClick: handleClick,
        onKeyDown: handleKeyDown,
        role: "button",
        tabIndex: disabled ? -1 : 0,
        "aria-label": "Drop files here or click to select",
        children: [
          /* @__PURE__ */ jsx(
            "input",
            {
              ref: inputRef,
              type: "file",
              accept,
              multiple,
              onChange: handleInputChange,
              disabled,
              className: "rag-upload-input",
              "aria-hidden": "true"
            }
          ),
          /* @__PURE__ */ jsxs("div", { className: "rag-upload-dropzone-content", children: [
            /* @__PURE__ */ jsx("div", { className: `rag-upload-dropzone-icon ${isDragging ? "active" : ""}`, children: isDragging ? /* @__PURE__ */ jsx(FileText, { size: 32 }) : /* @__PURE__ */ jsx(Upload, { size: 32 }) }),
            /* @__PURE__ */ jsxs("div", { className: "rag-upload-dropzone-text", children: [
              /* @__PURE__ */ jsx("span", { className: "rag-upload-dropzone-title", children: isDragging ? "Drop files here" : "Drop files here or click to select" }),
              /* @__PURE__ */ jsx("span", { className: "rag-upload-dropzone-subtitle", children: "PDF, DOCX, Excel, CSV, TXT, MD, HTML" })
            ] })
          ] }),
          error && /* @__PURE__ */ jsxs("div", { className: "rag-upload-dropzone-error", children: [
            /* @__PURE__ */ jsx(AlertCircle, { size: 14 }),
            /* @__PURE__ */ jsx("span", { children: error })
          ] })
        ]
      }
    );
  }

  // src/react/components/upload/ProgressIndicator.tsx
  var STAGES = {
    idle: { label: "Waiting", icon: /* @__PURE__ */ jsx(FileText, { size: 14 }), rangeStart: 0, rangeEnd: 0, order: null },
    reading: { label: "Reading file", icon: /* @__PURE__ */ jsx(FileText, { size: 14 }), rangeStart: 0, rangeEnd: 10, order: 0 },
    extracting: { label: "Extracting text", icon: /* @__PURE__ */ jsx(FileText, { size: 14 }), rangeStart: 10, rangeEnd: 30, order: 1 },
    chunking: { label: "Chunking", icon: /* @__PURE__ */ jsx(FileText, { size: 14 }), rangeStart: 30, rangeEnd: 35, order: 2 },
    embedding: { label: "Generating embeddings", icon: /* @__PURE__ */ jsx(Sparkles, { size: 14 }), rangeStart: 35, rangeEnd: 90, order: 3 },
    storing: { label: "Storing", icon: /* @__PURE__ */ jsx(Database, { size: 14 }), rangeStart: 90, rangeEnd: 100, order: 4 },
    complete: { label: "Complete", icon: /* @__PURE__ */ jsx(Check, { size: 14 }), rangeStart: 100, rangeEnd: 100, order: 5 },
    error: { label: "Error", icon: /* @__PURE__ */ jsx(AlertCircle, { size: 14 }), rangeStart: 0, rangeEnd: 0, order: null }
  };
  var STAGE_ORDER = Object.entries(STAGES).filter(([, info]) => info.order !== null).sort((a, b) => a[1].order - b[1].order).map(([stage]) => stage);
  function getStageIndex(stage) {
    const idx = STAGE_ORDER.indexOf(stage);
    return idx >= 0 ? idx : 0;
  }
  function ProgressIndicator({
    progress,
    showStages = true,
    className = ""
  }) {
    const { stage, percent, current, total, chunkCount } = progress;
    const stageInfo = STAGES[stage];
    const currentStageIndex = getStageIndex(stage);
    const isComplete = stage === "complete";
    const isError = stage === "error";
    let detailText = "";
    if (stage === "embedding" && current !== void 0 && total !== void 0) {
      detailText = `${current}/${total} chunks`;
    } else if (stage === "chunking" && chunkCount !== void 0) {
      detailText = `${chunkCount} chunks`;
    }
    return /* @__PURE__ */ jsxs("div", { className: `rag-upload-progress ${className}`, children: [
      /* @__PURE__ */ jsx("div", { className: "rag-upload-progress-bar-container", children: /* @__PURE__ */ jsx(
        "div",
        {
          className: `rag-upload-progress-bar ${isComplete ? "complete" : ""} ${isError ? "error" : ""}`,
          style: { width: `${percent}%` }
        }
      ) }),
      /* @__PURE__ */ jsxs("div", { className: "rag-upload-progress-info", children: [
        /* @__PURE__ */ jsxs("span", { className: `rag-upload-progress-stage ${isError ? "error" : ""}`, children: [
          stageInfo.icon,
          /* @__PURE__ */ jsx("span", { children: stageInfo.label })
        ] }),
        /* @__PURE__ */ jsxs("span", { className: "rag-upload-progress-percent", children: [
          detailText && /* @__PURE__ */ jsx("span", { className: "rag-upload-progress-detail", children: detailText }),
          !isError && /* @__PURE__ */ jsxs("span", { children: [
            percent,
            "%"
          ] })
        ] })
      ] }),
      showStages && !isError && /* @__PURE__ */ jsx("div", { className: "rag-upload-progress-stages", children: STAGE_ORDER.slice(0, -1).map((s, idx) => {
        const info = STAGES[s];
        const isPast = idx < currentStageIndex;
        const isCurrent = idx === currentStageIndex;
        return /* @__PURE__ */ jsx(
          "div",
          {
            className: `rag-upload-progress-stage-dot ${isPast ? "past" : ""} ${isCurrent ? "current" : ""}`,
            title: info.label,
            children: isPast ? /* @__PURE__ */ jsx(Check, { size: 10 }) : /* @__PURE__ */ jsx("span", { className: "dot" })
          },
          s
        );
      }) })
    ] });
  }

  // src/react/utils/format.ts
  function formatFileSize(bytes) {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  }

  // src/react/components/upload/FileQueue.tsx
  function getStatusIcon(status) {
    switch (status) {
      case "queued":
        return /* @__PURE__ */ jsx(FileText, { size: 16, className: "rag-upload-queue-icon queued" });
      case "uploading":
        return /* @__PURE__ */ jsx(Loader2, { size: 16, className: "rag-upload-queue-icon uploading" });
      case "complete":
        return /* @__PURE__ */ jsx(Check, { size: 16, className: "rag-upload-queue-icon complete" });
      case "error":
        return /* @__PURE__ */ jsx(AlertCircle, { size: 16, className: "rag-upload-queue-icon error" });
    }
  }
  function FileQueueItem({
    file,
    onRemove,
    onRename,
    isUploading
  }) {
    const [isEditing, setIsEditing] = react_shim_default.useState(false);
    const [editName, setEditName] = react_shim_default.useState(file.name);
    const inputRef = react_shim_default.useRef(null);
    const canEdit = file.status === "queued" && !isUploading;
    const canRemove = file.status !== "uploading";
    const handleStartEdit = () => {
      if (canEdit && onRename) {
        setEditName(file.name);
        setIsEditing(true);
        requestAnimationFrame(() => inputRef.current?.focus());
      }
    };
    const handleSaveEdit = () => {
      if (editName.trim() && editName !== file.name) {
        onRename?.(editName.trim());
      }
      setIsEditing(false);
    };
    const handleKeyDown = (e) => {
      if (e.key === "Enter") {
        handleSaveEdit();
      } else if (e.key === "Escape") {
        setIsEditing(false);
        setEditName(file.name);
      }
    };
    return /* @__PURE__ */ jsxs("div", { className: `rag-upload-queue-item ${file.status}`, children: [
      /* @__PURE__ */ jsxs("div", { className: "rag-upload-queue-item-header", children: [
        /* @__PURE__ */ jsxs("div", { className: "rag-upload-queue-item-info", children: [
          getStatusIcon(file.status),
          isEditing ? /* @__PURE__ */ jsx(
            "input",
            {
              ref: inputRef,
              type: "text",
              value: editName,
              onChange: (e) => setEditName(e.target.value),
              onBlur: handleSaveEdit,
              onKeyDown: handleKeyDown,
              className: "rag-upload-queue-item-input"
            }
          ) : /* @__PURE__ */ jsxs(
            "span",
            {
              className: `rag-upload-queue-item-name ${canEdit ? "editable" : ""}`,
              onClick: handleStartEdit,
              title: file.name,
              children: [
                file.name,
                canEdit && onRename && /* @__PURE__ */ jsx(Edit2, { size: 12, className: "edit-icon" })
              ]
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "rag-upload-queue-item-actions", children: [
          /* @__PURE__ */ jsx("span", { className: "rag-upload-queue-item-size", children: formatFileSize(file.file.size) }),
          file.result && /* @__PURE__ */ jsxs("span", { className: "rag-upload-queue-item-chunks", children: [
            file.result.chunks,
            " chunks"
          ] }),
          canRemove && /* @__PURE__ */ jsx(
            "button",
            {
              type: "button",
              onClick: onRemove,
              className: "rag-upload-queue-item-remove",
              "aria-label": "Remove file",
              children: /* @__PURE__ */ jsx(X, { size: 14 })
            }
          )
        ] })
      ] }),
      file.status === "uploading" && /* @__PURE__ */ jsx(ProgressIndicator, { progress: file.progress, showStages: false }),
      file.status === "error" && file.error && /* @__PURE__ */ jsxs("div", { className: "rag-upload-queue-item-error", children: [
        /* @__PURE__ */ jsx(AlertCircle, { size: 12 }),
        /* @__PURE__ */ jsx("span", { children: file.error })
      ] }),
      file.warning && /* @__PURE__ */ jsxs("div", { className: "rag-upload-queue-item-warning", children: [
        /* @__PURE__ */ jsx(AlertCircle, { size: 12 }),
        /* @__PURE__ */ jsx("span", { children: file.warning })
      ] })
    ] });
  }
  function FileQueue({
    files,
    onRemove,
    onRename,
    isUploading = false,
    className = ""
  }) {
    if (files.length === 0) {
      return null;
    }
    const queuedCount = files.filter((f) => f.status === "queued").length;
    const completedCount = files.filter((f) => f.status === "complete").length;
    const errorCount = files.filter((f) => f.status === "error").length;
    return /* @__PURE__ */ jsxs("div", { className: `rag-upload-queue ${className}`, children: [
      /* @__PURE__ */ jsxs("div", { className: "rag-upload-queue-header", children: [
        /* @__PURE__ */ jsxs("span", { className: "rag-upload-queue-title", children: [
          "Files (",
          files.length,
          ")"
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "rag-upload-queue-stats", children: [
          queuedCount > 0 && /* @__PURE__ */ jsxs("span", { className: "rag-upload-queue-stat queued", children: [
            queuedCount,
            " queued"
          ] }),
          completedCount > 0 && /* @__PURE__ */ jsxs("span", { className: "rag-upload-queue-stat complete", children: [
            completedCount,
            " complete"
          ] }),
          errorCount > 0 && /* @__PURE__ */ jsxs("span", { className: "rag-upload-queue-stat error", children: [
            errorCount,
            " failed"
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "rag-upload-queue-list", children: files.map((file) => /* @__PURE__ */ jsx(
        FileQueueItem,
        {
          file,
          onRemove: () => onRemove(file.id),
          onRename: onRename ? (name) => onRename(file.id, name) : void 0,
          isUploading
        },
        file.id
      )) })
    ] });
  }

  // src/react/components/categories/CategoryFilter.tsx
  function CategoryFilter({
    categories,
    selected,
    onChange,
    mode = "dropdown",
    placeholder = "All Categories",
    className = ""
  }) {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);
    useEffect(() => {
      function handleClickOutside(event) {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
          setIsOpen(false);
        }
      }
      if (isOpen) {
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
      }
    }, [isOpen]);
    const selectedCategory = selected ? categories.find((c) => c.id === selected) : null;
    if (mode === "buttons") {
      return /* @__PURE__ */ jsxs(
        "div",
        {
          className: `rag-category-filter-buttons ${className}`,
          style: {
            display: "flex",
            flexWrap: "wrap",
            gap: "6px"
          },
          children: [
            /* @__PURE__ */ jsx(
              "button",
              {
                type: "button",
                onClick: () => onChange(null),
                style: {
                  padding: "6px 12px",
                  fontSize: "13px",
                  fontWeight: selected === null ? 600 : 400,
                  border: "1px solid",
                  borderColor: selected === null ? "#6366f1" : "#e5e7eb",
                  borderRadius: "6px",
                  backgroundColor: selected === null ? "#6366f1" : "#ffffff",
                  color: selected === null ? "#ffffff" : "#374151",
                  cursor: "pointer",
                  transition: "all 0.15s ease"
                },
                children: "All"
              }
            ),
            categories.map((category) => {
              const isSelected = selected === category.id;
              return /* @__PURE__ */ jsxs(
                "button",
                {
                  type: "button",
                  onClick: () => onChange(isSelected ? null : category.id),
                  style: {
                    padding: "6px 12px",
                    fontSize: "13px",
                    fontWeight: isSelected ? 600 : 400,
                    border: "1px solid",
                    borderColor: isSelected ? category.color : "#e5e7eb",
                    borderRadius: "6px",
                    backgroundColor: isSelected ? category.color : "#ffffff",
                    color: isSelected ? getContrastColor(category.color) : "#374151",
                    cursor: "pointer",
                    transition: "all 0.15s ease"
                  },
                  children: [
                    category.icon && /* @__PURE__ */ jsx("span", { style: { marginRight: "4px" }, children: category.icon }),
                    category.name
                  ]
                },
                category.id
              );
            })
          ]
        }
      );
    }
    return /* @__PURE__ */ jsxs(
      "div",
      {
        ref: dropdownRef,
        className: `rag-category-filter-dropdown ${className}`,
        style: {
          position: "relative",
          display: "inline-block",
          minWidth: "180px"
        },
        children: [
          /* @__PURE__ */ jsxs(
            "button",
            {
              type: "button",
              onClick: () => setIsOpen(!isOpen),
              style: {
                width: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: "8px",
                padding: "8px 12px",
                fontSize: "14px",
                fontWeight: 400,
                border: "1px solid #e5e7eb",
                borderRadius: "6px",
                backgroundColor: "#ffffff",
                color: "#374151",
                cursor: "pointer",
                transition: "border-color 0.15s ease"
              },
              onFocus: (e) => {
                e.currentTarget.style.borderColor = "#6366f1";
              },
              onBlur: (e) => {
                e.currentTarget.style.borderColor = "#e5e7eb";
              },
              "aria-haspopup": "listbox",
              "aria-expanded": isOpen,
              children: [
                /* @__PURE__ */ jsx("span", { style: { display: "flex", alignItems: "center", gap: "6px" }, children: selectedCategory ? /* @__PURE__ */ jsxs(Fragment2, { children: [
                  /* @__PURE__ */ jsx(
                    "span",
                    {
                      style: {
                        width: "10px",
                        height: "10px",
                        borderRadius: "2px",
                        backgroundColor: selectedCategory.color
                      }
                    }
                  ),
                  /* @__PURE__ */ jsx("span", { children: selectedCategory.name })
                ] }) : /* @__PURE__ */ jsx("span", { style: { color: "#9ca3af" }, children: placeholder }) }),
                /* @__PURE__ */ jsx(
                  "svg",
                  {
                    width: "12",
                    height: "12",
                    viewBox: "0 0 12 12",
                    fill: "none",
                    style: {
                      transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
                      transition: "transform 0.15s ease"
                    },
                    children: /* @__PURE__ */ jsx(
                      "path",
                      {
                        d: "M2.5 4.5L6 8L9.5 4.5",
                        stroke: "currentColor",
                        strokeWidth: "1.5",
                        strokeLinecap: "round",
                        strokeLinejoin: "round"
                      }
                    )
                  }
                )
              ]
            }
          ),
          isOpen && /* @__PURE__ */ jsxs(
            "ul",
            {
              role: "listbox",
              style: {
                position: "absolute",
                top: "calc(100% + 4px)",
                left: 0,
                right: 0,
                margin: 0,
                padding: "4px",
                listStyle: "none",
                backgroundColor: "#ffffff",
                border: "1px solid #e5e7eb",
                borderRadius: "6px",
                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
                zIndex: 50,
                maxHeight: "240px",
                overflowY: "auto"
              },
              children: [
                /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsxs(
                  "button",
                  {
                    type: "button",
                    onClick: () => {
                      onChange(null);
                      setIsOpen(false);
                    },
                    style: {
                      width: "100%",
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      padding: "8px 10px",
                      fontSize: "13px",
                      fontWeight: selected === null ? 600 : 400,
                      border: "none",
                      borderRadius: "4px",
                      backgroundColor: selected === null ? "#f3f4f6" : "transparent",
                      color: "#374151",
                      cursor: "pointer",
                      textAlign: "left",
                      transition: "background-color 0.1s ease"
                    },
                    onMouseEnter: (e) => {
                      if (selected !== null) {
                        e.currentTarget.style.backgroundColor = "#f9fafb";
                      }
                    },
                    onMouseLeave: (e) => {
                      if (selected !== null) {
                        e.currentTarget.style.backgroundColor = "transparent";
                      }
                    },
                    role: "option",
                    "aria-selected": selected === null,
                    children: [
                      /* @__PURE__ */ jsx(
                        "span",
                        {
                          style: {
                            width: "10px",
                            height: "10px",
                            borderRadius: "2px",
                            backgroundColor: "#9ca3af"
                          }
                        }
                      ),
                      /* @__PURE__ */ jsx("span", { children: placeholder })
                    ]
                  }
                ) }),
                categories.map((category) => {
                  const isSelected = selected === category.id;
                  return /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsxs(
                    "button",
                    {
                      type: "button",
                      onClick: () => {
                        onChange(category.id);
                        setIsOpen(false);
                      },
                      style: {
                        width: "100%",
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                        padding: "8px 10px",
                        fontSize: "13px",
                        fontWeight: isSelected ? 600 : 400,
                        border: "none",
                        borderRadius: "4px",
                        backgroundColor: isSelected ? "#f3f4f6" : "transparent",
                        color: "#374151",
                        cursor: "pointer",
                        textAlign: "left",
                        transition: "background-color 0.1s ease"
                      },
                      onMouseEnter: (e) => {
                        if (!isSelected) {
                          e.currentTarget.style.backgroundColor = "#f9fafb";
                        }
                      },
                      onMouseLeave: (e) => {
                        if (!isSelected) {
                          e.currentTarget.style.backgroundColor = "transparent";
                        }
                      },
                      role: "option",
                      "aria-selected": isSelected,
                      children: [
                        /* @__PURE__ */ jsx(
                          "span",
                          {
                            style: {
                              width: "10px",
                              height: "10px",
                              borderRadius: "2px",
                              backgroundColor: category.color
                            }
                          }
                        ),
                        /* @__PURE__ */ jsx("span", { children: category.name })
                      ]
                    }
                  ) }, category.id);
                })
              ]
            }
          )
        ]
      }
    );
  }
  function getContrastColor(hexColor) {
    const hex = hexColor.replace("#", "");
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    return luminance > 0.5 ? "#1f2937" : "#ffffff";
  }

  // src/react/components/upload/UploadModal.tsx
  function UploadModal({
    isOpen,
    onClose,
    onUploadComplete,
    endpoint = "/api/rag",
    headers = {},
    className = ""
  }) {
    const { handleBackdropClick } = useModal({ onClose, isOpen });
    const { categories, isLoading: categoriesLoading, refetch: refetchCategories } = useCategories({
      endpoint,
      headers,
      autoFetch: false
      // Manual control to prevent race conditions
    });
    react_shim_default.useEffect(() => {
      if (!isOpen) return;
      const abortController = new AbortController();
      const fetchCategories = async () => {
        await Promise.resolve();
        if (!abortController.signal.aborted) {
          refetchCategories();
        }
      };
      fetchCategories();
      return () => {
        abortController.abort();
      };
    }, [isOpen, refetchCategories]);
    const [selectedCategoryId, setSelectedCategoryId] = react_shim_default.useState(null);
    const {
      files,
      addFiles,
      removeFile,
      updateFileName,
      clearAll,
      startUpload,
      cancelUpload,
      isUploading,
      hasFiles,
      completedCount
    } = useFileQueue({
      endpoint: `${endpoint}/upload/stream`,
      headers,
      onAllComplete: (results) => {
        if (onUploadComplete) {
          const completedFiles = files.filter((f) => f.status === "complete");
          onUploadComplete(completedFiles);
        }
      }
    });
    const handleFilesSelected = useCallback((newFiles) => {
      addFiles(newFiles);
    }, [addFiles]);
    const handleStartUpload = useCallback(async () => {
      await startUpload({
        categoryIds: selectedCategoryId ? [selectedCategoryId] : void 0
      });
    }, [startUpload, selectedCategoryId]);
    const handleClose = useCallback(() => {
      if (isUploading) {
        cancelUpload();
      }
      clearAll();
      setSelectedCategoryId(null);
      onClose();
    }, [isUploading, cancelUpload, clearAll, onClose]);
    useEffect(() => {
      if (isOpen) {
        clearAll();
        setSelectedCategoryId(null);
      }
    }, [isOpen, clearAll]);
    if (!isOpen) return null;
    const queuedCount = files.filter((f) => f.status === "queued").length;
    const canUpload = queuedCount > 0 && !isUploading;
    return /* @__PURE__ */ jsx(
      "div",
      {
        className: `rag-upload-modal-overlay ${className}`,
        onClick: handleBackdropClick,
        role: "dialog",
        "aria-modal": "true",
        "aria-labelledby": "upload-modal-title",
        children: /* @__PURE__ */ jsxs("div", { className: "rag-upload-modal", children: [
          /* @__PURE__ */ jsxs("div", { className: "rag-upload-modal-header", children: [
            /* @__PURE__ */ jsxs("div", { className: "rag-upload-modal-title-row", children: [
              /* @__PURE__ */ jsx(Upload, { size: 20 }),
              /* @__PURE__ */ jsx("h2", { id: "upload-modal-title", children: "Upload Documents" })
            ] }),
            /* @__PURE__ */ jsx(
              "button",
              {
                type: "button",
                onClick: handleClose,
                className: "rag-upload-modal-close",
                "aria-label": "Close",
                children: /* @__PURE__ */ jsx(X, { size: 20 })
              }
            )
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "rag-upload-modal-content", children: [
            /* @__PURE__ */ jsx(
              FileDropZone,
              {
                onFilesSelected: handleFilesSelected,
                disabled: isUploading,
                multiple: true
              }
            ),
            hasFiles && /* @__PURE__ */ jsx(
              FileQueue,
              {
                files,
                onRemove: removeFile,
                onRename: updateFileName,
                isUploading
              }
            ),
            hasFiles && categories.length > 0 && /* @__PURE__ */ jsxs("div", { className: "rag-upload-modal-category", children: [
              /* @__PURE__ */ jsx("label", { className: "rag-upload-modal-label", children: "Assign to category (optional)" }),
              /* @__PURE__ */ jsx(
                CategoryFilter,
                {
                  categories,
                  selected: selectedCategoryId,
                  onChange: setSelectedCategoryId,
                  mode: "dropdown",
                  placeholder: "Select a category..."
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "rag-upload-modal-footer", children: [
            /* @__PURE__ */ jsx(
              "button",
              {
                type: "button",
                onClick: handleClose,
                className: "rag-upload-modal-btn secondary",
                children: "Cancel"
              }
            ),
            /* @__PURE__ */ jsx(
              "button",
              {
                type: "button",
                onClick: handleStartUpload,
                className: "rag-upload-modal-btn primary",
                disabled: !canUpload,
                children: isUploading ? /* @__PURE__ */ jsxs(Fragment2, { children: [
                  /* @__PURE__ */ jsx(Loader2, { size: 16, className: "spin" }),
                  "Uploading..."
                ] }) : /* @__PURE__ */ jsxs(Fragment2, { children: [
                  /* @__PURE__ */ jsx(Upload, { size: 16 }),
                  "Upload ",
                  queuedCount > 0 ? `(${queuedCount})` : ""
                ] })
              }
            )
          ] }),
          completedCount > 0 && !isUploading && /* @__PURE__ */ jsxs("div", { className: "rag-upload-modal-success", children: [
            "Successfully uploaded ",
            completedCount,
            " file",
            completedCount !== 1 ? "s" : ""
          ] })
        ] })
      }
    );
  }

  // src/react/hooks/useDocumentLibraryState.ts
  function useDocumentLibraryState({
    getDocumentDetails,
    deleteDocument,
    refetch,
    onDocumentSelect
  }) {
    const refetchRef = useRef(refetch);
    refetchRef.current = refetch;
    const [previewDoc, setPreviewDoc] = useState(null);
    const [previewLoading, setPreviewLoading] = useState(false);
    const [deleteDoc, setDeleteDoc] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const [localError, setLocalError] = useState(null);
    const handlePreview = useCallback(
      async (doc) => {
        setPreviewLoading(true);
        setLocalError(null);
        try {
          const details = await getDocumentDetails(doc.documentId);
          if (details) {
            setPreviewDoc(details);
          } else {
            setPreviewDoc({
              ...doc,
              chunks: []
            });
          }
        } catch {
          setLocalError("Failed to load document details");
        } finally {
          setPreviewLoading(false);
        }
      },
      [getDocumentDetails]
    );
    const handleDeleteRequest = useCallback((doc) => {
      setDeleteDoc(doc);
    }, []);
    const handleConfirmDelete = useCallback(async () => {
      if (!deleteDoc) return;
      setIsDeleting(true);
      setLocalError(null);
      try {
        const success = await deleteDocument(deleteDoc.documentId);
        if (success) {
          setDeleteDoc(null);
          if (previewDoc?.documentId === deleteDoc.documentId) {
            setPreviewDoc(null);
          }
        } else {
          refetchRef.current();
        }
      } catch {
        setLocalError("Failed to delete document");
        refetchRef.current();
      } finally {
        setIsDeleting(false);
      }
    }, [deleteDoc, deleteDocument, previewDoc?.documentId]);
    const handleCancelDelete = useCallback(() => {
      setDeleteDoc(null);
    }, []);
    const handleClosePreview = useCallback(() => {
      setPreviewDoc(null);
    }, []);
    const handleQueryDocument = useCallback(
      (doc) => {
        setPreviewDoc(null);
        onDocumentSelect?.(doc);
      },
      [onDocumentSelect]
    );
    const handleDocumentSelect = useCallback(
      (doc) => {
        onDocumentSelect?.(doc);
      },
      [onDocumentSelect]
    );
    const dismissError = useCallback(() => {
      setLocalError(null);
    }, []);
    return {
      previewDoc,
      previewLoading,
      handlePreview,
      handleClosePreview,
      handleQueryDocument,
      deleteDoc,
      isDeleting,
      handleDeleteRequest,
      handleConfirmDelete,
      handleCancelDelete,
      localError,
      dismissError,
      handleDocumentSelect
    };
  }

  // src/react/components/documents/DocumentLibrary.tsx
  function DocumentLibrary({
    endpoint = "/api/rag",
    title = "Document Library",
    className = "",
    accentColor = DEFAULT_ACCENT_COLOR,
    onDocumentSelect,
    emptyState,
    headers
  }) {
    const {
      documents,
      filteredDocuments,
      isLoading,
      error,
      refetch,
      deleteDocument,
      getDocumentDetails,
      searchQuery,
      setSearchQuery,
      sortBy,
      setSortBy,
      sortOrder,
      setSortOrder
    } = useDocuments({ endpoint, headers });
    const {
      previewDoc,
      previewLoading,
      handlePreview,
      handleClosePreview,
      handleQueryDocument,
      deleteDoc,
      isDeleting,
      handleDeleteRequest,
      handleConfirmDelete,
      handleCancelDelete,
      localError,
      dismissError,
      handleDocumentSelect
    } = useDocumentLibraryState({
      getDocumentDetails,
      deleteDocument,
      refetch,
      onDocumentSelect
    });
    const [isUploadOpen, setIsUploadOpen] = useState(false);
    const handleUploadComplete = () => {
      refetch();
    };
    const displayError = localError || error;
    const defaultEmptyState = /* @__PURE__ */ jsx(
      EmptyState,
      {
        title: "No documents yet",
        description: "Upload documents to start building your knowledge base.",
        iconColor: accentColor,
        iconShadow: `0 0 30px ${accentColor}15`,
        className: "rag-library-empty"
      }
    );
    return /* @__PURE__ */ jsxs("div", { className: `rag-document-library ${className}`, children: [
      /* @__PURE__ */ jsxs("header", { className: "rag-library-header", children: [
        /* @__PURE__ */ jsxs("div", { className: "rag-library-header-info", children: [
          /* @__PURE__ */ jsx(
            "div",
            {
              className: "rag-library-header-icon",
              style: { backgroundColor: `${accentColor}15`, borderColor: `${accentColor}30` },
              children: /* @__PURE__ */ jsx(Library, { size: 20, style: { color: accentColor }, "aria-hidden": "true" })
            }
          ),
          /* @__PURE__ */ jsxs("div", { className: "rag-library-header-text", children: [
            /* @__PURE__ */ jsx("h2", { className: "rag-library-title", children: title }),
            /* @__PURE__ */ jsx("span", { className: "rag-library-count", children: isLoading ? "Loading..." : /* @__PURE__ */ jsxs(Fragment2, { children: [
              /* @__PURE__ */ jsx("span", { className: "rag-library-count-number", children: documents.length }),
              " ",
              documents.length === 1 ? "document" : "documents"
            ] }) })
          ] })
        ] }),
        /* @__PURE__ */ jsxs(
          "button",
          {
            type: "button",
            onClick: () => setIsUploadOpen(true),
            className: "rag-library-upload-btn",
            style: { backgroundColor: accentColor },
            children: [
              /* @__PURE__ */ jsx(Upload, { size: 16 }),
              "Upload"
            ]
          }
        )
      ] }),
      displayError && /* @__PURE__ */ jsxs("div", { className: "rag-library-error", role: "alert", children: [
        /* @__PURE__ */ jsx(AlertCircle, { size: 16, "aria-hidden": "true" }),
        /* @__PURE__ */ jsx("span", { children: displayError }),
        /* @__PURE__ */ jsx(
          "button",
          {
            type: "button",
            onClick: dismissError,
            className: "rag-library-error-dismiss",
            "aria-label": "Dismiss error",
            children: /* @__PURE__ */ jsx(X, { size: 14 })
          }
        )
      ] }),
      /* @__PURE__ */ jsx(
        DocumentSearch,
        {
          value: searchQuery,
          onChange: setSearchQuery,
          sortBy,
          onSortByChange: setSortBy,
          sortOrder,
          onSortOrderChange: setSortOrder,
          placeholder: "Search documents..."
        }
      ),
      /* @__PURE__ */ jsx("div", { className: "rag-library-content", children: /* @__PURE__ */ jsx(
        DocumentList,
        {
          documents: filteredDocuments,
          isLoading,
          onDocumentSelect: onDocumentSelect ? handleDocumentSelect : void 0,
          onDocumentDelete: handleDeleteRequest,
          onDocumentPreview: handlePreview,
          emptyState: emptyState || defaultEmptyState
        }
      ) }),
      previewDoc && /* @__PURE__ */ jsx(
        DocumentPreview,
        {
          document: previewDoc,
          isLoading: previewLoading,
          onClose: handleClosePreview,
          onQueryDocument: onDocumentSelect ? handleQueryDocument : void 0,
          accentColor
        }
      ),
      deleteDoc && /* @__PURE__ */ jsx(
        ConfirmDialog,
        {
          title: "Delete Document",
          message: `Are you sure you want to delete "${deleteDoc.documentName}"? This action cannot be undone.`,
          confirmLabel: isDeleting ? "Deleting..." : "Delete",
          cancelLabel: "Cancel",
          onConfirm: handleConfirmDelete,
          onCancel: handleCancelDelete,
          isDestructive: true
        }
      ),
      /* @__PURE__ */ jsx(
        UploadModal,
        {
          isOpen: isUploadOpen,
          onClose: () => setIsUploadOpen(false),
          onUploadComplete: handleUploadComplete,
          endpoint,
          headers
        }
      )
    ] });
  }

  // src/react/RAGInterface.tsx
  function RAGInterface({
    endpoint = "/api/rag",
    headers,
    chatTitle = "RAG Assistant",
    documentsTitle = "Document Library",
    accentColor = DEFAULT_ACCENT_COLOR,
    defaultView = "chat",
    showDocumentLibrary = true,
    placeholder = "Ask a question about your documents...",
    showSources = true,
    systemPrompt,
    topK,
    className = "",
    onDocumentSelect,
    chatEmptyState,
    documentsEmptyState
  }) {
    const [activeView, setActiveView] = useState(defaultView);
    const [scopedDocument, setScopedDocument] = useState(null);
    const handleDocumentSelect = useCallback((doc) => {
      setScopedDocument(doc);
      setActiveView("chat");
      onDocumentSelect?.(doc);
    }, [onDocumentSelect]);
    const handleClearScope = useCallback(() => {
      setScopedDocument(null);
      onDocumentSelect?.(null);
    }, [onDocumentSelect]);
    const chatEndpoint = `${endpoint}/query`;
    return /* @__PURE__ */ jsxs("div", { className: `rag-interface ${className}`, children: [
      showDocumentLibrary && /* @__PURE__ */ jsxs("nav", { className: "rag-interface-tabs", role: "tablist", children: [
        /* @__PURE__ */ jsxs(
          "button",
          {
            type: "button",
            role: "tab",
            "aria-selected": activeView === "chat",
            className: `rag-interface-tab ${activeView === "chat" ? "rag-interface-tab--active" : ""}`,
            onClick: () => setActiveView("chat"),
            style: activeView === "chat" ? { borderColor: accentColor, color: accentColor } : void 0,
            children: [
              /* @__PURE__ */ jsx(MessageSquare, { size: 16, "aria-hidden": "true" }),
              /* @__PURE__ */ jsx("span", { children: "Chat" }),
              scopedDocument && /* @__PURE__ */ jsx(
                "span",
                {
                  className: "rag-interface-tab-badge",
                  style: { backgroundColor: `${accentColor}20`, color: accentColor },
                  children: "1"
                }
              )
            ]
          }
        ),
        /* @__PURE__ */ jsxs(
          "button",
          {
            type: "button",
            role: "tab",
            "aria-selected": activeView === "documents",
            className: `rag-interface-tab ${activeView === "documents" ? "rag-interface-tab--active" : ""}`,
            onClick: () => setActiveView("documents"),
            style: activeView === "documents" ? { borderColor: accentColor, color: accentColor } : void 0,
            children: [
              /* @__PURE__ */ jsx(Library, { size: 16, "aria-hidden": "true" }),
              /* @__PURE__ */ jsx("span", { children: "Documents" })
            ]
          }
        )
      ] }),
      scopedDocument && activeView === "chat" && /* @__PURE__ */ jsxs("div", { className: "rag-interface-scope", children: [
        /* @__PURE__ */ jsxs("div", { className: "rag-interface-scope-info", children: [
          /* @__PURE__ */ jsx(FileText, { size: 14, style: { color: accentColor }, "aria-hidden": "true" }),
          /* @__PURE__ */ jsx("span", { className: "rag-interface-scope-label", children: "Querying:" }),
          /* @__PURE__ */ jsx("span", { className: "rag-interface-scope-name", children: scopedDocument.documentName })
        ] }),
        /* @__PURE__ */ jsxs(
          "button",
          {
            type: "button",
            className: "rag-interface-scope-clear",
            onClick: handleClearScope,
            "aria-label": "Clear document filter",
            title: "Query all documents",
            children: [
              /* @__PURE__ */ jsx(X, { size: 14 }),
              /* @__PURE__ */ jsx("span", { children: "Clear" })
            ]
          }
        )
      ] }),
      /* @__PURE__ */ jsx("div", { className: "rag-interface-content", children: activeView === "chat" ? /* @__PURE__ */ jsx(
        RAGChat,
        {
          endpoint: chatEndpoint,
          headers,
          title: chatTitle,
          accentColor,
          placeholder: scopedDocument ? `Ask about "${scopedDocument.documentName}"...` : placeholder,
          showSources,
          systemPrompt,
          topK,
          documentId: scopedDocument?.documentId,
          emptyState: chatEmptyState
        }
      ) : /* @__PURE__ */ jsx(
        DocumentLibrary,
        {
          endpoint,
          headers,
          title: documentsTitle,
          accentColor,
          onDocumentSelect: handleDocumentSelect,
          emptyState: documentsEmptyState
        }
      ) })
    ] });
  }

  // src/react/components/categories/CategoryBadge.tsx
  function CategoryBadge({
    category,
    size = "md",
    onRemove,
    className = ""
  }) {
    const getContrastColor2 = (hexColor) => {
      const hex = hexColor.replace("#", "");
      const r = parseInt(hex.substring(0, 2), 16);
      const g = parseInt(hex.substring(2, 4), 16);
      const b = parseInt(hex.substring(4, 6), 16);
      const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
      return luminance > 0.5 ? "#1f2937" : "#ffffff";
    };
    const textColor = getContrastColor2(category.color);
    const sizeStyles = {
      sm: {
        padding: "2px 6px",
        fontSize: "11px",
        borderRadius: "3px",
        gap: "3px"
      },
      md: {
        padding: "3px 8px",
        fontSize: "12px",
        borderRadius: "4px",
        gap: "4px"
      }
    };
    const style = sizeStyles[size];
    return /* @__PURE__ */ jsxs(
      "span",
      {
        className: `rag-category-badge ${className}`,
        style: {
          display: "inline-flex",
          alignItems: "center",
          gap: style.gap,
          padding: style.padding,
          fontSize: style.fontSize,
          fontWeight: 500,
          borderRadius: style.borderRadius,
          backgroundColor: category.color,
          color: textColor,
          lineHeight: 1.2,
          whiteSpace: "nowrap"
        },
        children: [
          category.icon && /* @__PURE__ */ jsx("span", { style: { fontSize: size === "sm" ? "10px" : "11px" }, children: category.icon }),
          /* @__PURE__ */ jsx("span", { children: category.name }),
          onRemove && /* @__PURE__ */ jsx(
            "button",
            {
              type: "button",
              onClick: (e) => {
                e.stopPropagation();
                onRemove();
              },
              style: {
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                padding: 0,
                marginLeft: "2px",
                width: size === "sm" ? "12px" : "14px",
                height: size === "sm" ? "12px" : "14px",
                border: "none",
                borderRadius: "50%",
                backgroundColor: "rgba(0, 0, 0, 0.15)",
                color: textColor,
                cursor: "pointer",
                fontSize: size === "sm" ? "10px" : "11px",
                lineHeight: 1,
                transition: "background-color 0.15s ease"
              },
              onMouseEnter: (e) => {
                e.currentTarget.style.backgroundColor = "rgba(0, 0, 0, 0.25)";
              },
              onMouseLeave: (e) => {
                e.currentTarget.style.backgroundColor = "rgba(0, 0, 0, 0.15)";
              },
              "aria-label": `Remove ${category.name} category`,
              children: "\xD7"
            }
          )
        ]
      }
    );
  }

  // src/react/components/upload/FilePreview.tsx
  var FILE_TYPE_LABELS = {
    pdf: "PDF",
    docx: "DOCX",
    txt: "Text",
    md: "Markdown",
    html: "HTML",
    htm: "HTML"
  };
  function getFileTypeLabel(file) {
    const ext = file.name.split(".").pop()?.toLowerCase() || "";
    return FILE_TYPE_LABELS[ext] ?? (ext.toUpperCase() || "File");
  }
  function FilePreview({
    file,
    preview,
    estimatedChunks,
    maxPreviewLength = 500,
    className = "",
    estimateEndpoint = "/api/rag/upload/estimate",
    onEstimate
  }) {
    const [estimate, setEstimate] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    useEffect(() => {
      if (!preview || estimatedChunks !== void 0) return;
      const fetchEstimate = async () => {
        setIsLoading(true);
        try {
          const response = await fetch(estimateEndpoint, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ text: preview })
          });
          if (response.ok) {
            const data = await response.json();
            setEstimate(data);
            onEstimate?.(data);
          }
        } catch {
        } finally {
          setIsLoading(false);
        }
      };
      fetchEstimate();
    }, [preview, estimatedChunks, onEstimate]);
    const displayedPreview = preview ? preview.length > maxPreviewLength ? preview.slice(0, maxPreviewLength) + "..." : preview : null;
    const chunks = estimatedChunks ?? estimate?.estimatedChunks;
    const isLargeFile = file.size > 5 * 1024 * 1024;
    return /* @__PURE__ */ jsxs("div", { className: `rag-upload-preview ${className}`, children: [
      /* @__PURE__ */ jsxs("div", { className: "rag-upload-preview-header", children: [
        /* @__PURE__ */ jsx("div", { className: "rag-upload-preview-icon", children: /* @__PURE__ */ jsx(FileText, { size: 20 }) }),
        /* @__PURE__ */ jsxs("div", { className: "rag-upload-preview-meta", children: [
          /* @__PURE__ */ jsx("span", { className: "rag-upload-preview-name", title: file.name, children: file.name }),
          /* @__PURE__ */ jsxs("div", { className: "rag-upload-preview-details", children: [
            /* @__PURE__ */ jsx("span", { className: "rag-upload-preview-type", children: getFileTypeLabel(file) }),
            /* @__PURE__ */ jsx("span", { className: "rag-upload-preview-size", children: formatFileSize(file.size) }),
            chunks !== void 0 && /* @__PURE__ */ jsxs("span", { className: "rag-upload-preview-chunks", children: [
              /* @__PURE__ */ jsx(Hash, { size: 12 }),
              "~",
              chunks,
              " chunks"
            ] }),
            isLoading && /* @__PURE__ */ jsxs("span", { className: "rag-upload-preview-loading", children: [
              /* @__PURE__ */ jsx(Clock, { size: 12 }),
              "Estimating..."
            ] })
          ] })
        ] })
      ] }),
      isLargeFile && /* @__PURE__ */ jsxs("div", { className: "rag-upload-preview-warning", children: [
        /* @__PURE__ */ jsx(AlertTriangle, { size: 14 }),
        /* @__PURE__ */ jsx("span", { children: "Large file - processing may take a moment" })
      ] }),
      displayedPreview && /* @__PURE__ */ jsx("div", { className: "rag-upload-preview-content", children: /* @__PURE__ */ jsx("pre", { children: displayedPreview }) }),
      !preview && !isLargeFile && /* @__PURE__ */ jsx("div", { className: "rag-upload-preview-empty", children: "Preview will be available after processing" })
    ] });
  }

  // src/react/utils/formatters.ts
  function formatRelativeTime(timestamp) {
    if (!timestamp || timestamp <= 0 || !Number.isFinite(timestamp)) {
      return "unknown";
    }
    const now = Date.now();
    const diff = now - timestamp;
    if (diff < 0) return "just now";
    const minutes = Math.floor(diff / 6e4);
    const hours = Math.floor(diff / 36e5);
    const days = Math.floor(diff / 864e5);
    if (minutes < 1) return "just now";
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  }

  // src/react/components/admin/AdminDashboard.tsx
  var HEALTH_STATUS_ICONS = {
    healthy: CheckCircle,
    degraded: AlertCircle,
    unhealthy: XCircle
  };
  var SKELETON_COUNT = 4;
  function StatCard({ icon, iconBgColor, iconColor, value, label, meta, isLoading }) {
    return /* @__PURE__ */ jsxs("div", { className: "rag-admin-stat-card", children: [
      /* @__PURE__ */ jsx("div", { className: "rag-admin-stat-icon", style: { backgroundColor: iconBgColor, color: iconColor }, children: icon }),
      /* @__PURE__ */ jsxs("div", { className: "rag-admin-stat-info", children: [
        /* @__PURE__ */ jsx("span", { className: "rag-admin-stat-value", children: isLoading ? "-" : value }),
        /* @__PURE__ */ jsx("span", { className: "rag-admin-stat-label", children: label })
      ] }),
      meta && /* @__PURE__ */ jsx("span", { className: "rag-admin-stat-meta", children: meta })
    ] });
  }
  function ServiceStatusItem({ icon, label, isUp, statusText, meta }) {
    return /* @__PURE__ */ jsxs("div", { className: "rag-admin-service-item", children: [
      /* @__PURE__ */ jsxs("div", { className: "rag-admin-service-header", children: [
        icon,
        /* @__PURE__ */ jsx("span", { children: label }),
        /* @__PURE__ */ jsxs("span", { className: `rag-admin-service-status rag-admin-service-${isUp ? "up" : "down"}`, children: [
          isUp ? /* @__PURE__ */ jsx(CheckCircle, { size: 14 }) : /* @__PURE__ */ jsx(XCircle, { size: 14 }),
          statusText
        ] })
      ] }),
      meta && /* @__PURE__ */ jsx("div", { className: "rag-admin-service-meta", children: meta })
    ] });
  }
  function AdminDashboard({
    endpoint = "/api/rag",
    accentColor = "#6366f1",
    refreshInterval = 3e4
  }) {
    const [stats, setStats] = useState(null);
    const [health, setHealth] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [lastRefresh, setLastRefresh] = useState(/* @__PURE__ */ new Date());
    const fetchData = useCallback(async (signal) => {
      try {
        setError(null);
        const res = await fetch(`${endpoint}/admin/dashboard`, { signal });
        if (!res.ok) {
          throw new Error("Failed to fetch dashboard data");
        }
        const data = await res.json();
        setStats(data.stats);
        setHealth(data.health);
        setLastRefresh(/* @__PURE__ */ new Date());
      } catch (err) {
        if (err instanceof Error && err.name === "AbortError") return;
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setIsLoading(false);
      }
    }, [endpoint]);
    const abortControllerRef = react_shim_default.useRef(null);
    useEffect(() => {
      const controller = new AbortController();
      fetchData(controller.signal);
      let interval;
      if (refreshInterval > 0) {
        interval = setInterval(() => {
          abortControllerRef.current?.abort();
          abortControllerRef.current = new AbortController();
          fetchData(abortControllerRef.current.signal);
        }, refreshInterval);
      }
      return () => {
        controller.abort();
        abortControllerRef.current?.abort();
        if (interval) clearInterval(interval);
      };
    }, [fetchData, refreshInterval]);
    const handleRefresh = () => {
      abortControllerRef.current?.abort();
      abortControllerRef.current = new AbortController();
      setIsLoading(true);
      fetchData(abortControllerRef.current.signal);
    };
    const maxCategoryCount = stats?.documents.byCategory.reduce(
      (max, cat) => Math.max(max, cat.count),
      0
    ) || 1;
    return /* @__PURE__ */ jsxs("div", { className: "rag-admin-dashboard", style: { "--rag-accent": accentColor }, children: [
      /* @__PURE__ */ jsxs("div", { className: "rag-admin-header", children: [
        /* @__PURE__ */ jsxs("div", { className: "rag-admin-header-info", children: [
          /* @__PURE__ */ jsx("div", { className: "rag-admin-header-icon", children: /* @__PURE__ */ jsx(BarChart3, { size: 20 }) }),
          /* @__PURE__ */ jsxs("div", { className: "rag-admin-header-text", children: [
            /* @__PURE__ */ jsx("h2", { className: "rag-admin-title", children: "Admin Dashboard" }),
            /* @__PURE__ */ jsxs("p", { className: "rag-admin-subtitle", children: [
              "Last updated: ",
              lastRefresh.toLocaleTimeString()
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxs(
          "button",
          {
            className: "rag-admin-refresh-btn",
            onClick: handleRefresh,
            disabled: isLoading,
            style: { "--accent": accentColor },
            children: [
              /* @__PURE__ */ jsx(RefreshCw, { size: 16, className: isLoading ? "spin" : "" }),
              "Refresh"
            ]
          }
        )
      ] }),
      error && /* @__PURE__ */ jsxs("div", { className: "rag-admin-error", children: [
        /* @__PURE__ */ jsx(AlertCircle, { size: 16 }),
        error,
        /* @__PURE__ */ jsx("button", { className: "rag-admin-error-dismiss", onClick: () => setError(null), children: /* @__PURE__ */ jsx(XCircle, { size: 14 }) })
      ] }),
      health && /* @__PURE__ */ jsxs("div", { className: `rag-admin-health-banner rag-admin-health-${health.status}`, children: [
        react_shim_default.createElement(HEALTH_STATUS_ICONS[health.status], { size: 18 }),
        /* @__PURE__ */ jsxs("span", { className: "rag-admin-health-text", children: [
          "System Status: ",
          /* @__PURE__ */ jsx("strong", { children: health.status.charAt(0).toUpperCase() + health.status.slice(1) })
        ] }),
        /* @__PURE__ */ jsxs("span", { className: "rag-admin-health-responder", children: [
          "Default Responder: ",
          health.defaultResponder
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "rag-admin-stats-grid", children: [
        /* @__PURE__ */ jsx(
          StatCard,
          {
            icon: /* @__PURE__ */ jsx(FileText, { size: 20 }),
            iconBgColor: "#3b82f620",
            iconColor: "#3b82f6",
            value: stats?.documents.total || 0,
            label: "Documents",
            isLoading
          }
        ),
        /* @__PURE__ */ jsx(
          StatCard,
          {
            icon: /* @__PURE__ */ jsx(Layers, { size: 20 }),
            iconBgColor: "#10b98120",
            iconColor: "#10b981",
            value: (stats?.chunks.total ?? 0).toLocaleString(),
            label: "Total Chunks",
            meta: `~${stats?.chunks.averagePerDocument || 0} per doc`,
            isLoading
          }
        ),
        /* @__PURE__ */ jsx(
          StatCard,
          {
            icon: /* @__PURE__ */ jsx(HardDrive, { size: 20 }),
            iconBgColor: "#f59e0b20",
            iconColor: "#f59e0b",
            value: `${stats?.storage.estimatedMB || "0"} MB`,
            label: "Est. Storage",
            isLoading
          }
        ),
        /* @__PURE__ */ jsx(
          StatCard,
          {
            icon: /* @__PURE__ */ jsx(Activity, { size: 20 }),
            iconBgColor: "#8b5cf620",
            iconColor: "#8b5cf6",
            value: stats?.chunks.averagePerDocument || 0,
            label: "Avg Chunks/Doc",
            isLoading
          }
        )
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "rag-admin-content-grid", children: [
        /* @__PURE__ */ jsxs("div", { className: "rag-admin-panel", children: [
          /* @__PURE__ */ jsxs("h3", { className: "rag-admin-panel-title", children: [
            /* @__PURE__ */ jsx(Database, { size: 16 }),
            "Documents by Category"
          ] }),
          /* @__PURE__ */ jsx("div", { className: "rag-admin-chart", children: isLoading ? /* @__PURE__ */ jsx("div", { className: "rag-admin-chart-skeleton", children: Array.from({ length: SKELETON_COUNT }, (_, i) => /* @__PURE__ */ jsx("div", { className: "rag-admin-chart-skeleton-bar" }, i)) }) : stats?.documents.byCategory.length === 0 ? /* @__PURE__ */ jsx("div", { className: "rag-admin-chart-empty", children: "No categories with documents" }) : /* @__PURE__ */ jsx("div", { className: "rag-admin-bar-chart", children: stats?.documents.byCategory.map((cat) => /* @__PURE__ */ jsxs("div", { className: "rag-admin-bar-row", children: [
            /* @__PURE__ */ jsxs("div", { className: "rag-admin-bar-label", children: [
              /* @__PURE__ */ jsx(
                "span",
                {
                  className: "rag-admin-bar-color",
                  style: { backgroundColor: cat.color }
                }
              ),
              cat.categoryName
            ] }),
            /* @__PURE__ */ jsx("div", { className: "rag-admin-bar-container", children: /* @__PURE__ */ jsx(
              "div",
              {
                className: "rag-admin-bar-fill",
                style: {
                  width: `${cat.count / maxCategoryCount * 100}%`,
                  backgroundColor: cat.color
                }
              }
            ) }),
            /* @__PURE__ */ jsx("span", { className: "rag-admin-bar-count", children: cat.count })
          ] }, cat.categoryId)) }) })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "rag-admin-panel", children: [
          /* @__PURE__ */ jsxs("h3", { className: "rag-admin-panel-title", children: [
            /* @__PURE__ */ jsx(Cpu, { size: 16 }),
            "Service Health"
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "rag-admin-services", children: [
            /* @__PURE__ */ jsx(
              ServiceStatusItem,
              {
                icon: /* @__PURE__ */ jsx(Database, { size: 16 }),
                label: "Database (LanceDB)",
                isUp: health?.services.database.status === "up",
                statusText: health?.services.database.status || "unknown",
                meta: health?.services.database.status === "up" ? `${health.services.database.documentCount} docs, ${health.services.database.chunkCount.toLocaleString()} chunks` : void 0
              }
            ),
            /* @__PURE__ */ jsx(
              ServiceStatusItem,
              {
                icon: /* @__PURE__ */ jsx(Layers, { size: 16 }),
                label: "Embeddings",
                isUp: health?.services.embeddings.status === "up",
                statusText: health?.services.embeddings.status || "unknown",
                meta: health?.services.embeddings.provider || "Not configured"
              }
            ),
            /* @__PURE__ */ jsx(
              ServiceStatusItem,
              {
                icon: /* @__PURE__ */ jsx(Activity, { size: 16 }),
                label: "Claude Code CLI",
                isUp: health?.services.responders.claude.available ?? false,
                statusText: health?.services.responders.claude.available ? "available" : "unavailable"
              }
            ),
            /* @__PURE__ */ jsx(
              ServiceStatusItem,
              {
                icon: /* @__PURE__ */ jsx(Activity, { size: 16 }),
                label: "Gemini API",
                isUp: health?.services.responders.gemini.available ?? false,
                statusText: health?.services.responders.gemini.available ? "configured" : "not configured"
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "rag-admin-panel rag-admin-panel-wide", children: [
          /* @__PURE__ */ jsxs("h3", { className: "rag-admin-panel-title", children: [
            /* @__PURE__ */ jsx(Clock, { size: 16 }),
            "Recent Uploads"
          ] }),
          /* @__PURE__ */ jsx("div", { className: "rag-admin-recent-list", children: isLoading ? /* @__PURE__ */ jsx("div", { className: "rag-admin-recent-skeleton", children: Array.from({ length: 3 }, (_, i) => /* @__PURE__ */ jsx("div", { className: "rag-admin-recent-skeleton-row" }, i)) }) : stats?.recentUploads.length === 0 ? /* @__PURE__ */ jsx("div", { className: "rag-admin-recent-empty", children: "No documents uploaded yet" }) : stats?.recentUploads.map((doc) => /* @__PURE__ */ jsxs("div", { className: "rag-admin-recent-item", children: [
            /* @__PURE__ */ jsx(FileText, { size: 16, className: "rag-admin-recent-icon" }),
            /* @__PURE__ */ jsxs("div", { className: "rag-admin-recent-info", children: [
              /* @__PURE__ */ jsx("span", { className: "rag-admin-recent-name", children: doc.documentName }),
              /* @__PURE__ */ jsxs("span", { className: "rag-admin-recent-meta", children: [
                doc.chunkCount,
                " chunks"
              ] })
            ] }),
            /* @__PURE__ */ jsx("span", { className: "rag-admin-recent-time", children: formatRelativeTime(doc.timestamp) })
          ] }, doc.documentId)) })
        ] })
      ] })
    ] });
  }
  return __toCommonJS(browser_entry_exports);
})();
