# Volume 5 — Motion Bible

## PROJECT SOVEREIGN — The Digital Universe of Ahmed Ali

> Every animation, transition, reveal, and micro-interaction is documented here with exact timing, easing, and trigger conditions. This is the temporal blueprint of the portfolio.

---

## Table of Contents

1. [Motion Design System](#1-motion-design-system)
2. [GSAP Animations](#2-gsap-animations)
3. [Framer Motion Animations](#3-framer-motion-animations)
4. [Shader Animations](#4-shader-animations)
5. [CSS Animations](#5-css-animations)
6. [Scroll-Triggered Reveals](#6-scroll-triggered-reveals)
7. [Interaction Animations](#7-interaction-animations)
8. [Motion Timing Reference](#8-motion-timing-reference)
9. [Reduced Motion Protocol](#9-reduced-motion-protocol)

---

## 1. Motion Design System

### Easing Functions

| Name | Value | Use Case |
|------|-------|----------|
| `power2.inOut` | `cubic-bezier(0.455, 0.03, 0.515, 0.955)` | Preloader counter |
| `power2.out` | `cubic-bezier(0.25, 0.46, 0.45, 0.94)` | Cursor hover, counter |
| `power2.in` | `cubic-bezier(0.55, 0.055, 0.675, 0.19)` | Preloader logo fade |
| `power3.out` | `cubic-bezier(0.16, 1, 0.3, 1)` | All scroll reveals |
| `power3.inOut` | `cubic-bezier(0.855, 0.03, 0.515, 0.955)` | Preloader split-screen |
| `easeOut` | `cubic-bezier(0, 0, 0.58, 1)` | Message bubbles |
| `easeInOut` | `cubic-bezier(0.42, 0, 0.58, 1)` | Typing dots |
| `--ease-premium` | `cubic-bezier(0.22, 1, 0.36, 1)` | Custom CSS easing |

### Duration Scale

| Speed | Duration | Use Case |
|-------|----------|----------|
| Instant | 0.01ms | Reduced motion fallback |
| Fast | 0.2–0.3s | Hover states, tooltips |
| Normal | 0.5–0.7s | Reveals, fades |
| Slow | 0.8–1.0s | Major reveals, preloader |
| Very Slow | 2.0–2.2s | Counter animation |

### Stagger Patterns

| Pattern | Stagger | Use Case |
|---------|---------|----------|
| Tight | 0.08s | Preloader fade out |
| Standard | 0.1s | Tilt cards |
| Loose | 0.12s | Timeline items |
| Wide | 0.15s | Counter animations |
| Hero | 0.1s per badge | Role badges |

---

## 2. GSAP Animations

### Preloader Timeline

**File:** `src/components/ui/Preloader.tsx`

```typescript
const tl = gsap.timeline();
```

| Step | Time | Element | From | To | Ease | Duration |
|------|------|---------|------|-----|------|----------|
| 1 | 0s | Counter object | val: 0 | val: 100 | `power2.inOut` | 2.2s |
| 1 | 0s | Progress bar | width: 0% | width: 100% | (linked to counter) | 2.2s |
| 2 | 1.9s | Logo + counter + progress parent | opacity: 1, y: 0 | opacity: 0, y: -15 | `power2.in` | 0.5s |
| 2 | 1.9s | (Stagger) | — | — | — | 0.08s between elements |
| 3 | 2.3s | Top panel | yPercent: 0 | yPercent: -100 | `power3.inOut` | 0.8s |
| 3 | 2.3s | Bottom panel | yPercent: 0 | yPercent: 100 | `power3.inOut` | 0.8s |
| 4 | 3.1s | (callback) | — | — | — | — |

### Scroll Reveals (useGsapReveal)

**File:** `src/hooks/use-gsap-reveal.ts`

| Section | Element | From | To | Duration | Delay | Start |
|---------|---------|------|-----|----------|-------|-------|
| About | Label | x: -30, opacity: 0 | x: 0, opacity: 1 | 0.7s | 0 | top 85% |
| About | Heading | y: 40, opacity: 0 | y: 0, opacity: 1 | 0.8s | 0.1s | top 85% |
| About | Bio | y: 30, opacity: 0 | y: 0, opacity: 1 | 0.8s | 0.2s | top 85% |
| About | Timeline container | y: 40, opacity: 0 | y: 0, opacity: 1 | 0.9s | 0.1s | top 85% |
| About | Timeline items | x: -20, opacity: 0 | x: 0, opacity: 1 | 0.6s | i*0.12 | top 90% |
| Expertise | Label | x: -30, opacity: 0 | x: 0, opacity: 1 | 0.7s | 0 | top 85% |
| Expertise | Heading | y: 40, opacity: 0 | y: 0, opacity: 1 | 0.8s | 0.1s | top 85% |
| Expertise | Cards | y: 50, rotateX: 8, opacity: 0 | y: 0, rotateX: 0, opacity: 1 | 0.8s | i*0.1 | top 85% |
| Stats | Counter grid | y: 30, opacity: 0 | y: 0, opacity: 1 | 0.8s | 0 | top 85% |

### Counter Animation (useGsapCounter)

**File:** `src/hooks/use-gsap-counter.ts`

| Stat | Target | Duration | Delay | Ease |
|------|--------|----------|-------|------|
| Corporate Accounts | 300 | 2s | 0s | `power2.out` |
| Annual Sales | 16 | 2s | 0.15s | `power2.out` |
| Hotel Partners | 50 | 2s | 0.3s | `power2.out` |
| Team Members | 5 | 2s | 0.45s | `power2.out` |

### Cursor Animations

**File:** `src/components/nav/MagneticCursor.tsx`

| Element | Trigger | Property | From | To | Duration | Ease |
|---------|---------|----------|------|-----|----------|------|
| Ring | Hover enter | scale | 1 | 1.8 | 0.3s | `power2.out` |
| Ring | Hover enter | borderColor | 35% opacity | 80% opacity | 0.3s | `power2.out` |
| Ring | Hover exit | scale | 1.8 | 1 | 0.3s | `power2.out` |
| Ring | Hover exit | borderColor | 80% opacity | 35% opacity | 0.3s | `power2.out` |
| Dot | Hover enter | scale | 1 | 0.5 | 0.3s | `power2.out` |
| Dot | Hover exit | scale | 0.5 | 1 | 0.3s | `power2.out` |

### Cursor Lerp

```typescript
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
// Factor: 0.12 (12% of distance per frame)
// At 60fps: ~95% of target reached in ~20 frames (~333ms)
```

---

## 3. Framer Motion Animations

### Hero Section Entrance

**File:** `src/components/sections/HeroSection.tsx`

| Element | Initial | Animate | Transition |
|---------|---------|---------|------------|
| Label | `{ opacity: 0, y: 20 }` | `{ opacity: 1, y: 0 }` | duration: 0.8, ease: `power3.out` |
| Name | `{ opacity: 0, y: 30 }` | `{ opacity: 1, y: 0 }` | duration: 0.9, delay: 0.15 |
| Tagline | `{ opacity: 0, y: 20 }` | `{ opacity: 1, y: 0 }` | duration: 0.8, delay: 0.35 |
| Role badges | `{ opacity: 0, scale: 0.9 }` | `{ opacity: 1, scale: 1 }` | duration: 0.5, delay: 0.7 + i*0.1 |
| CTAs | `{ opacity: 0, y: 20 }` | `{ opacity: 1, y: 0 }` | duration: 0.8, delay: 1.0 |
| Scroll indicator | `{ opacity: 0 }` | `{ opacity: 1 }` | delay: 2, duration: 1 |
| Scroll indicator bounce | — | `{ y: [0, 8, 0] }` | duration: 2, repeat: Infinity |

### Navigation

**File:** `src/components/nav/Navigation.tsx`

| Element | Initial | Transition |
|---------|---------|------------|
| Nav bar | `{ y: -100, opacity: 0 }` | duration: 0.8, delay: 0.5 |
| Mobile menu | `{ opacity: 0, y: -20 }` | duration: 0.3 |
| Mobile links | `{ opacity: 0, y: 20 }` | delay: i * 0.1 |

### Sections (whileInView)

| Section | Animation | Duration | Stagger |
|---------|-----------|----------|---------|
| Projects (label) | `{ opacity: 0, x: -30 }` | 0.7s | — |
| Projects (heading) | `{ opacity: 0, y: 30 }` | 0.8s | 0.1s delay |
| Projects (cards) | `{ opacity: 0, y: 30 }` | 0.6s | i * 0.08 |
| Tech Stack (cards) | `{ opacity: 0, y: 20 }` | 0.6s | ci * 0.1 |
| Testimonials | `{ opacity: 0, y: 30 }` | 0.6s | i * 0.1 |
| Contact (label) | `{ opacity: 0, x: -30 }` | 0.7s | — |
| Contact (heading) | `{ opacity: 0, y: 30 }` | 0.8s | 0.1s delay |
| Contact (CTAs) | `{ opacity: 0, y: 20 }` | 0.8s | 0.3s delay |
| Contact (info) | `{ opacity: 0 }` | 1s | 0.5s delay |

### Chat Widget

**File:** `src/components/nav/AIChatAssistant.tsx`

| Element | Animation | Duration | Ease |
|---------|-----------|----------|------|
| FAB hover | `{ scale: 1.08 }` | — | — |
| FAB tap | `{ scale: 0.92 }` | — | — |
| FAB icon swap | `{ rotate: ±90, opacity: 0→1 }` | 0.2s | — |
| Chat window enter | `{ opacity: 0, y: 24, scale: 0.96, filter: "blur(8px)" }` | 0.35s | `power3.out` |
| Chat window exit | Same as enter, reversed | 0.35s | `power3.out` |
| Messages | `{ opacity: 0, y: 10 }` | 0.25s | `easeOut` |
| Typing indicator | `{ opacity: 0, y: 8 }` | — | — |

### Typing Dots

```typescript
animate={{ opacity: [0.3, 1, 0.3], scale: [0.8, 1.1, 0.8] }}
transition={{ duration: 1.2, repeat: Infinity, delay, ease: "easeInOut" }}
```

---

## 4. Shader Animations

### Particle Vertex Shader

**File:** `src/shaders/particle.ts`

| Effect | Formula | Speed | Amplitude |
|--------|---------|-------|-----------|
| Noise breathing | `snoise(pos * 0.3 + uTime * 0.15)` | 0.15 | 0.12 |
| Wave ripple | `sin(pos.x * 2.0 + uTime * 0.4) * 0.05` | 0.4 | 0.05 |
| Pulsing glow | `sin(uTime * 1.2 + length(position) * 0.5)` | 1.2 | 0.3 |

### Particle Fragment Shader

| Effect | Formula | Speed |
|--------|---------|-------|
| Bioluminescent pulse | `0.7 + 0.3 * vPulse` | 1.2 |
| Distance fog | `smoothstep(3.0, 12.0, vDistance)` | — |
| Core brightness | `(1.0 - dist * 0.4)` | — |

### Floating Geometry

**File:** `src/scenes/FloatingGeometry.tsx`

| Shape | Float Speed | Float Amplitude | Rotation Speed |
|-------|-------------|-----------------|----------------|
| Octahedron 1 | 0.3 | 0.3 | 0.15 (X), 0.09 (Z) |
| Tetrahedron 1 | 0.4 | 0.3 | 0.2 (X), 0.12 (Z) |
| Icosahedron | 0.25 | 0.3 | 0.125 (X), 0.075 (Z) |
| Octahedron 2 | 0.35 | 0.3 | 0.175 (X), 0.105 (Z) |
| Tetrahedron 2 | 0.45 | 0.3 | 0.225 (X), 0.135 (Z) |

### Scene Rotation

| Axis | Formula | Speed |
|------|---------|-------|
| Y | `t * 0.03` | 0.03 rad/s |
| X | `sin(t * 0.02) * 0.05` | 0.02 (wobble) |

---

## 5. CSS Animations

### Tailwind Animate (Chat FAB Glow)

```css
@keyframes ping {
  75%, 100% {
    transform: scale(2);
    opacity: 0;
  }
}

.animate-[ping_2.5s_cubic-bezier(0,0,0.2,1)_infinite] {
  animation: ping 2.5s cubic-bezier(0, 0, 0.2, 1) infinite;
}
```

### Scroll Indicator Bounce

Framer Motion handles this — no CSS keyframes.

### Scrollbar

No animation — static styling.

---

## 6. Scroll-Triggered Reveals

### Trigger Configuration

All GSAP ScrollTriggers use:

| Parameter | Value | Purpose |
|-----------|-------|---------|
| `start` | `top 85%` (default) | Trigger when element top hits 85% of viewport |
| `start` | `top 90%` | Earlier trigger for timeline items |
| `toggleActions` | `play none none none` | Play once on enter, never reverse |

### Reveal Patterns

**Pattern A: Slide Up**
```typescript
gsap.set(el, { y: 40, opacity: 0 });
gsap.to(el, { y: 0, opacity: 1, duration: 0.9, ease: "power3.out" });
```

**Pattern B: Slide From Left**
```typescript
gsap.set(el, { x: -30, opacity: 0 });
gsap.to(el, { x: 0, opacity: 1, duration: 0.7, ease: "power3.out" });
```

**Pattern C: 3D Tilt**
```typescript
gsap.set(el, { opacity: 0, y: 50, rotateX: 8, transformPerspective: 800 });
gsap.to(el, { opacity: 1, y: 0, rotateX: 0, duration: 0.8, ease: "power3.out" });
```

---

## 7. Interaction Animations

### Hover States

| Element | Property | Default | Hover | Duration |
|---------|----------|---------|-------|----------|
| Nav links | color | `--text-secondary` | `--accent` | 300ms |
| CTA buttons | box-shadow | none | `0 0 30px var(--accent-glow)` | 500ms |
| Glass cards | border-color | `--border-glass` | `--border-hover` | 500ms |
| Tech tags | border-color, color | dim | gold | 300ms |
| Social links | color | `--text-muted` | `--accent` | 300ms |

### Cursor Magnetism

The cursor doesn't actually magnetize toward elements — it just changes scale and color on hover. True magnetic attraction would move the cursor toward the element center.

---

## 8. Motion Timing Reference

### Complete Animation Timeline

```
0.00s  — Page loads
0.00s  — Preloader counter starts (0→100)
0.00s  — 3D scene begins loading (dynamic import)
2.20s  — Counter reaches 100
2.30s  — Logo/counter fade out (0.5s)
2.50s  — Split-screen exit begins (0.8s)
3.10s  — Preloader complete → site revealed
3.10s  — Navigation slides in (0.8s, delay 0.5s)
3.60s  — Navigation fully visible
3.10s  — Hero text stagger begins (over 2s)
5.10s  — All hero elements visible
5.10s  — Scroll indicator fades in
...
User scrolls → sections reveal at 85% viewport
```

---

## 9. Reduced Motion Protocol

### Three Layers of Protection

**Layer 1: CSS**
```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
  .cursor-dot, .cursor-ring { display: none !important; }
}
```

**Layer 2: GSAP Hooks**
```typescript
const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
if (prefersReduced) {
  gsap.set(el, { opacity: 1 });  // Show immediately
  return;  // Skip ScrollTrigger setup
}
```

**Layer 3: Framer Motion**
```typescript
const prefersReduced = useReducedMotion();
<motion.div initial={prefersReduced ? {} : { opacity: 0, y: 20 }} />
```

**Layer 4: Cursor**
```typescript
const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
if (prefersReduced) return;  // Don't render cursor
```

### Behavior When Reduced Motion Is Active

| Component | Behavior |
|-----------|----------|
| Preloader | Counter jumps to 100 instantly, split-screen exits instantly |
| Scroll reveals | Elements visible immediately (opacity: 1) |
| Counter | Numbers show final values immediately |
| Tilt cards | Cards visible immediately, no tilt |
| Cursor | Hidden completely |
| Chat | Animations still work (Framer Motion handles internally) |
| 3D scene | Shaders still animate (no GPU reduction) |

---

*End of Volume 5 — Motion Bible*
*Total: ~600 lines, ~13 pages*
