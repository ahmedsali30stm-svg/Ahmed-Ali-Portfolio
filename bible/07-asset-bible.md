# Volume 7 — Asset Bible

## PROJECT SOVEREIGN — The Digital Universe of Ahmed Ali

> Every visual asset, SVG, icon, font, color, and graphic element documented with exact specifications.

---

## Table of Contents

1. [Asset Inventory](#1-asset-inventory)
2. [SVG Assets](#2-svg-assets)
3. [Font Assets](#3-font-assets)
4. [Color Tokens](#4-color-tokens)
5. [Icon System](#5-icon-system)
6. [Asset Creation Guidelines](#6-asset-creation-guidelines)

---

## 1. Asset Inventory

| Asset | Type | File | Size | Purpose |
|-------|------|------|------|---------|
| OG Image | SVG | `public/og-image.svg` | ~2KB | Social sharing preview |
| Favicon | ICO | `public/favicon.ico` | ~4KB | Browser tab icon |
| Preloader Logo | Inline SVG | `Preloader.tsx` | 48×48 | Loading screen logo |
| Chat Avatar | Inline SVG | `AIChatAssistant.tsx` | 16×16 | AI assistant avatar |
| Chat FAB Icon | Inline SVG | `AIChatAssistant.tsx` | 20×20 | Floating action button |
| Close Icon | Inline SVG | `AIChatAssistant.tsx` | 16×16 | Close button |
| Arrow Icon | Inline SVG | `AIChatAssistant.tsx` | 12×12 | Navigation badge |
| Send Icon | Inline SVG | `AIChatAssistant.tsx` | 16×16 | Send button |
| Scroll Indicator | CSS | `HeroSection.tsx` | 1px × 48px | Scroll hint |
| Gold Lines | CSS | Various sections | 12px × 1px | Section label decorations |

---

## 2. SVG Assets

### OG Image — `public/og-image.svg`

**Dimensions:** 1200×630 (OpenGraph standard)
**Format:** SVG (referenced as `image/svg+xml`)
**Content:** Abstract gold geometric pattern on dark background

**Usage:**
```html
<meta property="og:image" content="/og-image.svg" />
<meta name="twitter:image" content="/og-image.svg" />
```

**Note:** Should be replaced with a 1200×630 PNG for wider compatibility. SVG OG images are not supported by all platforms.

### Preloader Logo (Inline)

```svg
<svg width="48" height="48" viewBox="0 0 48 48" fill="none">
  <rect x="4" y="4" width="40" height="40" rx="2"
        stroke="#d4af37" stroke-width="1.5" opacity="0.4" />
  <rect x="12" y="12" width="24" height="24" rx="1"
        stroke="#d4af37" stroke-width="1" opacity="0.6" />
  <rect x="18" y="18" width="12" height="12"
        fill="#d4af37" opacity="0.8" />
</svg>
```

**Design:** 3 nested rectangles — represents layers of architecture. Opacity increases inward (0.4 → 0.6 → 0.8).

### Chat Icons (Inline)

All chat icons are inline SVGs within `AIChatAssistant.tsx`:

| Icon | ViewBox | Stroke | Size |
|------|---------|--------|------|
| Robot/Chat | 0 0 24 24 | #050508 | 16×16 |
| Close (X) | 0 0 24 24 | currentColor | 16×16 / 20×20 |
| Arrow Right | 0 0 24 24 | currentColor | 12×12 |
| Send | 0 0 24 24 | currentColor | 16×16 |

---

## 3. Font Assets

### Primary: Space Grotesk

**CSS Variable:** `--font-heading`
**Weights:** 300, 400, 500, 600, 700
**Subsets:** Latin
**Display:** Swap
**Usage:** Headings, nav logo, counter, section labels, chat header

### Secondary: Inter

**CSS Variable:** `--font-body`
**Weights:** 300, 400, 500, 600, 700
**Subsets:** Latin
**Display:** Swap
**Usage:** Body text, descriptions, paragraphs, chat messages

### Loading Strategy

```typescript
const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-heading",
  display: "swap",  // Show fallback immediately, swap when loaded
});
```

`display: "swap"` ensures text is visible immediately with a fallback font, then swaps to the custom font when loaded.

---

## 4. Color Tokens

### CSS Custom Properties

| Token | Value | RGB | Use |
|-------|-------|-----|-----|
| `--bg-primary` | `#050508` | `rgb(5, 5, 8)` | Main background |
| `--bg-secondary` | `#0a0a10` | `rgb(10, 10, 16)` | Secondary background |
| `--bg-glass` | `rgba(255,255,255,0.025)` | — | Glassmorphism fill |
| `--border-glass` | `rgba(255,255,255,0.06)` | — | Default borders |
| `--border-hover` | `rgba(212,175,55,0.35)` | — | Hover borders |
| `--accent` | `#d4af37` | `rgb(212, 175, 55)` | Primary gold |
| `--accent-soft` | `rgba(212,175,55,0.12)` | — | Soft gold |
| `--accent-glow` | `rgba(212,175,55,0.4)` | — | Glow effect |
| `--text-primary` | `#f0ede6` | `rgb(240, 237, 230)` | Main text |
| `--text-secondary` | `rgba(240,237,230,0.55)` | — | Secondary text |
| `--text-muted` | `rgba(240,237,230,0.3)` | — | Muted text |
| `--gradient-gold` | `linear-gradient(135deg, #d4af37, #f0d060, #d4af37)` | — | Gold gradient |

### Shader Colors

| Name | RGB | Hex | Use |
|------|-----|-----|-----|
| Pure Gold | `rgb(1.0, 0.84, 0.0)` | `#FFD700` | Particle core |
| Amber | `rgb(0.95, 0.65, 0.1)` | `#F2A61A` | Particle mid |
| Deep Amber | `rgb(0.8, 0.3, 0.05)` | `#CC4D0D` | Particle edge |

**Note:** Shader gold (`#FFD700`) is brighter than UI gold (`#d4af37`). This is intentional — particles should glow brighter than UI elements.

### Tailwind Usage

Colors are applied via Tailwind's arbitrary value syntax:
```html
<div class="bg-[var(--bg-primary)]">
<div class="text-[var(--accent)]">
<div class="border border-[var(--border-glass)]">
```

---

## 5. Icon System

All icons are inline SVG — no icon library dependency.

### Design Principles

1. **Stroke-based:** All icons use `stroke` not `fill`
2. **Consistent stroke width:** 2px (or 2.5px for emphasis)
3. **Round caps:** `stroke-linecap="round"`
4. **Gold for primary:** Active/brand icons use `#d4af37`
5. **Current color for contextual:** Icons that inherit text color

### Icon Catalog

| Icon | Stroke | Use | Location |
|------|--------|-----|----------|
| Robot | #050508 | Chat avatar | AIChatAssistant |
| Close (X) | currentColor | Close buttons | Navigation, Chat |
| Arrow Right | currentColor | Navigation badge | AIChatAssistant |
| Send (Paper Plane) | currentColor | Send button | AIChatAssistant |
| Hamburger (3 lines) | #d4af37 | Mobile menu toggle | Navigation |

---

## 6. Asset Creation Guidelines

### SVG Guidelines

- Use `viewBox` for scalability
- No `width`/`height` on root element (let CSS control size)
- Use `currentColor` for icons that should inherit text color
- Use explicit hex for brand icons (gold)
- Keep stroke width consistent (2px)

### New Asset Checklist

- [ ] SVG or inline SVG (no raster images except favicon)
- [ ] `aria-hidden="true"` if decorative
- [ ] Responsive sizing via CSS
- [ ] Gold accent (#d4af37) for brand elements
- [ ] Dark background compatible

---

*End of Volume 7 — Asset Bible*
*Total: ~300 lines, ~7 pages*
