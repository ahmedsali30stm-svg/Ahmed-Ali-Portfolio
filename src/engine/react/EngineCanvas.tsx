"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import {
  EffectComposer,
  Bloom,
  ChromaticAberration,
  Vignette,
} from "@react-three/postprocessing";
import { BlendFunction } from "postprocessing";
import { Suspense, useEffect } from "react";
import { useEngineContext } from "./EngineProvider";
import { UniverseScene } from "../scenes/UniverseScene";
import { FloatingWorld } from "../scenes/FloatingWorld";
import { TravelOSWorld } from "../scenes/TravelOSWorld";
import { AIAgentsWorld } from "../scenes/AIAgentsWorld";
import { ProjectsWorld } from "../scenes/ProjectsWorld";
import { TimelineWorld } from "../scenes/TimelineWorld";
import { CommandCenterWorld } from "../scenes/CommandCenterWorld";
import type { SceneID } from "../types";

const WORLD_NODES: {
  id: SceneID;
  position: [number, number, number];
  color: string;
  label: string;
}[] = [
  { id: "travel-os", position: [3.5, 1, 0], color: "#d4af37", label: "Travel OS" },
  { id: "ai-agents", position: [-3, 2, 1], color: "#c0c0c0", label: "AI Agents" },
  { id: "projects", position: [2, -2, -1], color: "#d4af37", label: "Projects" },
  { id: "timeline", position: [-2.5, -1.5, 0.5], color: "#c0c0c0", label: "Timeline" },
  { id: "command-center", position: [0, 3, -2], color: "#d4af37", label: "Command Center" },
];

function EngineTicker() {
  const { engine } = useEngineContext();

  useFrame((state, delta) => {
    engine.tick(delta, state.clock.elapsedTime);
  });

  return null;
}

function PointerTracker() {
  const { engine } = useEngineContext();
  const { pointer } = useThree();

  useEffect(() => {
    engine.camera.setPointer(pointer.x, pointer.y);
  }, [pointer.x, pointer.y, engine]);

  return null;
}

function ActiveWorld() {
  const { currentScene, engine } = useEngineContext();
  const { camera } = useThree();

  // Initialize camera on mount
  useEffect(() => {
    engine.camera.init(camera as never);
  }, [camera, engine]);

  switch (currentScene) {
    case "travel-os":
      return <TravelOSWorld />;
    case "ai-agents":
      return <AIAgentsWorld />;
    case "projects":
      return <ProjectsWorld />;
    case "timeline":
      return <TimelineWorld />;
    case "command-center":
      return <CommandCenterWorld />;
    default:
      return null;
  }
}

function SceneContent() {
  const { currentScene, navigateTo } = useEngineContext();
  const isUniverse = currentScene === "universe";

  return (
    <>
      <UniverseScene />

      {/* Show floating world nodes only in universe view */}
      {isUniverse &&
        WORLD_NODES.map((world) => (
          <FloatingWorld
            key={world.id}
            position={world.position}
            color={world.color}
            label={world.label}
            onClick={() => navigateTo(world.id)}
          />
        ))}

      {/* Show active world scene */}
      <ActiveWorld />

      {/* Post-processing pipeline */}
      <EffectComposer multisampling={0}>
        <Bloom
          intensity={0.6}
          luminanceThreshold={0.15}
          luminanceSmoothing={0.9}
          mipmapBlur
        />
        <ChromaticAberration
          blendFunction={BlendFunction.NORMAL}
          offset={[0.0005, 0.0005]}
        />
        <Vignette
          offset={0.3}
          darkness={0.7}
          blendFunction={BlendFunction.NORMAL}
        />
      </EffectComposer>
    </>
  );
}

export function EngineCanvas() {
  return (
    <div className="absolute inset-0 z-0">
      <Canvas
        camera={{ position: [0, 0, 8], fov: 50 }}
        dpr={[1, 1.5]}
        gl={{
          antialias: true,
          alpha: false,
          powerPreference: "high-performance",
        }}
      >
        <Suspense fallback={null}>
          <EngineTicker />
          <PointerTracker />
          <SceneContent />
        </Suspense>
      </Canvas>
    </div>
  );
}
