import type { ChartTheme } from '../types.js';

/**
 * Cyberpunk skin ECharts theme
 * Neon glow, electric cyan/magenta palette
 */
export const cyberpunkTheme: ChartTheme = {
  skin: 'cyberpunk',
  colors: [
    '#00ffff', // Neon cyan (primary)
    '#ff0080', // Neon magenta (accent)
    '#7fffff', // Light cyan
    '#ff4da6', // Light magenta
    '#00cccc', // Dark cyan
    '#cc0066', // Dark magenta
  ],
  backgroundColor: 'transparent',
  textStyle: {
    color: '#8888aa',
    fontFamily: "'Rajdhani', 'Inter', sans-serif",
  },
  axisLine: {
    lineStyle: {
      color: '#333355',
    },
  },
  splitLine: {
    lineStyle: {
      color: 'rgba(0, 255, 255, 0.08)',
    },
  },
  tooltip: {
    backgroundColor: 'rgba(18, 18, 31, 0.95)',
    borderColor: '#00ffff',
    textStyle: {
      color: '#e0e0ff',
    },
  },
  legend: {
    textStyle: {
      color: '#8888aa',
    },
  },
};
