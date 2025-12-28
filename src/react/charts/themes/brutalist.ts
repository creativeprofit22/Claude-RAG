import type { ChartTheme } from '../types.js';

/**
 * Brutalist skin ECharts theme
 * High contrast, bold geometric, no decoration
 */
export const brutalistTheme: ChartTheme = {
  skin: 'brutalist',
  colors: [
    '#ff3333', // Bold red (primary)
    '#0033ff', // Bold blue (accent)
    '#000000', // Black
    '#ff6666', // Light red
    '#3355ff', // Light blue
    '#333333', // Dark gray
  ],
  backgroundColor: 'transparent',
  textStyle: {
    color: '#333333',
    fontFamily: "'Space Grotesk', 'Inter', sans-serif",
  },
  axisLine: {
    lineStyle: {
      color: '#000000',
    },
  },
  splitLine: {
    lineStyle: {
      color: '#cccccc',
    },
  },
  tooltip: {
    backgroundColor: '#ffffff',
    borderColor: '#000000',
    textStyle: {
      color: '#000000',
    },
  },
  legend: {
    textStyle: {
      color: '#333333',
    },
  },
};
