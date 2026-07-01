"use client";

import { useState, useEffect, useCallback } from "react";
import { useEngineEvent } from "../react";

/**
 * CinematicLoader — the entry experience for PROJECT SOVEREIGN.
 *
 * A split-screen reveal with:
 * - Geometric wireframe logo animation
 * - Loading progress bar
 * - Typewriter text reveal
 * - Exit animation (fade to black, then dissolve)
 */
export function CinematicLoader() {
  const [progress, setProgress] = useState(0);
  const [phase, setPhase] = useState<"loading" | "ready" | "exiting">("loading");
  const [textReveal, setTextReveal] = useState("");

  const fullText = "PROJECT SOVEREIGN";

  // Simulate loading progress
  useEffect(() => {
    if (phase !== "loading") return;

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setPhase("ready");
          return 100;
        }
        return prev + Math.random() * 8 + 2;
      });
    }, 120);

    return () => clearInterval(interval);
  }, [phase]);

  // Typewriter effect
  useEffect(() => {
    if (phase !== "ready") return;

    let i = 0;
    const interval = setInterval(() => {
      if (i <= fullText.length) {
        setTextReveal(fullText.slice(0, i));
        i++;
      } else {
        clearInterval(interval);
        setTimeout(() => setPhase("exiting"), 1200);
      }
    }, 80);

    return () => clearInterval(interval);
  }, [phase]);

  const handleTransitionComplete = useCallback(() => {
    // This is called when the engine finishes its first transition
  }, []);

  useEngineEvent("camera:transition:complete", handleTransitionComplete);

  if (phase === "exiting") {
    return (
      <div className="fixed inset-0 z-[100] bg-[#050508] animate-fadeOut pointer-events-none" />
    );
  }

  return (
    <div className="fixed inset-0 z-[100] bg-[#050508] flex items-center justify-center">
      <div className="relative w-full h-full flex flex-col items-center justify-center">
        {/* Geometric wireframe logo */}
        <div className="relative w-32 h-32 mb-8">
          <svg viewBox="0 0 100 100" className="w-full h-full animate-spin-slow">
            {/* Outer octagon */}
            <polygon
              points="50,5 90,25 95,70 65,95 35,95 5,70 10,25 50,5"
              fill="none"
              stroke="#d4af37"
              strokeWidth="0.5"
              opacity={Math.min(progress / 30, 1)}
            />
            {/* Inner hexagon */}
            <polygon
              points="50,20 80,35 80,65 50,80 20,65 20,35"
              fill="none"
              stroke="#c0c0c0"
              strokeWidth="0.3"
              opacity={Math.min(progress / 60, 1)}
            />
            {/* Center diamond */}
            <polygon
              points="50,35 65,50 50,65 35,50"
              fill="none"
              stroke="#d4af37"
              strokeWidth="0.8"
              opacity={Math.min(progress / 80, 1)}
            />
            {/* Center dot */}
            <circle
              cx="50"
              cy="50"
              r="2"
              fill="#d4af37"
              opacity={progress > 90 ? 1 : 0}
            />
          </svg>
        </div>

        {/* Title */}
        <div className="h-8 overflow-hidden">
          <h1 className="text-xl tracking-[0.5em] text-white/80 font-light">
            {textReveal}
          </h1>
        </div>

        {/* Progress bar */}
        <div className="mt-8 w-48 h-px bg-white/10 relative overflow-hidden">
          <div
            className="absolute inset-y-0 left-0 bg-gradient-to-r from-gold to-gold/50 transition-all duration-200"
            style={{ width: `${Math.min(progress, 100)}%` }}
          />
        </div>

        {/* Progress text */}
        <p className="mt-3 text-[10px] tracking-[0.3em] text-white/20 font-mono">
          {Math.min(Math.round(progress), 100)}%
        </p>

        {/* Subtitle */}
        <p className="mt-6 text-[11px] tracking-[0.2em] text-white/15 uppercase">
          Digital Universe Experience
        </p>
      </div>
    </div>
  );
}
