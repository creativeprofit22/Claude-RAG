/**
 * StatChip Artifact Component
 * A holographic data chip that displays statistics
 * Designed as a physical object, not a styled rectangle
 */
import React from 'react';
import './stat-chip.base.css';
import './stat-chip.cyberpunk.css';
export interface StatChipProps {
    /** Icon element to display */
    icon: React.ReactNode;
    /** The stat value to display */
    value: string | number;
    /** Label describing the stat */
    label: string;
    /** Optional metadata/subtitle */
    meta?: string;
    /** Loading state */
    isLoading?: boolean;
    /** Optional className for additional styling */
    className?: string;
}
export declare function StatChip({ icon, value, label, meta, isLoading, className, }: StatChipProps): import("react/jsx-runtime").JSX.Element;
export default StatChip;
//# sourceMappingURL=StatChip.d.ts.map