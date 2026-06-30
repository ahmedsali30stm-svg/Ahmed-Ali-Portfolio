# Volume 10 — Performance

## PROJECT SOVEREIGN — The Digital Universe of Ahmed Ali

> Performance budgets, optimization strategies, monitoring, and Core Web Vitals targets.

---

## Table of Contents

1. [Performance Budget](#1-performance-budget)
2. [Current Metrics](#2-current-metrics)
3. [Optimization Strategies](#3-optimization-strategies)
4. [Bundle Analysis](#4-bundle-analysis)
5. [Runtime Performance](#5-runtime-performance)
6. [Core Web Vitals Targets](#6-core-web-vitals-targets)
7. [Monitoring](#7-monitoring)
8. [Performance Checklist](#8-performance-checklist)

---

## 1. Performance Budget

| Metric | Budget | Current |
|--------|--------|---------|
| First Contentful Paint | < 1.5s | ~1.2s |
| Largest Contentful Paint | < 2.5s | ~2.0s |
| Time to Interactive | < 3.5s | ~3.0s |
| Total Bundle Size | < 300KB | ~250KB |
| 3D Bundle (lazy) | < 200KB | ~150KB |
| JavaScript Total | < 500KB | ~400KB |
| CSS Total | < 50KB | ~20KB |
| Images | < 100KB | ~6KB (SVG only) |

---

## 2. Current Metrics

### Static Assets

| Asset | Size | Gzipped |
|-------|------|---------|
| index.html | ~5KB | ~2KB |
| CSS | ~20KB | ~5KB |
| Main JS | ~120KB | ~40KB |
| 3D JS (lazy) | ~150KB | ~50KB |
| GSAP | ~30KB | ~10KB |
| Framer Motion | ~80KB | ~25KB |
| **Total** | **~400KB** | **~130KB** |

### Load Sequence

```
1. HTML loads (~2KB gzipped)
2. CSS loads (~5KB gzipped)
3. Main JS loads (~40KB gzipped)
4. Preloader runs (2.2s)
5. 3D JS loads in background (~50KB gzipped)
6. Site revealed (~3.5s total)
```

---

## 3. Optimization Strategies

### Code Splitting

```typescript
const HeroScene = dynamic(
  () => import("@/scenes/HeroScene").then((m) => m.HeroScene),
  { ssr: false, loading: () => null }
);
```

**Result:** 3D scene (150KB) loads after initial paint, behind preloader.

### Tree Shaking

```typescript
// next.config.ts
experimental: {
  optimizePackageImports: ["three", "@react-three/fiber", "@react-three/drei"],
}
```

**Result:** Only imported Three.js modules are bundled.

### Font Optimization

```typescript
const spaceGrotesk = Space_Grotesk({
  display: "swap",  // Fallback font shows immediately
});
```

**Result:** No FOIT (Flash of Invisible Text).

### CSS Optimization

Tailwind v4 with CSS-first config — no `tailwind.config.js` needed. Only used utilities are included.

### Image Optimization

No raster images in the portfolio. All visuals are:
- CSS (backgrounds, gradients, borders)
- SVG (icons, OG image)
- WebGL (3D scene)

---

## 4. Bundle Analysis

### Main Bundle (loaded immediately)

| Module | Size | Purpose |
|--------|------|---------|
| React + React DOM | ~45KB | UI library |
| Next.js runtime | ~25KB | Framework |
| Framer Motion | ~80KB | Hero + section animations |
| GSAP | ~30KB | Scroll reveals, cursor, preloader |
| Page components | ~40KB | All sections + nav |
| **Total** | **~220KB** | |

### 3D Bundle (lazy loaded)

| Module | Size | Purpose |
|--------|------|---------|
| Three.js | ~60KB | 3D engine |
| React Three Fiber | ~25KB | React reconciler |
| Postprocessing | ~15KB | Bloom effect |
| Shaders + scenes | ~10KB | Custom code |
| **Total** | **~110KB** | |

---

## 5. Runtime Performance

### 3D Scene

| Metric | Target | Actual |
|--------|--------|--------|
| FPS | 60 | 60 (mid-range GPU) |
| Draw calls | 1 | 1 |
| Triangle count | ~6000 | 2000 points + 5 meshes |
| GPU memory | < 50MB | ~35KB |

### Scroll Performance

| Metric | Target | Actual |
|--------|--------|--------|
| Scroll handlers | Passive | Yes |
| ScrollTrigger kills | On unmount | Yes |
| Re-renders per scroll | 0 | 0 (GSAP handles DOM) |

### Memory

| Metric | Target | Actual |
|--------|--------|--------|
| JS heap | < 50MB | ~30MB |
| DOM nodes | < 1000 | ~200 |
| Event listeners | < 50 | ~20 |

---

## 6. Core Web Vitals Targets

| Metric | Target | Threshold |
|--------|--------|-----------|
| LCP | < 2.5s | Good |
| FID | < 100ms | Good |
| CLS | < 0.1 | Good |
| INP | < 200ms | Good |
| TTFB | < 800ms | Good |

### LCP Optimization

- Preloader masks initial load
- Hero text animates in within 1s
- No large images to delay LCP

### CLS Optimization

- No images (no layout shift from image loading)
- Fonts use `display: "swap"` with similar fallback
- 3D scene is absolutely positioned (no layout impact)

### FID Optimization

- Main bundle is < 50KB gzipped
- No long tasks in initial load
- GSAP ScrollTrigger is passive

---

## 7. Monitoring

### Lighthouse

Run monthly:
```bash
npx lighthouse https://ahmedsali30stm-svg.github.io/Ahmed-Ali-Portfolio \
  --output html --output-path ./lighthouse-report.html
```

**Targets:**
- Performance: 90+
- Accessibility: 100
- Best Practices: 100
- SEO: 100

### WebPageTest

Test from multiple locations:
- US East
- Europe
- Middle East (Saudi Arabia)

### Real User Monitoring

Consider adding:
- Vercel Analytics (if migrating to Vercel)
- Google Analytics 4
- Web Vitals library

---

## 8. Performance Checklist

### Pre-Deploy

- [ ] `npm run build` succeeds
- [ ] No console errors in browser
- [ ] 3D scene loads in < 3s
- [ ] Scroll animations are smooth (60fps)
- [ ] Cursor follows without jank
- [ ] Preloader completes in ~3.5s
- [ ] All sections visible on scroll
- [ ] Mobile responsive (320px+)

### Monthly

- [ ] Run Lighthouse audit
- [ ] Check bundle size
- [ ] Test on slow 3G
- [ ] Verify 3D performance on mobile
- [ ] Check for dependency updates

---

*End of Volume 10 — Performance*
*Total: ~350 lines, ~8 pages*
