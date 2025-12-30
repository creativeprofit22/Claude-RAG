/**
 * Drawer Component
 * Card Catalog Drawer with GSAP physics-based animations
 *
 * Interactions:
 * - Pull Open (~300-400ms): Initial friction -> smooth glide -> soft stop
 * - Push Closed (~300ms): Initial push -> momentum slide -> impact + bounce
 */
import React from 'react';
export interface DrawerProps {
    title: string;
    isOpen: boolean;
    onToggle: () => void;
    children: React.ReactNode;
    className?: string;
}
export declare function Drawer({ title, isOpen, onToggle, children, className, }: DrawerProps): import("react/jsx-runtime").JSX.Element;
export default Drawer;
//# sourceMappingURL=Drawer.d.ts.map