'use client';

import { useState, useEffect, useRef } from 'react';
import { Search, ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';
import { Dropdown, type DropdownOption } from '../shared/Dropdown.js';

export interface DocumentSearchProps {
  value: string;
  onChange: (value: string) => void;
  sortBy: 'name' | 'date' | 'chunks';
  onSortByChange: (sort: 'name' | 'date' | 'chunks') => void;
  sortOrder: 'asc' | 'desc';
  onSortOrderChange: (order: 'asc' | 'desc') => void;
  placeholder?: string;
}

const SORT_OPTIONS: DropdownOption<'name' | 'date' | 'chunks'>[] = [
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
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocalValue(e.target.value);
  };

  const toggleSortOrder = () => {
    onSortOrderChange(sortOrder === 'asc' ? 'desc' : 'asc');
  };

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
        <Dropdown
          options={SORT_OPTIONS}
          value={sortBy}
          onChange={onSortByChange}
          icon={<ArrowUpDown size={14} aria-hidden="true" />}
          className="rag-doc-sort-dropdown"
          triggerClassName="rag-doc-sort-trigger"
          menuClassName="rag-doc-sort-menu"
          optionClassName="rag-doc-sort-option"
        />

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
