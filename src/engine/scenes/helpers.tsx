"use client";

import { Line } from "@react-three/drei";
import * as THREE from "three";

/**
 * Helper components to avoid JSX namespace conflicts
 * between Three.js <line> and SVG <line>.
 */

export function LineConnect({
  from,
  to,
  color = "#d4af37",
  opacity = 0.15,
}: {
  from: THREE.Vector3;
  to: THREE.Vector3;
  color?: string;
  opacity?: number;
}) {
  return (
    <Line
      points={[from, to]}
      color={color}
      lineWidth={1}
      transparent
      opacity={opacity}
      blending={THREE.AdditiveBlending}
    />
  );
}

export function LinePath({
  points,
  color = "#d4af37",
  opacity = 0.15,
}: {
  points: THREE.Vector3[];
  color?: string;
  opacity?: number;
}) {
  return (
    <Line
      points={points}
      color={color}
      lineWidth={1}
      transparent
      opacity={opacity}
      blending={THREE.AdditiveBlending}
    />
  );
}

export function LineRing({
  radius,
  color = "#d4af37",
  opacity = 0.2,
  segments = 128,
  rotation,
}: {
  radius: number;
  color?: string;
  opacity?: number;
  segments?: number;
  rotation?: [number, number, number];
}) {
  const points = React.useMemo(() => {
    const pts: THREE.Vector3[] = [];
    for (let i = 0; i <= segments; i++) {
      const angle = (i / segments) * Math.PI * 2;
      pts.push(new THREE.Vector3(Math.cos(angle) * radius, 0, Math.sin(angle) * radius));
    }
    return pts;
  }, [radius, segments]);

  return (
    <group rotation={rotation}>
      <Line
        points={points}
        color={color}
        lineWidth={1}
        transparent
        opacity={opacity}
        blending={THREE.AdditiveBlending}
      />
    </group>
  );
}

export function LineHelix({
  turns = 3,
  height = 5,
  radius = 0.8,
  segments = 100,
  color = "#c0c0c0",
  opacity = 0.15,
  offset = false,
}: {
  turns?: number;
  height?: number;
  radius?: number;
  segments?: number;
  color?: string;
  opacity?: number;
  offset?: boolean;
}) {
  const points = React.useMemo(() => {
    const pts: THREE.Vector3[] = [];
    for (let i = 0; i <= segments; i++) {
      const t = i / segments;
      const angle = t * Math.PI * 2 * turns + (offset ? Math.PI : 0);
      const y = t * height - height / 2;
      pts.push(new THREE.Vector3(Math.cos(angle) * radius, y, Math.sin(angle) * radius));
    }
    return pts;
  }, [turns, height, radius, segments, offset]);

  return (
    <Line
      points={points}
      color={color}
      lineWidth={1}
      transparent
      opacity={opacity}
      blending={THREE.AdditiveBlending}
    />
  );
}

import React from "react";
