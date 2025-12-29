'use client';
import { jsx as _jsx } from "react/jsx-runtime";
import { useMemo, useRef, useEffect } from 'react';
import * as echarts from 'echarts';
import { useSkinMotion } from '../motion/hooks/useSkinMotion.js';
import { getChartTheme } from './themes/index.js';
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
export function SkinAwareChart({ option, style, className = '', loading = false, notMerge = false, lazyUpdate = true, onEvents, }) {
    const chartRef = useRef(null);
    const instanceRef = useRef(null);
    const { skin, reducedMotion } = useSkinMotion();
    const theme = getChartTheme(skin);
    // Merge user option with theme defaults
    const themedOption = useMemo(() => {
        return {
            // Theme colors
            color: theme.colors,
            backgroundColor: theme.backgroundColor,
            // Global text style
            textStyle: theme.textStyle,
            // Default xAxis styling
            xAxis: {
                axisLine: theme.axisLine,
                splitLine: { show: false },
                axisLabel: { color: theme.textStyle.color },
                ...(typeof option.xAxis === 'object' && !Array.isArray(option.xAxis) ? option.xAxis : {}),
            },
            // Default yAxis styling
            yAxis: {
                axisLine: theme.axisLine,
                splitLine: theme.splitLine,
                axisLabel: { color: theme.textStyle.color },
                ...(typeof option.yAxis === 'object' && !Array.isArray(option.yAxis) ? option.yAxis : {}),
            },
            // Tooltip styling
            tooltip: {
                backgroundColor: theme.tooltip.backgroundColor,
                borderColor: theme.tooltip.borderColor,
                borderWidth: 1,
                textStyle: theme.tooltip.textStyle,
                ...(typeof option.tooltip === 'object' ? option.tooltip : {}),
            },
            // Legend styling
            legend: {
                textStyle: theme.legend.textStyle,
                ...(typeof option.legend === 'object' ? option.legend : {}),
            },
            // Animation settings (respect reduced motion)
            animation: !reducedMotion,
            animationDuration: reducedMotion ? 0 : 500,
            animationEasing: 'cubicOut',
            // Grid defaults
            grid: {
                containLabel: true,
                left: 16,
                right: 16,
                top: 32,
                bottom: 16,
                ...(typeof option.grid === 'object' ? option.grid : {}),
            },
            // Pass through series and other options
            ...option,
        };
    }, [option, theme, reducedMotion]);
    // Initialize chart
    useEffect(() => {
        if (!chartRef.current)
            return;
        // Create instance if not exists
        if (!instanceRef.current) {
            instanceRef.current = echarts.init(chartRef.current);
        }
        const chart = instanceRef.current;
        // Set option
        chart.setOption(themedOption, { notMerge, lazyUpdate });
        // Handle loading state
        if (loading) {
            chart.showLoading();
        }
        else {
            chart.hideLoading();
        }
        // Bind events
        if (onEvents) {
            Object.entries(onEvents).forEach(([eventName, handler]) => {
                chart.on(eventName, handler);
            });
        }
        // Handle resize
        const handleResize = () => chart.resize();
        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
            if (onEvents) {
                Object.keys(onEvents).forEach((eventName) => {
                    chart.off(eventName);
                });
            }
        };
    }, [themedOption, loading, notMerge, lazyUpdate, onEvents]);
    // Cleanup on unmount
    useEffect(() => {
        return () => {
            if (instanceRef.current) {
                instanceRef.current.dispose();
                instanceRef.current = null;
            }
        };
    }, []);
    const containerStyle = {
        width: '100%',
        height: 300,
        ...style,
    };
    return (_jsx("div", { ref: chartRef, className: `rag-chart ${className}`, style: containerStyle }));
}
//# sourceMappingURL=SkinAwareChart.js.map