/**
 * Admin Dashboard Component
 * Displays system statistics and health monitoring
 */

import React, { useState, useEffect, useCallback } from 'react';
import {
  BarChart3,
  Database,
  FileText,
  HardDrive,
  RefreshCw,
  CheckCircle,
  XCircle,
  AlertCircle,
  Clock,
  Layers,
  Cpu,
  Activity,
  Settings,
} from 'lucide-react';
import { SettingsModal } from '../settings/SettingsModal.js';
import { SkinAwareChart } from '../../charts/SkinAwareChart.js';
import { ErrorBanner } from '../shared/ErrorBanner.js';
import type { AdminStats, AdminHealth } from '../../types.js';
import { formatBytes, formatRelativeTime } from '../../utils/formatters.js';

export interface AdminDashboardProps {
  /** Base API endpoint (default: /api/rag) */
  endpoint?: string;
  /** Custom headers for API requests */
  headers?: Record<string, string>;
  /** Accent color for charts and indicators */
  accentColor?: string;
  /** Auto-refresh interval in ms (0 to disable) */
  refreshInterval?: number;
}

/** Health status icon lookup */
const HEALTH_STATUS_ICONS = {
  healthy: CheckCircle,
  degraded: AlertCircle,
  unhealthy: XCircle,
} as const;

/** Skeleton loader count */
const SKELETON_COUNT = 4;

/** Reusable stat card component */
interface StatCardProps {
  icon: React.ReactNode;
  iconBgColor: string;
  iconColor: string;
  value: string | number;
  label: string;
  meta?: string;
  isLoading?: boolean;
}

function StatCard({ icon, iconBgColor, iconColor, value, label, meta, isLoading }: StatCardProps) {
  return (
    <div className="rag-admin-stat-card">
      <div className="rag-admin-stat-icon" style={{ backgroundColor: iconBgColor, color: iconColor }}>
        {icon}
      </div>
      <div className="rag-admin-stat-info">
        <span className="rag-admin-stat-value">
          {isLoading ? '-' : value}
        </span>
        <span className="rag-admin-stat-label">{label}</span>
      </div>
      {meta && <span className="rag-admin-stat-meta">{meta}</span>}
    </div>
  );
}

/** Reusable service status item component */
interface ServiceStatusItemProps {
  icon: React.ReactNode;
  label: string;
  isUp: boolean;
  statusText: string;
  meta?: string;
}

function ServiceStatusItem({ icon, label, isUp, statusText, meta }: ServiceStatusItemProps) {
  return (
    <div className="rag-admin-service-item">
      <div className="rag-admin-service-header">
        {icon}
        <span>{label}</span>
        <span className={`rag-admin-service-status rag-admin-service-${isUp ? 'up' : 'down'}`}>
          {isUp ? <CheckCircle size={14} /> : <XCircle size={14} />}
          {statusText}
        </span>
      </div>
      {meta && <div className="rag-admin-service-meta">{meta}</div>}
    </div>
  );
}

