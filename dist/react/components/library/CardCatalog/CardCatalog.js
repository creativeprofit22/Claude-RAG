import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
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
import { useState, useCallback, useMemo } from 'react';
import { Drawer } from './Drawer.js';
import { IndexCard } from './IndexCard.js';
import './CardCatalog.css';
// Default stacking configuration
const STACK_CONFIG = {
    offsetPerCard: 2, // Vertical pixels between cards
    maxFanAngle: 3, // Max rotation degrees when fanning
    staggerDelay: 0.05, // Delay between card animations
};
export function CardCatalog({ title, cards, onCardSelect, defaultOpen = false, className = '', maxVisibleCards = 20, }) {
    const [isOpen, setIsOpen] = useState(defaultOpen);
    const [selectedCardId, setSelectedCardId] = useState(null);
    const [isFanning, setIsFanning] = useState(false);
    /**
     * Toggle drawer open/close
     */
    const handleToggle = useCallback(() => {
        setIsOpen(prev => !prev);
        // Reset selection when closing
        if (isOpen) {
            setSelectedCardId(null);
        }
    }, [isOpen]);
    /**
     * Handle card selection
     */
    const handleCardSelect = useCallback((card) => {
        setSelectedCardId(card.id);
        onCardSelect?.(card);
    }, [onCardSelect]);
    /**
     * Handle card deselection
     */
    const handleCardDeselect = useCallback(() => {
        setSelectedCardId(null);
    }, []);
    /**
     * Calculate stack offset for each card
     */
    const getStackOffset = useCallback((index, total) => {
        // Cards stack from back to front
        return (total - index - 1) * STACK_CONFIG.offsetPerCard;
    }, []);
    /**
     * Calculate fan angle for each card (when drawer is open)
     */
    const getFanAngle = useCallback((index, total) => {
        if (!isOpen || !isFanning)
            return 0;
        // Fan out from center
        const center = (total - 1) / 2;
        const offset = index - center;
        return offset * (STACK_CONFIG.maxFanAngle / Math.max(1, total / 4));
    }, [isOpen, isFanning]);
    /**
     * Memoized visible cards (limited for performance)
     */
    const visibleCards = useMemo(() => {
        return cards.slice(0, maxVisibleCards);
    }, [cards, maxVisibleCards]);
    /**
     * Card count display
     */
    const cardCountLabel = useMemo(() => {
        if (cards.length === 0)
            return 'Empty';
        if (cards.length === 1)
            return '1 card';
        return `${cards.length} cards`;
    }, [cards.length]);
    return (_jsxs("div", { className: `card-catalog ${isOpen ? 'open' : ''} ${className}`, children: [_jsxs(Drawer, { title: title, isOpen: isOpen, onToggle: handleToggle, children: [_jsx("div", { className: "card-stack", onMouseEnter: () => setIsFanning(true), onMouseLeave: () => setIsFanning(false), children: visibleCards.length === 0 ? (_jsx("div", { className: "card-stack-empty", children: _jsx("span", { children: "No cards filed" }) })) : (visibleCards.map((card, index) => (_jsx(IndexCard, { card: card, index: index, isSelected: selectedCardId === card.id, onSelect: handleCardSelect, onDeselect: handleCardDeselect, stackOffset: getStackOffset(index, visibleCards.length), fanAngle: getFanAngle(index, visibleCards.length) }, card.id)))) }), cards.length > maxVisibleCards && (_jsxs("div", { className: "card-overflow-indicator", children: ["+", cards.length - maxVisibleCards, " more"] }))] }), _jsx("div", { className: "card-catalog-count", children: cardCountLabel }), selectedCardId && (_jsx(SelectedCardPreview, { card: cards.find(c => c.id === selectedCardId) || null, onClose: handleCardDeselect }))] }));
}
function SelectedCardPreview({ card, onClose }) {
    if (!card)
        return null;
    return (_jsx("div", { className: "selected-card-preview", onClick: onClose, children: _jsxs("div", { className: "preview-card", onClick: e => e.stopPropagation(), children: [_jsxs("div", { className: "preview-header", children: [_jsx("h3", { className: "preview-title", children: card.title }), card.date && (_jsx("span", { className: "preview-date", children: card.date })), _jsx("button", { className: "preview-close", onClick: onClose, children: _jsx("span", { "aria-hidden": "true", children: "x" }) })] }), _jsx("div", { className: "preview-content", children: card.content })] }) }));
}
export default CardCatalog;
//# sourceMappingURL=CardCatalog.js.map