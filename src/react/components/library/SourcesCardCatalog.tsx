/**
 * SourcesCardCatalog Component
 * Library Skin V2: Sources displayed as index cards in a card catalog
 *
 * Converts RAG message sources into IndexCards for the library aesthetic.
 */

import React, { useMemo } from 'react';
import { CardCatalog, type IndexCardData } from './CardCatalog/index.js';
import type { MessageSource } from '../../types.js';

export interface SourcesCardCatalogProps {
  sources: MessageSource[];
  onSourceSelect?: (source: MessageSource) => void;
  defaultOpen?: boolean;
  className?: string;
}

/**
 * Convert MessageSource to IndexCardData format
 */
function sourceToCard(source: MessageSource, index: number): IndexCardData {
  return {
    id: `${source.documentId}-${source.chunkIndex}-${index}`,
    title: source.documentName,
    content: source.snippet,
    date: `Chunk ${source.chunkIndex}`,
  };
}

export function SourcesCardCatalog({
  sources,
  onSourceSelect,
  defaultOpen = false,
  className = '',
}: SourcesCardCatalogProps) {
  // Convert sources to card data
  const cards = useMemo(() => {
    return sources.map((source, i) => sourceToCard(source, i));
  }, [sources]);

  // Handle card selection - find original source and call callback
  const handleCardSelect = (card: IndexCardData) => {
    if (!onSourceSelect) return;

    // Find the original source by matching the card id pattern
    const index = cards.findIndex(c => c.id === card.id);
    if (index >= 0 && sources[index]) {
      onSourceSelect(sources[index]);
    }
  };

  if (sources.length === 0) {
    return null;
  }

  return (
    <div className={`sources-card-catalog ${className}`}>
      <CardCatalog
        title={`${sources.length} Source${sources.length > 1 ? 's' : ''}`}
        cards={cards}
        onCardSelect={handleCardSelect}
        defaultOpen={defaultOpen}
        maxVisibleCards={10}
      />
    </div>
  );
}

export default SourcesCardCatalog;
