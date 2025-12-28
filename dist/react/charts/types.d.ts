import type { SkinType } from '../motion/types.js';
export type EChartsOption = Record<string, unknown>;
export interface ChartTheme {
    skin: SkinType;
    colors: string[];
    backgroundColor: string;
    textStyle: {
        color: string;
        fontFamily: string;
    };
    axisLine: {
        lineStyle: {
            color: string;
        };
    };
    splitLine: {
        lineStyle: {
            color: string;
        };
    };
    tooltip: {
        backgroundColor: string;
        borderColor: string;
        textStyle: {
            color: string;
        };
    };
    legend: {
        textStyle: {
            color: string;
        };
    };
}
export interface SkinAwareChartProps {
    option: EChartsOption;
    style?: React.CSSProperties;
    className?: string;
    loading?: boolean;
    notMerge?: boolean;
    lazyUpdate?: boolean;
    onEvents?: Record<string, (params: unknown) => void>;
}
export type ChartPreset = 'bar' | 'line' | 'pie' | 'area' | 'donut';
//# sourceMappingURL=types.d.ts.map