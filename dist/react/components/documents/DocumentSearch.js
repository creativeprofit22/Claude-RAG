'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect, useRef } from 'react';
import { Search, ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';
import { Dropdown } from '../shared/Dropdown.js';
const SORT_OPTIONS = [
    { value: 'name', label: 'Name' },
    { value: 'date', label: 'Date' },
    { value: 'chunks', label: 'Size' },
];
/**
 * DocumentSearch - Search input with sort controls
 */
export function DocumentSearch({ value, onChange, sortBy, onSortByChange, sortOrder, onSortOrderChange, placeholder = 'Search documents...', }) {
    const [localValue, setLocalValue] = useState(value);
    const debounceRef = useRef(null);
    // Use ref for onChange to prevent debounce reset when parent recreates callback
    const onChangeRef = useRef(onChange);
    onChangeRef.current = onChange;
    // Track prop value in ref to avoid dependency array issues
    const valueRef = useRef(value);
    valueRef.current = value;
    // Sync local value with prop
    useEffect(() => {
        setLocalValue(value);
    }, [value]);
    // Debounced search - only depends on localValue to avoid double-firing
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
        onSortOrderChange(sortOrder === 'asc' ? 'desc' : 'asc');
    };
    const SortIcon = sortOrder === 'asc' ? ArrowUp : ArrowDown;
    return (_jsxs("div", { className: "rag-doc-search", children: [_jsxs("div", { className: "rag-doc-search-input-wrapper", children: [_jsx(Search, { size: 16, className: "rag-doc-search-icon", "aria-hidden": "true" }), _jsx("input", { type: "text", className: "rag-doc-search-input", placeholder: placeholder, value: localValue, onChange: handleInputChange, "aria-label": "Search documents" })] }), _jsxs("div", { className: "rag-doc-search-sort", children: [_jsx(Dropdown, { options: SORT_OPTIONS, value: sortBy, onChange: onSortByChange, icon: _jsx(ArrowUpDown, { size: 14, "aria-hidden": "true" }), className: "rag-doc-sort-dropdown", triggerClassName: "rag-doc-sort-trigger", menuClassName: "rag-doc-sort-menu", optionClassName: "rag-doc-sort-option" }), _jsx("button", { type: "button", className: "rag-doc-sort-order", onClick: toggleSortOrder, title: `Sort ${sortOrder === 'asc' ? 'ascending' : 'descending'}`, "aria-label": `Sort ${sortOrder === 'asc' ? 'ascending' : 'descending'}`, children: _jsx(SortIcon, { size: 16 }) })] })] }));
}
//# sourceMappingURL=DocumentSearch.js.map