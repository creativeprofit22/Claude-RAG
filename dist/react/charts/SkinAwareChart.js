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
    // IMPORTANT: Theme values must override user values for consistent styling
    const themedOption = useMemo(() => {
        // Extract only the properties we DON'T handle specially
        const { xAxis, yAxis, tooltip, legend, grid, color, backgroundColor, textStyle, ...restOption } = option;
        return {
            // Pass through series and other unhandled options FIRST
            ...restOption,
            // Theme colors (theme wins)
            color: theme.colors,
            backgroundColor: theme.backgroundColor,
            // Global text style (theme wins)
            textStyle: theme.textStyle,
            // xAxis: user values first, then theme overrides for styling
            xAxis: {
                ...(typeof xAxis === 'object' && !Array.isArray(xAxis) ? xAxis : {}),
                axisLine: theme.axisLine,
                axisLabel: {
                    ...(xAxis?.axisLabel ?? {}),
                    color: theme.textStyle.color
                },
            },
            // yAxis: user values first, then theme overrides for styling
            yAxis: {
                ...(typeof yAxis === 'object' && !Array.isArray(yAxis) ? yAxis : {}),
                axisLine: theme.axisLine,
                splitLine: theme.splitLine,
                axisLabel: {
                    ...(yAxis?.axisLabel ?? {}),
                    color: theme.textStyle.color
                },
            },
            // Tooltip: user values first, then theme overrides
            tooltip: {
                ...(typeof tooltip === 'object' ? tooltip : {}),
                backgroundColor: theme.tooltip.backgroundColor,
                borderColor: theme.tooltip.borderColor,
                borderWidth: 1,
                textStyle: theme.tooltip.textStyle,
            },
            // Legend: user values first, then theme overrides
            legend: {
                ...(typeof legend === 'object' ? legend : {}),
                textStyle: theme.legend.textStyle,
            },
            // Animation settings (respect reduced motion)
            animation: !reducedMotion,
            animationDuration: reducedMotion ? 0 : 500,
            animationEasing: 'cubicOut',
            // Grid: user values first, then theme defaults
            grid: {
                containLabel: true,
                left: 16,
                right: 16,
                top: 32,
                bottom: 16,
                ...(typeof grid === 'object' ? grid : {}),
            },
        };
    }, [option, theme, reducedMotion]);
    // Initialize chart - recreate on skin change for proper theme application
    useEffect(() => {
        if (!chartRef.current)
            return;
        // Dispose existing instance on skin change to apply new theme
        if (instanceRef.current) {
            instanceRef.current.dispose();
            instanceRef.current = null;
        }
        // Create new instance
        instanceRef.current = echarts.init(chartRef.current);
        const chart = instanceRef.current;
        // Set option
        chart.setOption(themedOption, { notMerge: true, lazyUpdate });
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
    }, [themedOption, loading, notMerge, lazyUpdate, onEvents, skin]);
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