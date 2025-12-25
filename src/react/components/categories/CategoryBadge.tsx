'use client';

import React from 'react';
import type { Category } from '../../types.js';

export interface CategoryBadgeProps {
  /** The category to display */
  category: Category;
  /** Size variant of the badge */
  size?: 'sm' | 'md';
  /** Callback when remove button is clicked. If provided, shows X button. */
  onRemove?: () => void;
  /** Additional CSS class names */
  className?: string;
}

/**
 * Small colored badge displaying a category name.
 * Optionally shows an X button to remove the category.
 */
export function CategoryBadge({
  category,
  size = 'md',
  onRemove,
  className = '',
}: CategoryBadgeProps) {
  // Calculate contrasting text color based on background
  const getContrastColor = (hexColor: string): string => {
    // Remove # if present
    const hex = hexColor.replace('#', '');

    // Parse RGB values
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);

    // Calculate relative luminance (WCAG formula)
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;

    // Return white for dark backgrounds, dark gray for light backgrounds
    return luminance > 0.5 ? '#1f2937' : '#ffffff';
  };

  const textColor = getContrastColor(category.color);

  const sizeStyles = {
    sm: {
      padding: '2px 6px',
      fontSize: '11px',
      borderRadius: '3px',
      gap: '3px',
    },
    md: {
      padding: '3px 8px',
      fontSize: '12px',
      borderRadius: '4px',
      gap: '4px',
    },
  };

  const style = sizeStyles[size];

  return (
    <span
      className={`rag-category-badge ${className}`}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: style.gap,
        padding: style.padding,
        fontSize: style.fontSize,
        fontWeight: 500,
        borderRadius: style.borderRadius,
        backgroundColor: category.color,
        color: textColor,
        lineHeight: 1.2,
        whiteSpace: 'nowrap',
      }}
    >
      {category.icon && (
        <span style={{ fontSize: size === 'sm' ? '10px' : '11px' }}>
          {/* Simple icon placeholder - can be replaced with icon library */}
          {category.icon}
        </span>
      )}
      <span>{category.name}</span>
      {onRemove && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 0,
            marginLeft: '2px',
            width: size === 'sm' ? '12px' : '14px',
            height: size === 'sm' ? '12px' : '14px',
            border: 'none',
            borderRadius: '50%',
            backgroundColor: 'rgba(0, 0, 0, 0.15)',
            color: textColor,
            cursor: 'pointer',
            fontSize: size === 'sm' ? '10px' : '11px',
            lineHeight: 1,
            transition: 'background-color 0.15s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = 'rgba(0, 0, 0, 0.25)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'rgba(0, 0, 0, 0.15)';
          }}
          aria-label={`Remove ${category.name} category`}
        >
          ×
        </button>
      )}
    </span>
  );
}

export default CategoryBadge;
