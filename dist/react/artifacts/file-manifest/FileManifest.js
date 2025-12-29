import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
/**
 * FileManifest Artifact Component
 * A corrupted thermal printer receipt with physical wear and data degradation
 *
 * Design: "Corrupted Data Terminal Printout"
 * - Tapered/angled top edge (torn from printer)
 * - Perforated tear line at bottom
 * - Feed holes on left side (dot matrix printer paper)
 * - Physical wear/aging effects
 * - Two-row entry layout: filename + time, then metadata
 */
import { useMemo } from 'react';
import './file-manifest.base.css';
import './file-manifest.cyberpunk.css';
/**
 * Seeded random number generator (Linear Congruential Generator)
 * Provides deterministic "random" values for consistent corruption patterns
 */
function seededRandom(seed) {
    let state = seed;
    return () => {
        state = (state * 1103515245 + 12345) & 0x7fffffff;
        return state / 0x7fffffff;
    };
}
/**
 * Corrupt text by replacing random characters with block characters
 */
function corruptText(text, intensity, seed) {
    if (intensity <= 0)
        return text;
    const rng = seededRandom(seed);
    return text
        .split('')
        .map((char) => (rng() < intensity ? '\u2588' : char))
        .join('');
}
/**
 * Generate a tapered/torn top edge clip-path for the printout
 */
function generateTornTopEdge(seed) {
    const rng = seededRandom(seed);
    const points = [];
    // Tapered/torn top edge - starts slightly indented, jagged across
    points.push('2% 3%'); // Start slightly in from left, down from top
    // Create jagged tear across top
    const topSteps = 8;
    for (let i = 1; i <= topSteps; i++) {
        const x = 2 + (i / topSteps) * 96; // 2% to 98%
        const y = rng() * 4; // 0-4% variation
        points.push(`${x}% ${y}%`);
    }
    // Right side straight down
    points.push('100% 0%');
    points.push('100% 100%');
    // Bottom with perforation hint
    points.push('0% 100%');
    // Left side back up
    points.push('0% 3%');
    return `polygon(${points.join(', ')})`;
}
/**
 * Format timestamp to HH:MM format
 */
function formatTime(timestamp) {
    const date = new Date(timestamp);
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
}
/**
 * Truncate filename intelligently, keeping extension visible
 */
