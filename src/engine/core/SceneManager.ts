import type { ExperienceEngine } from "./Engine";
import type {
  SceneDefinition,
  SceneID,
  SceneState,
  EngineEvent,
} from "../types";

interface SceneEntry {
  definition: SceneDefinition;
  state: SceneState;
  progress: number;
}

/**
 * Manages scene registration, lifecycle, and state transitions.
 *
 * Scenes are registered declaratively; the engine controls
 * when each scene loads, enters, and exits.
 */
export class SceneManager {
  private scenes = new Map<SceneID, SceneEntry>();
  private engine: ExperienceEngine;

  constructor(engine: ExperienceEngine) {
    this.engine = engine;
  }

  // ─── Registration ────────────────────────────────────────
  register(definition: SceneDefinition) {
    if (this.scenes.has(definition.id)) {
      console.warn(`[SceneManager] Scene "${definition.id}" already registered`);
      return;
    }
    this.scenes.set(definition.id, {
      definition,
      state: "idle",
      progress: 0,
    });
  }

  registerAll(definitions: SceneDefinition[]) {
    for (const def of definitions) {
      this.register(def);
    }
  }

  // ─── Queries ─────────────────────────────────────────────
  get(id: SceneID): SceneDefinition | undefined {
    return this.scenes.get(id)?.definition;
  }

  getState(id: SceneID): SceneState {
    return this.scenes.get(id)?.state ?? "idle";
  }

  getProgress(id: SceneID): number {
    return this.scenes.get(id)?.progress ?? 0;
  }

  all(): SceneDefinition[] {
    return Array.from(this.scenes.values()).map((e) => e.definition);
  }

  states(): [SceneID, SceneState][] {
    return Array.from(this.scenes.entries()).map(([id, e]) => [id, e.state]);
  }

  // ─── Loading ─────────────────────────────────────────────
  async load(id: SceneID) {
    const entry = this.scenes.get(id);
    if (!entry) return;
    if (entry.state === "ready" || entry.state === "active") return;

    entry.state = "loading";
    entry.progress = 0;
    this.emit({
      type: "scene:loading",
      sceneId: id,
      progress: 0,
    });

    try {
      if (entry.definition.load) {
        await entry.definition.load();
      }
      entry.state = "ready";
      entry.progress = 1;
      this.emit({ type: "scene:ready", sceneId: id });
    } catch (e) {
      console.error(`[SceneManager] Failed to load scene "${id}":`, e);
      entry.state = "error";
    }
  }

  async loadAll(ids?: SceneID[]) {
    const toLoad = ids ?? Array.from(this.scenes.keys());
    await Promise.all(toLoad.map((id) => this.load(id)));
  }

  // ─── State Management ────────────────────────────────────
  setActive(id: SceneID) {
    for (const [sid, entry] of this.scenes) {
      if (sid === id) {
        entry.state = "active";
      } else if (entry.state === "active") {
        entry.state = "ready";
      }
    }
  }

  // ─── Frame Update ────────────────────────────────────────
  tick(_delta: number, _elapsed: number) {
    // Future: per-scene update hooks
  }

  // ─── Cleanup ─────────────────────────────────────────────
  dispose() {
    this.scenes.clear();
  }

  private emit(event: EngineEvent) {
    this.engine.emit(event);
  }
}
