# Volume 4 — Scene Bible

## PROJECT SOVEREIGN — The Digital Universe of Ahmed Ali

> Every visual scene, 3D environment, section backdrop, and interactive space is documented here with a standardized template. This volume is the visual construction manual — how each scene is built, what it contains, and how it behaves.

---

## Table of Contents

1. [Scene Classification System](#1-scene-classification-system)
2. [Scene 01: The Void — Preloader](#2-scene-01-the-void--preloader)
3. [Scene 02: The Cosmos — Hero 3D Background](#3-scene-02-the-cosmos--hero-3d-background)
4. [Scene 03: The Foundation — Hero Text](#4-scene-03-the-foundation--hero-text)
5. [Scene 04: The Chronicle — About Section](#5-scene-04-the-chronicle--about-section)
6. [Scene 05: The Metrics — Stats Section](#6-scene-05-the-metrics--stats-section)
7. [Scene 06: The Forge — Expertise Section](#7-scene-06-the-forge--expertise-section)
8. [Scene 07: The Showcase — Projects Section](#8-scene-07-the-showcase--projects-section)
9. [Scene 08: The Arsenal — Tech Stack Section](#9-scene-08-the-arsenal--tech-stack-section)
10. [Scene 09: The Echo — Testimonials Section](#10-scene-09-the-echo--testimonials-section)
11. [Scene 10: The Signal — Contact Section](#11-scene-10-the-signal--contact-section)
12. [Scene 11: The Navigator — AI Chat](#12-scene-11-the-navigator--ai-chat)
13. [Scene 12: The Beacon — Magnetic Cursor](#13-scene-12-the-beacon--magnetic-cursor)
14. [Scene Transitions](#14-scene-transitions)
15. [Scene Rendering Order](#15-scene-rendering-order)

---

## 1. Scene Classification System

Every scene in the portfolio falls into one of three categories:

| Type | Description | Example |
|------|-------------|---------|
| **3D Scene** | WebGL/Three.js rendered environment | Hero Background |
| **2D Section** | DOM-based section with CSS/GSAP/Framer Motion | About, Projects, Contact |
| **Overlay** | Persistent UI layer above all scenes | Cursor, Chat Widget, Preloader |

### Standard Scene Template

Every scene entry follows this structure:

```markdown
## Scene NN: [Name] — [Location]

**Type:** 3D / 2D / Overlay
**File:** `src/[path]/[file].tsx`
**Section ID:** #sectionid (if applicable)
**Visible:** When user is at [scroll position]

### Visual Composition
[What the user sees]

### Technical Implementation
[How it's built]

### Animation Behaviors
[What moves and how]

### Accessibility
[ARIA, reduced motion, keyboard]
```

---

## 2. Scene 01: The Void — Preloader

**Type:** Overlay
**File:** `src/components/ui/Preloader.tsx`
**Visible:** Always, from page load until ~3.5 seconds

### Visual Composition

```
┌─────────────────────────────────────┐
│                                     │
│                                     │
│            ┌─────────┐              │
│            │ ◻ ◻ ◻   │  ← SVG Logo │
│            │   ◻ ◻   │              │
│            └─────────┘              │
│                                     │
│              000                    │  ← Counter (Space Grotesk, bold, gold)
│                                     │
│           ━━━━━━━━━━━━             │  ← Progress bar (1px gold on dim)
│                                     │
│            LOADING                  │  ← Label (uppercase, tracked, muted)
│                                     │
│                                     │
└─────────────────────────────────────┘

Background: #050508 (solid, full-screen)
Z-index: 10000 (container), 10001 (panels), 10002 (content)
```

### Technical Implementation

**Container:** `position: fixed, inset: 0, z-index: 10000, pointer-events: none`

**Two Background Panels:**
- Top half: `h-1/2, bg-[var(--bg-primary)]` — slides up on exit
- Bottom half: `h-1/2, bg-[var(--bg-primary)]` — slides down on exit

**SVG Logo:** 3 nested rectangles (48×48 viewBox)
```svg
<rect x="4" y="4" width="40" height="40" rx="2" stroke="#d4af37" opacity="0.4" />
<rect x="12" y="12" width="24" height="24" rx="1" stroke="#d4af37" opacity="0.6" />
<rect x="18" y="18" width="12" height="12" fill="#d4af37" opacity="0.8" />
```

**Counter:** `{String(count).padStart(3, "0")}` — zero-padded 3 digits

### Animation Behaviors

| Step | Time | Action | Ease |
|------|------|--------|------|
| 1 | 0–2.2s | Counter 0→100, progress bar 0→100% | `power2.inOut` |
| 2 | 1.9–2.4s | Logo + counter fade up and out | `power2.in`, stagger 0.08 |
| 3 | 2.3–3.1s | Top panel slides up (yPercent: -100) | `power3.inOut` |
| 3 | 2.3–3.1s | Bottom panel slides down (yPercent: 100) | `power3.inOut` |
| 4 | 3.1s | `onComplete()` callback fires | — |

### Accessibility

- `pointer-events: none` — never blocks interaction
- Removed from DOM after completion
- If reduced motion: all animations skip to end state immediately

---

## 3. Scene 02: The Cosmos — Hero 3D Background

**Type:** 3D (WebGL)
**File:** `src/scenes/HeroScene.tsx` (container) + `ParticleField.tsx` + `FloatingGeometry.tsx`
**Visible:** Always rendered behind HeroSection, but only visible in hero viewport

### Visual Composition

```
┌─────────────────────────────────────┐
│ ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ │
│ ░░ ○  ○    ○     ○  ○    ○  ○ ░░ │  ← 2000 gold particles
│ ░░   ○   ◇   ○      ○  ◇   ○  ░░ │  ← 5 wireframe shapes
│ ░░ ○    ○    ○  ○  ○    ○    ○ ░░ │
│ ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ │
│                                     │
│  ○ = particle  ◇ = wireframe shape  │
│  Bloom glow on bright particles     │
└─────────────────────────────────────┘

Background: #050508 (opaque)
Fog: #050508, near: 5, far: 15
Post-processing: Bloom (intensity 0.5, threshold 0.2)
```

### Technical Implementation

**Canvas Configuration:**
```typescript
<Canvas
  camera={{ position: [0, 0, 4], fov: 50 }}
  dpr={[1, 1.5]}
  gl={{ antialias: true, alpha: false, powerPreference: "high-performance" }}
/>
```

**Particle Distribution:** Spherical shell between radius 3–8 units, using `phi = acos(2*random - 1)` for uniform sphere distribution.

**Geometry Count:** 2000 particles, 5 wireframe shapes.

### Animation Behaviors

| Element | Animation | Speed |
|---------|-----------|-------|
| Particle field | Y-axis rotation | 0.03 rad/s |
| Particle field | X-axis wobble | `sin(t * 0.02) * 0.05` |
| Each particle | Noise-based displacement | 0.12 amplitude |
| Each particle | Sin wave ripple | 0.05 amplitude, 0.4 speed |
| Each particle | Pulsing glow | 0.3 amplitude, 1.2 speed |
| Wireframe shapes | Float up/down | Individual speeds (0.25–0.45) |
| Wireframe shapes | X + Z rotation | Individual speeds |

### Bloom Effect

```
intensity: 0.5          — Moderate glow
luminanceThreshold: 0.2 — Only bright pixels bloom
luminanceSmoothing: 0.9 — Smooth transition
mipmapBlur: true        — High quality
```

### Accessibility

- WebGL canvas has no ARIA (decorative background)
- Hidden from screen readers via `position: absolute, inset: 0, z: 0`
- No interactive elements in the 3D scene
- Reduced motion: Particle animation speed reduces (handled in shader via `uTime`)

---

## 4. Scene 03: The Foundation — Hero Text

**Type:** 2D Section
**File:** `src/components/sections/HeroSection.tsx`
**Section ID:** `#hero`
**Visible:** Full-screen on page load

### Visual Composition

```
┌─────────────────────────────────────┐
│                                     │
│         ━━ PORTFOLIO ━━            │  ← Label with gold lines
│                                     │
│            Ahmed                    │  ← 6xl/8xl/9xl, bold, white
│             Ali                     │  ← 6xl/8xl/9xl, bold, gold
│                                     │
│  Building autonomous AI-first       │  ← 2xl, light, secondary color
│  travel ecosystems.                 │
│  Founder of Etlaala Travel...       │  ← Muted text
│                                     │
│  ┌──────┐ ┌──────┐ ┌──────┐       │  ← Role badges (rounded-full, glass)
│  │ AI   │ │Luxury│ │Sales │       │
│  │Systems│ │Travel│ │Leader│       │
│  └──────┘ └──────┘ └──────┘       │
│                                     │
│  ┌─────────┐  ┌─────────┐          │  ← CTAs
│  │Get in   │  │View     │          │
│  │Touch    │  │Projects │          │
│  └─────────┘  └─────────┘          │
│                                     │
│            │                        │  ← Scroll indicator (1px gold line)
│            │                        │     Animated bounce
└─────────────────────────────────────┘
```

### Technical Implementation

**Framer Motion Staggered Entrance:**
| Element | Delay | Duration | Ease |
|---------|-------|----------|------|
| Label | 0s | 0.8s | `power3.out` |
| Name | 0.15s | 0.9s | `power3.out` |
| Tagline | 0.35s | 0.8s | `power3.out` |
| Role badges | 0.7s + i*0.1 | 0.5s | — |
| CTAs | 1s | 0.8s | `power3.out` |
| Scroll indicator | 2s | 1s | — |

**Scroll Indicator:** `motion.div` with `animate={{ y: [0, 8, 0] }}` — infinite bounce.

### Accessibility

- Semantic `<section id="hero">`
- CTAs are `<a>` tags with `href="#contact"` and `href="#projects"`
- Reduced motion: All Framer Motion `initial` props become `{}`

---

## 5. Scene 04: The Chronicle — About Section

**Type:** 2D Section
**File:** `src/components/sections/AboutSection.tsx`
**Section ID:** `#about`

### Visual Composition

```
┌─────────────────────────────────────┐
│ ━━ ABOUT                           │  ← Label (GSAP reveal from left)
│                                     │
│ AI Systems Builder.                 │  ← Heading (GSAP reveal from below)
│ Travel Technology Strategist.       │     Gold accent on second line
│                                     │
│ ┌──────────────┐ ┌──────────────┐  │  ← Bio (2-column grid)
│ │ Ahmed Ali is │ │ He specializes│  │
│ │ an AI...     │ │ in building  │  │
│ │              │ │ autonomous...│  │
│ └──────────────┘ └──────────────┘  │
│                                     │
│ ── Present ──                      │  ← Timeline (vertical line)
│   Founder & AI Systems Architect   │     5 entries
│   Etlaala Travel & Tourism         │     Gold dots on line
│                                     │
│ ── 2022-2023 ──                    │
│   Senior B2B Travel Tech Agent     │
│   ...                              │
└─────────────────────────────────────┘
```

### Technical Implementation

**Timeline:** 5 career entries with a vertical gold gradient line on the left.

**GSAP Reveals:**
- Label: `x: -30 → 0` (0.7s)
- Heading: `y: 40 → 0` (0.8s, delay 0.1)
- Bio grid: `y: 30 → 0` (0.8s, delay 0.2)
- Timeline container: `y: 40 → 0` (0.9s, delay 0.1)
- Each timeline item: `x: -20 → 0` (0.6s, stagger 0.12)

**Timeline Item Structure:**
```html
<div class="pl-8 relative">
  <div class="absolute left-0 top-2 w-2 h-2 rounded-full bg-[var(--accent)]" />  <!-- Dot -->
  <span class="text-xs tracking-[0.2em] uppercase text-[var(--accent)]">Period</span>
  <h3 class="text-xl md:text-2xl font-semibold">Title</h3>
  <p class="text-sm text-[var(--text-muted)]">Organization</p>
  <p class="text-[var(--text-secondary)]">Description</p>
</div>
```

### Content

| Period | Title | Organization |
|--------|-------|-------------|
| Present | Founder & AI Systems Architect | Etlaala Travel & Tourism |
| 2022–2023 | Senior B2B Travel Tech Agent | Etlaala — Mecca, Saudi Arabia |
| 2021–2022 | Business Development Manager | Etlaala — Mecca |
| 2019–2021 | Senior Travel Consultant | Etlaala — Mecca |
| 2018–2019 | Travel Operations Specialist | Etlaala — Mecca |

---

## 6. Scene 05: The Metrics — Stats Section

**Type:** 2D Section
**File:** `src/components/sections/StatsSection.tsx`
**Section ID:** `#stats`

### Visual Composition

```
┌─────────────────────────────────────┐
│                                     │
│  ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐  │
│  │  300+  │ │SAR 16M+│ │  50+   │ │   5    │  │
│  │Corporate│ │Annual  │ │Hotel   │ │Team    │  │
│  │Accounts │ │Sales   │ │Partners│ │Members │  │
│  └────────┘ └────────┘ └────────┘ └────────┘  │
│                                     │
│  (4-column grid, centered text)     │
└─────────────────────────────────────┘
```

### Technical Implementation

**Counter Animation:** GSAP ScrollTrigger-based counter.

**Data Attributes:**
```html
<div data-count="300+">0+</div>
<div data-count="SAR 16M+">SAR 0M+</div>
<div data-count="50+">0+</div>
<div data-count="5">0</div>
```

**Animation Logic:**
1. Parse `data-count` → extract prefix ("SAR "), number (300), suffix ("+")
2. On viewport entry, animate number from 0 to target
3. Numbers ≥ 100 get `toLocaleString()`
4. Stagger: 0.15s between each counter
5. Duration: 2s

### Animation Behaviors

| Stat | Target | Prefix | Suffix | Duration |
|------|--------|--------|--------|----------|
| Corporate Accounts | 300 | — | + | 2s |
| Annual Sales | 16 | SAR  | M+ | 2s |
| Hotel Partners | 50 | — | + | 2s |
| Team Members | 5 | — | — | 2s |

---

## 7. Scene 06: The Forge — Expertise Section

**Type:** 2D Section
**File:** `src/components/sections/ExpertiseSection.tsx`
**Section ID:** `#expertise`

### Visual Composition

```
┌─────────────────────────────────────┐
│ ━━ EXPERTISE                       │
│                                     │
│ Core Competencies                   │
│                                     │
│ ┌──────────┐ ┌──────────┐ ┌──────────┐  │
│ │   01     │ │   02     │ │   03     │  │  ← 3×2 grid
│ │ AI       │ │ Travel   │ │ Full-    │  │     Glass cards
│ │ Systems  │ │ Tech &   │ │ Stack    │  │     Tilt reveal
│ │ Arch     │ │ OTA      │ │ App Dev  │  │
│ └──────────┘ └──────────┘ └──────────┘  │
│ ┌──────────┐ ┌──────────┐ ┌──────────┐  │
│ │   04     │ │   05     │ │   06     │  │
│ │ Business │ │ Intel-   │ │ Enter-   │  │
│ │ Growth   │ │ ligent   │ │ prise    │  │
│ │          │ │ Auto     │ │ Integr.  │  │
│ └──────────┘ └──────────┘ └──────────┘  │
└─────────────────────────────────────┘
```

### Technical Implementation

**Grid:** `grid md:grid-cols-2 lg:grid-cols-3 gap-6`

**Tilt Card Animation (GSAP):**
1. Initial: `opacity: 0, y: 50, rotateX: 8, transformPerspective: 800`
2. Final: `opacity: 1, y: 0, rotateX: 0`
3. Stagger: 0.1s between cards
4. Duration: 0.8s each

**Card Structure:**
```html
<div data-tilt-card class="group p-8 rounded-2xl bg-[var(--bg-glass)] border border-[var(--border-glass)] backdrop-blur-sm hover:border-[var(--border-hover)] transition-all duration-500">
  <span class="text-3xl font-bold text-[var(--accent)]">01</span>
  <h3 class="text-lg font-semibold">Title</h3>
  <p class="text-sm text-[var(--text-secondary)]">Description</p>
</div>
```

### Content

| # | Title | Description |
|---|-------|-------------|
| 01 | AI Systems Architecture | Autonomous multi-agent orchestration engines |
| 02 | Travel Technology & OTA Platforms | Dynamic pricing, inventory, reservation systems |
| 03 | Full-Stack Application Development | React, Next.js, Node.js, Python |
| 04 | Business Growth & Sales Strategy | 50→300+ accounts, SAR 16M+ sales |
| 05 | Intelligent Automation | Reservations, invoicing, visa processing |
| 06 | Enterprise System Integration | CRM, ERP, booking engines, payment gateways |

---

## 8. Scene 07: The Showcase — Projects Section

**Type:** 2D Section
**File:** `src/components/sections/ProjectsSection.tsx`
**Section ID:** `#projects`

### Visual Composition

```
┌─────────────────────────────────────┐
│ ━━ PROJECTS                        │
│                                     │
│ Selected Work                       │
│                                     │
│ ┌─────────────────────────────────┐ │
│ │ Etlaala OTA Platform            │ │  ← Full-width cards
│ │ Full-Stack Travel Ecosystem     │ │     Stacked vertically
│ │                                 │ │
│ │ [React] [Node.js] [AI/ML]...   │ │  ← Tech tags
│ │                          SAR 16M+│ │  ← Metric badge
│ └─────────────────────────────────┘ │
│ ┌─────────────────────────────────┐ │
│ │ Multi-Agent AI Orchestration    │ │
│ │ ...                             │ │
│ └─────────────────────────────────┘ │
│ ┌─────────────────────────────────┐ │
│ │ Dynamic Pricing Engine          │ │
│ │ ...                             │ │
│ └─────────────────────────────────┘ │
│ (6 project cards total)             │
└─────────────────────────────────────┘
```

### Technical Implementation

**Animation:** Framer Motion `whileInView` with stagger.

**Card Layout:** `flex flex-col md:flex-row md:items-start md:justify-between`
- Left: Title, subtitle, description, tech tags
- Right: Metric badge (aligned right on desktop)

**Hover Effect:** `hover:border-[var(--border-hover)]` — gold border on hover.

**External Links:** Projects 1 (Etlaala) links to `https://etlaala.com`. Others link to `#` (placeholder).

### Content

| Project | Metric | External |
|---------|--------|----------|
| Etlaala OTA Platform | SAR 16M+ Revenue | Yes |
| Multi-Agent AI Orchestration | 90% Automation | No |
| Dynamic Pricing Engine | 23% Revenue Increase | No |
| AI Customer Support System | 80% Self-Service | No |
| CRM & Sales Pipeline | 300+ Accounts | No |
| Real-Time Analytics Dashboard | 50K+ Daily Events | No |

---

## 9. Scene 08: The Arsenal — Tech Stack Section

**Type:** 2D Section
**File:** `src/components/sections/TechStackSection.tsx`
**Section ID:** `#techstack`

### Visual Composition

```
┌─────────────────────────────────────┐
│ ━━ TECH STACK                      │
│                                     │
│ Tools & Technologies                │
│                                     │
│ ┌───────────────┐ ┌───────────────┐ │
│ │ Languages &   │ │ AI / ML       │ │  ← 2×2 grid
│ │ Frameworks    │ │               │ │
│ │               │ │ [LangChain]   │ │
│ │ [Python]      │ │ [GPT-4]       │ │  ← Tag pills
│ │ [TypeScript]  │ │ [RAG]         │ │
│ │ [React]       │ │ [Pinecone]    │ │
│ │ ...           │ │ ...           │ │
│ └───────────────┘ └───────────────┘ │
│ ┌───────────────┐ ┌───────────────┐ │
│ │ Databases &   │ │ Tools &       │ │
│ │ Cloud         │ │ Integrations  │ │
│ │ [PostgreSQL]  │ │ [WhatsApp]    │ │
│ │ [Redis]       │ │ [Stripe]      │ │
│ │ ...           │ │ ...           │ │
│ └───────────────┘ └───────────────┘ │
└─────────────────────────────────────┘
```

### Content

| Category | Items |
|----------|-------|
| Languages & Frameworks | Python, TypeScript, JavaScript, React, Next.js, Node.js, FastAPI, Flask, Express.js, Tailwind CSS, HTML5/CSS3, React Native, Kotlin |
| AI / ML | LangChain, OpenAI API, GPT-4, Claude, Gemini, RAG, Vector Databases, Pinecone, FAISS, Hugging Face, LangGraph, AutoGen |
| Databases & Cloud | PostgreSQL, MySQL, MongoDB, Redis, Firebase, Supabase, Google Cloud, AWS, Docker, Git |
| Tools & Integrations | WhatsApp Business API, Stripe, PayPal, Google Maps, Amadeus, Midtrans, Xero, QuickBooks, Jira, Figma |

### Tag Pill Behavior

```html
<span class="px-3 py-1.5 text-xs rounded-lg border border-[var(--border-glass)]
             text-[var(--text-secondary)]
             hover:border-[var(--border-hover)]
             hover:text-[var(--accent)]
             transition-all duration-300 cursor-default">
  Python
</span>
```

- Default: Dim text, dim border
- Hover: Gold text, gold border
- Transition: 300ms

---

## 10. Scene 09: The Echo — Testimonials Section

**Type:** 2D Section
**File:** `src/components/sections/TestimonialsSection.tsx`
**Section ID:** `#testimonials`

### Visual Composition

```
┌─────────────────────────────────────┐
│ ━━ TESTIMONIALS                    │
│                                     │
│ What They Say                       │
│                                     │
│ ┌──────────┐ ┌──────────┐ ┌──────────┐  │
│ │   "      │ │   "      │ │   "      │  │  ← 3-column grid
│ │ Quote... │ │ Quote... │ │ Quote... │  │     Glass cards
│ │          │ │          │ │          │  │
│ │ Author   │ │ Author   │ │ Author   │  │
│ │ Role     │ │ Role     │ │ Role     │  │
│ └──────────┘ └──────────┘ └──────────┘  │
└─────────────────────────────────────┘
```

### Content

| Author | Role | Quote |
|--------|------|-------|
| Etlaala Operations Team | Travel Operations | "Ahmed transformed our travel operations with AI..." |
| Etlaala Management | Revenue Strategy | "The dynamic pricing engine increased our revenue by 23%..." |
| Etlaala B2B Division | B2B Operations | "Ahmed's approach to building systems is different..." |

### Card Design

- Opening quote mark: `text-4xl text-[var(--accent)] opacity-30 font-serif`
- Quote text: `italic, text-[var(--text-secondary)]`
- Author: `font-semibold, text-[var(--text-primary)]`
- Role: `text-xs, text-[var(--text-muted)]`

---

## 11. Scene 10: The Signal — Contact Section

**Type:** 2D Section
**File:** `src/components/sections/ContactSection.tsx`
**Section ID:** `#contact`

### Visual Composition

```
┌─────────────────────────────────────┐
│         ━━ CONTACT ━━              │  ← Centered label
│                                     │
│      Let's Build Together           │  ← Centered heading
│                                     │
│  Ready to build intelligent systems │  ← Centered paragraph
│  for your travel business?          │
│                                     │
│  ┌─────────┐ ┌─────────┐ ┌─────────┐  │
│  │ Email   │ │LinkedIn │ │ GitHub  │  │  ← 3 CTAs
│  └─────────┘ └─────────┘ └─────────┘  │
│                                     │
│ ┌──────────┐ ┌──────────┐ ┌──────────┐  │
│ │ Location │ │Company   │ │Avail-   │  │  ← 3 info cards
│ │Giza,Egypt│ │Etlaala   │ │ability  │  │
│ └──────────┘ └──────────┘ └──────────┘  │
└─────────────────────────────────────┘
```

### Technical Implementation

**CTAs:**
- Email: `mailto:info@etlaala.com` (primary, gold)
- LinkedIn: External link (secondary)
- GitHub: External link (secondary)

**Info Cards:** 3-column grid on desktop, stacked on mobile.

### Content

| Card | Label | Value |
|------|-------|-------|
| Location | Location | Giza, Egypt |
| Company | Company | Etlaala Travel & Tourism |
| Availability | Availability | Open to Opportunities |

---

## 12. Scene 11: The Navigator — AI Chat

**Type:** Overlay
**File:** `src/components/nav/AIChatAssistant.tsx`
**Z-index:** 9000
**Visible:** Always (FAB), expandable (chat window)

### Visual Composition — FAB

```
                    ┌───┐
                    │ 🤖│  ← Gold circle, 56px
                    └───┘
                    ◌     ← Ping animation (pulse ring)
```

### Visual Composition — Chat Window

```
┌─────────────────────────────┐
│ 🟢 Navigator               │  ← Header
│    ONLINE — Ready to assist │     (avatar, title, status)
│                      ✕      │     Close button
├─────────────────────────────┤
│ [Projects] [About] [Skills] │  ← Quick command chips
│ [Contact]                   │     Horizontal scroll
├─────────────────────────────┤
│                             │
│ ┌─────────────────────────┐ │
│ │ Welcome. I'm Ahmed Ali's│ │  ← Assistant message
│ │ AI navigation assistant.│ │     (glass card, left-aligned)
│ └─────────────────────────┘ │
│                             │
│      ┌───────────────────┐  │
│       show me your work  │  │  ← User message
│      └───────────────────┘  │     (gold, right-aligned)
│                             │
│ ┌─────────────────────────┐ │
│ │ Navigating to Projects..│ │  ← Response with nav badge
│ │ → Scrolling to Projects │ │
│ └─────────────────────────┘ │
│                             │
│         ● ● ●               │  ← Typing indicator
│                             │
├─────────────────────────────┤
│ [Ask anything or say    ] [→] │  ← Input bar
│ [where to go...        ]      │
└─────────────────────────────┘
```

### Technical Implementation

**Window Size:** `w-[400px] max-w-[calc(100vw-2rem)]`
**Window Height:** Messages area is `h-[380px]` (fixed)
**Glass Effect:** `bg: rgba(8,8,14,0.88), backdrop-filter: blur(40px) saturate(1.3)`

**Position:** Fixed bottom-right, `bottom-24 right-6` (above FAB)

### Message Types

| Type | Style | Alignment |
|------|-------|-----------|
| User | Gold background, dark text | Right |
| Assistant | Glass background, light text | Left |
| Typing | 3 pulsing dots | Left |

### Quick Commands

| Label | Command |
|-------|---------|
| Projects | show me your work |
| About | about |
| Skills | tech stack |
| Contact | contact |

---

## 13. Scene 12: The Beacon — Magnetic Cursor

**Type:** Overlay
**File:** `src/components/nav/MagneticCursor.tsx`
**Z-index:** 9998 (ring), 9999 (dot)

### Visual Composition

```
        ○    ← Outer ring (36px, gold border, 35% opacity)
        •    ← Inner dot (6px, solid gold)
```

### Technical Implementation

**Dot:** 6px circle, `#d4af37`, follows mouse instantly
**Ring:** 36px circle, `1.5px solid rgba(212, 175, 55, 0.35)`, follows with 0.12 lerp factor

**Hover State:**
- Ring: scales to 1.8x, border turns 80% opacity gold
- Dot: scales to 0.5x

**Device Handling:**
- Touch devices: Hidden via CSS `@media (pointer: coarse)`
- Reduced motion: Hidden via CSS `@media (prefers-reduced-motion: reduce)`
- JS: Returns early without setting up event listeners

---

## 14. Scene Transitions

### Preloader → Site

The only scene transition in the portfolio:

```
Preloader (z: 10000)
    ↓ Split-screen exit (0.8s)
Site Content (z: 0) revealed
```

### Scroll-Based Reveals

Sections reveal as the user scrolls. There are no page transitions — it's a single-page application.

**Reveal Pattern:**
1. Element starts at `opacity: 0, y: 40`
2. ScrollTrigger fires when element enters viewport at 85%
3. GSAP animates to `opacity: 1, y: 0`
4. Never reverses (plays once)

---

## 15. Scene Rendering Order

```
1. HTML shell loads (layout.tsx)
2. CSS loads (globals.css — Tailwind + custom properties)
3. Preloader renders (z: 10000)
4. 3D scene loads in background (dynamic import)
5. Preloader animates (2.2s counter + 0.8s exit)
6. Site revealed
7. User scrolls → sections reveal
8. Chat FAB always visible (z: 9000)
9. Cursor always visible (z: 9999)
```

---

*End of Volume 4 — Scene Bible*
*Total: ~900 lines, ~20 pages*
