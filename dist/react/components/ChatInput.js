'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useRef } from 'react';
import { Send } from 'lucide-react';
import { m } from 'framer-motion';
import { DEFAULT_ACCENT_COLOR } from '../types.js';
import { useSkinMotion } from '../motion/hooks/useSkinMotion.js';
export function ChatInput({ placeholder = 'Ask a question about your documents...', accentColor = DEFAULT_ACCENT_COLOR, onSendMessage, disabled = false, }) {
    const [inputValue, setInputValue] = useState('');
    const inputRef = useRef(null);
    const { motion } = useSkinMotion();
    const handleSend = () => {
        if (!inputValue.trim() || !onSendMessage || disabled)
            return;
        onSendMessage(inputValue.trim());
        setInputValue('');
        inputRef.current?.focus();
    };
    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };
    const hasInput = inputValue.trim().length > 0;
    return (_jsx("div", { className: "rag-chat-input-container", children: _jsxs("div", { className: "rag-chat-input-wrapper", children: [_jsx("input", { ref: inputRef, type: "text", value: inputValue, onChange: (e) => setInputValue(e.target.value), onKeyDown: handleKeyDown, placeholder: placeholder, disabled: disabled, className: "rag-chat-input", style: {
                        boxShadow: hasInput
                            ? `0 0 0 1px ${accentColor}40, 0 0 20px ${accentColor}10`
                            : undefined,
                    } }), _jsx(m.button, { type: "button", onClick: handleSend, disabled: !hasInput || disabled, className: "rag-chat-send-button", style: {
                        backgroundColor: hasInput ? accentColor : undefined,
                        boxShadow: hasInput ? `0 4px 14px 0 ${accentColor}40` : undefined,
                    }, title: "Send message", "aria-label": "Send message", whileHover: hasInput && !disabled ? motion.button.hover : undefined, whileTap: hasInput && !disabled ? motion.button.tap : undefined, transition: motion.transition.fast, children: _jsx(Send, { size: 18, "aria-hidden": "true" }) })] }) }));
}
//# sourceMappingURL=ChatInput.js.map