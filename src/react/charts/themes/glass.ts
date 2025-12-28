import type { ChartTheme } from '../types.js';

/**
 * Glass skin ECharts theme
 * Frosted morphism, purple/cyan gradient feel
 */
export const glassTheme: ChartTheme = {
  skin: 'glass',
  colors: [
    '#8a2be2', // Purple (primary)
    '#06b6d4', // Cyan (accent)
    '#a855f7', // Light purple
    '#22d3ee', // Light cyan
    '#7c3aed', // Dark purple
    '#0e7490', // Dark cyan
  ],
  backgroundColor: 'transparent',
  textStyle: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontFamily: "'Inter', -apple-system, sans-serif",
  },
  axisLine: {
    lineStyle: {
      color: 'rgba(255, 255, 255, 0.15)',
    },
  },
  splitLine: {
    lineStyle: {
      color: 'rgba(255, 255, 255, 0.06)',
    },
  },
  tooltip: {
    backgroundColor: 'rgba(26, 26, 46, 0.9)',
    borderColor: 'rgba(255, 255, 255, 0.18)',
    textStyle: {
      color: 'rgba(255, 255, 255, 0.95)',
    },
  },
  legend: {
    textStyle: {
      color: 'rgba(255, 255, 255, 0.7)',
    },
  },
};
