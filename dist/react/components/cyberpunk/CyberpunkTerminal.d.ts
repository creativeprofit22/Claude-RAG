/**
 * CyberpunkTerminal - Main 3D holographic chat terminal
 *
 * Combines the 3D scene with HTML overlay for the actual chat interface.
 * Damaged Night City corpo terminal aesthetic.
 */
import { ReactNode } from 'react';
interface CyberpunkTerminalProps {
    /** Chat content to render inside the terminal */
    children: ReactNode;
    /** Panel width */
    width?: number;
    /** Panel height */
    height?: number;
    /** Overall damage level (0-1) */
    damageLevel?: number;
    /** Enable post-processing effects */
    enableEffects?: boolean;
    /** Additional CSS class for container */
    className?: string;
}
export declare function CyberpunkTerminal({ children, width, height, damageLevel, enableEffects, className, }: CyberpunkTerminalProps): import("react/jsx-runtime").JSX.Element;
export default CyberpunkTerminal;
//# sourceMappingURL=CyberpunkTerminal.d.ts.map