/**
 * Admin Dashboard Component
 * Displays system statistics and health monitoring
 */
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
export declare function AdminDashboard({ endpoint, headers, accentColor, refreshInterval, }: AdminDashboardProps): import("react/jsx-runtime").JSX.Element;
export default AdminDashboard;
//# sourceMappingURL=AdminDashboard.d.ts.map