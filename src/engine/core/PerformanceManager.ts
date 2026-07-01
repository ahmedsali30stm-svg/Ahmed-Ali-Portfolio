import type { ExperienceEngine } from "./Engine";
import type { QualityLevel, PerformanceBudget } from "../types";

const BUDGETS: Record<QualityLevel, PerformanceBudget> = {
  low: {
    maxParticles: 500,
    maxDrawCalls: 50,
    targetFPS: 30,
    shadowMapSize: 512,
    postProcessing: false,
  },
  medium: {
    maxParticles: 1000,
    maxDrawCalls: 100,
    targetFPS: 45,
    shadowMapSize: 1024,
    postProcessing: true,
  },
  high: {
    maxParticles: 2000,
    maxDrawCalls: 200,
    targetFPS: 60,
    shadowMapSize: 2048,
    postProcessing: true,
  },
  ultra: {
    maxParticles: 4000,
    maxDrawCalls: 400,
    targetFPS: 60,
    shadowMapSize: 4096,
    postProcessing: true,
  },
};

/**
 * Manages performance budgets, quality scaling, and FPS monitoring.
 *
 * Automatically downgrades quality when FPS drops below target.
 * Provides budgets for particle count, draw calls, shadow maps.
 */
export class PerformanceManager {
  private engine: ExperienceEngine;
  private _quality: QualityLevel = "high";
  private _fps = 60;
  private _fpsHistory: number[] = [];
  private _frameCount = 0;
  private _lastTime = 0;
  private _running = false;
  private _autoAdapt = true;
  private _gl: WebGLRenderingContext | null = null;

  constructor(engine: ExperienceEngine) {
    this.engine = engine;
  }

  init(gl: WebGLRenderingContext) {
    this._gl = gl;
  }

  get quality(): QualityLevel {
    return this._quality;
  }

  get budget(): PerformanceBudget {
    return BUDGETS[this._quality];
  }

  get fps(): number {
    return this._fps;
  }

  set autoAdapt(value: boolean) {
    this._autoAdapt = value;
  }

  // ─── Quality Control ─────────────────────────────────────
  setQuality(level: QualityLevel) {
    this._quality = level;
  }

  private downgrade() {
    const levels: QualityLevel[] = ["ultra", "high", "medium", "low"];
    const idx = levels.indexOf(this._quality);
    if (idx < levels.length - 1) {
      this._quality = levels[idx + 1];
      console.log(`[Performance] Downgraded to ${this._quality}`);
    }
  }

  private upgrade() {
    const levels: QualityLevel[] = ["low", "medium", "high", "ultra"];
    const idx = levels.indexOf(this._quality);
    if (idx > 0) {
      this._quality = levels[idx - 1];
      console.log(`[Performance] Upgraded to ${this._quality}`);
    }
  }

  // ─── FPS Monitoring ──────────────────────────────────────
  start() {
    this._running = true;
    this._lastTime = performance.now();
    this._frameCount = 0;
  }

  stop() {
    this._running = false;
  }

  tick(delta: number) {
    if (!this._running) return;

    this._frameCount++;
    this._fpsHistory.push(1 / delta);
    if (this._fpsHistory.length > 60) {
      this._fpsHistory.shift();
    }

    // Update FPS every 30 frames
    if (this._frameCount % 30 === 0) {
      this._fps =
        this._fpsHistory.reduce((a, b) => a + b, 0) /
        this._fpsHistory.length;

      this.engine.emit({ type: "performance:fps", fps: this._fps });

      // Auto-adapt quality
      if (this._autoAdapt) {
        const target = BUDGETS[this._quality].targetFPS;
        if (this._fps < target * 0.85) {
          this.downgrade();
        } else if (this._fps > target * 1.15) {
          this.upgrade();
        }
      }
    }
  }

  // ─── Draw Call Monitoring ─────────────────────────────────
  getDrawCalls(): number {
    if (!this._gl) return 0;
    const ext = this._gl.getExtension("WEBGL_debug_renderer_info");
    if (!ext) return 0;
    return this._gl.getParameter(0x9245) as number; // UNIFORMS_WEBGL
  }

  // ─── Device Detection ────────────────────────────────────
  static detectQuality(): QualityLevel {
    if (typeof window === "undefined") return "high";

    // Mobile: cap at medium
    const isMobile = /Android|iPhone|iPad|iPod|Opera Mini/i.test(
      navigator.userAgent
    );

    const gl = document.createElement("canvas").getContext("webgl2");
    if (!gl) return "low";

    const debugInfo = gl.getExtension("WEBGL_debug_renderer_info");
    if (!debugInfo) return isMobile ? "low" : "medium";

    const renderer = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL);
    const lower = renderer.toLowerCase();

    if (isMobile) {
      if (lower.includes("apple") || lower.includes("adreno 7")) {
        return "medium";
      }
      return "low";
    }

    if (
      lower.includes("rtx") ||
      lower.includes("radeon rx 6") ||
      lower.includes("radeon rx 7") ||
      lower.includes("apple m")
    ) {
      return "ultra";
    }
    if (
      lower.includes("gtx") ||
      lower.includes("radeon") ||
      lower.includes("intel iris")
    ) {
      return "high";
    }
    if (lower.includes("intel") || lower.includes("adreno")) {
      return "medium";
    }
    return "low";
  }

  // ─── Cleanup ─────────────────────────────────────────────
  dispose() {
    this.stop();
    this._fpsHistory = [];
  }
}
