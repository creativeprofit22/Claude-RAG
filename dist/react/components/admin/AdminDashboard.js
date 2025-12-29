import { Fragment as _Fragment, jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
/**
 * Admin Dashboard Component
 * Displays system statistics and health monitoring
 */
import React, { useState, useEffect, useCallback } from 'react';
import { BarChart3, Database, FileText, HardDrive, RefreshCw, CheckCircle, XCircle, AlertCircle, Clock, Layers, Activity, Settings, } from 'lucide-react';
import { SettingsModal } from '../settings/SettingsModal.js';
import { SkinAwareChart } from '../../charts/SkinAwareChart.js';
import { ErrorBanner } from '../shared/ErrorBanner.js';
import { StatChip } from '../../artifacts/stat-chip/StatChip.js';
import { TerminalReadout } from '../../artifacts/terminal-readout/TerminalReadout.js';
import { HudFrame } from '../../artifacts/hud-frame/HudFrame.js';
import { PowerConduit } from '../../artifacts/power-conduit/PowerConduit.js';
import { formatRelativeTime } from '../../utils/formatters.js';
/** Health status icon lookup */
const HEALTH_STATUS_ICONS = {
    healthy: CheckCircle,
    degraded: AlertCircle,
    unhealthy: XCircle,
};
/** Skeleton loader count */
const SKELETON_COUNT = 4;
function PanelContent({ isLoading, isEmpty, skeleton, emptyMessage, children }) {
    if (isLoading)
        return _jsx(_Fragment, { children: skeleton });
    if (isEmpty)
        return _jsx("div", { className: "rag-admin-chart-empty", children: emptyMessage });
    return _jsx(_Fragment, { children: children });
}
/** Convert health data to ServiceEntry format with defensive null checks */
function buildServiceEntries(health) {
    // Defensive null checks for nested properties - API may return partial data
    if (!health?.services?.database || !health?.services?.embeddings || !health?.services?.responders) {
        return [];
    }
    const getStatus = (isUp, isDegraded) => {
        if (isDegraded)
            return 'degraded';
        return isUp ? 'up' : 'down';
    };
    const db = health.services.database;
    const embed = health.services.embeddings;
    const claude = health.services.responders.claude;
    const gemini = health.services.responders.gemini;
    return [
        {
            icon: _jsx(Database, { size: 16 }),
            label: 'DATABASE',
            status: getStatus(db.status === 'up'),
            statusText: db.status === 'up' ? `${db.documentCount} docs` : db.status,
        },
        {
            icon: _jsx(Layers, { size: 16 }),
            label: 'EMBEDDINGS',
            status: getStatus(embed.status === 'up'),
            statusText: embed.provider || 'N/A',
        },
        {
            icon: _jsx(Activity, { size: 16 }),
            label: 'CLAUDE CLI',
            status: getStatus(claude?.available ?? false),
            statusText: claude?.available ? 'OK' : 'N/A',
        },
        {
            icon: _jsx(Activity, { size: 16 }),
            label: 'GEMINI API',
            status: getStatus(gemini?.available ?? false),
            statusText: gemini?.available ? 'OK' : 'N/A',
        },
    ];
}
export function AdminDashboard({ endpoint = '/api/rag', headers = {}, accentColor = '#6366f1', refreshInterval = 30000, }) {
    const [stats, setStats] = useState(null);
    const [health, setHealth] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [lastRefresh, setLastRefresh] = useState(new Date());
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    // Stabilize headers to prevent infinite rerenders from inline objects
    const headersJson = JSON.stringify(headers);
    const stableHeaders = React.useMemo(() => headers, [headersJson]);
    // Memoize service entries to prevent unnecessary TerminalReadout re-renders
    const serviceEntries = React.useMemo(() => buildServiceEntries(health), [health]);
    const fetchData = useCallback(async (signal) => {
        try {
            setError(null);
            const res = await fetch(`${endpoint}/admin/dashboard`, {
                signal,
                headers: {
                    'Content-Type': 'application/json',
                    ...stableHeaders,
                },
            });
            if (!res.ok) {
                throw new Error('Failed to fetch dashboard data');
            }
            const data = await res.json();
            setStats(data.stats);
            setHealth(data.health);
            setLastRefresh(new Date());
        }
        catch (err) {
            // Ignore aborted requests
            if (err instanceof Error && err.name === 'AbortError')
                return;
            setError(err instanceof Error ? err.message : 'Unknown error');
        }
        finally {
            setIsLoading(false);
        }
    }, [endpoint, stableHeaders]);
    // AbortController ref for manual refresh
    const abortControllerRef = React.useRef(null);
    useEffect(() => {
        const controller = new AbortController();
        fetchData(controller.signal);
        let interval;
        if (refreshInterval > 0) {
            interval = setInterval(() => {
                // Cancel pending request before starting new one
                abortControllerRef.current?.abort();
                abortControllerRef.current = new AbortController();
                fetchData(abortControllerRef.current.signal);
            }, refreshInterval);
        }
        return () => {
            controller.abort();
            abortControllerRef.current?.abort();
            if (interval)
                clearInterval(interval);
        };
    }, [fetchData, refreshInterval]);
    const handleRefresh = () => {
        // Cancel any pending requests
        abortControllerRef.current?.abort();
        abortControllerRef.current = new AbortController();
        setIsLoading(true);
        fetchData(abortControllerRef.current.signal);
    };
    // Build ECharts option for documents by category
    const categoryChartOption = React.useMemo(() => {
        const categories = stats?.documents.byCategory || [];
        return {
            tooltip: {
                trigger: 'axis',
                axisPointer: { type: 'shadow' },
            },
            grid: {
                left: 8,
                right: 40,
                top: 8,
                bottom: 8,
                containLabel: true,
            },
            xAxis: {
                type: 'value',
                axisLabel: { show: false },
                splitLine: { show: false },
                axisLine: { show: false },
                axisTick: { show: false },
            },
            yAxis: {
                type: 'category',
                data: categories.map((c) => c.categoryName),
                axisLine: { show: false },
                axisTick: { show: false },
                inverse: true,
            },
            series: [
                {
                    type: 'bar',
                    data: categories.map((c) => ({
                        value: c.count,
                        itemStyle: { color: c.color },
                    })),
                    barWidth: 16,
                    label: {
                        show: true,
                        position: 'right',
                        formatter: '{c}',
                        color: 'inherit',
                    },
                },
            ],
        };
    }, [stats?.documents.byCategory]);
    // Derived value to avoid repeated parseFloat calls
    const storageMB = parseFloat(stats?.storage.estimatedMB || '0');
    return (_jsxs("div", { className: "rag-admin-dashboard", style: { '--rag-accent': accentColor }, children: [_jsxs("div", { className: "rag-admin-header", children: [_jsxs("div", { className: "rag-admin-header-info", children: [_jsx("div", { className: "rag-admin-header-icon", children: _jsx(BarChart3, { size: 20 }) }), _jsxs("div", { className: "rag-admin-header-text", children: [_jsx("h2", { className: "rag-admin-title", children: "Admin Dashboard" }), _jsxs("p", { className: "rag-admin-subtitle", children: ["Last updated: ", lastRefresh.toLocaleTimeString()] })] })] }), _jsxs("div", { className: "rag-admin-header-actions", children: [_jsx("button", { className: "rag-admin-settings-btn", onClick: () => setIsSettingsOpen(true), "aria-label": "Settings", children: _jsx(Settings, { size: 16 }) }), _jsxs("button", { className: "curator-btn curator-btn-ghost rag-admin-refresh-btn", onClick: handleRefresh, disabled: isLoading, style: { '--accent': accentColor }, children: [_jsx(RefreshCw, { size: 16, className: isLoading ? 'spin' : '' }), "Refresh"] })] })] }), _jsx(SettingsModal, { isOpen: isSettingsOpen, onClose: () => setIsSettingsOpen(false), onConfigured: handleRefresh, endpoint: endpoint, headers: headers }), error && _jsx(ErrorBanner, { error: error, onDismiss: () => setError(null) }), health && (_jsxs("div", { className: `rag-admin-health-banner rag-admin-health-${health.status}`, children: [React.createElement(HEALTH_STATUS_ICONS[health.status], { size: 18 }), _jsxs("span", { className: "rag-admin-health-text", children: ["System Status: ", _jsx("strong", { children: health.status.charAt(0).toUpperCase() + health.status.slice(1) })] }), _jsxs("span", { className: "rag-admin-health-responder", children: ["Default Responder: ", health.defaultResponder] })] })), _jsxs("div", { className: "rag-admin-stats-grid", children: [_jsx(StatChip, { icon: _jsx(FileText, { size: 20 }), value: stats?.documents.total || 0, label: "Documents", isLoading: isLoading }), _jsx(StatChip, { icon: _jsx(Layers, { size: 20 }), value: (stats?.chunks.total ?? 0).toLocaleString(), label: "Total Chunks", meta: `~${stats?.chunks.averagePerDocument || 0} per doc`, isLoading: isLoading }), _jsx(StatChip, { icon: _jsx(HardDrive, { size: 20 }), value: `${stats?.storage.estimatedMB || '0'} MB`, label: "Est. Storage", isLoading: isLoading }), _jsx(StatChip, { icon: _jsx(Activity, { size: 20 }), value: stats?.chunks.averagePerDocument || 0, label: "Avg Chunks/Doc", isLoading: isLoading })] }), _jsx(HudFrame, { title: "SYSTEM_LOAD", icon: _jsx(Activity, { size: 16 }), isLoading: isLoading, className: "rag-admin-panel", style: { marginBottom: '1.5rem' }, children: _jsxs("div", { style: { display: 'flex', flexDirection: 'column', gap: '1.25rem', padding: '0.5rem' }, children: [_jsx(PowerConduit, { value: stats?.chunks.total || 0, max: Math.max(stats?.chunks.total || 1, 10000), label: "MEMORY ALLOCATION", variant: "default" }), _jsx(PowerConduit, { value: stats?.documents.total || 0, max: Math.max(stats?.documents.total || 1, 100), label: "DOCUMENT CACHE", variant: stats?.documents.total && stats.documents.total > 50 ? 'warning' : 'default' }), _jsx(PowerConduit, { value: storageMB, max: 1024, label: "STORAGE USAGE", variant: storageMB > 800 ? 'critical' : storageMB > 500 ? 'warning' : 'default' })] }) }), _jsxs("div", { className: "rag-admin-content-grid", children: [_jsx(HudFrame, { title: "CATEGORY_INDEX", icon: _jsx(Database, { size: 16 }), isLoading: isLoading, className: "rag-admin-panel", children: _jsx("div", { className: "rag-admin-chart", children: _jsx(PanelContent, { isLoading: isLoading, isEmpty: (stats?.documents?.byCategory?.length ?? 0) === 0, skeleton: _jsx("div", { className: "rag-admin-chart-skeleton", children: Array.from({ length: SKELETON_COUNT }, (_, i) => (_jsx("div", { className: "rag-admin-chart-skeleton-bar" }, i))) }), emptyMessage: "No categories with documents", children: _jsx(SkinAwareChart, { option: categoryChartOption, style: { height: 220 } }) }) }) }), _jsx(HudFrame, { hideHeader: true, hideReticles: true, size: "compact", isLoading: isLoading, className: "rag-admin-panel", children: _jsx(TerminalReadout, { title: "SYSTEM_HEALTH.exe", services: serviceEntries, burnInText: "SYSTEM INITIALIZED // SECTOR 7G", isLoading: isLoading }) }), _jsx(HudFrame, { title: "UPLOAD_MANIFEST", icon: _jsx(Clock, { size: 16 }), isLoading: isLoading, className: "rag-admin-panel rag-admin-panel-wide", children: _jsx("div", { className: "rag-admin-recent-list", children: _jsx(PanelContent, { isLoading: isLoading, isEmpty: stats?.recentUploads.length === 0, skeleton: _jsx("div", { className: "rag-admin-recent-skeleton", children: Array.from({ length: 3 }, (_, i) => (_jsx("div", { className: "rag-admin-recent-skeleton-row" }, i))) }), emptyMessage: "No documents uploaded yet", children: stats?.recentUploads.map((doc) => (_jsxs("div", { className: "rag-admin-recent-item", children: [_jsx(FileText, { size: 16, className: "rag-admin-recent-icon" }), _jsxs("div", { className: "rag-admin-recent-info", children: [_jsx("span", { className: "rag-admin-recent-name", children: doc.documentName }), _jsxs("span", { className: "rag-admin-recent-meta", children: [doc.chunkCount, " chunks"] })] }), _jsx("span", { className: "rag-admin-recent-time", children: formatRelativeTime(doc.timestamp) })] }, doc.documentId))) }) }) })] })] }));
}
export default AdminDashboard;
//# sourceMappingURL=AdminDashboard.js.map