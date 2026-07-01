"use client";

import { useEngine } from "../react";
import { SCENES } from "../scenes";

/**
 * WorldNavigator — overlay UI for navigating between worlds.
 * Shows current world, available worlds, and keyboard hints.
 */
export function WorldNavigator() {
  const { currentScene, navigateTo, fps } = useEngine();

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
      <div className="flex items-center gap-2 rounded-full border border-white/10 bg-black/40 backdrop-blur-xl px-4 py-2">
        {SCENES.map((scene) => {
          const isActive = currentScene === scene.id;
          return (
            <button
              key={scene.id}
              onClick={() => navigateTo(scene.id)}
              title={scene.description}
              className={`relative px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-300 ${
                isActive
                  ? "bg-gold/20 text-gold border border-gold/30"
                  : "text-white/50 hover:text-white/80 hover:bg-white/5"
              }`}
            >
              {scene.label}
              {isActive && (
                <span className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-gold" />
              )}
            </button>
          );
        })}
      </div>

      {/* FPS indicator (dev) */}
      <div className="text-center mt-2 text-[10px] text-white/20 font-mono">
        {fps} FPS
      </div>
    </div>
  );
}
