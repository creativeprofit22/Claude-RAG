import type { SkinType } from '../motion/types.js';

// ECharts option type (simplified for our use case)
export type EChartsOption = Record<string, unknown>;

// ECharts theme configuration matching skin aesthetics
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

// Props for SkinAwareChart wrapper
export interface SkinAwareChartProps {
  option: EChartsOption;
  style?: React.CSSProperties;
  className?: string;
  loading?: boolean;
  notMerge?: boolean;
  lazyUpdate?: boolean;
  onEvents?: Record<string, (params: unknown) => void>;
}

// Chart type presets for common visualizations
export type ChartPreset = 'bar' | 'line' | 'pie' | 'area' | 'donut';