function truncateFilename(name, maxLen = 24) {
    if (name.length <= maxLen)
        return name;
    const lastDot = name.lastIndexOf('.');
    if (lastDot > 0 && name.length - lastDot <= 5) {
        // Has extension, preserve it
        const ext = name.slice(lastDot);
        const baseName = name.slice(0, lastDot);
        const availableLen = maxLen - ext.length - 1; // -1 for ellipsis
        return baseName.slice(0, availableLen) + '\u2026' + ext;
    }
    return name.slice(0, maxLen - 1) + '\u2026';
}
export function FileManifest({ files, sectorLabel = 'SECTOR 7G', corruptionLevel = 0, isLoading = false, className = '', }) {
    const corruptionIntensity = Math.min(100, Math.max(0, corruptionLevel)) / 100;
    // Generate torn top edge
    const tornEdge = useMemo(() => generateTornTopEdge(42), []);
    // Determine which entries are corrupted (compute intensity inside to avoid stale closure)
    const corruptedIndices = useMemo(() => {
        if (corruptionLevel <= 0)
            return new Set();
        const intensity = Math.min(100, Math.max(0, corruptionLevel)) / 100;
        const rng = seededRandom(corruptionLevel);
        const indices = new Set();
        files.forEach((_, index) => {
            if (rng() < intensity * 0.8) {
                indices.add(index);
            }
        });
        return indices;
    }, [files, corruptionLevel]);
    // Generate feed hole positions (left edge sprocket holes)
    const feedHoles = useMemo(() => {
        const count = Math.max(4, Math.min(12, files.length * 2 + 4));
        return Array.from({ length: count }, (_, i) => i);
    }, [files.length]);
    return (_jsx("article", { className: [
            'file-manifest',
            'file-manifest--printout',
            isLoading && 'file-manifest--loading',
            className,
        ].filter(Boolean).join(' '), "aria-label": "File Manifest", "aria-busy": isLoading, children: _jsxs("div", { className: "file-manifest__printout", style: { '--torn-edge': tornEdge }, children: [_jsx("div", { className: "file-manifest__feed-holes", "aria-hidden": "true", children: feedHoles.map((i) => (_jsx("div", { className: "file-manifest__feed-hole", style: { '--hole-index': i } }, i))) }), _jsxs("div", { className: "file-manifest__paper", children: [_jsxs("header", { className: "file-manifest__header", children: [_jsxs("div", { className: "file-manifest__header-row", children: [_jsx("span", { className: "file-manifest__title", children: corruptText('FILE_MANIFEST', corruptionIntensity * 0.2, 11) }), _jsx("span", { className: "file-manifest__sector", "aria-label": "Sector", children: corruptText(sectorLabel, corruptionIntensity * 0.3, 42) })] }), _jsx("div", { className: "file-manifest__header-divider", "aria-hidden": "true", children: corruptText('================================', corruptionIntensity * 0.15, 99) }), _jsxs("div", { className: "file-manifest__integrity", children: ["DATA INTEGRITY: ", Math.max(0, 100 - corruptionLevel), "%"] })] }), _jsxs("div", { className: "file-manifest__entries", role: "list", children: [files.map((file, index) => {
                                    const isCorrupted = corruptedIndices.has(index);
                                    const entryIntensity = isCorrupted ? corruptionIntensity : 0;
                                    const entrySeed = index * 777 + file.timestamp;
                                    const displayName = truncateFilename(file.documentName);
                                    const timeStr = formatTime(file.timestamp);
                                    const chunkStr = `${file.chunkCount} chunks`;
                                    return (_jsxs("div", { className: `file-manifest__entry ${isCorrupted ? 'file-manifest__entry--corrupted' : ''}`, role: "listitem", style: { '--entry-delay': `${index * 0.05}s` }, children: [_jsxs("div", { className: "file-manifest__entry-row file-manifest__entry-row--primary", children: [_jsx("span", { className: `file-manifest__entry-status ${isCorrupted ? 'file-manifest__entry-status--error' : ''}`, "aria-label": isCorrupted ? 'Corrupted' : 'Healthy', children: isCorrupted ? '\u2588' : '\u25CF' }), _jsx("span", { className: "file-manifest__entry-name", title: file.documentName, children: corruptText(displayName, entryIntensity * 0.5, entrySeed) }), _jsx("span", { className: "file-manifest__entry-time", children: corruptText(timeStr, entryIntensity * 0.6, entrySeed + 1) })] }), _jsxs("div", { className: "file-manifest__entry-row file-manifest__entry-row--secondary", children: [_jsx("span", { className: "file-manifest__entry-indent", "aria-hidden": "true", children: '\u2514\u2500' }), _jsx("span", { className: "file-manifest__entry-meta", children: isCorrupted && entryIntensity > 0.5
                                                            ? _jsx("span", { className: "file-manifest__error-text", children: "ERR" })
                                                            : corruptText(chunkStr, entryIntensity * 0.4, entrySeed + 2) })] })] }, file.documentId));
                                }), files.length === 0 && !isLoading && (_jsxs("div", { className: "file-manifest__empty", children: [_jsx("span", { className: "file-manifest__empty-icon", children: "[!]" }), _jsx("span", { children: "NO FILES IN MANIFEST" })] })), isLoading && files.length === 0 && (_jsx(_Fragment, { children: Array.from({ length: 3 }, (_, i) => (_jsxs("div", { className: "file-manifest__entry file-manifest__entry--skeleton", children: [_jsxs("div", { className: "file-manifest__entry-row file-manifest__entry-row--primary", children: [_jsx("span", { className: "file-manifest__entry-status", children: '\u25CB' }), _jsx("span", { className: "file-manifest__entry-name", children: "SCANNING..." }), _jsx("span", { className: "file-manifest__entry-time", children: "--:--" })] }), _jsxs("div", { className: "file-manifest__entry-row file-manifest__entry-row--secondary", children: [_jsx("span", { className: "file-manifest__entry-indent", children: '\u2514\u2500' }), _jsx("span", { className: "file-manifest__entry-meta", children: "- chunks" })] })] }, i))) }))] }), _jsx("div", { className: "file-manifest__footer-divider", "aria-hidden": "true", children: corruptText('--------------------------------', corruptionIntensity * 0.2, 88) }), _jsxs("footer", { className: "file-manifest__footer", children: [_jsxs("div", { className: "file-manifest__stats", children: [_jsxs("span", { className: "file-manifest__stat", children: ["TOTAL: ", files.length] }), _jsx("span", { className: "file-manifest__stat file-manifest__stat--warn", children: corruptedIndices.size > 0 && `ERR: ${corruptedIndices.size}` })] }), corruptionLevel > 0 && (_jsx("div", { className: "file-manifest__corruption-bar", role: "meter", "aria-valuenow": corruptionLevel, "aria-valuemin": 0, "aria-valuemax": 100, "aria-label": "Data corruption level", children: _jsx("div", { className: "file-manifest__corruption-fill", style: { '--corruption-percent': `${corruptionLevel}%` } }) }))] })] }), _jsx("div", { className: "file-manifest__perforation", "aria-hidden": "true", children: _jsx("div", { className: "file-manifest__perforation-line" }) }), _jsx("div", { className: "file-manifest__scanlines", "aria-hidden": "true" }), corruptionLevel > 50 && (_jsx("div", { className: "file-manifest__glitch", "aria-hidden": "true" }))] }) }));
}
export default FileManifest;
//# sourceMappingURL=FileManifest.js.map