"use client";

import { useEngine } from "../react";
import { useIsMobile } from "../react/useReducedMotion";
import { SCENES } from "../scenes";

/**
 * WorldNavigator — overlay UI for navigating between worlds.
 * Touch-friendly with larger tap targets on mobile.
 */
export function WorldNavigator() {
  const { currentScene, navigateTo, fps } = useEngine();
  const isMobile = useIsMobile();

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
      <div
        className={`flex items-center gap-1 rounded-full border border-white/10 bg-black/40 backdrop-blur-xl ${
          isMobile ? "px-2 py-1.5 gap-0.5" : "px-4 py-2 gap-2"
        }`}
      >
        {SCENES.map((scene) => {
          const isActive = currentScene === scene.id;
          return (
            <button
              key={scene.id}
              onClick={() => navigateTo(scene.id)}
              title={scene.description}
              className={`relative rounded-full font-medium transition-all duration-300 ${
                isMobile ? "px-2 py-2 text-[10px]" : "px-3 py-1.5 text-xs"
              } ${
                isActive
                  ? "bg-gold/20 text-gold border border-gold/30"
                  : "text-white/50 hover:text-white/80 hover:bg-white/5"
              }`}
            >
              {isMobile ? scene.label.split(" ")[0] : scene.label}
              {isActive && (
                <span className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-gold" />
              )}
            </button>
          );
        })}
      </div>

      {/* FPS indicator (hidden on mobile) */}
      {!isMobile && (
        <div className="text-center mt-2 text-[10px] text-white/20 font-mono">
          {fps} FPS
        </div>
      )}
    </div>
  );
}
