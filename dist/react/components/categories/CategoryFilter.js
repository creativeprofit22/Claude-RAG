'use client';
import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState, useRef, useEffect } from 'react';
/**
 * Category filter component that allows filtering by a single category.
 * Supports dropdown or button group display modes.
 */
export function CategoryFilter({ categories, selected, onChange, mode = 'dropdown', placeholder = 'All Categories', className = '', }) {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);
    // Close dropdown when clicking outside
    useEffect(() => {
        function handleClickOutside(event) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        }
        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
            return () => document.removeEventListener('mousedown', handleClickOutside);
        }
    }, [isOpen]);
    // Find selected category for display
    const selectedCategory = selected ? categories.find(c => c.id === selected) : null;
    if (mode === 'buttons') {
        return (_jsxs("div", { className: `rag-category-filter-buttons ${className}`, style: {
                display: 'flex',
                flexWrap: 'wrap',
                gap: '6px',
            }, children: [_jsx("button", { type: "button", onClick: () => onChange(null), style: {
                        padding: '6px 12px',
                        fontSize: '13px',
                        fontWeight: selected === null ? 600 : 400,
                        border: '1px solid',
                        borderColor: selected === null ? '#6366f1' : '#e5e7eb',
                        borderRadius: '6px',
                        backgroundColor: selected === null ? '#6366f1' : '#ffffff',
                        color: selected === null ? '#ffffff' : '#374151',
                        cursor: 'pointer',
                        transition: 'all 0.15s ease',
                    }, children: "All" }), categories.map(category => {
                    const isSelected = selected === category.id;
                    return (_jsxs("button", { type: "button", onClick: () => onChange(isSelected ? null : category.id), style: {
                            padding: '6px 12px',
                            fontSize: '13px',
                            fontWeight: isSelected ? 600 : 400,
                            border: '1px solid',
                            borderColor: isSelected ? category.color : '#e5e7eb',
                            borderRadius: '6px',
                            backgroundColor: isSelected ? category.color : '#ffffff',
                            color: isSelected ? getContrastColor(category.color) : '#374151',
                            cursor: 'pointer',
                            transition: 'all 0.15s ease',
                        }, children: [category.icon && (_jsx("span", { style: { marginRight: '4px' }, children: category.icon })), category.name] }, category.id));
                })] }));
    }
    // Dropdown mode
    return (_jsxs("div", { ref: dropdownRef, className: `rag-category-filter-dropdown ${className}`, style: {
            position: 'relative',
            display: 'inline-block',
            minWidth: '180px',
        }, children: [_jsxs("button", { type: "button", onClick: () => setIsOpen(!isOpen), style: {
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '8px',
                    padding: '8px 12px',
                    fontSize: '14px',
                    fontWeight: 400,
                    border: '1px solid #e5e7eb',
                    borderRadius: '6px',
                    backgroundColor: '#ffffff',
                    color: '#374151',
                    cursor: 'pointer',
                    transition: 'border-color 0.15s ease',
                }, onFocus: (e) => {
                    e.currentTarget.style.borderColor = '#6366f1';
                }, onBlur: (e) => {
                    e.currentTarget.style.borderColor = '#e5e7eb';
                }, "aria-haspopup": "listbox", "aria-expanded": isOpen, children: [_jsx("span", { style: { display: 'flex', alignItems: 'center', gap: '6px' }, children: selectedCategory ? (_jsxs(_Fragment, { children: [_jsx("span", { style: {
                                        width: '10px',
                                        height: '10px',
                                        borderRadius: '2px',
                                        backgroundColor: selectedCategory.color,
                                    } }), _jsx("span", { children: selectedCategory.name })] })) : (_jsx("span", { style: { color: '#9ca3af' }, children: placeholder })) }), _jsx("svg", { width: "12", height: "12", viewBox: "0 0 12 12", fill: "none", style: {
                            transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                            transition: 'transform 0.15s ease',
                        }, children: _jsx("path", { d: "M2.5 4.5L6 8L9.5 4.5", stroke: "currentColor", strokeWidth: "1.5", strokeLinecap: "round", strokeLinejoin: "round" }) })] }), isOpen && (_jsxs("ul", { role: "listbox", style: {
                    position: 'absolute',
                    top: 'calc(100% + 4px)',
                    left: 0,
                    right: 0,
                    margin: 0,
                    padding: '4px',
                    listStyle: 'none',
                    backgroundColor: '#ffffff',
                    border: '1px solid #e5e7eb',
                    borderRadius: '6px',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                    zIndex: 50,
                    maxHeight: '240px',
                    overflowY: 'auto',
                }, children: [_jsx("li", { children: _jsxs("button", { type: "button", onClick: () => {
                                onChange(null);
                                setIsOpen(false);
                            }, style: {
                                width: '100%',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                                padding: '8px 10px',
                                fontSize: '13px',
                                fontWeight: selected === null ? 600 : 400,
                                border: 'none',
                                borderRadius: '4px',
                                backgroundColor: selected === null ? '#f3f4f6' : 'transparent',
                                color: '#374151',
                                cursor: 'pointer',
                                textAlign: 'left',
                                transition: 'background-color 0.1s ease',
                            }, onMouseEnter: (e) => {
                                if (selected !== null) {
                                    e.currentTarget.style.backgroundColor = '#f9fafb';
                                }
                            }, onMouseLeave: (e) => {
                                if (selected !== null) {
                                    e.currentTarget.style.backgroundColor = 'transparent';
                                }
                            }, role: "option", "aria-selected": selected === null, children: [_jsx("span", { style: {
                                        width: '10px',
                                        height: '10px',
                                        borderRadius: '2px',
                                        backgroundColor: '#9ca3af',
                                    } }), _jsx("span", { children: placeholder })] }) }), categories.map(category => {
                        const isSelected = selected === category.id;
                        return (_jsx("li", { children: _jsxs("button", { type: "button", onClick: () => {
                                    onChange(category.id);
                                    setIsOpen(false);
                                }, style: {
                                    width: '100%',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '8px',
                                    padding: '8px 10px',
                                    fontSize: '13px',
                                    fontWeight: isSelected ? 600 : 400,
                                    border: 'none',
                                    borderRadius: '4px',
                                    backgroundColor: isSelected ? '#f3f4f6' : 'transparent',
                                    color: '#374151',
                                    cursor: 'pointer',
                                    textAlign: 'left',
                                    transition: 'background-color 0.1s ease',
                                }, onMouseEnter: (e) => {
                                    if (!isSelected) {
                                        e.currentTarget.style.backgroundColor = '#f9fafb';
                                    }
                                }, onMouseLeave: (e) => {
                                    if (!isSelected) {
                                        e.currentTarget.style.backgroundColor = 'transparent';
                                    }
                                }, role: "option", "aria-selected": isSelected, children: [_jsx("span", { style: {
                                            width: '10px',
                                            height: '10px',
                                            borderRadius: '2px',
                                            backgroundColor: category.color,
                                        } }), _jsx("span", { children: category.name })] }) }, category.id));
                    })] }))] }));
}
/**
 * Calculate contrasting text color based on background
 */
function getContrastColor(hexColor) {
    const hex = hexColor.replace('#', '');
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    return luminance > 0.5 ? '#1f2937' : '#ffffff';
}
export default CategoryFilter;
//# sourceMappingURL=CategoryFilter.js.map