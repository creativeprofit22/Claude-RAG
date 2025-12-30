/**
 * CardCatalog Component
 * Library Skin V2: Card Catalog Edition
 *
 * A library card catalog drawer containing index cards.
 * Features:
 * - Drawer with physics-based pull/push animations
 * - Index cards with 3D perspective and fan effects
 * - Card selection for viewing details
 * - Authentic library card catalog aesthetic
 *
 * Tech stack: React + GSAP
 */
import { type IndexCardData } from './IndexCard.js';
import './CardCatalog.css';
export interface CardCatalogProps {
    title: string;
    cards: IndexCardData[];
    onCardSelect?: (card: IndexCardData) => void;
    defaultOpen?: boolean;
    className?: string;
    maxVisibleCards?: number;
}
export declare function CardCatalog({ title, cards, onCardSelect, defaultOpen, className, maxVisibleCards, }: CardCatalogProps): import("react/jsx-runtime").JSX.Element;
export type { IndexCardData };
export default CardCatalog;
//# sourceMappingURL=CardCatalog.d.ts.map