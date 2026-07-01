"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { LineHelix, LineConnect } from "./helpers";

/**
 * TimelineWorld — career journey as a vertical timeline.
 */
export function TimelineWorld() {
  const groupRef = useRef<THREE.Group>(null);

  const milestones = useMemo(
    () => [
      { year: "2016", y: -2.5 },
      { year: "2018", y: -1.5 },
      { year: "2020", y: -0.5 },
      { year: "2022", y: 0.5 },
      { year: "2024", y: 1.5 },
      { year: "2026", y: 2.5 },
    ],
    []
  );

  const milestonePositions = useMemo(() => {
    return milestones.map((m, i) => {
      const angle = (i / (milestones.length - 1)) * Math.PI * 2 * 3;
      const radius = 0.8;
      return new THREE.Vector3(Math.cos(angle) * radius, m.y, Math.sin(angle) * radius);
    });
  }, [milestones]);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.08;
    }
  });

  return (
    <group ref={groupRef}>
      <LineHelix turns={3} height={5} radius={0.8} color="#c0c0c0" opacity={0.12} />
      <LineHelix turns={3} height={5} radius={0.8} color="#c0c0c0" opacity={0.12} offset />

      {milestonePositions.map((pos, i) => (
        <group key={i} position={pos}>
          <mesh>
            <icosahedronGeometry args={[0.1, 1]} />
            <meshBasicMaterial color="#d4af37" wireframe transparent opacity={0.8} />
          </mesh>
          <mesh>
            <sphereGeometry args={[0.06, 8, 8]} />
            <meshBasicMaterial color="#d4af37" transparent opacity={0.3} blending={THREE.AdditiveBlending} />
          </mesh>
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[0.15, 0.003, 8, 32]} />
            <meshBasicMaterial color="#d4af37" transparent opacity={0.2} blending={THREE.AdditiveBlending} />
          </mesh>
          <pointLight color="#d4af37" intensity={0.3} distance={1.5} />
        </group>
      ))}

      <LineConnect
        from={new THREE.Vector3(0, -2.8, 0)}
        to={new THREE.Vector3(0, 2.8, 0)}
        color="#d4af37"
        opacity={0.08}
      />

      <ambientLight intensity={0.05} />
    </group>
  );
}
