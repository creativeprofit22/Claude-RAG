/**
 * Lucide React shim - creates React components from vanilla lucide icons
 * The CDN loads vanilla lucide which exports icon definitions (SVG path arrays),
 * not React components. This shim wraps them into React components.
 */

const lucide = window.lucide;
const React = window.React;

/**
 * Create a React component from a vanilla lucide icon definition
 * Vanilla lucide icons are ["svg", defaultAttrs, [[childType, childAttrs], ...]]
 */
function createIconComponent(iconDef) {
  const IconComponent = function(props) {
    const {
      size = 24,
      strokeWidth = 2,
      color = 'currentColor',
      className = '',
      ...rest
    } = props;

    // iconDef structure: ["svg", defaultAttributes, [children]]
    // Each child is [elementType, attributes]
    const childrenDef = iconDef[2] || [];
    const children = childrenDef.map((el, i) =>
      React.createElement(el[0], { key: i, ...el[1] })
    );

    return React.createElement('svg', {
      xmlns: 'http://www.w3.org/2000/svg',
      width: size,
      height: size,
      viewBox: '0 0 24 24',
      fill: 'none',
      stroke: color,
      strokeWidth: strokeWidth,
      strokeLinecap: 'round',
      strokeLinejoin: 'round',
      className: className,
      ...rest
    }, ...children);
  };

  return IconComponent;
}

// All icons used in Claude-RAG React components
export const Activity = createIconComponent(lucide.Activity);
export const AlertCircle = createIconComponent(lucide.AlertCircle);
export const AlertTriangle = createIconComponent(lucide.AlertTriangle);
export const ArrowDown = createIconComponent(lucide.ArrowDown);
export const ArrowUp = createIconComponent(lucide.ArrowUp);
export const ArrowUpDown = createIconComponent(lucide.ArrowUpDown);
export const BarChart3 = createIconComponent(lucide.BarChart3);
export const Calendar = createIconComponent(lucide.Calendar);
export const Check = createIconComponent(lucide.Check);
export const CheckCircle = createIconComponent(lucide.CheckCircle);
export const ChevronDown = createIconComponent(lucide.ChevronDown);
export const ChevronUp = createIconComponent(lucide.ChevronUp);
export const Clock = createIconComponent(lucide.Clock);
export const Cpu = createIconComponent(lucide.Cpu);
export const Database = createIconComponent(lucide.Database);
export const Edit2 = createIconComponent(lucide.Edit2);
export const ExternalLink = createIconComponent(lucide.ExternalLink);
export const Eye = createIconComponent(lucide.Eye);
export const File = createIconComponent(lucide.File);
export const FileCode = createIconComponent(lucide.FileCode);
export const FileJson = createIconComponent(lucide.FileJson);
export const FileText = createIconComponent(lucide.FileText);
export const HardDrive = createIconComponent(lucide.HardDrive);
export const Hash = createIconComponent(lucide.Hash);
export const Layers = createIconComponent(lucide.Layers);
export const Library = createIconComponent(lucide.Library);
export const Loader2 = createIconComponent(lucide.Loader2);
export const MessageSquare = createIconComponent(lucide.MessageSquare);
export const RefreshCw = createIconComponent(lucide.RefreshCw);
export const Search = createIconComponent(lucide.Search);
export const Send = createIconComponent(lucide.Send);
export const Sparkles = createIconComponent(lucide.Sparkles);
export const Trash2 = createIconComponent(lucide.Trash2);
export const Upload = createIconComponent(lucide.Upload);
export const X = createIconComponent(lucide.X);
export const XCircle = createIconComponent(lucide.XCircle);
