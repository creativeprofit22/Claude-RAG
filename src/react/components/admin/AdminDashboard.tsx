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
  Activity,
  Settings,
} from 'lucide-react';
import { SettingsModal } from '../settings/SettingsModal.js';
import { SkinAwareChart } from '../../charts/SkinAwareChart.js';
import { ErrorBanner } from '../shared/ErrorBanner.js';
import { StatChip } from '../../artifacts/stat-chip/StatChip.js';
import { TerminalReadout, type ServiceEntry, type ServiceStatus } from '../../artifacts/terminal-readout/TerminalReadout.js';
import { HudFrame } from '../../artifacts/hud-frame/HudFrame.js';
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

/** Conditional panel content - handles loading/empty/content states */
interface PanelContentProps {
  isLoading: boolean;
  isEmpty: boolean;
  skeleton: React.ReactNode;
  emptyMessage: string;
  children: React.ReactNode;
}

function PanelContent({ isLoading, isEmpty, skeleton, emptyMessage, children }: PanelContentProps) {
  if (isLoading) return <>{skeleton}</>;
  if (isEmpty) return <div className="rag-admin-chart-empty">{emptyMessage}</div>;
  return <>{children}</>;
}

/** Convert health data to ServiceEntry format with defensive null checks */
function buildServiceEntries(health: AdminHealth | null): ServiceEntry[] {
  // Defensive null checks for nested properties - API may return partial data
  if (!health?.services?.database || !health?.services?.embeddings || !health?.services?.responders) {
    return [];
  }

  const getStatus = (isUp: boolean, isDegraded?: boolean): ServiceStatus => {
    if (isDegraded) return 'degraded';
    return isUp ? 'up' : 'down';
  };

  const db = health.services.database;
  const embed = health.services.embeddings;
  const claude = health.services.responders.claude;
  const gemini = health.services.responders.gemini;

  return [
    {
      icon: <Database size={16} />,
      label: 'DATABASE',
      status: getStatus(db.status === 'up'),
      statusText: db.status === 'up' ? `${db.documentCount} docs` : db.status,
    },
    {
      icon: <Layers size={16} />,
      label: 'EMBEDDINGS',
      status: getStatus(embed.status === 'up'),
      statusText: embed.provider || 'N/A',
    },
    {
      icon: <Activity size={16} />,
      label: 'CLAUDE CLI',
      status: getStatus(claude?.available ?? false),
      statusText: claude?.available ? 'OK' : 'N/A',
    },
    {
      icon: <Activity size={16} />,
      label: 'GEMINI API',
      status: getStatus(gemini?.available ?? false),
      statusText: gemini?.available ? 'OK' : 'N/A',
    },
  ];
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

  // Memoize service entries to prevent unnecessary TerminalReadout re-renders
  const serviceEntries = React.useMemo(() => buildServiceEntries(health), [health]);

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

      {/* Stats Cards - Cyberpunk: Holographic Data Chips */}
      <div className="rag-admin-stats-grid">
        <StatChip
          icon={<FileText size={20} />}
          value={stats?.documents.total || 0}
          label="Documents"
          isLoading={isLoading}
        />
        <StatChip
          icon={<Layers size={20} />}
          value={(stats?.chunks.total ?? 0).toLocaleString()}
          label="Total Chunks"
          meta={`~${stats?.chunks.averagePerDocument || 0} per doc`}
          isLoading={isLoading}
        />
        <StatChip
          icon={<HardDrive size={20} />}
          value={`${stats?.storage.estimatedMB || '0'} MB`}
          label="Est. Storage"
          isLoading={isLoading}
        />
        <StatChip
          icon={<Activity size={20} />}
          value={stats?.chunks.averagePerDocument || 0}
          label="Avg Chunks/Doc"
          isLoading={isLoading}
        />
      </div>

      {/* Main Content Grid */}
      <div className="rag-admin-content-grid">
        {/* Documents by Category - Wrapped in HUD Frame */}
        <HudFrame
          title="CATEGORY_INDEX"
          icon={<Database size={16} />}
          isLoading={isLoading}
          className="rag-admin-panel"
        >
          <div className="rag-admin-chart">
            <PanelContent
              isLoading={isLoading}
              isEmpty={(stats?.documents?.byCategory?.length ?? 0) === 0}
              skeleton={
                <div className="rag-admin-chart-skeleton">
                  {Array.from({ length: SKELETON_COUNT }, (_, i) => (
                    <div key={i} className="rag-admin-chart-skeleton-bar" />
                  ))}
                </div>
              }
              emptyMessage="No categories with documents"
            >
              <SkinAwareChart
                option={categoryChartOption}
                style={{ height: 220 }}
              />
            </PanelContent>
          </div>
        </HudFrame>

        {/* Service Health - Cyberpunk: Busted Terminal Readout */}
        <HudFrame
          hideHeader
          hideReticles
          size="compact"
          isLoading={isLoading}
          className="rag-admin-panel"
        >
          <TerminalReadout
            title="SYSTEM_HEALTH.exe"
            services={serviceEntries}
            burnInText="SYSTEM INITIALIZED // SECTOR 7G"
            isLoading={isLoading}
          />
        </HudFrame>

        {/* Recent Uploads - Wrapped in HUD Frame */}
        <HudFrame
          title="UPLOAD_MANIFEST"
          icon={<Clock size={16} />}
          isLoading={isLoading}
          className="rag-admin-panel rag-admin-panel-wide"
        >
          <div className="rag-admin-recent-list">
            <PanelContent
              isLoading={isLoading}
              isEmpty={stats?.recentUploads.length === 0}
              skeleton={
                <div className="rag-admin-recent-skeleton">
                  {Array.from({ length: 3 }, (_, i) => (
                    <div key={i} className="rag-admin-recent-skeleton-row" />
                  ))}
                </div>
              }
              emptyMessage="No documents uploaded yet"
            >
              {stats?.recentUploads.map((doc) => (
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
              ))}
            </PanelContent>
          </div>
        </HudFrame>
      </div>
    </div>
  );
}

export default AdminDashboard;
