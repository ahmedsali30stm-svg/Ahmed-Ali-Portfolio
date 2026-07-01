"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import {
  particleVertexShader,
  particleFragmentShader,
} from "@/shaders/particle";

/**
 * UniverseScene — the root 3D scene.
 *
 * A particle field representing the digital universe,
 * with orbital rings for each world.
 */
export function UniverseScene() {
  const particlesRef = useRef<THREE.Points>(null);
  const ringsRef = useRef<THREE.Group>(null);

  const count = 3000;

  const { geometry, material } = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    const positions = new Float32Array(count * 3);
    const sizes = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      const radius = 2 + Math.random() * 8;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);

      positions[i3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i3 + 2] = radius * Math.cos(phi);

      sizes[i] = Math.random() * 1.5 + 0.3;
    }

    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geo.setAttribute("aSize", new THREE.BufferAttribute(sizes, 1));

    const pr = Math.min(window.devicePixelRatio, 2);
    const mat = new THREE.ShaderMaterial({
      vertexShader: particleVertexShader,
      fragmentShader: particleFragmentShader,
      uniforms: {
        uTime: { value: 0 },
        uPixelRatio: { value: pr },
      },
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    return { geometry: geo, material: mat };
  }, []);

  // Orbital rings for each world
  const rings = useMemo(() => {
    const ringData = [
      { radius: 3.5, color: "#d4af37", speed: 0.1 },
      { radius: 4.5, color: "#c0c0c0", speed: 0.08 },
      { radius: 5.5, color: "#d4af37", speed: 0.06 },
      { radius: 6.5, color: "#c0c0c0", speed: 0.04 },
    ];
    return ringData;
  }, []);

  useFrame((state) => {
    const t = state.clock.elapsedTime;

    // Update particle time
    material.uniforms.uTime.value = t;

    // Slow rotation
    if (particlesRef.current) {
      particlesRef.current.rotation.y = t * 0.02;
      particlesRef.current.rotation.x = Math.sin(t * 0.01) * 0.03;
    }

    // Rotate rings
    if (ringsRef.current) {
      ringsRef.current.children.forEach((ring, i) => {
        ring.rotation.x = t * rings[i].speed * 0.5;
        ring.rotation.z = t * rings[i].speed * 0.3;
      });
    }
  });

  return (
    <>
      <color attach="background" args={["#050508"]} />
      <fog attach="fog" args={["#050508", 5, 18]} />

      {/* Core particles */}
      <points ref={particlesRef} geometry={geometry} material={material} />

      {/* Orbital rings */}
      <group ref={ringsRef}>
        {rings.map((ring, i) => (
          <mesh key={i} rotation={[Math.PI * 0.3, 0, i * 0.5]}>
            <torusGeometry args={[ring.radius, 0.005, 8, 128]} />
            <meshBasicMaterial
              color={ring.color}
              transparent
              opacity={0.3}
              blending={THREE.AdditiveBlending}
            />
          </mesh>
        ))}
      </group>

      {/* Center glow */}
      <mesh>
        <sphereGeometry args={[0.3, 32, 32]} />
        <meshBasicMaterial
          color="#d4af37"
          transparent
          opacity={0.8}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* Ambient light */}
      <ambientLight intensity={0.1} />
      <pointLight position={[0, 0, 0]} intensity={2} color="#d4af37" distance={15} />
    </>
  );
}
