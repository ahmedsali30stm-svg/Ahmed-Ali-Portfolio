import * as THREE from "three";

// ─── Scene Lifecycle ───────────────────────────────────────
export type SceneID =
  | "universe"
  | "travel-os"
  | "ai-agents"
  | "projects"
  | "timeline"
  | "command-center"
  | "contact"
  | "skills";

export type SceneState = "idle" | "loading" | "ready" | "active" | "exiting" | "error";

export interface SceneDefinition {
  id: SceneID;
  label: string;
  description: string;
  /** Camera position when entering this scene */
  camera: {
    position: THREE.Vector3;
    target: THREE.Vector3;
    fov?: number;
  };
  /** Optional load function for heavy assets */
  load?: () => Promise<void>;
  /** Called when scene becomes active */
  onEnter?: () => void | Promise<void>;
  /** Called when scene is exiting */
  onExit?: () => void | Promise<void>;
}

// ─── Camera ────────────────────────────────────────────────
export interface CameraKeyframe {
  position: THREE.Vector3;
  target: THREE.Vector3;
  fov: number;
  duration: number;
  ease?: string;
}

export interface CameraTransition {
  from: CameraKeyframe;
  to: CameraKeyframe;
  onComplete?: () => void;
}

// ─── Assets ────────────────────────────────────────────────
export type AssetType = "texture" | "model" | "audio" | "font" | "json";

export interface AssetDefinition {
  id: string;
  type: AssetType;
  url: string;
  priority?: "high" | "medium" | "low";
}

export interface AssetLoaded {
  id: string;
  type: AssetType;
  data: THREE.Texture | THREE.Group | AudioBuffer | FontFace | unknown;
}

// ─── Audio ─────────────────────────────────────────────────
export type AudioChannel = "music" | "sfx" | "ambient" | "voice";

export interface AudioTrack {
  id: string;
  channel: AudioChannel;
  url: string;
  loop?: boolean;
  volume?: number;
}

// ─── Performance ───────────────────────────────────────────
export type QualityLevel = "low" | "medium" | "high" | "ultra";

export interface PerformanceBudget {
  maxParticles: number;
  maxDrawCalls: number;
  targetFPS: number;
  shadowMapSize: number;
  postProcessing: boolean;
}

// ─── Engine Events ─────────────────────────────────────────
export type EngineEvent =
  | { type: "scene:loading"; sceneId: SceneID; progress: number }
  | { type: "scene:ready"; sceneId: SceneID }
  | { type: "scene:enter"; sceneId: SceneID }
  | { type: "scene:exit"; sceneId: SceneID }
  | { type: "camera:transition:start" }
  | { type: "camera:transition:complete" }
  | { type: "performance:quality:change"; level: QualityLevel }
  | { type: "performance:fps"; fps: number }
  | { type: "input:pointer"; position: THREE.Vector2 }
  | { type: "input:scroll"; delta: number };

export type EngineEventHandler = (event: EngineEvent) => void;
