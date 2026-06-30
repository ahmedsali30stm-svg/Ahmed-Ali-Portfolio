"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export function FloatingGeometry() {
  const group = useRef<THREE.Group>(null);

  const shapes = useMemo(() => {
    return [
      { pos: [-2.5, 1.5, -2] as [number, number, number], scale: 0.3, speed: 0.3, type: "octahedron" as const },
      { pos: [2.8, -1.2, -1.5] as [number, number, number], scale: 0.25, speed: 0.4, type: "tetrahedron" as const },
      { pos: [-1.5, -2, -3] as [number, number, number], scale: 0.2, speed: 0.25, type: "icosahedron" as const },
      { pos: [1.8, 2.2, -2.5] as [number, number, number], scale: 0.35, speed: 0.35, type: "octahedron" as const },
      { pos: [0, -2.8, -2] as [number, number, number], scale: 0.18, speed: 0.45, type: "tetrahedron" as const },
    ];
  }, []);

  useFrame((state) => {
    if (!group.current) return;
    const t = state.clock.elapsedTime;
    group.current.children.forEach((child, i) => {
      const s = shapes[i];
      child.position.y = s.pos[1] + Math.sin(t * s.speed + i) * 0.3;
      child.rotation.x = t * s.speed * 0.5;
      child.rotation.z = t * s.speed * 0.3;
    });
  });

  return (
    <group ref={group}>
      {shapes.map((s, i) => (
        <mesh key={i} position={s.pos} scale={s.scale}>
          {s.type === "octahedron" && <octahedronGeometry args={[1, 0]} />}
          {s.type === "tetrahedron" && <tetrahedronGeometry args={[1, 0]} />}
          {s.type === "icosahedron" && <icosahedronGeometry args={[1, 0]} />}
          <meshBasicMaterial
            color="#d4af37"
            wireframe
            transparent
            opacity={0.15}
          />
        </mesh>
      ))}
    </group>
  );
}
