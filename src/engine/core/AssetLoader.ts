import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader.js";
import type { ExperienceEngine } from "./Engine";
import type { AssetDefinition, AssetLoaded, AssetType } from "../types";

type LoadedAsset = AssetLoaded & { data: unknown };

/**
 * Manages asset preloading with priority queues and progress tracking.
 *
 * Supports: textures, GLTF models, HDR environments, audio buffers, fonts.
 * Assets are cached by ID to prevent duplicate loads.
 */
export class AssetLoader {
  private engine: ExperienceEngine;
  private cache = new Map<string, LoadedAsset>();
  private loading = new Map<string, Promise<LoadedAsset>>();
  private managers: {
    texture: THREE.TextureLoader;
    model: GLTFLoader;
    audio: AudioContext | null;
  };

  constructor(engine: ExperienceEngine) {
    this.engine = engine;
    this.managers = {
      texture: new THREE.TextureLoader(),
      model: new GLTFLoader(),
      audio: null,
    };
  }

  private ensureAudioContext(): AudioContext {
    if (!this.managers.audio) {
      this.managers.audio = new AudioContext();
    }
    return this.managers.audio;
  }

  // ─── Loading ─────────────────────────────────────────────
  async load(definition: AssetDefinition): Promise<LoadedAsset> {
    // Return cached
    const cached = this.cache.get(definition.id);
    if (cached) return cached;

    // Return in-flight
    const inflight = this.loading.get(definition.id);
    if (inflight) return inflight;

    const promise = this._loadInternal(definition);
    this.loading.set(definition.id, promise);

    try {
      const result = await promise;
      this.cache.set(definition.id, result);
      return result;
    } finally {
      this.loading.delete(definition.id);
    }
  }

  async loadAll(definitions: AssetDefinition[]): Promise<LoadedAsset[]> {
    // Sort by priority
    const sorted = [...definitions].sort((a, b) => {
      const p = { high: 0, medium: 1, low: 2 };
      return (p[a.priority ?? "medium"] ?? 1) - (p[b.priority ?? "medium"] ?? 1);
    });

    const results: LoadedAsset[] = [];
    for (const def of sorted) {
      results.push(await this.load(def));
    }
    return results;
  }

  private async _loadInternal(
    def: AssetDefinition
  ): Promise<LoadedAsset> {
    switch (def.type) {
      case "texture":
        return this.loadTexture(def);
      case "model":
        return this.loadModel(def);
      case "audio":
        return this.loadAudio(def);
      case "font":
        return this.loadFont(def);
      case "json":
        return this.loadJSON(def);
      default:
        throw new Error(`[AssetLoader] Unknown asset type: ${def.type}`);
    }
  }

  private loadTexture(def: AssetDefinition): Promise<LoadedAsset> {
    return new Promise((resolve, reject) => {
      this.managers.texture.load(
        def.url,
        (texture) => {
          texture.colorSpace = THREE.SRGBColorSpace;
          resolve({ id: def.id, type: "texture", data: texture });
        },
        undefined,
        reject
      );
    });
  }

  private async loadModel(def: AssetDefinition): Promise<LoadedAsset> {
    const gltf = await new Promise<unknown>((resolve, reject) => {
      (this.managers.model as GLTFLoader).load(
        def.url,
        resolve,
        undefined,
        reject
      );
    });
    return { id: def.id, type: "model", data: gltf };
  }

  private async loadAudio(def: AssetDefinition): Promise<LoadedAsset> {
    const response = await fetch(def.url);
    const arrayBuffer = await response.arrayBuffer();
    const ctx = this.ensureAudioContext();
    const audioBuffer = await ctx.decodeAudioData(arrayBuffer);
    return { id: def.id, type: "audio", data: audioBuffer };
  }

  private async loadFont(def: AssetDefinition): Promise<LoadedAsset> {
    const font = new FontFace(
      def.id,
      `url(${def.url})`
    );
    await font.load();
    document.fonts.add(font);
    return { id: def.id, type: "font", data: font };
  }

  private async loadJSON(def: AssetDefinition): Promise<LoadedAsset> {
    const response = await fetch(def.url);
    const data = await response.json();
    return { id: def.id, type: "json", data };
  }

  // ─── Accessors ───────────────────────────────────────────
  get<T = unknown>(id: string): T | undefined {
    return this.cache.get(id)?.data as T | undefined;
  }

  has(id: string): boolean {
    return this.cache.has(id);
  }

  // ─── Cleanup ─────────────────────────────────────────────
  dispose() {
    for (const [, asset] of this.cache) {
      if (asset.type === "texture") {
        (asset.data as THREE.Texture).dispose();
      }
    }
    this.cache.clear();
    this.loading.clear();
  }
}
