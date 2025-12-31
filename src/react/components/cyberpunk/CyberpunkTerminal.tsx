/**
 * CyberpunkTerminal - Main 3D holographic chat terminal
 *
 * Combines the 3D scene with HTML overlay for the actual chat interface.
 * Damaged Night City corpo terminal aesthetic.
 */

'use client';

import React, { Suspense, useRef, useMemo, useEffect, useState, ReactNode, memo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { PerspectiveCamera } from '@react-three/drei';
import * as THREE from 'three';
import { HolographicPanel } from './HolographicPanel.js';
import { CyberpunkEffects } from './CyberpunkEffects.js';
import { CYBERPUNK_COLORS } from './shaders.js';

interface CyberpunkTerminalProps {
  /** Chat content to render inside the terminal */
  children: ReactNode;
  /** Panel width */
  width?: number;
  /** Panel height */
  height?: number;
  /** Overall damage level (0-1) */
  damageLevel?: number;
  /** Enable post-processing effects */
  enableEffects?: boolean;
  /** Additional CSS class for container */
  className?: string;
}

export function CyberpunkTerminal({
  children,
  width = 4,
  height = 3,
  damageLevel = 0.5,
  enableEffects = true,
  className = '',
}: CyberpunkTerminalProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <div
      ref={containerRef}
      className={`cyberpunk-terminal-container ${className}`}
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        minHeight: '600px',
        background: `linear-gradient(180deg, ${rgbToHex(CYBERPUNK_COLORS.bgDeep)} 0%, #0f0f1a 50%, ${rgbToHex(CYBERPUNK_COLORS.bgSurface)} 100%)`,
        overflow: 'hidden',
      }}
    >
      {/* 3D Canvas Layer */}
      <Canvas
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          pointerEvents: 'none', // Let HTML layer handle interactions
        }}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: 'high-performance',
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.2,
        }}
        dpr={[1, 2]}
      >
        <Suspense fallback={null}>
          <TerminalScene
            width={width}
            height={height}
            damageLevel={damageLevel}
            enableEffects={enableEffects}
          />
        </Suspense>
      </Canvas>

      {/* HTML Overlay Layer - Chat UI */}
      <div
        className="cyberpunk-terminal-overlay"
        style={{
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
        }}
      >
        {/* Terminal header bar */}
        <TerminalHeader />

        {/* Chat content area */}
        <div
          className="cyberpunk-terminal-content"
          style={{
            flex: 1,
            minHeight: 0,
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
          }}
        >
          {children}
        </div>

        {/* Terminal status bar */}
        <TerminalStatusBar />
      </div>
    </div>
  );
}

// 3D Scene contents
function TerminalScene({
  width,
  height,
  damageLevel,
  enableEffects,
}: {
  width: number;
  height: number;
  damageLevel: number;
  enableEffects: boolean;
}) {
  return (
    <>
      {/* Camera - slightly off-center for depth */}
      <PerspectiveCamera makeDefault position={[0, 0, 4]} fov={50} />

      {/* Ambient lighting */}
      <ambientLight intensity={0.3} color="#4080ff" />

      {/* Key light - cyan neon */}
      <pointLight position={[3, 2, 3]} intensity={1.5} color="#00ffff" />

      {/* Fill light - magenta accent */}
      <pointLight position={[-3, -1, 2]} intensity={0.8} color="#ff0080" />

      {/* Rim light - white for highlights */}
      <pointLight position={[0, 3, -2]} intensity={0.5} color="#ffffff" />

      {/* The holographic panel */}
      <HolographicPanel
        width={width}
        height={height}
        damageIntensity={damageLevel}
        glitchIntensity={damageLevel * 0.6}
        scanlineIntensity={0.4}
        flickerIntensity={damageLevel * 0.4}
        opacity={0.85}
      />

      {/* Floating particles / data streams */}
      <DataParticles count={50} />

      {/* Post-processing effects */}
      {enableEffects && (
        <CyberpunkEffects
          bloomIntensity={1.0 + damageLevel * 0.5}
          chromaticOffset={[0.002 + damageLevel * 0.002, 0.002 + damageLevel * 0.002]}
          noiseOpacity={0.06 + damageLevel * 0.04}
          vignetteDarkness={0.6}
          scanlineDensity={1.5}
          enableGlitch={damageLevel > 0.3}
        />
      )}
    </>
  );
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

  return (
    <div
      className="cyberpunk-terminal-header"
      style={{
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
      }}
    >
      <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <span
          style={{
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            background: '#00ff00',
            boxShadow: '0 0 8px #00ff00',
            animation: 'pulse 2s ease-in-out infinite',
          }}
        />
        SYSTEM ONLINE
      </span>
      <span style={{ color: '#ff0080' }}>ARASAKA_TERMINAL_v2.77</span>
      <span style={{ opacity: 0.7 }}>{time}</span>
    </div>
  );
});

// Terminal status bar - memoized (static content)
const TerminalStatusBar = memo(function TerminalStatusBar() {
  return (
    <div
      className="cyberpunk-terminal-status"
      style={{
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
      }}
    >
      <span>CLAUDE-RAG :: NEURAL_LINK_ACTIVE</span>
      <span style={{ display: 'flex', gap: '16px' }}>
        <span>MEM: 847MB</span>
        <span>NET: ENCRYPTED</span>
        <span style={{ color: '#ff0080' }}>CORP_BYPASS: ON</span>
      </span>
    </div>
  );
});

// Floating data particles - fixed buffer mutation on re-mount
function DataParticles({ count = 50 }: { count?: number }) {
  const pointsRef = useRef<THREE.Points>(null);
  const velocitiesRef = useRef<Float32Array | null>(null);

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
    if (!pointsRef.current || !velocitiesRef.current) return;

    const positionAttribute = pointsRef.current.geometry.getAttribute('position') as THREE.BufferAttribute;
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

  return (
    <points ref={pointsRef} geometry={geometry}>
      <pointsMaterial
        color="#00ffff"
        size={0.03}
        transparent
        opacity={0.6}
        blending={THREE.AdditiveBlending}
        sizeAttenuation
      />
    </points>
  );
}

// Utility to convert RGB array to hex
function rgbToHex([r, g, b]: [number, number, number]): string {
  const toHex = (n: number) =>
    Math.round(n * 255)
      .toString(16)
      .padStart(2, '0');
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

export default CyberpunkTerminal;
