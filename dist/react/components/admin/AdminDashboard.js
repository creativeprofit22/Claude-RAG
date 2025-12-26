import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
/**
 * Admin Dashboard Component
 * Displays system statistics and health monitoring
 */
import React, { useState, useEffect, useCallback } from 'react';
import { BarChart3, Database, FileText, HardDrive, RefreshCw, CheckCircle, XCircle, AlertCircle, Clock, Layers, Cpu, Activity, Settings, } from 'lucide-react';
import { SettingsModal } from '../settings/SettingsModal.js';
import { formatRelativeTime } from '../../utils/formatters.js';
/** Health status icon lookup */
const HEALTH_STATUS_ICONS = {
    healthy: CheckCircle,
    degraded: AlertCircle,
    unhealthy: XCircle,
};
/** Skeleton loader count */
const SKELETON_COUNT = 4;
function StatCard({ icon, iconBgColor, iconColor, value, label, meta, isLoading }) {
    return (_jsxs("div", { className: "rag-admin-stat-card", children: [_jsx("div", { className: "rag-admin-stat-icon", style: { backgroundColor: iconBgColor, color: iconColor }, children: icon }), _jsxs("div", { className: "rag-admin-stat-info", children: [_jsx("span", { className: "rag-admin-stat-value", children: isLoading ? '-' : value }), _jsx("span", { className: "rag-admin-stat-label", children: label })] }), meta && _jsx("span", { className: "rag-admin-stat-meta", children: meta })] }));
}
function ServiceStatusItem({ icon, label, isUp, statusText, meta }) {
    return (_jsxs("div", { className: "rag-admin-service-item", children: [_jsxs("div", { className: "rag-admin-service-header", children: [icon, _jsx("span", { children: label }), _jsxs("span", { className: `rag-admin-service-status rag-admin-service-${isUp ? 'up' : 'down'}`, children: [isUp ? _jsx(CheckCircle, { size: 14 }) : _jsx(XCircle, { size: 14 }), statusText] })] }), meta && _jsx("div", { className: "rag-admin-service-meta", children: meta })] }));
}
export function AdminDashboard({ endpoint = '/api/rag', headers = {}, accentColor = '#6366f1', refreshInterval = 30000, }) {
    const [stats, setStats] = useState(null);
    const [health, setHealth] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [lastRefresh, setLastRefresh] = useState(new Date());
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const fetchData = useCallback(async (signal) => {
        try {
            setError(null);
            const res = await fetch(`${endpoint}/admin/dashboard`, { signal });
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
    }, [endpoint]);
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
    // Calculate max count for chart scaling
    const maxCategoryCount = stats?.documents.byCategory.reduce((max, cat) => Math.max(max, cat.count), 0) || 1;
    return (_jsxs("div", { className: "rag-admin-dashboard", style: { '--rag-accent': accentColor }, children: [_jsxs("div", { className: "rag-admin-header", children: [_jsxs("div", { className: "rag-admin-header-info", children: [_jsx("div", { className: "rag-admin-header-icon", children: _jsx(BarChart3, { size: 20 }) }), _jsxs("div", { className: "rag-admin-header-text", children: [_jsx("h2", { className: "rag-admin-title", children: "Admin Dashboard" }), _jsxs("p", { className: "rag-admin-subtitle", children: ["Last updated: ", lastRefresh.toLocaleTimeString()] })] })] }), _jsxs("div", { className: "rag-admin-header-actions", children: [_jsx("button", { className: "rag-admin-settings-btn", onClick: () => setIsSettingsOpen(true), "aria-label": "Settings", children: _jsx(Settings, { size: 16 }) }), _jsxs("button", { className: "rag-admin-refresh-btn", onClick: handleRefresh, disabled: isLoading, style: { '--accent': accentColor }, children: [_jsx(RefreshCw, { size: 16, className: isLoading ? 'spin' : '' }), "Refresh"] })] })] }), _jsx(SettingsModal, { isOpen: isSettingsOpen, onClose: () => setIsSettingsOpen(false), onConfigured: handleRefresh, endpoint: endpoint, headers: headers }), error && (_jsxs("div", { className: "rag-admin-error", children: [_jsx(AlertCircle, { size: 16 }), error, _jsx("button", { className: "rag-admin-error-dismiss", onClick: () => setError(null), children: _jsx(XCircle, { size: 14 }) })] })), health && (_jsxs("div", { className: `rag-admin-health-banner rag-admin-health-${health.status}`, children: [React.createElement(HEALTH_STATUS_ICONS[health.status], { size: 18 }), _jsxs("span", { className: "rag-admin-health-text", children: ["System Status: ", _jsx("strong", { children: health.status.charAt(0).toUpperCase() + health.status.slice(1) })] }), _jsxs("span", { className: "rag-admin-health-responder", children: ["Default Responder: ", health.defaultResponder] })] })), _jsxs("div", { className: "rag-admin-stats-grid", children: [_jsx(StatCard, { icon: _jsx(FileText, { size: 20 }), iconBgColor: "#3b82f620", iconColor: "#3b82f6", value: stats?.documents.total || 0, label: "Documents", isLoading: isLoading }), _jsx(StatCard, { icon: _jsx(Layers, { size: 20 }), iconBgColor: "#10b98120", iconColor: "#10b981", value: (stats?.chunks.total ?? 0).toLocaleString(), label: "Total Chunks", meta: `~${stats?.chunks.averagePerDocument || 0} per doc`, isLoading: isLoading }), _jsx(StatCard, { icon: _jsx(HardDrive, { size: 20 }), iconBgColor: "#f59e0b20", iconColor: "#f59e0b", value: `${stats?.storage.estimatedMB || '0'} MB`, label: "Est. Storage", isLoading: isLoading }), _jsx(StatCard, { icon: _jsx(Activity, { size: 20 }), iconBgColor: "#8b5cf620", iconColor: "#8b5cf6", value: stats?.chunks.averagePerDocument || 0, label: "Avg Chunks/Doc", isLoading: isLoading })] }), _jsxs("div", { className: "rag-admin-content-grid", children: [_jsxs("div", { className: "rag-admin-panel", children: [_jsxs("h3", { className: "rag-admin-panel-title", children: [_jsx(Database, { size: 16 }), "Documents by Category"] }), _jsx("div", { className: "rag-admin-chart", children: isLoading ? (_jsx("div", { className: "rag-admin-chart-skeleton", children: Array.from({ length: SKELETON_COUNT }, (_, i) => (_jsx("div", { className: "rag-admin-chart-skeleton-bar" }, i))) })) : stats?.documents.byCategory.length === 0 ? (_jsx("div", { className: "rag-admin-chart-empty", children: "No categories with documents" })) : (_jsx("div", { className: "rag-admin-bar-chart", children: stats?.documents.byCategory.map((cat) => (_jsxs("div", { className: "rag-admin-bar-row", children: [_jsxs("div", { className: "rag-admin-bar-label", children: [_jsx("span", { className: "rag-admin-bar-color", style: { backgroundColor: cat.color } }), cat.categoryName] }), _jsx("div", { className: "rag-admin-bar-container", children: _jsx("div", { className: "rag-admin-bar-fill", style: {
                                                        width: `${(cat.count / maxCategoryCount) * 100}%`,
                                                        backgroundColor: cat.color,
                                                    } }) }), _jsx("span", { className: "rag-admin-bar-count", children: cat.count })] }, cat.categoryId))) })) })] }), _jsxs("div", { className: "rag-admin-panel", children: [_jsxs("h3", { className: "rag-admin-panel-title", children: [_jsx(Cpu, { size: 16 }), "Service Health"] }), _jsxs("div", { className: "rag-admin-services", children: [_jsx(ServiceStatusItem, { icon: _jsx(Database, { size: 16 }), label: "Database (LanceDB)", isUp: health?.services.database.status === 'up', statusText: health?.services.database.status || 'unknown', meta: health?.services.database.status === 'up'
                                            ? `${health.services.database.documentCount} docs, ${health.services.database.chunkCount.toLocaleString()} chunks`
                                            : undefined }), _jsx(ServiceStatusItem, { icon: _jsx(Layers, { size: 16 }), label: "Embeddings", isUp: health?.services.embeddings.status === 'up', statusText: health?.services.embeddings.status || 'unknown', meta: health?.services.embeddings.provider || 'Not configured' }), _jsx(ServiceStatusItem, { icon: _jsx(Activity, { size: 16 }), label: "Claude Code CLI", isUp: health?.services.responders.claude.available ?? false, statusText: health?.services.responders.claude.available ? 'available' : 'unavailable' }), _jsx(ServiceStatusItem, { icon: _jsx(Activity, { size: 16 }), label: "Gemini API", isUp: health?.services.responders.gemini.available ?? false, statusText: health?.services.responders.gemini.available ? 'configured' : 'not configured' })] })] }), _jsxs("div", { className: "rag-admin-panel rag-admin-panel-wide", children: [_jsxs("h3", { className: "rag-admin-panel-title", children: [_jsx(Clock, { size: 16 }), "Recent Uploads"] }), _jsx("div", { className: "rag-admin-recent-list", children: isLoading ? (_jsx("div", { className: "rag-admin-recent-skeleton", children: Array.from({ length: 3 }, (_, i) => (_jsx("div", { className: "rag-admin-recent-skeleton-row" }, i))) })) : stats?.recentUploads.length === 0 ? (_jsx("div", { className: "rag-admin-recent-empty", children: "No documents uploaded yet" })) : (stats?.recentUploads.map((doc) => (_jsxs("div", { className: "rag-admin-recent-item", children: [_jsx(FileText, { size: 16, className: "rag-admin-recent-icon" }), _jsxs("div", { className: "rag-admin-recent-info", children: [_jsx("span", { className: "rag-admin-recent-name", children: doc.documentName }), _jsxs("span", { className: "rag-admin-recent-meta", children: [doc.chunkCount, " chunks"] })] }), _jsx("span", { className: "rag-admin-recent-time", children: formatRelativeTime(doc.timestamp) })] }, doc.documentId)))) })] })] })] }));
}
export default AdminDashboard;
//# sourceMappingURL=AdminDashboard.js.map