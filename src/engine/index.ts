// Core
export { ExperienceEngine } from "./core/Engine";
export { SceneManager } from "./core/SceneManager";
export { CameraManager } from "./core/CameraManager";
export { AssetLoader } from "./core/AssetLoader";
export { AudioManager } from "./core/AudioManager";
export { PerformanceManager } from "./core/PerformanceManager";
export { InputManager } from "./core/InputManager";

// Types
export type {
  SceneID,
  SceneDefinition,
  SceneState,
  CameraKeyframe,
  AssetDefinition,
  AudioTrack,
  AudioChannel,
  QualityLevel,
  PerformanceBudget,
  EngineEvent,
  EngineEventHandler,
} from "./types";

// React
export {
  EngineProvider,
  useEngine,
  useEngineContext,
  useEngineEvent,
} from "./react";

// Components
export { EngineCanvas } from "./react/EngineCanvas";
export { WorldNavigator, SceneOverlay } from "./ui";

// Scenes
export { SCENES, UniverseScene, FloatingWorld } from "./scenes";
