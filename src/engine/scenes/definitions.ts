import * as THREE from "three";
import type { SceneDefinition } from "../types";

/**
 * All scene definitions for PROJECT SOVEREIGN.
 * Each scene has a camera position, target, and lifecycle hooks.
 */
export const SCENES: SceneDefinition[] = [
  {
    id: "universe",
    label: "Ahmed's Universe",
    description: "The central hub — a constellation of worlds orbiting the core.",
    camera: {
      position: new THREE.Vector3(0, 0, 8),
      target: new THREE.Vector3(0, 0, 0),
      fov: 50,
    },
  },
  {
    id: "travel-os",
    label: "Travel OS",
    description: "The travel technology platform — routes, experiences, operations.",
    camera: {
      position: new THREE.Vector3(5, 2, 6),
      target: new THREE.Vector3(0, 1, 0),
      fov: 45,
    },
  },
  {
    id: "ai-agents",
    label: "AI Agents",
    description: "Autonomous intelligence — agents, orchestration, decision systems.",
    camera: {
      position: new THREE.Vector3(-4, 3, 5),
      target: new THREE.Vector3(0, 0, 0),
      fov: 50,
    },
  },
  {
    id: "projects",
    label: "Projects",
    description: "Portfolio showcase — case studies, metrics, outcomes.",
    camera: {
      position: new THREE.Vector3(3, -1, 6),
      target: new THREE.Vector3(0, 0, 0),
      fov: 45,
    },
  },
  {
    id: "timeline",
    label: "Timeline",
    description: "Career journey — milestones, growth, impact.",
    camera: {
      position: new THREE.Vector3(0, 4, 7),
      target: new THREE.Vector3(0, 0, 0),
      fov: 55,
    },
  },
  {
    id: "command-center",
    label: "Command Center",
    description: "AI assistant interface — commands, navigation, control.",
    camera: {
      position: new THREE.Vector3(0, 0, 3),
      target: new THREE.Vector3(0, 0, 0),
      fov: 40,
    },
  },
  {
    id: "contact",
    label: "Contact",
    description: "Communication hub — email, LinkedIn, GitHub, location.",
    camera: {
      position: new THREE.Vector3(0, 1, 5),
      target: new THREE.Vector3(0, 0, 0),
      fov: 50,
    },
  },
  {
    id: "skills",
    label: "Skills",
    description: "Skill constellation — frontend, backend, AI/ML, DevOps.",
    camera: {
      position: new THREE.Vector3(0, 0, 6),
      target: new THREE.Vector3(0, 0, 0),
      fov: 50,
    },
  },
];
