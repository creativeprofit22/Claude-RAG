/**
 * CyberpunkTerminal - Main 3D holographic chat terminal
 *
 * Combines the 3D scene with HTML overlay for the actual chat interface.
 * Damaged Night City corpo terminal aesthetic.
 */
'use client';
import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { Suspense, useRef, useMemo, useEffect, useState, memo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { PerspectiveCamera } from '@react-three/drei';
import * as THREE from 'three';
import { HolographicPanel } from './HolographicPanel.js';
import { CyberpunkEffects } from './CyberpunkEffects.js';
import { CYBERPUNK_COLORS } from './shaders.js';
export function CyberpunkTerminal({ children, width = 4, height = 3, damageLevel = 0.5, enableEffects = true, className = '', }) {
    const containerRef = useRef(null);
    return (_jsxs("div", { ref: containerRef, className: `cyberpunk-terminal-container ${className}`, style: {
            position: 'relative',
            width: '100%',
            height: '100%',
            minHeight: '600px',
            background: `linear-gradient(180deg, ${rgbToHex(CYBERPUNK_COLORS.bgDeep)} 0%, #0f0f1a 50%, ${rgbToHex(CYBERPUNK_COLORS.bgSurface)} 100%)`,
            overflow: 'hidden',
        }, children: [_jsx(Canvas, { style: {
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    pointerEvents: 'none', // Let HTML layer handle interactions
                }, gl: {
                    antialias: true,
                    alpha: true,
                    powerPreference: 'high-performance',
                    toneMapping: THREE.ACESFilmicToneMapping,
                    toneMappingExposure: 1.2,
                }, dpr: [1, 2], children: _jsx(Suspense, { fallback: null, children: _jsx(TerminalScene, { width: width, height: height, damageLevel: damageLevel, enableEffects: enableEffects }) }) }), _jsxs("div", { className: "cyberpunk-terminal-overlay", style: {
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: '95%',
                    maxWidth: '1200px',
                    height: '92%',
                    maxHeight: '90vh',
                    display: 'flex',
                    flexDirection: 'column',
                    zIndex: 10,
                }, children: [_jsx(TerminalHeader, {}), _jsx("div", { className: "cyberpunk-terminal-content", style: {
                            flex: 1,
                            minHeight: 0,
                            display: 'flex',
                            flexDirection: 'column',
                            overflow: 'hidden',
                        }, children: children }), _jsx(TerminalStatusBar, {})] })] }));
}
// 3D Scene contents
function TerminalScene({ width, height, damageLevel, enableEffects, }) {
    return (_jsxs(_Fragment, { children: [_jsx(PerspectiveCamera, { makeDefault: true, position: [0, 0, 4], fov: 50 }), _jsx("ambientLight", { intensity: 0.3, color: "#4080ff" }), _jsx("pointLight", { position: [3, 2, 3], intensity: 1.5, color: "#00ffff" }), _jsx("pointLight", { position: [-3, -1, 2], intensity: 0.8, color: "#ff0080" }), _jsx("pointLight", { position: [0, 3, -2], intensity: 0.5, color: "#ffffff" }), _jsx(HolographicPanel, { width: width, height: height, damageIntensity: damageLevel, glitchIntensity: damageLevel * 0.6, scanlineIntensity: 0.4, flickerIntensity: damageLevel * 0.4, opacity: 0.85 }), _jsx(DataParticles, { count: 50 }), enableEffects && (_jsx(CyberpunkEffects, { bloomIntensity: 1.0 + damageLevel * 0.5, chromaticOffset: [0.002 + damageLevel * 0.002, 0.002 + damageLevel * 0.002], noiseOpacity: 0.06 + damageLevel * 0.04, vignetteDarkness: 0.6, scanlineDensity: 1.5, enableGlitch: damageLevel > 0.3 }))] }));
}
// Terminal header with system info - memoized with live time
const TerminalHeader = memo(function TerminalHeader() {
    const [time, setTime] = useState(() => new Date().toLocaleTimeString('en-US', { hour12: false }));
    useEffect(() => {
        const interval = setInterval(() => {
            setTime(new Date().toLocaleTimeString('en-US', { hour12: false }));
        }, 1000);
        return () => clearInterval(interval);
    }, []);
    return (_jsxs("div", { className: "cyberpunk-terminal-header", style: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '8px 16px',
            background: 'linear-gradient(90deg, rgba(255, 0, 128, 0.2), rgba(0, 255, 255, 0.2))',
            borderBottom: '1px solid rgba(0, 255, 255, 0.3)',
            fontFamily: "'Orbitron', 'Rajdhani', monospace",
            fontSize: '11px',
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            color: '#00ffff',
        }, children: [_jsxs("span", { style: { display: 'flex', alignItems: 'center', gap: '8px' }, children: [_jsx("span", { style: {
                            width: '8px',
                            height: '8px',
                            borderRadius: '50%',
                            background: '#00ff00',
                            boxShadow: '0 0 8px #00ff00',
                            animation: 'pulse 2s ease-in-out infinite',
                        } }), "SYSTEM ONLINE"] }), _jsx("span", { style: { color: '#ff0080' }, children: "ARASAKA_TERMINAL_v2.77" }), _jsx("span", { style: { opacity: 0.7 }, children: time })] }));
});
// Terminal status bar - memoized (static content)
const TerminalStatusBar = memo(function TerminalStatusBar() {
    return (_jsxs("div", { className: "cyberpunk-terminal-status", style: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '6px 16px',
            background: 'rgba(0, 0, 0, 0.5)',
            borderTop: '1px solid rgba(0, 255, 255, 0.2)',
            fontFamily: "'Share Tech Mono', 'Fira Code', monospace",
            fontSize: '10px',
            letterSpacing: '0.05em',
            color: 'rgba(0, 255, 255, 0.6)',
        }, children: [_jsx("span", { children: "CLAUDE-RAG :: NEURAL_LINK_ACTIVE" }), _jsxs("span", { style: { display: 'flex', gap: '16px' }, children: [_jsx("span", { children: "MEM: 847MB" }), _jsx("span", { children: "NET: ENCRYPTED" }), _jsx("span", { style: { color: '#ff0080' }, children: "CORP_BYPASS: ON" })] })] }));
});
// Floating data particles - fixed buffer mutation on re-mount
function DataParticles({ count = 50 }) {
    const pointsRef = useRef(null);
    const velocitiesRef = useRef(null);
    // Generate velocities once (stable ref, not part of geometry)
    if (!velocitiesRef.current || velocitiesRef.current.length !== count * 3) {
        const vel = new Float32Array(count * 3);
        for (let i = 0; i < count; i++) {
            vel[i * 3] = (Math.random() - 0.5) * 0.01;
            vel[i * 3 + 1] = Math.random() * 0.02 + 0.005;
            vel[i * 3 + 2] = 0;
        }
        velocitiesRef.current = vel;
    }
    // Create geometry with fresh positions array each mount
    const geometry = useMemo(() => {
        const pos = new Float32Array(count * 3);
        for (let i = 0; i < count; i++) {
            pos[i * 3] = (Math.random() - 0.5) * 6;
            pos[i * 3 + 1] = (Math.random() - 0.5) * 5;
            pos[i * 3 + 2] = (Math.random() - 0.5) * 2 - 1;
        }
        const geo = new THREE.BufferGeometry();
        geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
        return geo;
    }, [count]);
    // Cleanup geometry on unmount
    useEffect(() => {
        return () => {
            geometry.dispose();
        };
    }, [geometry]);
    // Animate particles using useFrame
    useFrame(() => {
        if (!pointsRef.current || !velocitiesRef.current)
            return;
        const positionAttribute = pointsRef.current.geometry.getAttribute('position');
        const velocities = velocitiesRef.current;
        for (let i = 0; i < count; i++) {
            positionAttribute.array[i * 3] += velocities[i * 3];
            positionAttribute.array[i * 3 + 1] += velocities[i * 3 + 1];
            // Reset particles that go off screen
            if (positionAttribute.array[i * 3 + 1] > 3) {
                positionAttribute.array[i * 3 + 1] = -3;
                positionAttribute.array[i * 3] = (Math.random() - 0.5) * 6;
            }
        }
        positionAttribute.needsUpdate = true;
    });
    return (_jsx("points", { ref: pointsRef, geometry: geometry, children: _jsx("pointsMaterial", { color: "#00ffff", size: 0.03, transparent: true, opacity: 0.6, blending: THREE.AdditiveBlending, sizeAttenuation: true }) }));
}
// Utility to convert RGB array to hex
function rgbToHex([r, g, b]) {
    const toHex = (n) => Math.round(n * 255)
        .toString(16)
        .padStart(2, '0');
    return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}
export default CyberpunkTerminal;
//# sourceMappingURL=CyberpunkTerminal.js.map