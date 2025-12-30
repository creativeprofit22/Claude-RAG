/**
 * IndexCard Component
 * Physical index card with 3D perspective animations
 *
 * Interactions:
 * - Hover: Slight lift, shadow depth increases
 * - Select: Lifts forward out of stack, shadow intensifies
 * - Return: Settles back into position
 * - Fan: 3D perspective flip-through (controlled by parent)
 */
export interface IndexCardData {
    id: string;
    title: string;
    content: string;
    date?: string;
}
export interface IndexCardProps {
    card: IndexCardData;
    index: number;
    isSelected: boolean;
    onSelect: (card: IndexCardData) => void;
    onDeselect: () => void;
    stackOffset?: number;
    fanAngle?: number;
    className?: string;
}
export declare function IndexCard({ card, index, isSelected, onSelect, onDeselect, stackOffset, fanAngle, className, }: IndexCardProps): import("react/jsx-runtime").JSX.Element;
export default IndexCard;
//# sourceMappingURL=IndexCard.d.ts.map