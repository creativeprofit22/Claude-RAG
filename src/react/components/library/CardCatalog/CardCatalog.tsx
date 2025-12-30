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

import React, { useState, useCallback, useMemo } from 'react';
import { Drawer } from './Drawer.js';
import { IndexCard, type IndexCardData } from './IndexCard.js';
import './CardCatalog.css';

export interface CardCatalogProps {
  title: string;                           // Label text for drawer
  cards: IndexCardData[];                  // Array of card data
  onCardSelect?: (card: IndexCardData) => void;
  defaultOpen?: boolean;
  className?: string;
  maxVisibleCards?: number;                // Limit visible cards for performance
}

// Default stacking configuration
const STACK_CONFIG = {
  offsetPerCard: 2,        // Vertical pixels between cards
  maxFanAngle: 3,          // Max rotation degrees when fanning
  staggerDelay: 0.05,      // Delay between card animations
};

export function CardCatalog({
  title,
  cards,
  onCardSelect,
  defaultOpen = false,
  className = '',
  maxVisibleCards = 20,
}: CardCatalogProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const [selectedCardId, setSelectedCardId] = useState<string | null>(null);
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
  const handleCardSelect = useCallback((card: IndexCardData) => {
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
  const getStackOffset = useCallback((index: number, total: number): number => {
    // Cards stack from back to front
    return (total - index - 1) * STACK_CONFIG.offsetPerCard;
  }, []);

  /**
   * Calculate fan angle for each card (when drawer is open)
   */
  const getFanAngle = useCallback((index: number, total: number): number => {
    if (!isOpen || !isFanning) return 0;

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
    if (cards.length === 0) return 'Empty';
    if (cards.length === 1) return '1 card';
    return `${cards.length} cards`;
  }, [cards.length]);

  return (
    <div className={`card-catalog ${isOpen ? 'open' : ''} ${className}`}>
      <Drawer
        title={title}
        isOpen={isOpen}
        onToggle={handleToggle}
      >
        {/* Card Stack */}
        <div
          className="card-stack"
          onMouseEnter={() => setIsFanning(true)}
          onMouseLeave={() => setIsFanning(false)}
        >
          {visibleCards.length === 0 ? (
            <div className="card-stack-empty">
              <span>No cards filed</span>
            </div>
          ) : (
            visibleCards.map((card, index) => (
              <IndexCard
                key={card.id}
                card={card}
                index={index}
                isSelected={selectedCardId === card.id}
                onSelect={handleCardSelect}
                onDeselect={handleCardDeselect}
                stackOffset={getStackOffset(index, visibleCards.length)}
                fanAngle={getFanAngle(index, visibleCards.length)}
              />
            ))
          )}
        </div>

        {/* Overflow indicator */}
        {cards.length > maxVisibleCards && (
          <div className="card-overflow-indicator">
            +{cards.length - maxVisibleCards} more
          </div>
        )}
      </Drawer>

      {/* Card Count Badge */}
      <div className="card-catalog-count">
        {cardCountLabel}
      </div>

      {/* Selected Card Preview (when expanded) */}
      {selectedCardId && (
        <SelectedCardPreview
          card={cards.find(c => c.id === selectedCardId) || null}
          onClose={handleCardDeselect}
        />
      )}
    </div>
  );
}

/**
 * Selected Card Preview - Expanded view of selected card
 */
interface SelectedCardPreviewProps {
  card: IndexCardData | null;
  onClose: () => void;
}

function SelectedCardPreview({ card, onClose }: SelectedCardPreviewProps) {
  if (!card) return null;

  return (
    <div className="selected-card-preview" onClick={onClose}>
      <div className="preview-card" onClick={e => e.stopPropagation()}>
        <div className="preview-header">
          <h3 className="preview-title">{card.title}</h3>
          {card.date && (
            <span className="preview-date">{card.date}</span>
          )}
          <button className="preview-close" onClick={onClose}>
            <span aria-hidden="true">x</span>
          </button>
        </div>
        <div className="preview-content">
          {card.content}
        </div>
      </div>
    </div>
  );
}

// Re-export types for convenience
export type { IndexCardData };
export default CardCatalog;
