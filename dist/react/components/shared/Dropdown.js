'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect, useRef } from 'react';
import { ChevronDown } from 'lucide-react';
/**
 * Reusable Dropdown component with outside click and keyboard handling
 */
export function Dropdown({ options, value, onChange, icon, className = '', triggerClassName = '', menuClassName = '', optionClassName = '', }) {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);
    // Close dropdown on outside click
    useEffect(() => {
        function handleClickOutside(event) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);
    // Close dropdown on Escape key
    useEffect(() => {
        function handleKeyDown(event) {
            if (event.key === 'Escape' && isOpen) {
                setIsOpen(false);
            }
        }
        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [isOpen]);
    const handleSelect = (optionValue) => {
        onChange(optionValue);
        setIsOpen(false);
    };
    const currentLabel = options.find((opt) => opt.value === value)?.label || '';
    return (_jsxs("div", { className: `rag-dropdown ${className}`, ref: dropdownRef, children: [_jsxs("button", { type: "button", className: `rag-dropdown-trigger ${triggerClassName}`, onClick: () => setIsOpen(!isOpen), "aria-haspopup": "listbox", "aria-expanded": isOpen, children: [icon, _jsx("span", { children: currentLabel }), _jsx(ChevronDown, { size: 14, className: `rag-dropdown-chevron ${isOpen ? 'rag-dropdown-chevron--open' : ''}`, "aria-hidden": "true" })] }), isOpen && (_jsx("div", { className: `rag-dropdown-menu ${menuClassName}`, role: "listbox", children: options.map((option) => (_jsx("button", { type: "button", className: `rag-dropdown-option ${value === option.value ? 'rag-dropdown-option--active' : ''} ${optionClassName}`, onClick: () => handleSelect(option.value), role: "option", "aria-selected": value === option.value, children: option.label }, option.value))) }))] }));
}
//# sourceMappingURL=Dropdown.js.map