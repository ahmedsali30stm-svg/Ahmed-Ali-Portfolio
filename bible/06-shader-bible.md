# Volume 6 — Shader Bible

## PROJECT SOVEREIGN — The Digital Universe of Ahmed Ali

> Complete GLSL shader documentation, line-by-line analysis, and modification guide for OpenCode agents.

---

## Table of Contents

1. [Shader Overview](#1-shader-overview)
2. [Vertex Shader — Line-by-Line](#2-vertex-shader--line-by-line)
3. [Fragment Shader — Line-by-Line](#3-fragment-shader--line-by-line)
4. [Uniforms Reference](#4-uniforms-reference)
5. [Attributes Reference](#5-attributes-reference)
6. [Varyings Reference](#6-varyings-reference)
7. [Simplex Noise Implementation](#7-simplex-noise-implementation)
8. [Color Palette](#8-color-palette)
9. [Visual Effects Breakdown](#9-visual-effects-breakdown)
10. [Performance Considerations](#10-performance-considerations)
11. [Modification Guide](#11-modification-guide)

---

## 1. Shader Overview

**File:** `src/shaders/particle.ts`

Two GLSL shaders exported as TypeScript string constants:
- `particleVertexShader` — 81 lines
- `particleFragmentShader` — 36 lines

**Pipeline:**
```
Geometry (2000 points on sphere)
    ↓
Vertex Shader (displacement, size, varyings)
    ↓
Rasterization (point → fragments)
    ↓
Fragment Shader (color, alpha, glow)
    ↓
Additive Blending (transparent, overlapping)
    ↓
Bloom Post-Processing (glow on bright pixels)
    ↓
Screen
```

### Shader Material Configuration

```typescript
new THREE.ShaderMaterial({
  vertexShader: particleVertexShader,
  fragmentShader: particleFragmentShader,
  uniforms: {
    uTime: { value: 0 },
    uPixelRatio: { value: Math.min(window.devicePixelRatio, 2) },
  },
  transparent: true,
  blending: THREE.AdditiveBlending,
  depthWrite: false,
});
```

| Setting | Value | Purpose |
|---------|-------|---------|
| `transparent` | true | Enables alpha blending |
| `blending` | Additive | Particles glow brighter when overlapping |
| `depthWrite` | false | Prevents z-fighting between particles |

---

## 2. Vertex Shader — Line-by-Line

### Uniforms

```glsl
uniform float uTime;        // Elapsed time in seconds (0 → ∞)
uniform float uPixelRatio;  // Device pixel ratio (1.0–2.0)
```

### Attributes

```glsl
attribute float aSize;  // Per-particle size (0.5–2.0)
```

### Varyings (Output to Fragment)

```glsl
varying float vDistance;  // Distance from camera (for fog)
varying float vPulse;     // Pulsing glow value
```

### Simplex Noise Functions

```glsl
// Modulo 289 — prevents GPU float precision issues
vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }

// Permutation function — generates pseudo-random values
vec4 permute(vec4 x) { return mod289(((x * 34.0) + 1.0) * x); }

// Taylor inverse square root — fast approximation
vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }
```

### Main Function

```glsl
void main() {
  vec3 pos = position;  // Copy original position

  // ── Effect 1: Organic Breathing ──────────────────────────────
  float noise = snoise(pos * 0.3 + uTime * 0.15);
  pos += normalize(pos) * noise * 0.12;

  // ── Effect 2: Subtle Wave Ripple ─────────────────────────────
  float wave = sin(pos.x * 2.0 + uTime * 0.4) * 0.05;
  pos.y += wave;

  // ── Transform to View Space ──────────────────────────────────
  vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);

  // ── Pass Distance to Fragment ────────────────────────────────
  vDistance = -mvPosition.z;  // Negate because camera looks down -Z

  // ── Effect 3: Pulsing Glow ───────────────────────────────────
  vPulse = 0.5 + 0.5 * sin(uTime * 1.2 + length(position) * 0.5);

  // ── Final Position ───────────────────────────────────────────
  gl_Position = projectionMatrix * mvPosition;

  // ── Point Size with Perspective ──────────────────────────────
  gl_PointSize = aSize * uPixelRatio * (180.0 / -mvPosition.z);
}
```

### Effect Analysis

**Effect 1 — Organic Breathing:**
- `snoise(pos * 0.3 + uTime * 0.15)` — 3D noise sampled at scaled position + time
- `normalize(pos)` — Displaces outward from center (radial breathing)
- `* 0.12` — Amplitude: 12% of radius
- **Visual:** Particles gently pulsate in/out like breathing

**Effect 2 — Wave Ripple:**
- `sin(pos.x * 2.0 + uTime * 0.4)` — Horizontal wave moving rightward
- `* 0.05` — Amplitude: 5% of unit
- **Visual:** Subtle horizontal wave across the particle field

**Effect 3 — Pulsing Glow:**
- `sin(uTime * 1.2 + length(position) * 0.5)` — Phase varies by distance from center
- `0.5 + 0.5 *` — Maps [-1,1] to [0,1]
- **Visual:** Each particle pulses at a different phase based on its radius

**Point Size:**
- `180.0 / -mvPosition.z` — Perspective division (closer = larger)
- `* uPixelRatio` — HiDPI scaling

---

## 3. Fragment Shader — Line-by-Line

### Uniforms

```glsl
uniform float uTime;  // Elapsed time (unused in current fragment, available for future)
```

### Varyings (Input from Vertex)

```glsl
varying float vDistance;  // Distance from camera
varying float vPulse;     // Pulsing glow value
```

### Main Function

```glsl
void main() {
  // ── Step 1: Circular Point Shape ──────────────────────────────
  vec2 uv = gl_PointCoord - 0.5;  // Center UV at (0,0), range [-0.5, 0.5]
  float dist = length(uv);         // Distance from center (0–0.5)
  if (dist > 0.5) discard;         // Discard corners → circle

  // ── Step 2: Soft Edge Falloff ─────────────────────────────────
  float alpha = 1.0 - smoothstep(0.0, 0.5, dist);
  // 1.0 at center → 0.0 at edge

  // ── Step 3: Three-Color Radial Gradient ───────────────────────
  vec3 coreColor = vec3(1.0, 0.84, 0.0);     // Pure gold (#FFD700)
  vec3 midColor  = vec3(0.95, 0.65, 0.1);    // Amber
  vec3 edgeColor = vec3(0.8, 0.3, 0.05);     // Deep amber

  vec3 color = mix(coreColor, midColor, smoothstep(0.0, 0.3, dist));
  color = mix(color, edgeColor, smoothstep(0.3, 0.5, dist));

  // ── Step 4: Bioluminescent Pulse ─────────────────────────────
  float pulse = 0.7 + 0.3 * vPulse;  // Range: [0.4, 1.0]
  color *= pulse;

  // ── Step 5: Distance Fog ─────────────────────────────────────
  float fogFactor = 1.0 - smoothstep(3.0, 12.0, vDistance);
  alpha *= fogFactor;  // Fully visible near, faded at distance

  // ── Step 6: Core Brightness Boost ────────────────────────────
  alpha *= (1.0 - dist * 0.4);  // Brighter center, dimmer edge

  // ── Final Output ─────────────────────────────────────────────
  gl_FragColor = vec4(color, alpha * 0.75);  // 75% max opacity
}
```

### Color Gradient Visualization

```
Center (dist=0.0)     Mid (dist=0.3)      Edge (dist=0.5)
    ●                    ●                    ●
  Gold                Amber              Deep Amber
#FFD700            #F2A61A            #CC4D0D
rgb(1.0, 0.84, 0.0)  rgb(0.95, 0.65, 0.1)  rgb(0.8, 0.3, 0.05)
```

### Alpha Falloff Visualization

```
dist: 0.0    0.1    0.2    0.3    0.4    0.5
alpha: 1.0   0.92   0.76   0.52   0.24   0.0
       ████   ███░   ██░░   █░░░   ░░░░   (discard)
```

---

## 4. Uniforms Reference

| Uniform | Type | Value | Range | Purpose |
|---------|------|-------|-------|---------|
| `uTime` | float | `state.clock.elapsedTime` | 0 → ∞ | Drives all time-based animation |
| `uPixelRatio` | float | `Math.min(dpr, 2)` | 1.0–2.0 | Scales point size for HiDPI |

### How Uniforms Are Updated

```typescript
// In ParticleField.tsx useFrame:
material.uniforms.uTime.value = t;
```

Updated every frame (60fps = 60 updates/second).

---

## 5. Attributes Reference

| Attribute | Type | Per-Vertex | Range | Set In |
|-----------|------|------------|-------|--------|
| `position` | vec3 | Yes | sphere surface | BufferGeometry |
| `aSize` | float | Yes | 0.5–2.0 | BufferGeometry |

### Position Distribution

```typescript
const radius = 3 + Math.random() * 5;          // 3–8 units
const theta = Math.random() * Math.PI * 2;     // 0–2π
const phi = Math.acos(2 * Math.random() - 1);  // Uniform sphere
```

### Size Distribution

```typescript
sizes[i] = Math.random() * 1.5 + 0.5;  // 0.5–2.0
```

---

## 6. Varyings Reference

| Varying | Set In Vertex | Used In Fragment | Purpose |
|---------|---------------|------------------|---------|
| `vDistance` | `-mvPosition.z` | Distance fog | Fades particles far from camera |
| `vPulse` | `sin(time + radius)` | Bioluminescent glow | Per-particle pulsing |

---

## 7. Simplex Noise Implementation

The shader includes Ashima's classic 3D simplex noise (~50 lines of GLSL).

### Algorithm

1. **Skew input space:** Find simplex cell containing the point
2. **Determine simplex corner offsets:** 4 corners of the tetrahedron
3. **Calculate gradients:** Pseudo-random gradient vectors at each corner
4. **Compute contribution:** Falloff from each corner
5. **Sum contributions:** Final noise value

### Properties

- **Continuous:** No visible seams or repetition
- **Smooth:** Natural, organic-looking displacement
- **Fast:** ~50 ALU instructions (acceptable for 2000 vertices)
- **Range:** Approximately [-1, 1]

### Why Simplex Instead of Perlin?

- Fewer directional artifacts on GPU
- Better performance in GLSL
- More organic appearance

---

## 8. Color Palette

### Primary Colors

| Name | Hex | RGB | Use |
|------|-----|-----|-----|
| Pure Gold | `#FFD700` | `rgb(1.0, 0.84, 0.0)` | Particle core |
| Amber | `#F2A61A` | `rgb(0.95, 0.65, 0.1)` | Particle mid |
| Deep Amber | `#CC4D0D` | `rgb(0.8, 0.3, 0.05)` | Particle edge |

### Background

| Name | Hex | RGB |
|------|-----|-----|
| Primary BG | `#050508` | `rgb(0.02, 0.02, 0.03)` |

### CSS Equivalent

```css
--accent: #d4af37;           /* Slightly different from shader gold */
--accent-glow: rgba(212, 175, 55, 0.4);
```

**Note:** The shader gold (`#FFD700`) is slightly brighter than the CSS gold (`#d4af37`). This is intentional — the shader gold is the luminous particle core, while CSS gold is the UI accent.

---

## 9. Visual Effects Breakdown

### Effect: Organic Breathing

```
Input: pos * 0.3 + uTime * 0.15
Output: noise * 0.12 * normalize(pos)
```

- **Frequency:** 0.3 (spatial), 0.15 (temporal) — very slow
- **Amplitude:** 12% of radius
- **Visual:** Particles drift outward and inward in organic waves

### Effect: Wave Ripple

```
Input: pos.x * 2.0 + uTime * 0.4
Output: sin() * 0.05 → pos.y
```

- **Frequency:** 2.0 (horizontal), 0.4 (temporal)
- **Amplitude:** 5% of unit
- **Visual:** Subtle horizontal wave propagation

### Effect: Pulsing Glow

```
Input: uTime * 1.2 + length(position) * 0.5
Output: 0.5 + 0.5 * sin() → vPulse
```

- **Frequency:** 1.2 (temporal), 0.5 (radial phase)
- **Phase offset:** Each particle pulses at a different time based on its distance from center
- **Visual:** Ripple of brightness from center outward

### Effect: Distance Fog

```
Input: vDistance (camera space Z)
Output: smoothstep(3.0, 12.0, vDistance) → alpha multiplier
```

- **Near plane:** Fully visible (distance < 3)
- **Far plane:** Fully faded (distance > 12)
- **Transition:** Smooth gradient between 3 and 12

### Effect: Additive Blending

```
Final Color = Source Color + Destination Color
```

- Particles overlapping → brighter
- Creates natural "glow cluster" effect
- Combined with Bloom post-processing for soft halos

---

## 10. Performance Considerations

### ALU Instructions

| Shader | Approximate Instructions |
|--------|------------------------|
| Vertex | ~120 (including noise) |
| Fragment | ~30 |

### Texture Samples

None — all procedural.

### Draw Calls

1 — All 2000 particles rendered in a single draw call via `THREE.Points`.

### GPU Memory

| Resource | Size |
|----------|------|
| Position buffer | 2000 × 3 × 4 bytes = 24 KB |
| Size buffer | 2000 × 1 × 4 bytes = 8 KB |
| Shader code | ~3 KB |
| **Total** | **~35 KB** |

### Optimization Notes

- `depthWrite: false` — Prevents unnecessary depth testing
- `Additive blending` — No alpha blending overhead
- `discard` in fragment — Early exit for corner fragments
- `dpr` clamp to 2 — Prevents 4x rendering on 3x displays

---

## 11. Modification Guide

### Change Particle Color

In fragment shader, modify the three color vectors:
```glsl
vec3 coreColor = vec3(1.0, 0.84, 0.0);   // Change this
vec3 midColor  = vec3(0.95, 0.65, 0.1);   // And this
vec3 edgeColor = vec3(0.8, 0.3, 0.05);    // And this
```

### Change Particle Count

In `ParticleField.tsx`:
```typescript
const count = 2000;  // Change this number
```
Also update the `Float32Array` sizes accordingly.

### Change Animation Speed

In vertex shader:
```glsl
// Breathing speed: change 0.15
float noise = snoise(pos * 0.3 + uTime * 0.15);

// Wave speed: change 0.4
float wave = sin(pos.x * 2.0 + uTime * 0.4) * 0.05;

// Pulse speed: change 1.2
vPulse = 0.5 + 0.5 * sin(uTime * 1.2 + length(position) * 0.5);
```

### Change Bloom Intensity

In `HeroScene.tsx`:
```typescript
<Bloom
  intensity={0.5}           // Increase for more glow
  luminanceThreshold={0.2}  // Decrease to bloom more particles
/>
```

### Add Mouse Interaction

Add a `uMouse` uniform and use it in the vertex shader:
```glsl
uniform vec2 uMouse;  // Normalized mouse position [-1, 1]

// In main():
float mouseDist = length(pos.xy - uMouse * 5.0);
pos += normalize(pos) * max(0.0, 1.0 - mouseDist) * 0.3;
```

---

*End of Volume 6 — Shader Bible*
*Total: ~500 lines, ~11 pages*
