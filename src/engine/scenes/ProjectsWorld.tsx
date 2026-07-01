"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { LineConnect } from "./helpers";

/**
 * ProjectsWorld — portfolio showcase as floating project cards.
 */
export function ProjectsWorld() {
  const groupRef = useRef<THREE.Group>(null);

  const projects = useMemo(
    () => [
      { title: "Travel OS", metric: "SAR 16M+", color: "#d4af37", pos: [2.5, 1.2, -0.5] as [number, number, number] },
      { title: "AI Concierge", metric: "98% CSAT", color: "#c0c0c0", pos: [1, 0.5, 1] as [number, number, number] },
      { title: "Revenue Engine", metric: "+40% Rev", color: "#d4af37", pos: [-0.5, 1.5, 0.5] as [number, number, number] },
      { title: "Smart CRM", metric: "300+ Leads", color: "#c0c0c0", pos: [-2, 0.3, -0.3] as [number, number, number] },
      { title: "Agent Fleet", metric: "12 Agents", color: "#d4af37", pos: [0.3, -0.8, 1.2] as [number, number, number] },
      { title: "Digital Twin", metric: "Real-time", color: "#c0c0c0", pos: [-1.2, -0.5, -1] as [number, number, number] },
    ],
    []
  );

  const particleCount = 300;
  const particleGeo = useMemo(() => {
    const g = new THREE.BufferGeometry();
    const pos = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 8;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 4;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 4;
    }
    g.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    return g;
  }, []);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.03;
    }
  });

  return (
    <group ref={groupRef}>
      {projects.map((project, i) => (
        <group key={i} position={project.pos}>
          <mesh>
            <planeGeometry args={[1.2, 0.7]} />
            <meshBasicMaterial color={project.color} transparent opacity={0.05} side={THREE.DoubleSide} />
          </mesh>
          <lineSegments>
            <edgesGeometry args={[new THREE.PlaneGeometry(1.2, 0.7)]} />
            <lineBasicMaterial color={project.color} transparent opacity={0.3} />
          </lineSegments>
          <mesh position={[-0.45, 0.2, 0.01]}>
            <circleGeometry args={[0.02, 16]} />
            <meshBasicMaterial color={project.color} transparent opacity={0.8} />
          </mesh>
          <pointLight color={project.color} intensity={0.2} distance={2} />
        </group>
      ))}

      {projects.slice(0, -1).map((p, i) => (
        <LineConnect
          key={i}
          from={new THREE.Vector3(...p.pos)}
          to={new THREE.Vector3(...projects[i + 1].pos)}
          opacity={0.04}
        />
      ))}

      <points geometry={particleGeo}>
        <pointsMaterial size={0.008} color="#d4af37" transparent opacity={0.3} blending={THREE.AdditiveBlending} depthWrite={false} />
      </points>

      <ambientLight intensity={0.05} />
    </group>
  );
}
