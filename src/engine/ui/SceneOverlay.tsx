"use client";

import { useEngine, useEngineEvent } from "../react";
import { SCENES } from "../scenes";
import { useState } from "react";

/**
 * SceneOverlay — displays current scene info and transition state.
 */
export function SceneOverlay() {
  const { currentScene } = useEngine();
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEngineEvent("camera:transition:start", () => setIsTransitioning(true));
  useEngineEvent("camera:transition:complete", () =>
    setIsTransitioning(false)
  );

  const scene = SCENES.find((s) => s.id === currentScene);

  return (
    <>
      {/* Transition overlay */}
      <div
        className={`fixed inset-0 z-40 bg-black pointer-events-none transition-opacity duration-700 ${
          isTransitioning ? "opacity-30" : "opacity-0"
        }`}
      />

      {/* Scene title */}
      <div className="fixed top-6 left-6 z-50">
        <h1 className="text-sm font-medium text-white/60 tracking-widest uppercase">
          {scene?.label ?? "Loading..."}
        </h1>
        <p className="text-xs text-white/30 mt-1 max-w-[200px]">
          {scene?.description}
        </p>
      </div>
    </>
  );
}
