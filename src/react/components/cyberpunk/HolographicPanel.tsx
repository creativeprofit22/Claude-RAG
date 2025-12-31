/**
 * HolographicPanel - Damaged holographic display mesh
 *
 * A 3D panel with shader-based damage effects, scan lines, and flickering.
 * The main visual element of the cyberpunk terminal.
 */

import { useRef, useMemo, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import {
  hologramVertexShader,
  hologramFragmentShader,
  CYBERPUNK_COLORS,
} from './shaders.js';

interface HolographicPanelProps {
  width?: number;
  height?: number;
  depth?: number;
  damageIntensity?: number;
  glitchIntensity?: number;
  scanlineIntensity?: number;
  flickerIntensity?: number;
  opacity?: number;
}

export function HolographicPanel({
  width = 4,
  height = 3,
  depth = 0.1,
  damageIntensity = 0.5,
  glitchIntensity = 0.3,
  scanlineIntensity = 0.4,
  flickerIntensity = 0.2,
  opacity = 0.85,
}: HolographicPanelProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.ShaderMaterial>(null);

  // Create static uniforms once - these never change or are set only at init
  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uDamageIntensity: { value: damageIntensity },
      uGlitchIntensity: { value: glitchIntensity },
      uScanlineIntensity: { value: scanlineIntensity },
      uFlickerIntensity: { value: flickerIntensity },
      uPrimaryColor: { value: new THREE.Vector3(...CYBERPUNK_COLORS.primary) },
      uAccentColor: { value: new THREE.Vector3(...CYBERPUNK_COLORS.accent) },
      uBackgroundColor: { value: new THREE.Vector3(...CYBERPUNK_COLORS.bgDeep) },
      uOpacity: { value: opacity },
    }),
    [] // No deps - create once, update via ref
  );

  // Update dynamic uniform values when props change (without recreating uniforms object)
  useEffect(() => {
    if (materialRef.current) {
      materialRef.current.uniforms.uDamageIntensity.value = damageIntensity;
      materialRef.current.uniforms.uGlitchIntensity.value = glitchIntensity;
      materialRef.current.uniforms.uScanlineIntensity.value = scanlineIntensity;
      materialRef.current.uniforms.uFlickerIntensity.value = flickerIntensity;
      materialRef.current.uniforms.uOpacity.value = opacity;
    }
  }, [damageIntensity, glitchIntensity, scanlineIntensity, flickerIntensity, opacity]);

  // Animate shader uniforms
  useFrame((state) => {
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = state.clock.elapsedTime;
    }
  });

  return (
    <group>
      {/* Main panel - 32x32 segments sufficient for visual effects */}
      <mesh ref={meshRef} position={[0, 0, 0]}>
        <planeGeometry args={[width, height, 32, 32]} />
        <shaderMaterial
          ref={materialRef}
          vertexShader={hologramVertexShader}
          fragmentShader={hologramFragmentShader}
          uniforms={uniforms}
          transparent
          side={THREE.DoubleSide}
          depthWrite={false}
        />
      </mesh>

      {/* Panel frame - neon edges */}
      <FrameEdges width={width} height={height} />

      {/* Corner damage indicators */}
      <DamageIndicators width={width} height={height} />

      {/* Back panel glow */}
      <mesh position={[0, 0, -depth]}>
        <planeGeometry args={[width * 1.02, height * 1.02]} />
        <meshBasicMaterial
          color={new THREE.Color(...CYBERPUNK_COLORS.bgDeep)}
          transparent
          opacity={0.95}
        />
      </mesh>
    </group>
  );
}

// Neon frame edges around the panel
function FrameEdges({ width, height }: { width: number; height: number }) {
  const lineRef = useRef<THREE.LineSegments>(null);

  // Create frame geometry
  const geometry = useMemo(() => {
    const hw = width / 2;
    const hh = height / 2;
    const cornerCut = 0.15; // Cut corners for cyberpunk aesthetic

    // Define frame points with cut corners
    const points = [
      // Top edge (left to right, with corner cuts)
      new THREE.Vector3(-hw + cornerCut, hh, 0),
      new THREE.Vector3(hw - cornerCut, hh, 0),
      // Top-right corner cut
      new THREE.Vector3(hw - cornerCut, hh, 0),
      new THREE.Vector3(hw, hh - cornerCut, 0),
      // Right edge
      new THREE.Vector3(hw, hh - cornerCut, 0),
      new THREE.Vector3(hw, -hh + cornerCut, 0),
      // Bottom-right corner cut
      new THREE.Vector3(hw, -hh + cornerCut, 0),
      new THREE.Vector3(hw - cornerCut, -hh, 0),
      // Bottom edge
      new THREE.Vector3(hw - cornerCut, -hh, 0),
      new THREE.Vector3(-hw + cornerCut, -hh, 0),
      // Bottom-left corner cut
      new THREE.Vector3(-hw + cornerCut, -hh, 0),
      new THREE.Vector3(-hw, -hh + cornerCut, 0),
      // Left edge
      new THREE.Vector3(-hw, -hh + cornerCut, 0),
      new THREE.Vector3(-hw, hh - cornerCut, 0),
      // Top-left corner cut
      new THREE.Vector3(-hw, hh - cornerCut, 0),
      new THREE.Vector3(-hw + cornerCut, hh, 0),
    ];

    const geo = new THREE.BufferGeometry().setFromPoints(points);
    return geo;
  }, [width, height]);

  // Animate edge glow
  useFrame((state) => {
    if (lineRef.current) {
      const material = lineRef.current.material as THREE.LineBasicMaterial;
      const pulse = Math.sin(state.clock.elapsedTime * 2) * 0.3 + 0.7;
      material.opacity = pulse;
    }
  });

  return (
    <lineSegments ref={lineRef} geometry={geometry} position={[0, 0, 0.01]}>
      <lineBasicMaterial
        color="#00ffff"
        transparent
        opacity={0.8}
        linewidth={2}
      />
    </lineSegments>
  );
}

// Visual damage indicators at corners
function DamageIndicators({ width, height }: { width: number; height: number }) {
  const hw = width / 2;
  const hh = height / 2;

  // Damage positions - corners and random edge spots
  const damageSpots = useMemo(
    () => [
      { pos: [-hw + 0.3, hh - 0.2, 0.02] as [number, number, number], scale: 0.15, rotation: 0.3 },
      { pos: [hw - 0.2, hh - 0.3, 0.02] as [number, number, number], scale: 0.12, rotation: -0.5 },
      { pos: [hw - 0.25, -hh + 0.15, 0.02] as [number, number, number], scale: 0.18, rotation: 0.8 },
      { pos: [-hw + 0.15, -hh + 0.25, 0.02] as [number, number, number], scale: 0.1, rotation: -0.2 },
      // Edge damage
      { pos: [0.5, hh - 0.05, 0.02] as [number, number, number], scale: 0.08, rotation: 0 },
      { pos: [-hw + 0.05, 0.3, 0.02] as [number, number, number], scale: 0.06, rotation: 1.5 },
    ],
    [hw, hh]
  );

  return (
    <group>
      {damageSpots.map((spot, i) => (
        <mesh key={i} position={spot.pos} rotation={[0, 0, spot.rotation]}>
          <planeGeometry args={[spot.scale, spot.scale * 0.3]} />
          <meshBasicMaterial
            color="#ff0080"
            transparent
            opacity={0.6}
            blending={THREE.AdditiveBlending}
          />
        </mesh>
      ))}
    </group>
  );
}

export default HolographicPanel;
