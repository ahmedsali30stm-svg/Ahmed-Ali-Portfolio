"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { LineConnect } from "./helpers";

/**
 * AIAgentsWorld — autonomous intelligence visualization.
 *
 * Neural network nodes with pulsing connections,
 * representing agent orchestration and decision flows.
 */
export function AIAgentsWorld() {
  const groupRef = useRef<THREE.Group>(null);

  const layers = useMemo(
    () => [
      [
        new THREE.Vector3(-2, 1.2, 0),
        new THREE.Vector3(-2, 0.4, 0),
        new THREE.Vector3(-2, -0.4, 0),
        new THREE.Vector3(-2, -1.2, 0),
      ],
      [
        new THREE.Vector3(-0.5, 1, 0.3),
        new THREE.Vector3(-0.5, 0.3, -0.3),
        new THREE.Vector3(-0.5, -0.3, 0.3),
        new THREE.Vector3(-0.5, -1, -0.3),
      ],
      [
        new THREE.Vector3(1, 0.8, -0.2),
        new THREE.Vector3(1, 0, 0.2),
        new THREE.Vector3(1, -0.8, -0.2),
      ],
      [
        new THREE.Vector3(2.2, 0.4, 0),
        new THREE.Vector3(2.2, -0.4, 0),
      ],
    ],
    []
  );

  const allNodes = useMemo(() => layers.flat(), [layers]);

  const connections = useMemo(() => {
    const conns: [THREE.Vector3, THREE.Vector3][] = [];
    for (let l = 0; l < layers.length - 1; l++) {
      for (const from of layers[l]) {
        for (const to of layers[l + 1]) {
          conns.push([from, to]);
        }
      }
    }
    return conns;
  }, [layers]);

  const flowCount = 150;
  const flowGeo = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    const positions = new Float32Array(flowCount * 3);
    for (let i = 0; i < flowCount; i++) {
      const conn = connections[i % connections.length];
      const t = Math.random();
      positions[i * 3] = conn[0].x + (conn[1].x - conn[0].x) * t;
      positions[i * 3 + 1] = conn[0].y + (conn[1].y - conn[0].y) * t;
      positions[i * 3 + 2] = conn[0].z + (conn[1].z - conn[0].z) * t;
    }
    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    return geo;
  }, [connections]);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(t * 0.1) * 0.15;
    }

    const positions = flowGeo.attributes.position as THREE.BufferAttribute;
    for (let i = 0; i < flowCount; i++) {
      const conn = connections[i % connections.length];
      const phase = (t * 0.3 + i * 0.1) % 1;
      positions.array[i * 3] = conn[0].x + (conn[1].x - conn[0].x) * phase;
      positions.array[i * 3 + 1] = conn[0].y + (conn[1].y - conn[0].y) * phase;
      positions.array[i * 3 + 2] = conn[0].z + (conn[1].z - conn[0].z) * phase;
    }
    positions.needsUpdate = true;
  });

  return (
    <group ref={groupRef}>
      {allNodes.map((pos, i) => (
        <mesh key={i} position={pos}>
          <icosahedronGeometry args={[0.08, 1]} />
          <meshBasicMaterial
            color={i < 4 ? "#c0c0c0" : i >= allNodes.length - 2 ? "#d4af37" : "#c0c0c0"}
            wireframe
            transparent
            opacity={0.9}
          />
        </mesh>
      ))}

      {connections.map(([from, to], i) => (
        <LineConnect key={i} from={from} to={to} opacity={0.06} />
      ))}

      <points geometry={flowGeo}>
        <pointsMaterial
          size={0.02}
          color="#d4af37"
          transparent
          opacity={0.5}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </points>

      <pointLight position={[0, 0, 1]} intensity={0.5} color="#c0c0c0" distance={5} />
    </group>
  );
}
