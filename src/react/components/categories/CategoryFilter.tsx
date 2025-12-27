'use client';

import React, { useState, useRef, useEffect } from 'react';
import type { Category } from '../../types.js';

export interface CategoryFilterProps {
  /** List of available categories */
  categories: Category[];
  /** Currently selected category ID (null for "All") */
  selected: string | null;
  /** Callback when selection changes */
  onChange: (categoryId: string | null) => void;
  /** Display mode: 'dropdown' or 'buttons' */
  mode?: 'dropdown' | 'buttons';
  /** Placeholder text for dropdown mode */
  placeholder?: string;
  /** Additional CSS class names */
  className?: string;
}

/**
 * Category filter component that allows filtering by a single category.
 * Supports dropdown or button group display modes.
 */
export function CategoryFilter({
  categories,
  selected,
  onChange,
  mode = 'dropdown',
  placeholder = 'All Categories',
  className = '',
}: CategoryFilterProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
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
    return (
      <div
        className={`rag-category-filter-buttons ${className}`}
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '6px',
        }}
      >
        {/* All button */}
        <button
          type="button"
          onClick={() => onChange(null)}
          style={{
            padding: '6px 12px',
            fontSize: '13px',
            fontWeight: selected === null ? 600 : 400,
            border: '1px solid',
            borderColor: selected === null ? 'var(--curator-accent, #6366f1)' : 'var(--curator-border-light)',
            borderRadius: '6px',
            backgroundColor: selected === null ? 'var(--curator-accent, #6366f1)' : 'var(--curator-bg-surface)',
            color: selected === null ? 'white' : 'var(--curator-text-secondary)',
            cursor: 'pointer',
            transition: 'all 0.15s ease',
          }}
        >
          All
        </button>

        {/* Category buttons */}
        {categories.map(category => {
          const isSelected = selected === category.id;
          return (
            <button
              key={category.id}
              type="button"
              onClick={() => onChange(isSelected ? null : category.id)}
              style={{
                padding: '6px 12px',
                fontSize: '13px',
                fontWeight: isSelected ? 600 : 400,
                border: '1px solid',
                borderColor: isSelected ? category.color : 'var(--curator-border-light)',
                borderRadius: '6px',
                backgroundColor: isSelected ? category.color : 'var(--curator-bg-surface)',
                color: isSelected ? getContrastColor(category.color) : 'var(--curator-text-secondary)',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
            >
              {category.icon && (
                <span style={{ marginRight: '4px' }}>{category.icon}</span>
              )}
              {category.name}
            </button>
          );
        })}
      </div>
    );
  }

  // Dropdown mode
  return (
    <div
      ref={dropdownRef}
      className={`rag-category-filter-dropdown ${className}`}
      style={{
        position: 'relative',
        display: 'inline-block',
        minWidth: '180px',
      }}
    >
      {/* Dropdown trigger */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        style={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '8px',
          padding: '8px 12px',
          fontSize: '14px',
          fontWeight: 400,
          border: '1px solid var(--curator-border-light)',
          borderRadius: '6px',
          backgroundColor: 'var(--curator-bg-surface)',
          color: 'var(--curator-text-secondary)',
          cursor: 'pointer',
          transition: 'border-color 0.15s ease',
        }}
        onFocus={(e) => {
          e.currentTarget.style.borderColor = 'var(--curator-accent, #6366f1)';
        }}
        onBlur={(e) => {
          e.currentTarget.style.borderColor = 'var(--curator-border-light)';
        }}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          {selectedCategory ? (
            <>
              <span
                style={{
                  width: '10px',
                  height: '10px',
                  borderRadius: '2px',
                  backgroundColor: selectedCategory.color,
                }}
              />
              <span>{selectedCategory.name}</span>
            </>
          ) : (
            <span style={{ color: 'var(--curator-text-muted)' }}>{placeholder}</span>
          )}
        </span>
        <svg
          width="12"
          height="12"
          viewBox="0 0 12 12"
          fill="none"
          style={{
            transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
            transition: 'transform 0.15s ease',
          }}
        >
          <path
            d="M2.5 4.5L6 8L9.5 4.5"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      {/* Dropdown menu */}
      {isOpen && (
        <ul
          role="listbox"
          style={{
            position: 'absolute',
            top: 'calc(100% + 4px)',
            left: 0,
            right: 0,
            margin: 0,
            padding: '4px',
            listStyle: 'none',
            backgroundColor: 'var(--curator-bg-surface)',
            border: '1px solid var(--curator-border-light)',
            borderRadius: '6px',
            boxShadow: 'var(--curator-shadow-lg, 0 4px 12px rgba(0, 0, 0, 0.1))',
            zIndex: 50,
            maxHeight: '240px',
            overflowY: 'auto',
          }}
        >
          {/* All option */}
          <li>
            <button
              type="button"
              onClick={() => {
                onChange(null);
                setIsOpen(false);
              }}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 10px',
                fontSize: '13px',
                fontWeight: selected === null ? 600 : 400,
                border: 'none',
                borderRadius: '4px',
                backgroundColor: selected === null ? 'var(--curator-bg-subtle)' : 'transparent',
                color: 'var(--curator-text-secondary)',
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'background-color 0.1s ease',
              }}
              onMouseEnter={(e) => {
                if (selected !== null) {
                  e.currentTarget.style.backgroundColor = 'var(--curator-bg-hover)';
                }
              }}
              onMouseLeave={(e) => {
                if (selected !== null) {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }
              }}
              role="option"
              aria-selected={selected === null}
            >
              <span
                style={{
                  width: '10px',
                  height: '10px',
                  borderRadius: '2px',
                  backgroundColor: 'var(--curator-text-muted)',
                }}
              />
              <span>{placeholder}</span>
            </button>
          </li>

          {/* Category options */}
          {categories.map(category => {
            const isSelected = selected === category.id;
            return (
              <li key={category.id}>
                <button
                  type="button"
                  onClick={() => {
                    onChange(category.id);
                    setIsOpen(false);
                  }}
                  style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '8px 10px',
                    fontSize: '13px',
                    fontWeight: isSelected ? 600 : 400,
                    border: 'none',
                    borderRadius: '4px',
                    backgroundColor: isSelected ? 'var(--curator-bg-subtle)' : 'transparent',
                    color: 'var(--curator-text-secondary)',
                    cursor: 'pointer',
                    textAlign: 'left',
                    transition: 'background-color 0.1s ease',
                  }}
                  onMouseEnter={(e) => {
                    if (!isSelected) {
                      e.currentTarget.style.backgroundColor = 'var(--curator-bg-hover)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isSelected) {
                      e.currentTarget.style.backgroundColor = 'transparent';
                    }
                  }}
                  role="option"
                  aria-selected={isSelected}
                >
                  <span
                    style={{
                      width: '10px',
                      height: '10px',
                      borderRadius: '2px',
                      backgroundColor: category.color,
                    }}
                  />
                  <span>{category.name}</span>
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

/**
 * Calculate contrasting text color based on background
 */
function getContrastColor(hexColor: string): string {
  const hex = hexColor.replace('#', '');
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.5 ? '#1f2937' : '#ffffff';
}

export default CategoryFilter;
