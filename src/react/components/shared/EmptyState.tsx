'use client';

import type { LucideIcon } from 'lucide-react';
import { FileText } from 'lucide-react';

export interface EmptyStateProps {
  /** Icon component to display */
  icon?: LucideIcon;
  /** Icon size in pixels */
  iconSize?: number;
  /** Icon color (CSS color value) */
  iconColor?: string;
  /** Box shadow for icon container */
  iconShadow?: string;
  /** Main title text */
  title: string;
  /** Description text below title */
  description: string;
  /** Additional CSS class */
  className?: string;
}

/**
 * EmptyState - Reusable empty state component with icon, title, and description
 */
export function EmptyState({
  icon: Icon = FileText,
  iconSize = 48,
  iconColor,
  iconShadow,
  title,
  description,
  className = '',
}: EmptyStateProps) {
  return (
    <div className={`curator-empty-state ${className}`}>
      <div className="curator-empty-state-icon" style={iconShadow ? { boxShadow: iconShadow } : undefined}>
        <Icon size={iconSize} style={iconColor ? { color: iconColor } : undefined} aria-hidden="true" />
      </div>
      <h3 className="curator-empty-state-title">{title}</h3>
      <p className="curator-empty-state-description">{description}</p>
    </div>
  );
}
