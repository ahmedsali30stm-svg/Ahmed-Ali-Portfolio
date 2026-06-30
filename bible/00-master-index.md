# Volume 0 — Master Index

## PROJECT SOVEREIGN — The Digital Universe of Ahmed Ali

> This is the entry point for all OpenCode agents. Read this volume first to understand the project, then navigate to the specific volume you need.

---

## Project Overview

**PROJECT SOVEREIGN** is a comprehensive specification for rebuilding Ahmed Ali's portfolio as a premium, cinematic, AI-powered web experience. It consists of 10 volumes covering every aspect of the project — from creative direction to performance optimization.

**Primary Audience:** OpenCode / AI Agent
**Language:** English
**Format:** Markdown
**Location:** `/bible/` folder in the project root

---

## Volume Index

| Vol | Title | Pages | Purpose |
|-----|-------|-------|---------|
| 0 | Master Index | ~5 | This file — entry point |
| 1 | Creative Direction | ~20 | Brand philosophy, visual identity, art direction |
| 2 | Experience Architecture | ~23 | 10 Worlds, transitions, navigation architecture |
| 3 | Technical Architecture | ~27 | Core engine, 3D, shaders, hooks, deployment |
| 4 | Scene Bible | ~18 | Every scene documented with templates |
| 5 | Motion Bible | ~13 | All animations, timing, easing, triggers |
| 6 | Shader Bible | ~11 | GLSL line-by-line analysis, modification guide |
| 7 | Asset Bible | ~7 | SVGs, fonts, colors, icons, creation guidelines |
| 8 | Development Bible | ~11 | Sprints, conventions, CI/CD, testing |
| 9 | AI Integration | ~7 | Command router, LLM swap guide, future features |
| 10 | Performance | ~8 | Budgets, Core Web Vitals, optimization strategies |

**Total:** ~150 pages, ~6,000 lines

---

## How to Use This Bible

### For New Features

1. Read **Vol 3** (Technical Architecture) to understand the codebase
2. Read **Vol 8** (Development Bible) for coding conventions and sprint plan
3. Read the relevant **Scene Bible** (Vol 4) for the section you're modifying
4. Read **Vol 5** (Motion Bible) for animation patterns
5. Read **Vol 1** (Creative Direction) for brand guidelines

### For Visual Changes

1. Read **Vol 1** (Creative Direction) for color/typography rules
2. Read **Vol 7** (Asset Bible) for asset specifications
3. Read **Vol 4** (Scene Bible) for scene compositions
4. Read **Vol 6** (Shader Bible) for 3D visual effects

### For Performance Issues

1. Read **Vol 10** (Performance) for budgets and targets
2. Read **Vol 3** (Technical Architecture) for optimization strategies
3. Read **Vol 8** (Development Bible) for testing procedures

### For AI Assistant Work

1. Read **Vol 9** (AI Integration) for command router architecture
2. Read **Vol 3** (Technical Architecture) for component integration
3. Read **Vol 5** (Motion Bible) for chat UI animations

---

## Project Status

| Phase | Status | Volumes |
|-------|--------|---------|
| Creative Direction | ✅ Complete | Vol 1 |
| Experience Architecture | ✅ Complete | Vol 2 |
| Technical Architecture | ✅ Complete | Vol 3 |
| Scene Bible | ✅ Complete | Vol 4 |
| Motion Bible | ✅ Complete | Vol 5 |
| Shader Bible | ✅ Complete | Vol 6 |
| Asset Bible | ✅ Complete | Vol 7 |
| Development Bible | ✅ Complete | Vol 8 |
| AI Integration | ✅ Complete | Vol 9 |
| Performance | ✅ Complete | Vol 10 |

---

## Key Files Reference

### Configuration

| File | Purpose |
|------|---------|
| `next.config.ts` | Next.js configuration (basePath, output, transpile) |
| `tsconfig.json` | TypeScript configuration (strict, paths) |
| `package.json` | Dependencies and scripts |
| `.github/workflows/deploy.yml` | CI/CD pipeline |

### Core Application

| File | Purpose |
|------|---------|
| `src/app/layout.tsx` | Root layout (fonts, metadata, JSON-LD) |
| `src/app/page.tsx` | Main page (component tree, state) |
| `src/app/globals.css` | CSS variables, resets, media queries |

### 3D Engine

| File | Purpose |
|------|---------|
| `src/scenes/HeroScene.tsx` | R3F Canvas wrapper |
| `src/scenes/ParticleField.tsx` | 2000 gold particles |
| `src/scenes/FloatingGeometry.tsx` | 5 wireframe shapes |
| `src/shaders/particle.ts` | GLSL vertex/fragment shaders |

### Hooks

| File | Purpose |
|------|---------|
| `src/hooks/use-gsap-reveal.ts` | Scroll-triggered reveals |
| `src/hooks/use-gsap-counter.ts` | Animated counters |
| `src/hooks/use-gsap-tilt-cards.ts` | 3D card tilt reveal |
| `src/hooks/use-reduced-motion.ts` | Motion preference detection |

### Components

| File | Purpose |
|------|---------|
| `src/components/nav/Navigation.tsx` | Fixed nav bar |
| `src/components/nav/MagneticCursor.tsx` | Custom cursor |
| `src/components/nav/AIChatAssistant.tsx` | Chat widget |
| `src/components/nav/Footer.tsx` | Footer |
| `src/components/ui/Preloader.tsx` | Loading screen |
| `src/components/sections/*.tsx` | 8 content sections |

---

## Brand Quick Reference

| Element | Value |
|---------|-------|
| Primary Gold | `#d4af37` |
| Background | `#050508` |
| Text Primary | `#f0ede6` |
| Heading Font | Space Grotesk |
| Body Font | Inter |
| Easing | `cubic-bezier(0.22, 1, 0.36, 1)` |

---

## Deployment

- **Platform:** GitHub Pages
- **URL:** `https://ahmedsali30stm-svg.github.io/Ahmed-Ali-Portfolio`
- **Trigger:** Push to `main` branch
- **Build:** `next build` → `/out/` static export
- **CI/CD:** GitHub Actions

---

*End of Volume 0 — Master Index*
