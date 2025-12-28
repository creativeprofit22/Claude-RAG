import type { SkinAwareChartProps } from './types.js';
/**
 * SkinAwareChart - ECharts wrapper that auto-applies skin theming
 *
 * Automatically detects the current skin and applies the corresponding
 * chart theme (colors, typography, tooltip styling).
 *
 * @example
 * ```tsx
 * import { SkinAwareChart } from 'claude-rag/react/charts';
 *
 * const option = {
 *   xAxis: { type: 'category', data: ['Mon', 'Tue', 'Wed'] },
 *   yAxis: { type: 'value' },
 *   series: [{ data: [120, 200, 150], type: 'bar' }]
 * };
 *
 * <SkinAwareChart option={option} style={{ height: 300 }} />
 * ```
 */
export declare function SkinAwareChart({ option, style, className, loading, notMerge, lazyUpdate, onEvents, }: SkinAwareChartProps): import("react/jsx-runtime").JSX.Element;
//# sourceMappingURL=SkinAwareChart.d.ts.map