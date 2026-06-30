# Volume 8 — Development Bible

## PROJECT SOVEREIGN — The Digital Universe of Ahmed Ali

> Sprint-by-sprint development plan, coding conventions, testing strategy, and CI/CD procedures for OpenCode agents.

---

## Table of Contents

1. [Development Environment](#1-development-environment)
2. [Coding Conventions](#2-coding-conventions)
3. [Sprint Plan](#3-sprint-plan)
4. [Sprint 0: Foundation](#4-sprint-0-foundation)
5. [Sprint 1: 3D & Shaders](#5-sprint-1-3d--shaders)
6. [Sprint 2: Interactions](#6-sprint-2-interactions)
7. [Sprint 3: AI Assistant](#7-sprint-3-ai-assistant)
8. [Sprint 4: Polish & Deploy](#8-sprint-4-polish--deploy)
9. [Sprint 5: Enhancement Wave 1](#9-sprint-5-enhancement-wave-1)
10. [Sprint 6: Enhancement Wave 2](#10-sprint-6-enhancement-wave-2)
11. [Sprint 7: Enhancement Wave 3](#11-sprint-7-enhancement-wave-3)
12. [Testing Strategy](#12-testing-strategy)
13. [CI/CD Pipeline](#13-cicd-pipeline)
14. [Known Issues & Workarounds](#14-known-issues--workarounds)
15. [Git Workflow](#15-git-workflow)

---

## 1. Development Environment

### Prerequisites

| Tool | Version | Purpose |
|------|---------|---------|
| Node.js | 20+ | Runtime |
| npm | 10+ | Package manager |
| Git | 2.x | Version control |
| VS Code | Latest | Editor |
| GitHub CLI (`gh`) | Latest | PR/issue management |

### Local Setup

```bash
git clone https://github.com/ahmedsali30stm-svg/Ahmed-Ali-Portfolio.git
cd Ahmed-Ali-Portfolio
npm install
npm run dev -- --webpack    # Use --webpack on Windows (Turbopack fails)
```

**Important:** On Windows, Turbopack fails with "SWC binary not valid Win32". Always use `--webpack` flag.

### Dev Server

```bash
npm run dev -- --webpack
# → http://localhost:3000/Ahmed-Ali-Portfolio
```

### Build

```bash
npm run build
# → /out/ directory (static export)
```

### Lint

```bash
npm run lint
# → ESLint with next/core-web-vitals config
```

---

## 2. Coding Conventions

### File Naming

| Type | Convention | Example |
|------|-----------|---------|
| Components | PascalCase | `HeroSection.tsx` |
| Hooks | kebab-case with `use-` prefix | `use-gsap-reveal.ts` |
| Scenes | PascalCase | `ParticleField.tsx` |
| Shaders | kebab-case | `particle.ts` |
| CSS | kebab-case | `globals.css` |

### Component Structure

```typescript
"use client";

import { ... } from "...";

// Types/interfaces at top
interface Props { ... }

// Constants
const DATA = [...];

// Component
export function ComponentName({ ... }: Props) {
  // Hooks
  // State
  // Effects
  // Handlers
  // Render
}

// Sub-components (if any)
function SubComponent() { ... }
```

### CSS Usage

- **Primary:** Tailwind utility classes
- **Custom properties:** Via `var(--token)` in arbitrary values
- **No CSS modules** — all styles in `globals.css` or inline
- **No styled-components** — zero-runtime CSS

### TypeScript

- `strict: true` in tsconfig
- Use `interface` for props
- Use `Record<string, T>` for dictionaries
- Avoid `any` — use `unknown` with type guards
- Use `as const` for literal arrays

### Accessibility

- All interactive elements: native HTML (`<a>`, `<button>`, `<input>`)
- Decorative elements: `aria-hidden="true"`
- Form inputs: placeholder text (acceptable for single-field forms)
- External links: `target="_blank" rel="noopener noreferrer"`

---

## 3. Sprint Plan

| Sprint | Focus | Sessions | Deliverable |
|--------|-------|----------|-------------|
| 0 | Foundation | 1 | Next.js 16 project, all components created |
| 1 | 3D & Shaders | 1 | Custom GLSL shaders, GSAP hooks |
| 2 | Interactions | 1 | Magnetic cursor, preloader, code splitting |
| 3 | AI Assistant | 1 | Command router, chat UI, glassmorphism |
| 4 | Polish & Deploy | 1 | SEO, metadata, GitHub Actions, deployment |
| 5 | Enhancement Wave 1 | 1 | Bible Vols 1-3 |
| 6 | Enhancement Wave 2 | 1 | Bible Vols 4-6 |
| 7 | Enhancement Wave 3 | 1 | Bible Vols 7-10, final review |

---

## 4. Sprint 0: Foundation

### Tasks

1. Initialize Next.js 16 project with TypeScript
2. Install all dependencies
3. Create folder structure
4. Create all section components (8 sections)
5. Create nav components (Navigation, Footer)
6. Create hooks (use-gsap-reveal, use-gsap-counter, use-gsap-tilt-cards, use-reduced-motion)
7. Create scene components (HeroScene, ParticleField, FloatingGeometry)
8. Create shader file (particle.ts)
9. Create MagneticCursor, Preloader, AIChatAssistant
10. Wire up page.tsx with all components
11. Configure globals.css with custom properties
12. Configure next.config.ts

### Dependencies

```json
{
  "next": "16.2.9",
  "react": "19.2.4",
  "react-dom": "19.2.4",
  "three": "^0.185.0",
  "@react-three/fiber": "^9.6.1",
  "@react-three/drei": "^10.7.7",
  "@react-three/postprocessing": "^3.0.4",
  "gsap": "^3.15.0",
  "@gsap/react": "^2.1.2",
  "framer-motion": "^12.42.0",
  "tailwindcss": "^4",
  "@tailwindcss/postcss": "^4",
  "typescript": "^5",
  "@types/node": "^20",
  "@types/react": "^19",
  "@types/react-dom": "^19",
  "@types/three": "^0.185.0"
}
```

---

## 5. Sprint 1: 3D & Shaders

### Tasks

1. Implement simplex noise in GLSL vertex shader
2. Add organic breathing displacement
3. Add wave ripple effect
4. Add pulsing glow (vPulse)
5. Implement three-color radial gradient in fragment shader
6. Add distance fog
7. Add bioluminescent pulse
8. Configure additive blending
9. Add Bloom post-processing
10. Create FloatingGeometry with 5 wireframe shapes
11. Implement shape-specific float/rotation animations

### Verification

- 2000 particles visible on screen
- Particles move organically (breathing + wave)
- Gold-to-amber gradient visible
- Bloom glow on bright particles
- 5 wireframe shapes floating in background
- Performance: 60fps on mid-range device

---

## 6. Sprint 2: Interactions

### Tasks

1. Implement MagneticCursor with lerp following
2. Add hover detection and scale animation
3. Add touch/reduced-motion device detection
4. Create Preloader with GSAP timeline
5. Implement split-screen exit animation
6. Add code splitting for HeroScene (`next/dynamic`)
7. Add Preloader gate state in page.tsx
8. Verify cursor hides on touch devices

### Verification

- Cursor follows mouse with smooth lag
- Cursor changes on hover over links/buttons
- Cursor hidden on touch devices
- Preloader counts 0→100 in 2.2s
- Preloader splits and reveals site
- 3D scene loads behind preloader
- No layout shift on reveal

---

## 7. Sprint 3: AI Assistant

### Tasks

1. Define CommandMatch interface
2. Create COMMANDS array with 11 patterns
3. Implement resolveResponse() function
4. Create chat window UI (glassmorphism)
5. Create FAB with glow pulse
6. Add quick command chips
7. Implement typing indicator
8. Add RichText bold markdown renderer
9. Add auto-scroll to latest message
10. Wire up navigation on command match

### Verification

- FAB visible bottom-right with gold glow
- Clicking FAB opens chat window
- Typing "projects" navigates to projects section
- Typing "about" navigates to about section
- Typing "hello" gets knowledge response
- Quick command chips work
- Typing indicator appears during "thinking"
- Chat window closes on X button

---

## 8. Sprint 4: Polish & Deploy

### Tasks

1. Add SEO metadata (title, description, keywords, openGraph, twitter)
2. Add JSON-LD Person schema
3. Create OG image (SVG)
4. Add robots.txt configuration
5. Create GitHub Actions workflow
6. Configure `output: "export"` in next.config.ts
7. Add `basePath` for GitHub Pages
8. Test build locally
9. Push to GitHub
10. Verify deployment

### Verification

- `npm run build` succeeds
- `/out/` directory contains index.html + assets
- GitHub Actions workflow runs on push to main
- Site accessible at GitHub Pages URL
- OG image shows in social sharing previews
- JSON-LD validates in Google Rich Results Test

---

## 9. Sprint 5: Enhancement Wave 1

### Tasks

1. Write Bible Volume 1 — Creative Direction
2. Write Bible Volume 2 — Experience Architecture
3. Write Bible Volume 3 — Technical Architecture
4. Commit and push all volumes

---

## 10. Sprint 6: Enhancement Wave 2

### Tasks

1. Write Bible Volume 4 — Scene Bible
2. Write Bible Volume 5 — Motion Bible
3. Write Bible Volume 6 — Shader Bible
4. Commit and push all volumes

---

## 11. Sprint 7: Enhancement Wave 3

### Tasks

1. Write Bible Volume 7 — Asset Bible
2. Write Bible Volume 8 — Development Bible
3. Write Bible Volume 9 — AI Integration
4. Write Bible Volume 10 — Performance
5. Write Bible Volume 0 — Master Index
6. Final review of all volumes
7. Commit and push

---

## 12. Testing Strategy

### Manual Testing

| Test | Method | Pass Criteria |
|------|--------|---------------|
| Load time | Chrome DevTools | < 3s first contentful paint |
| 3D performance | FPS counter | 60fps sustained |
| Cursor behavior | Mouse interaction | Smooth follow, hover change |
| Preloader | Page load | Completes in ~3.5s |
| AI assistant | Type commands | Correct responses + navigation |
| Responsive | Chrome DevTools | Works on 320px–2560px |
| Accessibility | WAVE tool | No errors |
| SEO | Rich Results Test | Valid JSON-LD |

### Build Verification

```bash
npm run build    # Must succeed
npm run lint     # Must pass
```

### Browser Support

- Chrome 90+
- Firefox 90+
- Safari 15+
- Edge 90+

---

## 13. CI/CD Pipeline

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
      - npm install (NOT npm ci)
      - npx next build
      - Upload ./out artifact

  deploy:
    needs: build
    runs-on: ubuntu-latest
    steps:
      - Deploy to GitHub Pages
```

### Known CI Issues

1. **`npm ci` fails** — Lock file sync issues. Use `npm install` instead.
2. **Turbopack on Windows** — SWC binary not valid. Use `--webpack` locally.
3. **HTML caching** — GitHub Pages CDN caches aggressively. Users need hard refresh.

---

## 14. Known Issues & Workarounds

| Issue | Workaround |
|-------|-----------|
| Turbopack fails on Windows | Use `next dev --webpack` |
| `npm ci` fails in GitHub Actions | Use `npm install` |
| GitHub Pages caches HTML | Users do hard refresh (Ctrl+Shift+R) |
| OG image SVG not supported everywhere | Replace with PNG |
| `@react-three/drei` unused | Available but not imported (tree-shaken) |

---

## 15. Git Workflow

### Branch Strategy

- `main` — Production branch, triggers deployment
- Feature branches — Created per sprint, merged via PR

### Commit Convention

```
Bible Vol N: Title - brief description
```

Examples:
```
Bible Vol 1: Creative Direction - brand philosophy and visual identity
Bible Vol 3: Technical Architecture - core engine, 3D, shaders, hooks
Bible Vol 5-6: Motion Bible + Shader Bible - timing, easing, GLSL analysis
```

### PR Process

1. Create feature branch
2. Make changes
3. Run `npm run build` and `npm run lint`
4. Commit with convention
5. Push and create PR
6. Merge to main → auto-deploys

---

*End of Volume 8 — Development Bible*
*Total: ~500 lines, ~11 pages*
