import type { LucideIcon } from 'lucide-react';
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
export declare function EmptyState({ icon: Icon, iconSize, iconColor, iconShadow, title, description, className, }: EmptyStateProps): import("react/jsx-runtime").JSX.Element;
//# sourceMappingURL=EmptyState.d.ts.map