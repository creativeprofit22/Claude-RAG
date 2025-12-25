/**
 * Utility functions for formatting values
 */

/** Format bytes to human readable */
export function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
}

/** Format timestamp to relative time */
export function formatRelativeTime(timestamp: number): string {
  // Validate timestamp
  if (!timestamp || timestamp <= 0 || !Number.isFinite(timestamp)) {
    return 'unknown';
  }

  const now = Date.now();
  const diff = now - timestamp;

  // Handle future timestamps or invalid diffs
  if (diff < 0) return 'just now';

  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return 'just now';
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  return `${days}d ago`;
}
