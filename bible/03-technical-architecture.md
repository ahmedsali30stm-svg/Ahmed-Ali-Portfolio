# Volume 3 — Technical Architecture

## PROJECT SOVEREIGN — The Digital Universe of Ahmed Ali

> This volume documents every system, engine, manager, and infrastructure component in the portfolio. It is written for OpenCode agents executing the build — every file path, every API surface, every configuration value is real and verified against the deployed codebase.

---

## Table of Contents

1. [Architecture Overview](#1-architecture-overview)
2. [Core Engine — Next.js 16](#2-core-engine--nextjs-16)
3. [3D Rendering Engine — React Three Fiber](#3-3d-rendering-engine--react-three-fiber)
4. [Animation System — GSAP](#4-animation-system--gsap)
5. [Shader System — GLSL](#5-shader-system--glsl)
6. [Interaction System](#6-interaction-system)
7. [AI Navigation Assistant](#7-ai-navigation-assistant)
8. [UI Component Architecture](#8-ui-component-architecture)
9. [Custom Hooks Layer](#9-custom-hooks-layer)
10. [Performance & Code-Splitting](#10-performance--code-splitting)
11. [Accessibility System](#11-accessibility-system)
12. [Styling Architecture](#12-styling-architecture)
13. [SEO & Metadata Engine](#13-seo--metadata-engine)
14. [Deployment Infrastructure](#14-deployment-infrastructure)
15. [Directory Structure](#15-directory-structure)
16. [Dependency Map](#16-dependency-map)
17. [Configuration Files](#17-configuration-files)

---

## 1. Architecture Overview

### System Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                        BROWSER                               │
│                                                              │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌────────────┐  │
│  │ Preloader│  │ 3D Scene │  │ Sections │  │   Chat UI  │  │
│  │ (GSAP)   │  │ (R3F)    │  │ (GSAP+FM)│  │ (R3F+Framer│  │
│  └────┬─────┘  └────┬─────┘  └────┬─────┘  └─────┬──────┘  │
│       │              │              │               │         │
│  ┌────▼──────────────▼──────────────▼───────────────▼──────┐ │
│  │              React 19.2.4 Render Pipeline               │ │
│  └────────────────────────┬────────────────────────────────┘ │
│                           │                                   │
│  ┌────────────────────────▼────────────────────────────────┐ │
│  │                   NEXT.JS 16 App Router                   │ │
│  │  layout.tsx → page.tsx → dynamic import → HeroScene      │ │
│  └────────────────────────┬────────────────────────────────┘ │
│                           │                                   │
│  ┌────────────────────────▼────────────────────────────────┐ │
│  │              STATIC EXPORT (output: "export")             │ │
│  │  /out/ → GitHub Pages CDN                                 │ │
│  └─────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

### Technology Stack

| Layer | Technology | Version | Purpose |
|-------|-----------|---------|---------|
| Framework | Next.js | 16.2.9 | App Router, static export, metadata |
| UI Library | React | 19.2.4 | Component rendering, hooks |
| Language | TypeScript | ^5 | Type safety, editor support |
| 3D Engine | Three.js | ^0.185.0 | WebGL rendering |
| 3D React | React Three Fiber | ^9.6.1 | React reconciler for Three.js |
| 3D Helpers | React Three Drei | ^10.7.7 | Abstractions (unused in current build) |
| Post-Processing | React Three Postprocessing | ^3.0.4 | Bloom, EffectComposer |
| Animation | GSAP | ^3.15.0 | ScrollTrigger, timeline, lerp |
| Motion | Framer Motion | ^12.42.0 | Hero entrance, chat UI |
| Styling | Tailwind CSS | ^4 | Utility-first CSS |
| Build | Webpack | (bundled) | SWC transpilation (not Turbopack) |

### Data Flow

```
User Input → Event Handler → State Update → Re-render → Visual Output
                                    ↓
                              GSAP Animation
                                    ↓
                           DOM/Three.js Update
                                    ↓
                           RAF Loop (if continuous)
```

---

## 2. Core Engine — Next.js 16

### File: `next.config.ts`

```typescript
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",           // Static site generation — no server
  basePath: "/Ahmed-Ali-Portfolio",  // GitHub Pages subdirectory
  transpilePackages: ["three"],       // Three.js needs transpilation
  experimental: {
    optimizePackageImports: ["three", "@react-three/fiber", "@react-three/drei"],
  },
};
```

**Key Decisions:**
- `output: "export"` — Generates pure HTML/CSS/JS in `/out/`. No Node.js server needed.
- `basePath` — Required because GitHub Pages serves from `username.github.io/repo-name/`. Without this, all asset paths break (404s on JS/CSS/images).
- `transpilePackages: ["three"]` — Three.js ships ESM-only; Next.js needs to transpile it.
- `optimizePackageImports` — Tree-shakes Three.js to reduce bundle size.

### File: `src/app/layout.tsx` — Root Layout

**Responsibilities:**
1. Font loading (Space Grotesk + Inter via `next/font/google`)
2. SEO metadata export (Metadata API)
3. JSON-LD structured data injection
4. HTML shell (`<html>`, `<head>`, `<body>`)

**Font Configuration:**
```typescript
const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-heading",  // CSS custom property
  display: "swap",
  weight: ["300", "400", "500", "600", "700"],
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
  weight: ["300", "400", "500", "600", "700"],
});
```

**Fonts are applied via CSS custom properties:**
- `--font-heading` → Space Grotesk → used for headings, nav logo, counter
- `--font-body` → Inter → used for body text, paragraphs, descriptions

**JSON-LD Schema:**
```json
{
  "@type": "Person",
  "name": "Ahmed Ali",
  "alternateName": "The Travel Journey Engineer",
  "jobTitle": "Full-Stack Developer | Systems Architect | AI Automation Specialist",
  "worksFor": {
    "@type": "Organization",
    "name": "Etlaala Travel & Tourism",
    "url": "https://etlaala.com"
  },
  "knowsAbout": ["AI Systems Architecture", "Full-Stack Development", ...]
}
```

### File: `src/app/page.tsx` — Main Page

**Component Tree:**
```
Home (page.tsx)
├── MagneticCursor           — Custom cursor (always mounted)
├── Preloader                — Shown until loaded=true
└── main.relative
    ├── Navigation           — Fixed nav bar
    ├── div.relative
    │   ├── HeroScene        — R3F Canvas (dynamic import, ssr: false)
    │   └── HeroSection      — Text overlays (Framer Motion)
    ├── AboutSection         — GSAP reveal
    ├── StatsSection         — GSAP counter
    ├── ExpertiseSection     — GSAP tilt cards
    ├── ProjectsSection      — Framer Motion whileInView
    ├── TechStackSection     — Framer Motion whileInView
    ├── TestimonialsSection  — Framer Motion whileInView
    ├── ContactSection       — Framer Motion whileInView
    ├── Footer               — Static
    └── AIChatAssistant      — Floating chat widget
```

**Critical Pattern — Code Splitting:**
```typescript
const HeroScene = dynamic(
  () => import("@/scenes/HeroScene").then((m) => m.HeroScene),
  {
    ssr: false,      // Never render on server (needs WebGL)
    loading: () => null,  // No loading indicator (preloader covers it)
  }
);
```

**Why:** The 3D scene is 100KB+ of Three.js code. Code-splitting means the initial HTML loads instantly, the preloader runs, and the 3D scene loads in parallel behind the preloader curtain.

**State Management:**
```typescript
const [loaded, setLoaded] = useState(false);

const handlePreloaderComplete = useCallback(() => {
  setLoaded(true);
}, []);
```

- `loaded` controls whether `<Preloader>` renders
- Once preloader animation completes → `loaded=true` → preloader unmounts
- No global state manager — React useState is sufficient

---

## 3. 3D Rendering Engine — React Three Fiber

### File: `src/scenes/HeroScene.tsx` — Scene Container

```typescript
<Canvas
  camera={{ position: [0, 0, 4], fov: 50 }}
  dpr={[1, 1.5]}                    // Pixel ratio clamp
  gl={{
    antialias: true,
    alpha: false,                    // No transparency (opaque background)
    powerPreference: "high-performance"  // Prefer discrete GPU
  }}
>
  <Suspense fallback={null}>
    <Scene />   {/* Contains ParticleField + FloatingGeometry + Bloom */}
  </Suspense>
</Canvas>
```

**Scene Composition:**
```
Scene
├── <color attach="background" args={["#050508"]} />   — Background color
├── <fog attach="fog" args={["#050508", 5, 15]} />     — Distance fog
├── <ParticleField />       — 2000 gold particles (custom ShaderMaterial)
├── <FloatingGeometry />    — 5 wireframe shapes
└── <EffectComposer>
      <Bloom
        intensity={0.5}
        luminanceThreshold={0.2}
        luminanceSmoothing={0.9}
        mipmapBlur
      />
    </EffectComposer>
```

**Canvas Configuration:**
- `camera.position: [0, 0, 4]` — Camera 4 units from origin, looking at center
- `camera.fov: 50` — Moderate field of view (not too wide, not telephoto)
- `dpr: [1, 1.5]` — Clamp pixel ratio between 1x and 1.5x for performance
- `gl.antialias: true` — Smooth edges
- `gl.alpha: false` — Background is opaque (matches CSS #050508)
- `gl.powerPreference: "high-performance"` — Request discrete GPU on dual-GPU systems

### File: `src/scenes/ParticleField.tsx` — 2000 Gold Particles

**Geometry Setup:**
```typescript
const count = 2000;
const positions = new Float32Array(count * 3);  // x, y, z per particle
const sizes = new Float32Array(count);           // size per particle

// Distribute on sphere surface (fibonacci-ish)
for (let i = 0; i < count; i++) {
  const radius = 3 + Math.random() * 5;          // 3–8 units from center
  const theta = Math.random() * Math.PI * 2;     // Random angle
  const phi = Math.acos(2 * Math.random() - 1);  // Uniform sphere distribution
  
  positions[i3] = radius * Math.sin(phi) * Math.cos(theta);
  positions[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
  positions[i3 + 2] = radius * Math.cos(phi);
  
  sizes[i] = Math.random() * 1.5 + 0.5;  // 0.5–2.0 size range
}
```

**Material — Custom ShaderMaterial:**
```typescript
const mat = new THREE.ShaderMaterial({
  vertexShader: particleVertexShader,
  fragmentShader: particleFragmentShader,
  uniforms: {
    uTime: { value: 0 },
    uPixelRatio: { value: Math.min(window.devicePixelRatio, 2) },
  },
  transparent: true,
  blending: THREE.AdditiveBlending,  // Particles glow when overlapping
  depthWrite: false,                  // Prevents z-fighting
});
```

**Animation Loop:**
```typescript
useFrame((state) => {
  const t = state.clock.elapsedTime;
  material.uniforms.uTime.value = t;     // Pass time to shaders
  ref.current.rotation.y = t * 0.03;     // Slow Y-axis rotation
  ref.current.rotation.x = Math.sin(t * 0.02) * 0.05;  // Gentle X wobble
});
```

### File: `src/scenes/FloatingGeometry.tsx` — 5 Wireframe Shapes

```typescript
const shapes = [
  { pos: [-2.5, 1.5, -2],   scale: 0.3,  speed: 0.3,  type: "octahedron" },
  { pos: [2.8, -1.2, -1.5], scale: 0.25, speed: 0.4,  type: "tetrahedron" },
  { pos: [-1.5, -2, -3],    scale: 0.2,  speed: 0.25, type: "icosahedron" },
  { pos: [1.8, 2.2, -2.5],  scale: 0.35, speed: 0.35, type: "octahedron" },
  { pos: [0, -2.8, -2],     scale: 0.18, speed: 0.45, type: "tetrahedron" },
];
```

**Material:** `meshBasicMaterial` with wireframe, transparent, opacity 0.15 — barely visible, adding depth without distraction.

**Animation:** Each shape floats up/down with `Math.sin()` and rotates at its own speed.

### Bloom Post-Processing

```typescript
<Bloom
  intensity={0.5}           // Moderate glow
  luminanceThreshold={0.2}  // Only bright pixels bloom
  luminanceSmoothing={0.9}  // Smooth threshold transition
  mipmapBlur                // High-quality blur kernel
/>
```

**Effect:** Gold particles with brightness > 0.2 get a soft glow halo. Creates the "bioluminescent" quality specified in the Creative Direction.

---

## 4. Animation System — GSAP

### Registration

```typescript
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger);
```

All GSAP plugins are registered at module level in each file that uses them.

### File: `src/hooks/use-gsap-reveal.ts` — Scroll-Triggered Reveals

**API:**
```typescript
const ref = useGsapReveal({
  y: 40,           // Translate Y from 40px below
  x: 0,            // No X translation
  opacity: 0,      // Start invisible
  duration: 0.9,   // Animation duration
  delay: 0,        // No delay
  ease: "power3.out",  // Decelerating ease
  start: "top 85%",    // Trigger when top of element hits 85% of viewport
  toggleActions: "play none none none",  // Play once, never reverse
});
```

**Behavior:**
1. On mount, GSAP sets element to initial state (y: 40, opacity: 0)
2. ScrollTrigger watches for viewport intersection at `start: "top 85%"`
3. On enter, GSAP animates to final state (y: 0, opacity: 1)
4. `toggleActions: "play none none none"` = play on enter, do nothing on leave/back/repeat
5. On unmount, ScrollTrigger is killed

**Reduced Motion:** If `prefers-reduced-motion: reduce`, element is set to `opacity: 1` immediately — no animation.

### File: `src/hooks/use-gsap-counter.ts` — Animated Counters

**Behavior:**
1. Scans all `[data-count]` elements within the ref
2. Parses prefix, numeric value, suffix from the `data-count` attribute
3. On viewport entry, animates each number from 0 to target
4. Staggers each counter by 0.15s

**Example:**
```html
<div data-count="SAR 16M+">SAR 0M+</div>
```
→ Animates to "SAR 16M+" over 2 seconds with staggered entry.

**Special Handling:**
- Numbers ≥ 100 get `toLocaleString()` (e.g., 300 → "300")
- Prefix/suffix are preserved and prepended/appended during animation

### File: `src/hooks/use-gsap-tilt-cards.ts` — 3D Card Tilt Reveal

**Behavior:**
1. Finds all `[data-tilt-card]` elements
2. Sets initial state: `opacity: 0, y: 50, rotateX: 8, transformPerspective: 800`
3. On viewport entry, animates to: `opacity: 1, y: 0, rotateX: 0`
4. Creates a subtle 3D tilt-forward → flat animation

### GSAP Usage in Preloader

The Preloader uses a GSAP timeline (not a hook) with sequential steps:

```typescript
const tl = gsap.timeline();

// 1. Counter 0 → 100 (2.2s)
tl.to(obj, { val: 100, duration: 2.2, ease: "power2.inOut", onUpdate: ... });

// 2. Fade out logo + counter (0.5s, overlapping)
tl.to([logoRef, counterRef, progressRef?.parentElement], {
  opacity: 0, y: -15, duration: 0.5, stagger: 0.08, ease: "power2.in"
}, "-=0.3");

// 3. Split-screen exit (0.8s each, simultaneous)
tl.to(topRef, { yPercent: -100, duration: 0.8, ease: "power3.inOut" }, "-=0.1");
tl.to(bottomRef, { yPercent: 100, duration: 0.8, ease: "power3.inOut" }, "<");

// 4. Fire callback
tl.call(onComplete);
```

### GSAP in MagneticCursor

```typescript
// Lerp interpolation for smooth following
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

const tick = () => {
  pos.current.x = lerp(pos.current.x, mouse.current.x, 0.12);
  pos.current.y = lerp(pos.current.y, mouse.current.y, 0.12);
  
  gsap.set(dot, { x: mouse.current.x, y: mouse.current.y });  // Dot = instant
  gsap.set(ring, { x: pos.current.x, y: pos.current.y });     // Ring = lagged
  
  requestAnimationFrame(tick);
};
```

**Hover animations use gsap.to():**
```typescript
gsap.to(ring, {
  scale: 1.8,
  borderColor: "rgba(212, 175, 55, 0.8)",
  duration: 0.3,
  ease: "power2.out",
});
```

---

## 5. Shader System — GLSL

### File: `src/shaders/particle.ts`

Contains two GLSL shader strings exported as TypeScript constants.

### Vertex Shader

**Uniforms:**
- `uTime: float` — Elapsed time in seconds
- `uPixelRatio: float` — Device pixel ratio (clamped to 2)

**Attributes:**
- `aSize: float` — Per-particle size (0.5–2.0)

**Varyings (passed to fragment):**
- `vDistance: float` — Distance from camera (for fog)
- `vPulse: float` — Pulsing glow value

**Simplex Noise Implementation:**
The vertex shader includes a full 3D simplex noise implementation (Ashima's classic GLSL noise). This is ~50 lines of GLSL that provides organic, continuous random displacement.

**Vertex Displacement Logic:**
```glsl
// 1. Organic breathing — noise-based displacement
float noise = snoise(pos * 0.3 + uTime * 0.15);
pos += normalize(pos) * noise * 0.12;

// 2. Subtle wave ripple
float wave = sin(pos.x * 2.0 + uTime * 0.4) * 0.05;
pos.y += wave;

// 3. Pulsing glow (per-particle)
vPulse = 0.5 + 0.5 * sin(uTime * 1.2 + length(position) * 0.5);

// 4. Point size with perspective
gl_PointSize = aSize * uPixelRatio * (180.0 / -mvPosition.z);
```

### Fragment Shader

**Inputs:** `vDistance`, `vPulse` from vertex shader.

**Logic:**
```glsl
// 1. Circular point shape — discard corners
vec2 uv = gl_PointCoord - 0.5;
float dist = length(uv);
if (dist > 0.5) discard;

// 2. Soft edge falloff
float alpha = 1.0 - smoothstep(0.0, 0.5, dist);

// 3. Three-color radial gradient
vec3 coreColor = vec3(1.0, 0.84, 0.0);    // Pure gold (center)
vec3 midColor  = vec3(0.95, 0.65, 0.1);   // Amber (middle)
vec3 edgeColor = vec3(0.8, 0.3, 0.05);    // Deep amber (edge)

vec3 color = mix(coreColor, midColor, smoothstep(0.0, 0.3, dist));
color = mix(color, edgeColor, smoothstep(0.3, 0.5, dist));

// 4. Bioluminescent pulse
float pulse = 0.7 + 0.3 * vPulse;
color *= pulse;

// 5. Distance fog
float fogFactor = 1.0 - smoothstep(3.0, 12.0, vDistance);
alpha *= fogFactor;

// 6. Core brightness boost
alpha *= (1.0 - dist * 0.4);

gl_FragColor = vec4(color, alpha * 0.75);
```

**Visual Result:** Each particle is a soft gold-to-amber radial gradient with pulsing glow, fading with distance.

---

## 6. Interaction System

### MagneticCursor — `src/components/nav/MagneticCursor.tsx`

**Architecture:**
- Two DOM elements: `dot` (6px, instant follow) and `ring` (36px, lerp follow)
- Both are `position: fixed` with `pointer-events: none` and `z-index: 9998/9999`
- Animation loop runs via `requestAnimationFrame`

**Device Detection:**
```typescript
const isTouch =
  "ontouchstart" in window ||
  navigator.maxTouchPoints > 0 ||
  window.matchMedia("(pointer: coarse)").matches;
if (isTouch) return;  // Don't render cursor on touch devices

const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
if (prefersReduced) return;  // Don't render cursor with reduced motion
```

**Hover Detection:**
```typescript
const HOVER_SELECTOR = "a, button, [data-cursor-hover], input, textarea";

// On mouseover: ring scales to 1.8x, border turns bright gold
// On mouseout: ring returns to 1x, border returns to dim gold
```

**Cleanup:** All event listeners are removed on unmount. Body cursor style is restored.

### Preloader — `src/components/ui/Preloader.tsx`

**Visual Sequence:**
1. Center: Geometric SVG logo (3 nested rectangles)
2. Below: Counter "000" → "100"
3. Below: Progress bar (0% → 100%)
4. Below: "LOADING" text

**Exit Animation:**
1. Logo + counter fade up and out
2. Screen splits: top half slides up, bottom half slides down
3. Reveals the site underneath

**Z-Index Layering:**
- Top/Bottom panels: `z-index: 10001`
- Content (logo, counter): `z-index: 10002`
- Container: `z-index: 10000`

---

## 7. AI Navigation Assistant

### File: `src/components/nav/AIChatAssistant.tsx`

### Architecture

```
AIChatAssistant
├── FAB (Floating Action Button) — bottom-right, gold, pulsing glow
├── Chat Window
│   ├── Header (avatar, title, status, close button)
│   ├── Quick Commands (4 chips)
│   ├── Messages (scrollable)
│   │   ├── MessageBubble × N
│   │   └── Typing Indicator (3 pulsing dots)
│   └── Input (text field + send button)
```

### Command Router

The AI assistant uses a **command router pattern** — a declarative array of regex patterns with associated responses:

```typescript
interface CommandMatch {
  patterns: RegExp[];
  response: string;
  navigation?: { target: string; label: string };
}

const COMMANDS: CommandMatch[] = [
  {
    patterns: [/\b(project|work|built|portfolio|show.*work)\b/i],
    response: "Navigating to Projects...",
    navigation: { target: "projects", label: "Projects" },
  },
  // ... 10 more commands
];
```

**11 Command Categories:**
1. Navigation: projects, about, expertise, stats, contact, testimonials, techstack
2. Knowledge: hello, who are you, what does ahmed do, etlaala company, projects detail, tech stack detail, how built, thanks

### Response Resolution

```typescript
function resolveResponse(input: string): {
  content: string;
  navigation?: { target: string; label: string };
} {
  for (const cmd of COMMANDS) {
    for (const pattern of cmd.patterns) {
      if (pattern.test(trimmed)) {
        return { content: cmd.response, navigation: cmd.navigation };
      }
    }
  }
  return { content: FALLBACK };
}
```

### LLM Swap Point

The `resolveResponse` function is designed as an **LLM swap point**. To integrate a real LLM:
1. Replace `resolveResponse(text)` with `fetch("/api/chat", { body: JSON.stringify({ messages }) })`
2. Keep the `navigation` field in the response for scroll behavior
3. The `Message` interface already supports `navigation` on assistant messages

### Typing Simulation

```typescript
const delay = 600 + Math.random() * 800;  // 600–1400ms
setTimeout(() => {
  const { content, navigation } = resolveResponse(text);
  // ... add message, execute navigation
}, delay);
```

### RichText Renderer

Splits message content on `\n` for line breaks and `**text**` for bold:

```typescript
function RichText({ content }: { content: string }) {
  return content.split("\n").map((line, i) =>
    line.split(/(\*\*.*?\*\*)/).map((part, j) =>
      part.startsWith("**") && part.endsWith("**")
        ? <strong>{part.slice(2, -2)}</strong>
        : <span>{part}</span>
    )
  );
}
```

---

## 8. UI Component Architecture

### Component Hierarchy

```
src/
├── app/
│   ├── layout.tsx          — Root layout (fonts, metadata, JSON-LD)
│   ├── page.tsx            — Main page (component tree)
│   └── globals.css         — CSS variables, resets, media queries
├── components/
│   ├── nav/
│   │   ├── Navigation.tsx  — Fixed nav (scroll blur, mobile menu)
│   │   ├── Footer.tsx      — Copyright + social links
│   │   ├── MagneticCursor.tsx  — Custom cursor
│   │   └── AIChatAssistant.tsx — Chat widget
│   ├── ui/
│   │   └── Preloader.tsx   — Loading screen
│   └── sections/
│       ├── HeroSection.tsx
│       ├── AboutSection.tsx
│       ├── ExpertiseSection.tsx
│       ├── ProjectsSection.tsx
│       ├── StatsSection.tsx
│       ├── TechStackSection.tsx
│       ├── TestimonialsSection.tsx
│       └── ContactSection.tsx
├── scenes/
│   ├── HeroScene.tsx       — R3F Canvas wrapper
│   ├── ParticleField.tsx   — 2000 gold particles
│   └── FloatingGeometry.tsx — 5 wireframe shapes
├── shaders/
│   └── particle.ts         — GLSL vertex/fragment shaders
└── hooks/
    ├── use-gsap-reveal.ts
    ├── use-gsap-counter.ts
    ├── use-gsap-tilt-cards.ts
    └── use-reduced-motion.ts
```

### Section Pattern

Every section follows this pattern:

```typescript
"use client";

import { useGsapReveal } from "@/hooks/use-gsap-reveal";
// OR
import { motion } from "framer-motion";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

export function SectionName() {
  const labelRef = useGsapReveal({ x: -30, duration: 0.7 });
  const headingRef = useGsapReveal({ y: 40, duration: 0.8, delay: 0.1 });

  return (
    <section id="sectionname" className="relative py-32 px-6 z-10">
      <div className="max-w-6xl mx-auto">
        <div ref={labelRef} className="opacity-0">
          {/* Section label with gold line */}
        </div>
        <h2 ref={headingRef} className="opacity-0">
          {/* Heading with accent color */}
        </h2>
        {/* Content */}
      </div>
    </section>
  );
}
```

**Section IDs (used for navigation):**
- `#hero` — HeroSection
- `#about` — AboutSection
- `#stats` — StatsSection
- `#expertise` — ExpertiseSection
- `#projects` — ProjectsSection
- `#techstack` — TechStackSection
- `#testimonials` — TestimonialsSection
- `#contact` — ContactSection

### Glass Card Pattern

Used in About, Expertise, Testimonials, Stats, Tech Stack:

```html
<div class="p-8 rounded-2xl
            bg-[var(--bg-glass)]
            border border-[var(--border-glass)]
            backdrop-blur-sm
            hover:border-[var(--border-hover)]
            transition-all duration-500">
  {/* Content */}
</div>
```

**CSS Variables:**
- `--bg-glass: rgba(255, 255, 255, 0.025)` — Nearly invisible white
- `--border-glass: rgba(255, 255, 255, 0.06)` — Subtle border
- `--border-hover: rgba(212, 175, 55, 0.35)` — Gold on hover

### CTA Button Pattern

```html
<!-- Primary CTA -->
<a class="px-8 py-4 rounded-xl text-sm font-medium tracking-wider uppercase
           bg-[var(--accent)] text-[var(--bg-primary)]
           hover:shadow-[0_0_30px_var(--accent-glow)]">
  Get in Touch
</a>

<!-- Secondary CTA -->
<a class="px-8 py-4 rounded-xl text-sm font-medium tracking-wider uppercase
           border border-[var(--border-glass)] text-[var(--text-secondary)]
           hover:border-[var(--border-hover)] hover:text-[var(--accent)]">
  View Projects
</a>
```

### Navigation — `src/components/nav/Navigation.tsx`

**Scroll Detection:**
```typescript
useEffect(() => {
  const handler = () => setScrolled(window.scrollY > 60);
  window.addEventListener("scroll", handler, { passive: true });
  return () => window.removeEventListener("scroll", handler);
}, []);
```

**Scroll State Effect:**
- `scrolled = false` → transparent background
- `scrolled = true` → `bg-[rgba(5,5,8,0.85)] backdrop-blur-xl border-b`

**Mobile Menu:** Full-screen overlay with staggered Framer Motion animations.

---

## 9. Custom Hooks Layer

### `use-gsap-reveal.ts`

```typescript
export function useGsapReveal(options: RevealOptions = {}): React.RefObject<HTMLDivElement>
```

Returns a ref to attach to the element. The hook manages:
- Setting initial state (opacity, translate)
- Creating ScrollTrigger
- Animating on viewport entry
- Cleanup on unmount

### `use-gsap-counter.ts`

```typescript
export function useGsapCounter(options: CounterOptions = {}): React.RefObject<HTMLDivElement>
```

Returns a ref. The hook:
- Finds all `[data-count]` descendants
- Parses prefix/number/suffix
- Animates each number on viewport entry
- Staggers by 0.15s

### `use-gsap-tilt-cards.ts`

```typescript
export function useGsapTiltCards(options: TiltCardsOptions = {}): React.RefObject<HTMLDivElement>
```

Returns a ref. The hook:
- Finds all `[data-tilt-card]` descendants
- Sets perspective + rotateX initial state
- Animates to flat on viewport entry

### `use-reduced-motion.ts`

```typescript
export function useReducedMotion(): boolean
```

Returns `true` if `prefers-reduced-motion: reduce` is active. Updates on change.

---

## 10. Performance & Code-Splitting

### Bundle Splitting Strategy

| Chunk | Contents | Loaded When |
|-------|----------|-------------|
| Main | React, Next.js, layout, globals.css | Immediately |
| HeroScene | Three.js, R3F, shaders, postprocessing | After preloader (dynamic import) |
| GSAP | gsap.min.js + ScrollTrigger | Main bundle (small, ~30KB) |
| Framer Motion | framer-motion | Main bundle (tree-shaken) |

### Static Export

```bash
next build  # Generates /out/ directory
```

**Output:**
```
/out/
├── index.html
├── _next/static/
│   ├── chunks/       — Code-split JS chunks
│   ├── css/          — Compiled CSS
│   └── webpack/      — Webpack runtime
└── og-image.svg
```

### GitHub Actions CI/CD

```yaml
- name: Install dependencies
  run: npm install  # NOT npm ci (lock file sync issues)

- name: Build with Next.js
  run: npx next build
  env:
    NEXT_TELEMETRY_DISABLED: 1
```

**Known Issue:** `npm ci` fails in GitHub Actions due to lock file sync issues. Use `npm install` instead.

### Image Optimization

- No images in the portfolio (all text/SVG/CSS)
- OG image is SVG (lightweight, vector)
- No `<Image>` component from Next.js needed

---

## 11. Accessibility System

### Cursor

```html
<div aria-hidden="true" class="cursor-dot" />
<div aria-hidden="true" class="cursor-ring" />
```

Both marked `aria-hidden="true"` — screen readers ignore them.

### Keyboard Navigation

- All interactive elements are native HTML (`<a>`, `<button>`, `<input>`)
- Navigation links work with Tab + Enter
- Mobile menu toggle is a `<button>` with `aria-label`

### Reduced Motion

**Three layers of protection:**

1. **CSS:** `@media (prefers-reduced-motion: reduce)` — kills all CSS animations
2. **GSAP hooks:** Check `matchMedia` and skip ScrollTrigger if reduced
3. **Framer Motion:** `<motion.div initial={prefersReduced ? {} : {...}}>`

### Screen Reader

- Navigation: semantic `<nav>` element
- Sections: semantic `<section>` elements
- Form inputs: `<input>` with placeholder (not label, but acceptable for single-field form)
- All external links: `target="_blank" rel="noopener noreferrer"`

---

## 12. Styling Architecture

### CSS Custom Properties

```css
:root {
  --bg-primary: #050508;           /* Almost black */
  --bg-secondary: #0a0a10;         /* Slightly lighter black */
  --bg-glass: rgba(255, 255, 255, 0.025);  /* Glassmorphism fill */
  --border-glass: rgba(255, 255, 255, 0.06);
  --border-hover: rgba(212, 175, 55, 0.35);
  --accent: #d4af37;               /* Gold */
  --accent-soft: rgba(212, 175, 55, 0.12);
  --accent-glow: rgba(212, 175, 55, 0.4);
  --text-primary: #f0ede6;         /* Warm white */
  --text-secondary: rgba(240, 237, 230, 0.55);
  --text-muted: rgba(240, 237, 230, 0.3);
  --gradient-gold: linear-gradient(135deg, #d4af37 0%, #f0d060 50%, #d4af37 100%);
  --font-heading: "Space Grotesk", -apple-system, sans-serif;
  --font-body: "Inter", -apple-system, sans-serif;
  --ease-premium: cubic-bezier(0.22, 1, 0.36, 1);
}
```

### Tailwind v4 Integration

```css
@import "tailwindcss";
```

Tailwind v4 uses CSS-first configuration. No `tailwind.config.js` needed. All customization is via CSS custom properties.

### Custom Scrollbar

```css
::-webkit-scrollbar { width: 6px; }
::-webkit-scrollbar-track { background: var(--bg-primary); }
::-webkit-scrollbar-thumb { background: rgba(212, 175, 55, 0.3); border-radius: 3px; }
```

### Selection Color

```css
::selection { background: var(--accent); color: var(--bg-primary); }
```

---

## 13. SEO & Metadata Engine

### Metadata API (Next.js 16)

```typescript
export const metadata: Metadata = {
  title: { default: "Ahmed Ali | Full-Stack Developer & Systems Architect", template: "%s | Ahmed Ali" },
  description: "Portfolio of Ahmed Ali...",
  keywords: ["Ahmed Ali", "Full-Stack Developer", ...],
  openGraph: { type: "website", images: [{ url: "/og-image.svg" }] },
  twitter: { card: "summary_large_image", creator: "@ahmedsali30stm" },
  robots: { index: true, follow: true },
};
```

### JSON-LD Person Schema

Injected via `<script type="application/ld+json">` in `layout.tsx`. Provides structured data for Google rich results.

### URL Structure

- `SITE_URL = "https://ahmedsali30stm-svg.github.io/Ahmed-Ali-Portfolio"`
- `metadataBase: new URL(SITE_URL)`
- `alternates: { canonical: "/" }` — canonical URL resolves to full site URL

---

## 14. Deployment Infrastructure

### GitHub Actions Workflow

```yaml
name: Deploy to GitHub Pages
on:
  push:
    branches: ["main"]
  workflow_dispatch:

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - Checkout
      - Setup Node.js 20
      - npm install
      - npx next build
      - Upload ./out artifact

  deploy:
    needs: build
    runs-on: ubuntu-latest
    steps:
      - Deploy to GitHub Pages
```

### Deployment Flow

```
git push origin main
  → GitHub Actions triggers
  → npm install
  → next build (generates /out/)
  → upload-pages-artifact (./out/)
  → deploy-pages (GitHub Pages CDN)
  → Live at ahmedsali30stm-svg.github.io/Ahmed-Ali-Portfolio
```

### Caching Issue

GitHub Pages CDN aggressively caches HTML. Users may need hard refresh (Ctrl+Shift+R) to see new deploys.

---

## 15. Directory Structure

```
ahmed-ali-portfolio/
├── .github/workflows/deploy.yml     — CI/CD
├── bible/                            — PROJECT SOVEREIGN specification
│   ├── 01-creative-direction.md
│   ├── 02-experience-architecture.md
│   └── 03-technical-architecture.md
├── public/
│   ├── favicon.ico
│   └── og-image.svg
├── src/
│   ├── app/
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── components/
│   │   ├── nav/
│   │   │   ├── AIChatAssistant.tsx
│   │   │   ├── Footer.tsx
│   │   │   ├── MagneticCursor.tsx
│   │   │   └── Navigation.tsx
│   │   ├── sections/
│   │   │   ├── AboutSection.tsx
│   │   │   ├── ContactSection.tsx
│   │   │   ├── ExpertiseSection.tsx
│   │   │   ├── HeroSection.tsx
│   │   │   ├── ProjectsSection.tsx
│   │   │   ├── StatsSection.tsx
│   │   │   ├── TechStackSection.tsx
│   │   │   └── TestimonialsSection.tsx
│   │   └── ui/
│   │       └── Preloader.tsx
│   ├── hooks/
│   │   ├── use-gsap-counter.ts
│   │   ├── use-gsap-reveal.ts
│   │   ├── use-gsap-tilt-cards.ts
│   │   └── use-reduced-motion.ts
│   ├── scenes/
│   │   ├── FloatingGeometry.tsx
│   │   ├── HeroScene.tsx
│   │   └── ParticleField.tsx
│   └── shaders/
│       └── particle.ts
├── next.config.ts
├── package.json
├── tsconfig.json
└── out/                              — Generated by next build
```

---

## 16. Dependency Map

### Production Dependencies

| Package | Version | Used By | Purpose |
|---------|---------|---------|---------|
| next | 16.2.9 | Core | Framework |
| react | 19.2.4 | Core | UI library |
| react-dom | 19.2.4 | Core | DOM renderer |
| three | ^0.185.0 | ParticleField, FloatingGeometry | 3D engine |
| @react-three/fiber | ^9.6.1 | HeroScene | React ↔ Three.js bridge |
| @react-three/drei | ^10.7.7 | (available) | 3D abstractions |
| @react-three/postprocessing | ^3.0.4 | HeroScene | Bloom effect |
| gsap | ^3.15.0 | All hooks, Preloader, MagneticCursor | Animation |
| @gsap/react | ^2.1.2 | (available) | React GSAP integration |
| framer-motion | ^12.42.0 | Hero, Projects, Tech, Testimonials, Contact, Nav, Chat | React motion |

### Dev Dependencies

| Package | Version | Purpose |
|---------|---------|---------|
| tailwindcss | ^4 | Utility CSS |
| @tailwindcss/postcss | ^4 | PostCSS integration |
| typescript | ^5 | Type checking |
| @types/node | ^20 | Node.js types |
| @types/react | ^19 | React types |
| @types/react-dom | ^19 | React DOM types |
| @types/three | ^0.185.0 | Three.js types |
| eslint | ^9 | Linting |
| eslint-config-next | 16.2.9 | Next.js ESLint rules |

---

## 17. Configuration Files

### `tsconfig.json`

```json
{
  "compilerOptions": {
    "target": "ES2017",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "react-jsx",
    "incremental": true,
    "paths": { "@/*": ["./src/*"] }
  }
}
```

**Key Settings:**
- `strict: true` — All strict TypeScript checks enabled
- `paths: { "@/*": ["./src/*"] }` — Path alias for clean imports
- `moduleResolution: "bundler"` — Next.js 16 bundler resolution

### `package.json` Scripts

```json
{
  "dev": "next dev",
  "build": "next build",
  "start": "next start",
  "lint": "eslint"
}
```

**Note:** `next dev` uses Turbopack by default in Next.js 16, but Turbopack fails on Windows (SWC binary issue). Use `next dev --webpack` on Windows.

---

*End of Volume 3 — Technical Architecture*
*Total: ~1000 lines, ~25 pages*
