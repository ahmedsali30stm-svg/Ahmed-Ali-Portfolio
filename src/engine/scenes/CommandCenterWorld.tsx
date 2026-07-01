"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { LineRing } from "./helpers";

/**
 * CommandCenterWorld — AI assistant interface in 3D.
 */
export function CommandCenterWorld() {
  const groupRef = useRef<THREE.Group>(null);
  const coreRef = useRef<THREE.Mesh>(null);

  const rings = useMemo(
    () => [
      { radius: 0.6, speed: 0.5, color: "#d4af37" },
      { radius: 1.0, speed: -0.3, color: "#c0c0c0" },
      { radius: 1.4, speed: 0.2, color: "#d4af37" },
      { radius: 1.8, speed: -0.15, color: "#c0c0c0" },
    ],
    []
  );

  const streamCount = 200;
  const streamGeo = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    const positions = new Float32Array(streamCount * 3);
    const colors = new Float32Array(streamCount * 3);
    for (let i = 0; i < streamCount; i++) {
      const angle = Math.random() * Math.PI * 2;
      const radius = 0.5 + Math.random() * 1.5;
      positions[i * 3] = Math.cos(angle) * radius;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 2;
      positions[i * 3 + 2] = Math.sin(angle) * radius;
      const gold = Math.random() > 0.5;
      colors[i * 3] = gold ? 0.83 : 0.75;
      colors[i * 3 + 1] = gold ? 0.69 : 0.75;
      colors[i * 3 + 2] = gold ? 0.22 : 0.75;
    }
    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geo.setAttribute("color", new THREE.BufferAttribute(colors, 3));
    return geo;
  }, []);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (groupRef.current) groupRef.current.rotation.y = t * 0.05;
    if (coreRef.current) coreRef.current.scale.setScalar(1 + Math.sin(t * 2) * 0.15);

    const positions = streamGeo.attributes.position as THREE.BufferAttribute;
    for (let i = 0; i < streamCount; i++) {
      positions.array[i * 3 + 1] += Math.sin(t * 0.5 + i * 0.1) * 0.002;
    }
    positions.needsUpdate = true;
  });

  return (
    <group ref={groupRef}>
      <mesh ref={coreRef}>
        <icosahedronGeometry args={[0.25, 2]} />
        <meshBasicMaterial color="#d4af37" wireframe transparent opacity={0.8} />
      </mesh>
      <mesh>
        <sphereGeometry args={[0.2, 16, 16]} />
        <meshBasicMaterial color="#d4af37" transparent opacity={0.15} blending={THREE.AdditiveBlending} />
      </mesh>

      {rings.map((ring, i) => (
        <LineRing
          key={i}
          radius={ring.radius}
          color={ring.color}
          opacity={0.2}
          rotation={[Math.PI / 2 + i * 0.3, 0, i * 0.5]}
        />
      ))}

      <points geometry={streamGeo}>
        <pointsMaterial size={0.012} vertexColors transparent opacity={0.4} blending={THREE.AdditiveBlending} depthWrite={false} />
      </points>

      {[0, 1, 2, 3].map((i) => {
        const angle = (i / 4) * Math.PI * 2;
        return (
          <mesh key={i} position={[Math.cos(angle) * 2, 0, Math.sin(angle) * 2]}>
            <cylinderGeometry args={[0.005, 0.005, 3, 8]} />
            <meshBasicMaterial color="#d4af37" transparent opacity={0.1} />
          </mesh>
        );
      })}

      <pointLight position={[0, 0, 0]} intensity={1} color="#d4af37" distance={4} />
      <ambientLight intensity={0.03} />
    </group>
  );
}
