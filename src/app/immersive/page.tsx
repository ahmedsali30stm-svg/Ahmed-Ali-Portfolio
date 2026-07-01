"use client";

import dynamic from "next/dynamic";
import { EngineProvider } from "@/engine";
import { WorldNavigator, SceneOverlay } from "@/engine/ui";

const EngineCanvas = dynamic(
  () => import("@/engine").then((m) => m.EngineCanvas),
  { ssr: false }
);
const CinematicLoader = dynamic(
  () => import("@/engine/ui/CinematicLoader").then((m) => m.CinematicLoader),
  { ssr: false }
);

/**
 * Immersive V2 — PROJECT SOVEREIGN
 *
 * Full 3D universe with cinematic camera navigation,
 * interactive worlds, and real-time performance scaling.
 */
export default function ImmersivePage() {
  return (
    <EngineProvider>
      <main className="relative w-screen h-screen overflow-hidden bg-[#050508]">
        {/* Cinematic entry loader */}
        <CinematicLoader />

        {/* 3D Engine Canvas */}
        <EngineCanvas />

        {/* UI Overlays */}
        <SceneOverlay />
        <WorldNavigator />

        {/* Instructions */}
        <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-50 text-center">
          <p className="text-xs text-white/30 font-light tracking-wider">
            Click a world to explore — or use the navigation below
          </p>
        </div>
      </main>
    </EngineProvider>
  );
}
