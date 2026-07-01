"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface FloatingWorldProps {
  position: [number, number, number];
  color: string;
  label: string;
  onClick?: () => void;
}

/**
 * A floating geometric "world" node in the Universe.
 * Wireframe sphere with orbiting particles and label.
 */
export function FloatingWorld({
  position,
  color,
  label,
  onClick,
}: FloatingWorldProps) {
  const groupRef = useRef<THREE.Group>(null);
  const glowRef = useRef<THREE.Mesh>(null);
  const orbitRef = useRef<THREE.Group>(null);

  // Orbiting particles
  const orbitCount = 30;
  const { geometry, material } = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    const positions = new Float32Array(orbitCount * 3);

    for (let i = 0; i < orbitCount; i++) {
      const angle = (i / orbitCount) * Math.PI * 2;
      const radius = 0.8 + Math.random() * 0.3;
      positions[i * 3] = Math.cos(angle) * radius;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 0.2;
      positions[i * 3 + 2] = Math.sin(angle) * radius;
    }

    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));

    const mat = new THREE.PointsMaterial({
      color,
      size: 0.02,
      transparent: true,
      opacity: 0.6,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    return { geometry: geo, material: mat };
  }, [color]);

  useFrame((state) => {
    const t = state.clock.elapsedTime;

    // Hover bob
    if (groupRef.current) {
      groupRef.current.position.y =
        position[1] + Math.sin(t * 0.5 + position[0]) * 0.1;
    }

    // Glow pulse
    if (glowRef.current) {
      const scale = 1 + Math.sin(t * 1.2) * 0.1;
      glowRef.current.scale.setScalar(scale);
    }

    // Orbit rotation
    if (orbitRef.current) {
      orbitRef.current.rotation.y = t * 0.3;
    }
  });

  return (
    <group ref={groupRef} position={position} onClick={onClick}>
      {/* Core wireframe sphere */}
      <mesh>
        <icosahedronGeometry args={[0.3, 1]} />
        <meshBasicMaterial
          color={color}
          wireframe
          transparent
          opacity={0.6}
        />
      </mesh>

      {/* Inner glow */}
      <mesh ref={glowRef}>
        <sphereGeometry args={[0.25, 16, 16]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={0.15}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* Orbiting particles */}
      <points ref={orbitRef} geometry={geometry} material={material} />

      {/* Point light */}
      <pointLight color={color} intensity={0.5} distance={3} />
    </group>
  );
}
