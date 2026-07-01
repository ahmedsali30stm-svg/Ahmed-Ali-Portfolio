"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { Line } from "@react-three/drei";
import * as THREE from "three";

function RouteLine({
  start,
  end,
}: {
  start: THREE.Vector3;
  end: THREE.Vector3;
}) {
  const mid = start.clone().add(end).multiplyScalar(0.5);
  mid.y += 0.2;

  const curve = new THREE.QuadraticBezierCurve3(start, mid, end);
  const points = curve.getPoints(30);

  return (
    <Line
      points={points}
      color="#d4af37"
      lineWidth={1}
      transparent
      opacity={0.3}
      blending={THREE.AdditiveBlending}
    />
  );
}

/**
 * TravelOSWorld — the travel technology world.
 *
 * Represents routes, experiences, and operations as a
 * glowing network of connected nodes and flowing paths.
 */
export function TravelOSWorld() {
  const groupRef = useRef<THREE.Group>(null);
  const networkRef = useRef<THREE.Group>(null);

  // Network nodes (cities/hubs)
  const nodes = useMemo(() => {
    const positions: [number, number, number][] = [
      [0, 0, 0],      // Central hub
      [2, 0.5, -1],   // Regional hub
      [-1.5, 0.3, 1], // Regional hub
      [1, -0.4, 1.5], // Local hub
      [-2, 0.2, -0.5],// Local hub
      [0.5, 0.8, -2], // Remote hub
    ];
    return positions;
  }, []);

  // Route lines between nodes
  const routes = useMemo(() => {
    const lines: [number, number][] = [
      [0, 1], [0, 2], [0, 3], [0, 4], [0, 5],
      [1, 3], [2, 4], [1, 5],
    ];
    return lines;
  }, []);

  // Particle flow along routes
  const flowCount = 200;
  const flowGeometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    const positions = new Float32Array(flowCount * 3);
    const colors = new Float32Array(flowCount * 3);

    for (let i = 0; i < flowCount; i++) {
      const route = routes[i % routes.length];
      const start = nodes[route[0]];
      const end = nodes[route[1]];
      const t = Math.random();

      positions[i * 3] = start[0] + (end[0] - start[0]) * t;
      positions[i * 3 + 1] = start[1] + (end[1] - start[1]) * t;
      positions[i * 3 + 2] = start[2] + (end[2] - start[2]) * t;

      // Gold to amber gradient
      colors[i * 3] = 0.83 + Math.random() * 0.17;
      colors[i * 3 + 1] = 0.5 + Math.random() * 0.34;
      colors[i * 3 + 2] = Math.random() * 0.1;
    }

    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geo.setAttribute("color", new THREE.BufferAttribute(colors, 3));
    return geo;
  }, [nodes, routes]);

  useFrame((state) => {
    const t = state.clock.elapsedTime;

    // Slow group rotation
    if (groupRef.current) {
      groupRef.current.rotation.y = t * 0.05;
    }

    // Pulse nodes
    if (networkRef.current) {
      networkRef.current.children.forEach((child, i) => {
        if (child instanceof THREE.Mesh) {
          const scale = 1 + Math.sin(t * 1.5 + i * 0.5) * 0.15;
          child.scale.setScalar(scale);
        }
      });
    }
  });

  return (
    <group ref={groupRef}>
      {/* Network nodes */}
      <group ref={networkRef}>
        {nodes.map((pos, i) => (
          <mesh key={i} position={pos}>
            <octahedronGeometry args={[i === 0 ? 0.2 : 0.1, 0]} />
            <meshBasicMaterial
              color="#d4af37"
              wireframe
              transparent
              opacity={0.8}
            />
          </mesh>
        ))}
      </group>

      {/* Route lines */}
      {routes.map(([a, b], i) => (
        <RouteLine
          key={i}
          start={new THREE.Vector3(...nodes[a])}
          end={new THREE.Vector3(...nodes[b])}
        />
      ))}

      {/* Flow particles */}
      <points geometry={flowGeometry}>
        <pointsMaterial
          size={0.015}
          vertexColors
          transparent
          opacity={0.6}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </points>

      {/* Central glow */}
      <pointLight position={[0, 0, 0]} intensity={1} color="#d4af37" distance={5} />
    </group>
  );
}