export function AdminDashboard({
  endpoint = '/api/rag',
  headers = {},
  accentColor = '#6366f1',
  refreshInterval = 30000,
}: AdminDashboardProps) {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [health, setHealth] = useState<AdminHealth | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date());
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Stabilize headers to prevent infinite rerenders from inline objects
  const headersJson = JSON.stringify(headers);
  const stableHeaders = React.useMemo(() => headers, [headersJson]);

  const fetchData = useCallback(async (signal?: AbortSignal) => {
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
    } catch (err) {
      // Ignore aborted requests
      if (err instanceof Error && err.name === 'AbortError') return;
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setIsLoading(false);
    }
  }, [endpoint, stableHeaders]);

  // AbortController ref for manual refresh
  const abortControllerRef = React.useRef<AbortController | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    fetchData(controller.signal);

    let interval: ReturnType<typeof setInterval> | undefined;
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
      if (interval) clearInterval(interval);
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

  return (
    <div className="rag-admin-dashboard" style={{ '--rag-accent': accentColor } as React.CSSProperties}>
      {/* Header */}
      <div className="rag-admin-header">
        <div className="rag-admin-header-info">
          <div className="rag-admin-header-icon">
            <BarChart3 size={20} />
          </div>
          <div className="rag-admin-header-text">
            <h2 className="rag-admin-title">Admin Dashboard</h2>
            <p className="rag-admin-subtitle">
              Last updated: {lastRefresh.toLocaleTimeString()}
            </p>
          </div>
        </div>
        <div className="rag-admin-header-actions">
          <button
            className="rag-admin-settings-btn"
            onClick={() => setIsSettingsOpen(true)}
            aria-label="Settings"
          >
            <Settings size={16} />
          </button>
          <button
            className="curator-btn curator-btn-ghost rag-admin-refresh-btn"
            onClick={handleRefresh}
            disabled={isLoading}
            style={{ '--accent': accentColor } as React.CSSProperties}
          >
            <RefreshCw size={16} className={isLoading ? 'spin' : ''} />
            Refresh
          </button>
        </div>
      </div>

      {/* Settings Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        onConfigured={handleRefresh}
        endpoint={endpoint}
        headers={headers}
      />

      {/* Error Banner */}
      {error && <ErrorBanner error={error} onDismiss={() => setError(null)} />}

      {/* Health Status Banner */}
      {health && (
        <div className={`rag-admin-health-banner rag-admin-health-${health.status}`}>
          {React.createElement(HEALTH_STATUS_ICONS[health.status], { size: 18 })}
          <span className="rag-admin-health-text">
            System Status: <strong>{health.status.charAt(0).toUpperCase() + health.status.slice(1)}</strong>
          </span>
          <span className="rag-admin-health-responder">
            Default Responder: {health.defaultResponder}
          </span>
        </div>
      )}

      {/* Stats Cards */}
      <div className="rag-admin-stats-grid">
        <StatCard
          icon={<FileText size={20} />}
          iconBgColor="#3b82f620"
          iconColor="#3b82f6"
          value={stats?.documents.total || 0}
          label="Documents"
          isLoading={isLoading}
        />
        <StatCard
          icon={<Layers size={20} />}
          iconBgColor="#10b98120"
          iconColor="#10b981"
          value={(stats?.chunks.total ?? 0).toLocaleString()}
          label="Total Chunks"
          meta={`~${stats?.chunks.averagePerDocument || 0} per doc`}
          isLoading={isLoading}
        />
        <StatCard
          icon={<HardDrive size={20} />}
          iconBgColor="#f59e0b20"
          iconColor="#f59e0b"
          value={`${stats?.storage.estimatedMB || '0'} MB`}
          label="Est. Storage"
          isLoading={isLoading}
        />
        <StatCard
          icon={<Activity size={20} />}
          iconBgColor="#8b5cf620"
          iconColor="#8b5cf6"
          value={stats?.chunks.averagePerDocument || 0}
          label="Avg Chunks/Doc"
          isLoading={isLoading}
        />
      </div>

      {/* Main Content Grid */}
      <div className="rag-admin-content-grid">
        {/* Documents by Category */}
        <div className="rag-admin-panel">
          <h3 className="rag-admin-panel-title">
            <Database size={16} />
            Documents by Category
          </h3>
          <div className="rag-admin-chart">
            {isLoading ? (
              <div className="rag-admin-chart-skeleton">
                {Array.from({ length: SKELETON_COUNT }, (_, i) => (
                  <div key={i} className="rag-admin-chart-skeleton-bar" />
                ))}
              </div>
            ) : (stats?.documents?.byCategory?.length ?? 0) === 0 ? (
              <div className="rag-admin-chart-empty">
                No categories with documents
              </div>
            ) : (
              <SkinAwareChart
                option={categoryChartOption}
                style={{ height: 220 }}
              />
            )}
          </div>
        </div>

        {/* Service Health */}
        <div className="rag-admin-panel">
          <h3 className="rag-admin-panel-title">
            <Cpu size={16} />
            Service Health
          </h3>
          <div className="rag-admin-services">
            <ServiceStatusItem
              icon={<Database size={16} />}
              label="Database (LanceDB)"
              isUp={health?.services.database.status === 'up'}
              statusText={health?.services.database.status || 'unknown'}
              meta={health?.services.database.status === 'up'
                ? `${health.services.database.documentCount} docs, ${health.services.database.chunkCount.toLocaleString()} chunks`
                : undefined}
            />
            <ServiceStatusItem
              icon={<Layers size={16} />}
              label="Embeddings"
              isUp={health?.services.embeddings.status === 'up'}
              statusText={health?.services.embeddings.status || 'unknown'}
              meta={health?.services.embeddings.provider || 'Not configured'}
            />
            <ServiceStatusItem
              icon={<Activity size={16} />}
              label="Claude Code CLI"
              isUp={health?.services.responders.claude.available ?? false}
              statusText={health?.services.responders.claude.available ? 'available' : 'unavailable'}
            />
            <ServiceStatusItem
              icon={<Activity size={16} />}
              label="Gemini API"
              isUp={health?.services.responders.gemini.available ?? false}
              statusText={health?.services.responders.gemini.available ? 'configured' : 'not configured'}
            />
          </div>
        </div>

        {/* Recent Uploads */}
        <div className="rag-admin-panel rag-admin-panel-wide">
          <h3 className="rag-admin-panel-title">
            <Clock size={16} />
            Recent Uploads
          </h3>
          <div className="rag-admin-recent-list">
            {isLoading ? (
              <div className="rag-admin-recent-skeleton">
                {Array.from({ length: 3 }, (_, i) => (
                  <div key={i} className="rag-admin-recent-skeleton-row" />
                ))}
              </div>
            ) : stats?.recentUploads.length === 0 ? (
              <div className="rag-admin-recent-empty">
                No documents uploaded yet
              </div>
            ) : (
              stats?.recentUploads.map((doc) => (
                <div key={doc.documentId} className="rag-admin-recent-item">
                  <FileText size={16} className="rag-admin-recent-icon" />
                  <div className="rag-admin-recent-info">
                    <span className="rag-admin-recent-name">{doc.documentName}</span>
                    <span className="rag-admin-recent-meta">
                      {doc.chunkCount} chunks
                    </span>
                  </div>
                  <span className="rag-admin-recent-time">
                    {formatRelativeTime(doc.timestamp)}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
