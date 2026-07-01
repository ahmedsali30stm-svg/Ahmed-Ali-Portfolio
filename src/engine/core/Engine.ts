import * as THREE from "three";
import { SceneManager } from "./SceneManager";
import { CameraManager } from "./CameraManager";
import { AssetLoader } from "./AssetLoader";
import { AudioManager } from "./AudioManager";
import { PerformanceManager } from "./PerformanceManager";
import { InputManager } from "./InputManager";
import type {
  EngineEvent,
  EngineEventHandler,
  SceneID,
  QualityLevel,
} from "../types";

/**
 * ExperienceEngine — the core orchestrator for PROJECT SOVEREIGN.
 *
 * Owns all managers, routes events, and provides a single
 * interface for React components to interact with the 3D world.
 */
export class ExperienceEngine {
  readonly scene: SceneManager;
  readonly camera: CameraManager;
  readonly assets: AssetLoader;
  readonly audio: AudioManager;
  readonly performance: PerformanceManager;
  readonly input: InputManager;

  private listeners = new Set<EngineEventHandler>();
  private _running = false;
  private _currentScene: SceneID = "universe";

  constructor(gl?: WebGLRenderingContext) {
    this.scene = new SceneManager(this);
    this.camera = new CameraManager(this);
    this.assets = new AssetLoader(this);
    this.audio = new AudioManager(this);
    this.performance = new PerformanceManager(this);
    this.input = new InputManager(this);

    if (gl) {
      this.performance.init(gl);
    }
  }

  // ─── Lifecycle ───────────────────────────────────────────
  start() {
    if (this._running) return;
    this._running = true;
    this.input.start();
    this.performance.start();
  }

  stop() {
    if (!this._running) return;
    this._running = false;
    this.input.stop();
    this.performance.stop();
    this.audio.stopAll();
  }

  /** Called every frame from R3F useFrame */
  tick(delta: number, elapsed: number) {
    if (!this._running) return;
    this.camera.tick(delta);
    this.scene.tick(delta, elapsed);
    this.performance.tick(delta);
  }

  // ─── Scene Navigation ────────────────────────────────────
  async navigateTo(sceneId: SceneID) {
    if (sceneId === this._currentScene) return;

    const current = this.scene.get(this._currentScene);
    const next = this.scene.get(sceneId);
    if (!next) return;

    // Exit current
    if (current?.onExit) await current.onExit();
    this.emit({ type: "scene:exit", sceneId: this._currentScene });

    // Transition camera
    this.emit({ type: "camera:transition:start" });
    await this.camera.transitionTo(
      next.camera.position,
      next.camera.target,
      next.camera.fov ?? 50
    );
    this.emit({ type: "camera:transition:complete" });

    // Enter new scene
    this._currentScene = sceneId;
    if (next.onEnter) await next.onEnter();
    this.emit({ type: "scene:enter", sceneId });

    this.scene.setActive(sceneId);
  }

  get currentScene(): SceneID {
    return this._currentScene;
  }

  // ─── Event Bus ───────────────────────────────────────────
  on(handler: EngineEventHandler): () => void {
    this.listeners.add(handler);
    return () => this.listeners.delete(handler);
  }

  emit(event: EngineEvent) {
    for (const handler of this.listeners) {
      try {
        handler(event);
      } catch (e) {
        console.error("[Engine] Event handler error:", e);
      }
    }
  }

  // ─── Quality ─────────────────────────────────────────────
  setQuality(level: QualityLevel) {
    this.performance.setQuality(level);
    this.emit({ type: "performance:quality:change", level });
  }

  // ─── Cleanup ─────────────────────────────────────────────
  dispose() {
    this.stop();
    this.scene.dispose();
    this.assets.dispose();
    this.audio.dispose();
    this.input.dispose();
    this.listeners.clear();
  }
}
