'use client';

import { useState, useEffect, useRef, type ReactNode } from 'react';
import { ChevronDown } from 'lucide-react';

export interface DropdownOption<T extends string> {
  value: T;
  label: string;
}

export interface DropdownProps<T extends string> {
  options: DropdownOption<T>[];
  value: T;
  onChange: (value: T) => void;
  icon?: ReactNode;
  className?: string;
  triggerClassName?: string;
  menuClassName?: string;
  optionClassName?: string;
}

/**
 * Reusable Dropdown component with outside click and keyboard handling
 */
export function Dropdown<T extends string>({
  options,
  value,
  onChange,
  icon,
  className = '',
  triggerClassName = '',
  menuClassName = '',
  optionClassName = '',
}: DropdownProps<T>) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close dropdown on Escape key
  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    }

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  const handleSelect = (optionValue: T) => {
    onChange(optionValue);
    setIsOpen(false);
  };

  const currentLabel = options.find((opt) => opt.value === value)?.label || '';

  return (
    <div className={`rag-dropdown ${className}`} ref={dropdownRef}>
      <button
        type="button"
        className={`rag-dropdown-trigger ${triggerClassName}`}
        onClick={() => setIsOpen(!isOpen)}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        {icon}
        <span>{currentLabel}</span>
        <ChevronDown
          size={14}
          className={`rag-dropdown-chevron ${isOpen ? 'rag-dropdown-chevron--open' : ''}`}
          aria-hidden="true"
        />
      </button>

      {isOpen && (
        <div className={`rag-dropdown-menu ${menuClassName}`} role="listbox">
          {options.map((option) => (
            <button
              key={option.value}
              type="button"
              className={`rag-dropdown-option ${value === option.value ? 'rag-dropdown-option--active' : ''} ${optionClassName}`}
              onClick={() => handleSelect(option.value)}
              role="option"
              aria-selected={value === option.value}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
