/**
 * TerminalReadout Artifact Component
 * A busted CRT terminal with phosphor decay and burn-in effects
 * Displays service health status in a retro terminal aesthetic
 */
import React from 'react';
import './terminal-readout.base.css';
import './terminal-readout.cyberpunk.css';
import './terminal-readout.library.css';
export type ServiceStatus = 'up' | 'degraded' | 'down' | 'unknown';
export interface ServiceEntry {
    /** Icon element to display */
    icon: React.ReactNode;
    /** Service name label */
    label: string;
    /** Current status */
    status: ServiceStatus;
    /** Optional status text override (defaults to status value) */
    statusText?: string;
    /** Optional metadata */
    meta?: string;
}
export interface TerminalReadoutProps {
    /** Terminal title (e.g., "SYSTEM_HEALTH.exe") */
    title?: string;
    /** Array of service entries to display */
    services: ServiceEntry[];
    /** Burn-in ghost text (always visible at low opacity) */
    burnInText?: string;
    /** Loading state */
    isLoading?: boolean;
    /** Optional className for additional styling */
    className?: string;
}
export declare function TerminalReadout({ title, services, burnInText, isLoading, className, }: TerminalReadoutProps): import("react/jsx-runtime").JSX.Element;
export default TerminalReadout;
//# sourceMappingURL=TerminalReadout.d.ts.map