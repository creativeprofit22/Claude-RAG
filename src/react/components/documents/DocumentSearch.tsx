'use client';

import { useState, useEffect, useRef } from 'react';
import { Search, ArrowUpDown, ArrowUp, ArrowDown, ChevronDown } from 'lucide-react';

export interface DocumentSearchProps {
  value: string;
  onChange: (value: string) => void;
  sortBy: 'name' | 'date' | 'chunks';
  onSortByChange: (sort: 'name' | 'date' | 'chunks') => void;
  sortOrder: 'asc' | 'desc';
  onSortOrderChange: (order: 'asc' | 'desc') => void;
  placeholder?: string;
}

const SORT_OPTIONS: { value: 'name' | 'date' | 'chunks'; label: string }[] = [
  { value: 'name', label: 'Name' },
  { value: 'date', label: 'Date' },
  { value: 'chunks', label: 'Size' },
];

/**
 * DocumentSearch - Search input with sort controls
 */
export function DocumentSearch({
  value,
  onChange,
  sortBy,
  onSortByChange,
  sortOrder,
  onSortOrderChange,
  placeholder = 'Search documents...',
}: DocumentSearchProps) {
  const [localValue, setLocalValue] = useState(value);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  // Use ref for onChange to prevent debounce reset when parent recreates callback
  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;

  // Sync local value with prop
  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  // Debounced search
  useEffect(() => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    debounceRef.current = setTimeout(() => {
      if (localValue !== value) {
        onChangeRef.current(localValue);
      }
    }, 300);

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, [localValue, value]);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocalValue(e.target.value);
  };

  const handleSortBySelect = (sort: 'name' | 'date' | 'chunks') => {
    onSortByChange(sort);
    setIsDropdownOpen(false);
  };

  const toggleSortOrder = () => {
    onSortOrderChange(sortOrder === 'asc' ? 'desc' : 'asc');
  };

  const currentSortLabel = SORT_OPTIONS.find((opt) => opt.value === sortBy)?.label || 'Sort';
  const SortIcon = sortOrder === 'asc' ? ArrowUp : ArrowDown;

  return (
    <div className="rag-doc-search">
      {/* Search Input */}
      <div className="rag-doc-search-input-wrapper">
        <Search
          size={16}
          className="rag-doc-search-icon"
          aria-hidden="true"
        />
        <input
          type="text"
          className="rag-doc-search-input"
          placeholder={placeholder}
          value={localValue}
          onChange={handleInputChange}
          aria-label="Search documents"
        />
      </div>

      {/* Sort Controls */}
      <div className="rag-doc-search-sort">
        {/* Sort By Dropdown */}
        <div className="rag-doc-sort-dropdown" ref={dropdownRef}>
          <button
            type="button"
            className="rag-doc-sort-trigger"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            aria-haspopup="listbox"
            aria-expanded={isDropdownOpen}
          >
            <ArrowUpDown size={14} aria-hidden="true" />
            <span>{currentSortLabel}</span>
            <ChevronDown
              size={14}
              className={`rag-doc-sort-chevron ${isDropdownOpen ? 'rag-doc-sort-chevron-open' : ''}`}
              aria-hidden="true"
            />
          </button>

          {isDropdownOpen && (
            <div className="rag-doc-sort-menu" role="listbox">
              {SORT_OPTIONS.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  className={`rag-doc-sort-option ${sortBy === option.value ? 'rag-doc-sort-option-active' : ''}`}
                  onClick={() => handleSortBySelect(option.value)}
                  role="option"
                  aria-selected={sortBy === option.value}
                >
                  {option.label}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Sort Order Toggle */}
        <button
          type="button"
          className="rag-doc-sort-order"
          onClick={toggleSortOrder}
          title={`Sort ${sortOrder === 'asc' ? 'ascending' : 'descending'}`}
          aria-label={`Sort ${sortOrder === 'asc' ? 'ascending' : 'descending'}`}
        >
          <SortIcon size={16} />
        </button>
      </div>
    </div>
  );
}
