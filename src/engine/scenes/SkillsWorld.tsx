"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { Line } from "@react-three/drei";
import * as THREE from "three";

/**
 * SkillsWorld — skill constellation visualization.
 *
 * Skills as interconnected stars in a constellation,
 * with brightness indicating proficiency.
 */
export function SkillsWorld() {
  const groupRef = useRef<THREE.Group>(null);

  const categories = useMemo(
    () => [
      {
        name: "Frontend",
        color: "#d4af37",
        skills: [
          { name: "React", x: 2, y: 1.2, z: 0 },
          { name: "Next.js", x: 2.8, y: 0.8, z: 0.3 },
          { name: "TypeScript", x: 2.5, y: 1.8, z: -0.2 },
          { name: "Three.js", x: 1.5, y: 1.6, z: 0.1 },
        ],
      },
      {
        name: "Backend",
        color: "#c0c0c0",
        skills: [
          { name: "Node.js", x: -1.5, y: 1, z: 0.2 },
          { name: "Python", x: -2.2, y: 0.5, z: -0.1 },
          { name: "PostgreSQL", x: -1.8, y: 1.8, z: 0.1 },
          { name: "FastAPI", x: -2.5, y: 1.3, z: -0.2 },
        ],
      },
      {
        name: "AI/ML",
        color: "#d4af37",
        skills: [
          { name: "LangChain", x: 0, y: -1.5, z: 0.3 },
          { name: "OpenAI", x: 0.8, y: -2, z: -0.1 },
          { name: "RAG", x: -0.8, y: -2, z: 0.2 },
          { name: "Vector DB", x: 0, y: -2.5, z: -0.2 },
        ],
      },
      {
        name: "DevOps",
        color: "#c0c0c0",
        skills: [
          { name: "Docker", x: 1.5, y: -0.5, z: -0.3 },
          { name: "AWS", x: 2.2, y: -1, z: 0.1 },
          { name: "Git", x: 1, y: -0.8, z: 0.2 },
        ],
      },
    ],
    []
  );

  const allSkills = useMemo(
    () => categories.flatMap((c) => c.skills),
    [categories]
  );

  // Connections between related skills
  const connections = useMemo(() => {
    const conns: [THREE.Vector3, THREE.Vector3][] = [];
    // Frontend to AI
    conns.push([
      new THREE.Vector3(2, 1.2, 0),
      new THREE.Vector3(0, -1.5, 0.3),
    ]);
    // Backend to AI
    conns.push([
      new THREE.Vector3(-1.5, 1, 0.2),
      new THREE.Vector3(0, -1.5, 0.3),
    ]);
    // Frontend to Backend
    conns.push([
      new THREE.Vector3(2, 1.2, 0),
      new THREE.Vector3(-1.5, 1, 0.2),
    ]);
    // DevOps to Backend
    conns.push([
      new THREE.Vector3(1.5, -0.5, -0.3),
      new THREE.Vector3(-1.5, 1, 0.2),
    ]);
    return conns;
  }, []);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (groupRef.current) groupRef.current.rotation.y = t * 0.03;
  });

  return (
    <group ref={groupRef}>
      {/* Skill nodes */}
      {categories.map((cat) =>
        cat.skills.map((skill, i) => (
          <group key={`${cat.name}-${i}`} position={[skill.x, skill.y, skill.z]}>
            <mesh>
              <icosahedronGeometry args={[0.06, 1]} />
              <meshBasicMaterial
                color={cat.color}
                wireframe
                transparent
                opacity={0.9}
              />
            </mesh>
            <mesh>
              <sphereGeometry args={[0.03, 8, 8]} />
              <meshBasicMaterial
                color={cat.color}
                transparent
                opacity={0.3}
                blending={THREE.AdditiveBlending}
              />
            </mesh>
            <pointLight color={cat.color} intensity={0.15} distance={1} />
          </group>
        ))
      )}

      {/* Category labels (glowing centers) */}
      {categories.map((cat, i) => {
        const center = new THREE.Vector3();
        cat.skills.forEach((s) => center.add(new THREE.Vector3(s.x, s.y, s.z)));
        center.divideScalar(cat.skills.length);
        return (
          <mesh key={`cat-${i}`} position={center}>
            <sphereGeometry args={[0.04, 8, 8]} />
            <meshBasicMaterial color={cat.color} transparent opacity={0.15} blending={THREE.AdditiveBlending} />
          </mesh>
        );
      })}

      {/* Connections */}
      {connections.map(([from, to], i) => (
        <Line
          key={i}
          points={[from.x, from.y, from.z, to.x, to.y, to.z]}
          color="#d4af37"
          transparent
          opacity={0.06}
          blending={THREE.AdditiveBlending}
          lineWidth={0.5}
        />
      ))}

      {/* Ambient particles */}
      <points geometry={useMemo(() => {
        const geo = new THREE.BufferGeometry();
        const positions = new Float32Array(150 * 3);
        for (let i = 0; i < 150 * 3; i++) {
          positions[i] = (Math.random() - 0.5) * 6;
        }
        geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
        return geo;
      }, [])}>
        <pointsMaterial size={0.006} color="#d4af37" transparent opacity={0.2} blending={THREE.AdditiveBlending} depthWrite={false} />
      </points>

      <ambientLight intensity={0.03} />
    </group>
  );
}
