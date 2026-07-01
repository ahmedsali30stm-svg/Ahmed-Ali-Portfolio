"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

/**
 * ContactWorld — communication hub visualization.
 *
 * Radiating signal waves from a central beacon,
 * representing connection and outreach.
 */
export function ContactWorld() {
  const groupRef = useRef<THREE.Group>(null);
  const beaconRef = useRef<THREE.Mesh>(null);

  // Signal waves (concentric rings expanding outward)
  const waveCount = 6;
  const waves = useMemo(() => {
    return Array.from({ length: waveCount }, (_, i) => ({
      radius: 0.5 + i * 0.5,
      speed: 0.3 + i * 0.05,
      opacity: 0.3 - i * 0.04,
    }));
  }, []);

  // Connection lines to "contact points"
  const contactPoints = useMemo(
    () => [
      { pos: new THREE.Vector3(2, 1, 0), label: "Email" },
      { pos: new THREE.Vector3(-1.5, 1.5, 0.5), label: "LinkedIn" },
      { pos: new THREE.Vector3(1, -1.5, -0.5), label: "GitHub" },
      { pos: new THREE.Vector3(-2, -0.5, 0.3), label: "Location" },
    ],
    []
  );

  // Floating data particles
  const particleCount = 200;
  const particleGeo = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      const angle = Math.random() * Math.PI * 2;
      const radius = 0.5 + Math.random() * 2.5;
      positions[i * 3] = Math.cos(angle) * radius;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 2;
      positions[i * 3 + 2] = Math.sin(angle) * radius;
    }
    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    return geo;
  }, []);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (groupRef.current) groupRef.current.rotation.y = t * 0.04;
    if (beaconRef.current) {
      const scale = 1 + Math.sin(t * 2) * 0.2;
      beaconRef.current.scale.setScalar(scale);
    }
  });

  return (
    <group ref={groupRef}>
      {/* Central beacon */}
      <mesh ref={beaconRef}>
        <octahedronGeometry args={[0.2, 0]} />
        <meshBasicMaterial color="#d4af37" wireframe transparent opacity={0.9} />
      </mesh>
      <mesh>
        <sphereGeometry args={[0.15, 16, 16]} />
        <meshBasicMaterial color="#d4af37" transparent opacity={0.2} blending={THREE.AdditiveBlending} />
      </mesh>

      {/* Signal waves */}
      {waves.map((wave, i) => (
        <mesh key={i} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[wave.radius, 0.003, 8, 128]} />
          <meshBasicMaterial color="#d4af37" transparent opacity={wave.opacity} blending={THREE.AdditiveBlending} />
        </mesh>
      ))}

      {/* Contact points */}
      {contactPoints.map((cp, i) => (
        <group key={i} position={cp.pos}>
          <mesh>
            <icosahedronGeometry args={[0.08, 1]} />
            <meshBasicMaterial color="#c0c0c0" wireframe transparent opacity={0.8} />
          </mesh>
          <pointLight color="#c0c0c0" intensity={0.2} distance={1.5} />
        </group>
      ))}

      {/* Data streams */}
      <points geometry={particleGeo}>
        <pointsMaterial size={0.01} color="#d4af37" transparent opacity={0.3} blending={THREE.AdditiveBlending} depthWrite={false} />
      </points>

      <pointLight position={[0, 0, 0]} intensity={0.8} color="#d4af37" distance={4} />
      <ambientLight intensity={0.03} />
    </group>
  );
}
