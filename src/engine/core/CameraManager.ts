import * as THREE from "three";
import gsap from "gsap";
import type { ExperienceEngine } from "./Engine";

/**
 * Cinematic camera controller with GSAP-powered transitions.
 *
 * Supports:
 * - Smooth lerp follow for pointer
 * - GSAP tween transitions between keyframes
 * - Shake, drift, and orbit modifiers
 * - FOV transitions
 */
export class CameraManager {
  private engine: ExperienceEngine;
  private _camera!: THREE.PerspectiveCamera;
  private _target = new THREE.Vector3(0, 0, 0);
  private _lookAt = new THREE.Vector3(0, 0, 0);
  private _pointer = new THREE.Vector2(0, 0);
  private _pointerStrength = 0.02;
  private _drift = { x: 0, y: 0 };
  private _driftSpeed = 0.0003;
  private _transitioning = false;
  private _timeline: gsap.core.Timeline | null = null;

  constructor(engine: ExperienceEngine) {
    this.engine = engine;
  }

  // ─── Init (called when R3F Canvas mounts) ───────────────
  init(camera: THREE.PerspectiveCamera) {
    this._camera = camera;
    this._camera.near = 0.1;
    this._camera.far = 100;
    this._camera.fov = 50;
    this._camera.position.set(0, 0, 4);
    this._camera.lookAt(0, 0, 0);
    this._camera.updateProjectionMatrix();
  }

  get camera() {
    return this._camera;
  }

  get isTransitioning() {
    return this._transitioning;
  }

  // ─── Pointer Parallax ────────────────────────────────────
  setPointer(x: number, y: number) {
    this._pointer.set(x, y);
  }

  setPointerStrength(strength: number) {
    this._pointerStrength = strength;
  }

  // ─── GSAP Transitions ───────────────────────────────────
  async transitionTo(
    position: THREE.Vector3,
    target: THREE.Vector3,
    fov: number = 50,
    duration: number = 1.8,
    ease: string = "power3.inOut"
  ) {
    if (this._transitioning) {
      this._timeline?.kill();
    }

    this._transitioning = true;

    return new Promise<void>((resolve) => {
      const tl = gsap.timeline({
        onComplete: () => {
          this._transitioning = false;
          this._timeline = null;
          resolve();
        },
      });

      tl.to(this._camera.position, {
        x: position.x,
        y: position.y,
        z: position.z,
        duration,
        ease,
      });

      tl.to(
        this._lookAt,
        {
          x: target.x,
          y: target.y,
          z: target.z,
          duration,
          ease,
        },
        0
      );

      tl.to(
        this._camera,
        {
          fov,
          duration,
          ease,
          onUpdate: () => {
            this._camera.updateProjectionMatrix();
          },
        },
        0
      );

      this._timeline = tl;
    });
  }

  // ─── Shake Effect ────────────────────────────────────────
  shake(
    intensity: number = 0.05,
    duration: number = 0.5,
    decay: number = 0.95
  ) {
    if (!this._camera) return;

    const original = this._camera.position.clone();
    let current = intensity;

    const interval = setInterval(() => {
      if (current < 0.001) {
        clearInterval(interval);
        this._camera.position.copy(original);
        return;
      }

      this._camera.position.x =
        original.x + (Math.random() - 0.5) * current;
      this._camera.position.y =
        original.y + (Math.random() - 0.5) * current;

      current *= decay;
    }, 16);

    setTimeout(() => {
      clearInterval(interval);
      this._camera.position.copy(original);
    }, duration * 1000);
  }

  // ─── Orbit Modifier ─────────────────────────────────────
  orbit(
    center: THREE.Vector3,
    radius: number,
    speed: number,
    axis: "x" | "y" | "z" = "y"
  ) {
    if (!this._camera) return;

    const pos = this._camera.position.clone();
    const offset = pos.clone().sub(center);
    const angle = Math.atan2(offset.x, offset.z);

    const newAngle = angle + speed * 0.016;
    const sin = axis === "y" ? Math.sin(newAngle) : 0;
    const cos = axis === "y" ? Math.cos(newAngle) : 0;

    this._camera.position.set(
      center.x + sin * radius,
      center.y + (axis === "x" ? Math.sin(newAngle) * radius : 0),
      center.z + cos * radius
    );
    this._camera.lookAt(center);
  }

  // ─── Frame Update ────────────────────────────────────────
  tick(delta: number) {
    if (!this._camera || this._transitioning) return;

    // Pointer parallax
    const px = this._pointer.x * this._pointerStrength;
    const py = this._pointer.y * this._pointerStrength;

    this._drift.x += this._driftSpeed * delta;
    this._drift.y += this._driftSpeed * delta * 0.7;

    // Smooth follow
    this._camera.position.x += (px + Math.sin(this._drift.x) * 0.01 - this._camera.position.x) * 0.05;
    this._camera.position.y += (py + Math.cos(this._drift.y) * 0.005 - this._camera.position.y) * 0.05;

    // Look at target
    this._camera.lookAt(this._lookAt);
  }

  // ─── Cleanup ─────────────────────────────────────────────
  dispose() {
    this._timeline?.kill();
    this._timeline = null;
  }
}
