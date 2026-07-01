import * as THREE from "three";
import type { ExperienceEngine } from "./Engine";

/**
 * Abstracts pointer, keyboard, and touch input into a unified interface.
 *
 * Provides normalized pointer position (-1 to 1), scroll delta,
 * and key states for the engine.
 */
export class InputManager {
  private engine: ExperienceEngine;
  private _pointer = new THREE.Vector2(0, 0);
  private _scroll = 0;
  private _keys = new Set<string>();
  private _touchDevice = false;
  private _running = false;

  // Bound handlers
  private onPointerMove = this.handlePointerMove.bind(this);
  private onWheel = this.handleWheel.bind(this);
  private onKeyDown = this.handleKeyDown.bind(this);
  private onKeyUp = this.handleKeyUp.bind(this);
  private onTouchStart = this.handleTouchStart.bind(this);

  constructor(engine: ExperienceEngine) {
    this.engine = engine;
    if (typeof window !== "undefined") {
      this._touchDevice = "ontouchstart" in window;
    }
  }

  get pointer(): Readonly<THREE.Vector2> {
    return this._pointer;
  }

  get scroll(): number {
    return this._scroll;
  }

  get touchDevice(): boolean {
    return this._touchDevice;
  }

  isKeyDown(key: string): boolean {
    return this._keys.has(key);
  }

  // ─── Lifecycle ───────────────────────────────────────────
  start() {
    if (this._running || typeof window === "undefined") return;
    this._running = true;

    window.addEventListener("pointermove", this.onPointerMove, {
      passive: true,
    });
    window.addEventListener("wheel", this.onWheel, { passive: true });
    window.addEventListener("keydown", this.onKeyDown);
    window.addEventListener("keyup", this.onKeyUp);
    window.addEventListener("touchstart", this.onTouchStart, {
      passive: true,
    });
  }

  stop() {
    if (!this._running || typeof window === "undefined") return;
    this._running = false;

    window.removeEventListener("pointermove", this.onPointerMove);
    window.removeEventListener("wheel", this.onWheel);
    window.removeEventListener("keydown", this.onKeyDown);
    window.removeEventListener("keyup", this.onKeyUp);
    window.removeEventListener("touchstart", this.onTouchStart);
  }

  // ─── Handlers ────────────────────────────────────────────
  private handlePointerMove(e: PointerEvent) {
    // Normalize to -1..1
    this._pointer.set(
      (e.clientX / window.innerWidth) * 2 - 1,
      -(e.clientY / window.innerHeight) * 2 + 1
    );
    this.engine.emit({ type: "input:pointer", position: this._pointer });
  }

  private handleWheel(e: WheelEvent) {
    this._scroll = e.deltaY;
    this.engine.emit({ type: "input:scroll", delta: e.deltaY });
    // Decay scroll
    setTimeout(() => {
      this._scroll = 0;
    }, 100);
  }

  private handleKeyDown(e: KeyboardEvent) {
    this._keys.add(e.key);
  }

  private handleKeyUp(e: KeyboardEvent) {
    this._keys.delete(e.key);
  }

  private handleTouchStart() {
    this._touchDevice = true;
  }

  // ─── Cleanup ─────────────────────────────────────────────
  dispose() {
    this.stop();
    this._keys.clear();
  }
}
