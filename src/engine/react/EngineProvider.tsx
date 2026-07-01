"use client";

import { createContext, useContext, useRef, useEffect, useState } from "react";
import { ExperienceEngine } from "../core/Engine";
import type { QualityLevel, SceneID, EngineEvent } from "../types";

interface EngineContextValue {
  engine: ExperienceEngine;
  currentScene: SceneID;
  quality: QualityLevel;
  fps: number;
  navigateTo: (sceneId: SceneID) => Promise<void>;
  setQuality: (level: QualityLevel) => void;
  onEvent: (handler: (event: EngineEvent) => void) => () => void;
}

const EngineContext = createContext<EngineContextValue | null>(null);

export function useEngineContext(): EngineContextValue {
  const ctx = useContext(EngineContext);
  if (!ctx) throw new Error("useEngineContext must be used within EngineProvider");
  return ctx;
}

interface EngineProviderProps {
  children: React.ReactNode;
}

export function EngineProvider({ children }: EngineProviderProps) {
  const engineRef = useRef<ExperienceEngine | null>(null);
  const [currentScene, setCurrentScene] = useState<SceneID>("universe");
  const [quality, setQualityState] = useState<QualityLevel>("high");
  const [fps, setFps] = useState(60);

  // Create engine once
  if (!engineRef.current) {
    engineRef.current = new ExperienceEngine();
  }

  const engine = engineRef.current;

  useEffect(() => {
    engine.start();

    const unsub = engine.on((event: EngineEvent) => {
      switch (event.type) {
        case "scene:enter":
          setCurrentScene(event.sceneId);
          break;
        case "performance:quality:change":
          setQualityState(event.level);
          break;
        case "performance:fps":
          setFps(Math.round(event.fps));
          break;
      }
    });

    return () => {
      unsub();
      engine.stop();
    };
  }, [engine]);

  const navigateTo = async (sceneId: SceneID) => {
    await engine.navigateTo(sceneId);
  };

  const setQuality = (level: QualityLevel) => {
    engine.setQuality(level);
  };

  const onEvent = (handler: (event: EngineEvent) => void) => {
    return engine.on(handler);
  };

  return (
    <EngineContext.Provider
      value={{
        engine,
        currentScene,
        quality,
        fps,
        navigateTo,
        setQuality,
        onEvent,
      }}
    >
      {children}
    </EngineContext.Provider>
  );
}
