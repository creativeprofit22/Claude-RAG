import { useState, useEffect } from 'react';
/**
 * Respects user's prefers-reduced-motion system preference
 */
export function useReducedMotion() {
    const [reducedMotion, setReducedMotion] = useState(false);
    useEffect(() => {
        const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
        setReducedMotion(mediaQuery.matches);
        const handler = (event) => {
            setReducedMotion(event.matches);
        };
        mediaQuery.addEventListener('change', handler);
        return () => mediaQuery.removeEventListener('change', handler);
    }, []);
    return reducedMotion;
}
//# sourceMappingURL=useReducedMotion.js.map