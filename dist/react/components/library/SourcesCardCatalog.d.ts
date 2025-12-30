/**
 * SourcesCardCatalog Component
 * Library Skin V2: Sources displayed as index cards in a card catalog
 *
 * Converts RAG message sources into IndexCards for the library aesthetic.
 */
import type { MessageSource } from '../../types.js';
export interface SourcesCardCatalogProps {
    sources: MessageSource[];
    onSourceSelect?: (source: MessageSource) => void;
    defaultOpen?: boolean;
    className?: string;
}
export declare function SourcesCardCatalog({ sources, onSourceSelect, defaultOpen, className, }: SourcesCardCatalogProps): import("react/jsx-runtime").JSX.Element | null;
export default SourcesCardCatalog;
//# sourceMappingURL=SourcesCardCatalog.d.ts.map