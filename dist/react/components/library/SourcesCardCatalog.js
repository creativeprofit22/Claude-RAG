import { jsx as _jsx } from "react/jsx-runtime";
/**
 * SourcesCardCatalog Component
 * Library Skin V2: Sources displayed as index cards in a card catalog
 *
 * Converts RAG message sources into IndexCards for the library aesthetic.
 */
import { useMemo } from 'react';
import { CardCatalog } from './CardCatalog/index.js';
/**
 * Convert MessageSource to IndexCardData format
 */
function sourceToCard(source, index) {
    return {
        id: `${source.documentId}-${source.chunkIndex}-${index}`,
        title: source.documentName,
        content: source.snippet,
        date: `Chunk ${source.chunkIndex}`,
    };
}
export function SourcesCardCatalog({ sources, onSourceSelect, defaultOpen = false, className = '', }) {
    // Convert sources to card data
    const cards = useMemo(() => {
        return sources.map((source, i) => sourceToCard(source, i));
    }, [sources]);
    // Handle card selection - find original source and call callback
    const handleCardSelect = (card) => {
        if (!onSourceSelect)
            return;
        // Find the original source by matching the card id pattern
        const index = cards.findIndex(c => c.id === card.id);
        if (index >= 0 && sources[index]) {
            onSourceSelect(sources[index]);
        }
    };
    if (sources.length === 0) {
        return null;
    }
    return (_jsx("div", { className: `sources-card-catalog ${className}`, children: _jsx(CardCatalog, { title: `${sources.length} Source${sources.length > 1 ? 's' : ''}`, cards: cards, onCardSelect: handleCardSelect, defaultOpen: defaultOpen, maxVisibleCards: 10 }) }));
}
export default SourcesCardCatalog;
//# sourceMappingURL=SourcesCardCatalog.js.map