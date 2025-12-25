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
} from 'lucide-react';
import type { AdminStats, AdminHealth } from '../../types.js';

export interface AdminDashboardProps {
  /** Base API endpoint (default: /api/rag) */
  endpoint?: string;
  /** Accent color for charts and indicators */
  accentColor?: string;
  /** Auto-refresh interval in ms (0 to disable) */
  refreshInterval?: number;
}

/** Format bytes to human readable */
function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
}

/** Format timestamp to relative time */
function formatRelativeTime(timestamp: number): string {
  const now = Date.now();
  const diff = now - timestamp;
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return 'just now';
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  return `${days}d ago`;
}

export function AdminDashboard({
  endpoint = '/api/rag',
  accentColor = '#6366f1',
  refreshInterval = 30000,
}: AdminDashboardProps) {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [health, setHealth] = useState<AdminHealth | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date());

  const fetchData = useCallback(async () => {
    try {
      setError(null);
      const [statsRes, healthRes] = await Promise.all([
        fetch(`${endpoint}/admin/stats`),
        fetch(`${endpoint}/admin/health`),
      ]);

      if (!statsRes.ok || !healthRes.ok) {
        throw new Error('Failed to fetch dashboard data');
      }

      const [statsData, healthData] = await Promise.all([
        statsRes.json(),
        healthRes.json(),
      ]);

      setStats(statsData);
      setHealth(healthData);
      setLastRefresh(new Date());
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setIsLoading(false);
    }
  }, [endpoint]);

  useEffect(() => {
    fetchData();

    if (refreshInterval > 0) {
      const interval = setInterval(fetchData, refreshInterval);
      return () => clearInterval(interval);
    }
  }, [fetchData, refreshInterval]);

  const handleRefresh = () => {
    setIsLoading(true);
    fetchData();
  };

  // Calculate max count for chart scaling
  const maxCategoryCount = stats?.documents.byCategory.reduce(
    (max, cat) => Math.max(max, cat.count),
    0
  ) || 1;

  return (
    <div className="rag-admin-dashboard">
      {/* Header */}
      <div className="rag-admin-header">
        <div className="rag-admin-header-info">
          <div className="rag-admin-header-icon" style={{ borderColor: `${accentColor}40`, backgroundColor: `${accentColor}15` }}>
            <BarChart3 size={20} style={{ color: accentColor }} />
          </div>
          <div className="rag-admin-header-text">
            <h2 className="rag-admin-title">Admin Dashboard</h2>
            <p className="rag-admin-subtitle">
              Last updated: {lastRefresh.toLocaleTimeString()}
            </p>
          </div>
        </div>
        <button
          className="rag-admin-refresh-btn"
          onClick={handleRefresh}
          disabled={isLoading}
          style={{ '--accent': accentColor } as React.CSSProperties}
        >
          <RefreshCw size={16} className={isLoading ? 'spin' : ''} />
          Refresh
        </button>
      </div>

      {/* Error Banner */}
      {error && (
        <div className="rag-admin-error">
          <AlertCircle size={16} />
          {error}
          <button className="rag-admin-error-dismiss" onClick={() => setError(null)}>
            <XCircle size={14} />
          </button>
        </div>
      )}

      {/* Health Status Banner */}
      {health && (
        <div className={`rag-admin-health-banner rag-admin-health-${health.status}`}>
          {health.status === 'healthy' && <CheckCircle size={18} />}
          {health.status === 'degraded' && <AlertCircle size={18} />}
          {health.status === 'unhealthy' && <XCircle size={18} />}
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
        {/* Documents Card */}
        <div className="rag-admin-stat-card">
          <div className="rag-admin-stat-icon" style={{ backgroundColor: '#3b82f620', color: '#3b82f6' }}>
            <FileText size={20} />
          </div>
          <div className="rag-admin-stat-info">
            <span className="rag-admin-stat-value">
              {isLoading ? '-' : stats?.documents.total || 0}
            </span>
            <span className="rag-admin-stat-label">Documents</span>
          </div>
        </div>

        {/* Chunks Card */}
        <div className="rag-admin-stat-card">
          <div className="rag-admin-stat-icon" style={{ backgroundColor: '#10b98120', color: '#10b981' }}>
            <Layers size={20} />
          </div>
          <div className="rag-admin-stat-info">
            <span className="rag-admin-stat-value">
              {isLoading ? '-' : stats?.chunks.total.toLocaleString() || 0}
            </span>
            <span className="rag-admin-stat-label">Total Chunks</span>
          </div>
          <span className="rag-admin-stat-meta">
            ~{stats?.chunks.averagePerDocument || 0} per doc
          </span>
        </div>

        {/* Storage Card */}
        <div className="rag-admin-stat-card">
          <div className="rag-admin-stat-icon" style={{ backgroundColor: '#f59e0b20', color: '#f59e0b' }}>
            <HardDrive size={20} />
          </div>
          <div className="rag-admin-stat-info">
            <span className="rag-admin-stat-value">
              {isLoading ? '-' : stats?.storage.estimatedMB || '0'} MB
            </span>
            <span className="rag-admin-stat-label">Est. Storage</span>
          </div>
        </div>

        {/* Avg Chunks Card */}
        <div className="rag-admin-stat-card">
          <div className="rag-admin-stat-icon" style={{ backgroundColor: '#8b5cf620', color: '#8b5cf6' }}>
            <Activity size={20} />
          </div>
          <div className="rag-admin-stat-info">
            <span className="rag-admin-stat-value">
              {isLoading ? '-' : stats?.chunks.averagePerDocument || 0}
            </span>
            <span className="rag-admin-stat-label">Avg Chunks/Doc</span>
          </div>
        </div>
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
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="rag-admin-chart-skeleton-bar" />
                ))}
              </div>
            ) : stats?.documents.byCategory.length === 0 ? (
              <div className="rag-admin-chart-empty">
                No categories with documents
              </div>
            ) : (
              <div className="rag-admin-bar-chart">
                {stats?.documents.byCategory.map((cat) => (
                  <div key={cat.categoryId} className="rag-admin-bar-row">
                    <div className="rag-admin-bar-label">
                      <span
                        className="rag-admin-bar-color"
                        style={{ backgroundColor: cat.color }}
                      />
                      {cat.categoryName}
                    </div>
                    <div className="rag-admin-bar-container">
                      <div
                        className="rag-admin-bar-fill"
                        style={{
                          width: `${(cat.count / maxCategoryCount) * 100}%`,
                          backgroundColor: cat.color,
                        }}
                      />
                    </div>
                    <span className="rag-admin-bar-count">{cat.count}</span>
                  </div>
                ))}
              </div>
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
            {/* Database */}
            <div className="rag-admin-service-item">
              <div className="rag-admin-service-header">
                <Database size={16} />
                <span>Database (LanceDB)</span>
                <span className={`rag-admin-service-status rag-admin-service-${health?.services.database.status || 'down'}`}>
                  {health?.services.database.status === 'up' ? (
                    <CheckCircle size={14} />
                  ) : (
                    <XCircle size={14} />
                  )}
                  {health?.services.database.status || 'unknown'}
                </span>
              </div>
              {health?.services.database.status === 'up' && (
                <div className="rag-admin-service-meta">
                  {health.services.database.documentCount} docs, {health.services.database.chunkCount.toLocaleString()} chunks
                </div>
              )}
            </div>

            {/* Embeddings */}
            <div className="rag-admin-service-item">
              <div className="rag-admin-service-header">
                <Layers size={16} />
                <span>Embeddings</span>
                <span className={`rag-admin-service-status rag-admin-service-${health?.services.embeddings.status || 'down'}`}>
                  {health?.services.embeddings.status === 'up' ? (
                    <CheckCircle size={14} />
                  ) : (
                    <XCircle size={14} />
                  )}
                  {health?.services.embeddings.status || 'unknown'}
                </span>
              </div>
              <div className="rag-admin-service-meta">
                {health?.services.embeddings.provider || 'Not configured'}
              </div>
            </div>

            {/* Claude Responder */}
            <div className="rag-admin-service-item">
              <div className="rag-admin-service-header">
                <Activity size={16} />
                <span>Claude Code CLI</span>
                <span className={`rag-admin-service-status rag-admin-service-${health?.services.responders.claude.available ? 'up' : 'down'}`}>
                  {health?.services.responders.claude.available ? (
                    <CheckCircle size={14} />
                  ) : (
                    <XCircle size={14} />
                  )}
                  {health?.services.responders.claude.available ? 'available' : 'unavailable'}
                </span>
              </div>
            </div>

            {/* Gemini Responder */}
            <div className="rag-admin-service-item">
              <div className="rag-admin-service-header">
                <Activity size={16} />
                <span>Gemini API</span>
                <span className={`rag-admin-service-status rag-admin-service-${health?.services.responders.gemini.available ? 'up' : 'down'}`}>
                  {health?.services.responders.gemini.available ? (
                    <CheckCircle size={14} />
                  ) : (
                    <XCircle size={14} />
                  )}
                  {health?.services.responders.gemini.available ? 'configured' : 'not configured'}
                </span>
              </div>
            </div>
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
                {[1, 2, 3].map((i) => (
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
