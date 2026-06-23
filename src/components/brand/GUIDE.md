# GETMVX Brand System

## Overview

The brand system is a set of React components that implement the GETMVX visual identity. All assets come from the OpenDesign brand identity generation and are implemented as SVG-based React components.

## Directory Structure

```
src/components/brand/
├── index.ts          # Barrel exports
├── Logo.tsx          # Logo, LogoMark, HeroMark components
├── Icon.tsx          # 30 icons across 6 categories
└── Symbol.tsx        # 10 brand symbols
```

## Components

### Logo

The primary brand mark with 7 variants.

```tsx
import { Logo } from '@/components/brand';

<Logo size={120} variant="primary" />
```

| Variant | Description | Use Case |
|---|---|---|
| `primary` | Full color on dark bg | Hero sections, about pages |
| `monochrome-light` | Dark mark on light bg | Light mode, print |
| `monochrome-dark` | White mark on dark bg | Dark backgrounds |
| `simplified` | Gate only (no circle) | Small sizes, compact layouts |
| `monogram` | Letter "M" on surface | Avatars, small badges |
| `portal` | Concentric circles | Decorative, loading states |
| `abstract` | Diamond + center dot | Alternative mark |

**Props:**
- `size?: number` — Width/height in pixels (default: 120)
- `variant?: string` — One of the variants above (default: 'primary')
- `className?: string` — Additional CSS classes

---

### LogoMark

Small 32px mark for navigation bars.

```tsx
import { LogoMark } from '@/components/brand';

<LogoMark size={32} />
```

---

### HeroMark

Large 160px mark with ambient glow effect for hero sections.

```tsx
import { HeroMark } from '@/components/brand';

<HeroMark size={160} />
```

---

### Icon

30 SVG icons across 6 categories. Each icon has `stroke` and `filled` variants.

```tsx
import { Icon } from '@/components/brand';

<Icon name="code" size={24} variant="stroke" />
<Icon name="security" size={24} variant="filled" />
```

**Categories:**

| Category | Icons |
|---|---|
| **creation** | design, draw, build, prototype, publish |
| **development** | code, api, database, server, terminal |
| **discovery** | search, explore, navigate, research, archive |
| **productivity** | tasks, workflow, planning, documents, collaboration |
| **intelligence** | ai, neural, analysis, automation, knowledge |
| **system** | settings, security, permissions, network, cloud |

**Props:**
- `name: string` — Icon name (required)
- `size?: number` — Width/height in pixels (default: 24)
- `variant?: 'stroke' | 'filled'` — Icon style (default: 'stroke')
- `className?: string` — Additional CSS classes
- Plus all standard SVG props

**Helpers:**

```tsx
import { iconNames, iconCategories } from '@/components/brand';

// List all icon names
console.log(iconNames); // ['design', 'draw', 'build', ...]

// Icons grouped by category
console.log(iconCategories.creation); // ['design', 'draw', 'build', 'prototype', 'publish']
```

---

### BrandSymbol

10 decorative symbols for marketing, backgrounds, and feature sections.

```tsx
import { BrandSymbol } from '@/components/brand';

<BrandSymbol name="portal-ring" size={120} />
```

**Available symbols:**

| Name | Description |
|---|---|
| `portal-ring` | Concentric rings with crosshairs |
| `data-node` | Central node with 4 satellites |
| `constellation` | Connected star pattern |
| `coordinate-marker` | Compass with N/S/W/E labels |
| `orbital-path` | 3D orbital ellipses |
| `signal-wave` | Waveform with endpoints |
| `modular-grid` | Grid of rectangles |
| `energy-particle` | Radiating rings from center |
| `geometric-frame` | Nested squares with diagonals |
| `wayfinding` | Arrow/compass pointer |

**Props:**
- `name: string` — Symbol name (required)
- `size?: number` — Width/height in pixels (default: 120)
- `className?: string` — Additional CSS classes
- Plus all standard SVG props

---

## CSS Variables

The brand system uses these CSS variables (defined in `globals.css`):

```css
/* Backgrounds */
--bg: #0c0c0e;        /* Primary background */
--bg2: #131316;       /* Surface */
--bg3: #1a1a1f;       /* Elevated surface */
--bg4: #222228;       /* High surface */
--bg5: #2a2a32;       /* Highest surface */

/* Borders */
--border: rgba(255, 255, 255, 0.07);
--border2: rgba(255, 255, 255, 0.12);
--border3: rgba(255, 255, 255, 0.18);

/* Text */
--text: #f0eff4;       /* Primary text */
--text-secondary: #b8b7c0;
--muted: #8a8998;
--muted-dim: #5a5968;

/* Accent (Champagne Gold) */
--accent: #c9a96e;
--accent2: #e8c98a;
--accent-dim: rgba(201, 169, 110, 0.12);
--accent-glow: rgba(201, 169, 110, 0.06);

/* Semantic */
--success: #4ecb8d;
--warn: #e8a94e;
--danger: #e85555;

/* Radius */
--radius-sm: 8px;
--radius: 12px;
--radius-lg: 20px;
--radius-xl: 28px;
```

**Tailwind usage:**

```tsx
<div className="bg-bg2 text-text border-border">
  <span className="text-accent">Accent text</span>
</div>
```

---

## Typography

Three font families:

| Family | Variable | Use |
|---|---|---|
| **Barlow** | `--font-display` | Headlines, display text |
| **Inter** | `--font-body` | Body copy, UI text |
| **DM Mono** | `--font-mono` | Code, labels, metadata |

**Tailwind usage:**

```tsx
<h1 className="font-[family-name:var(--font-display)]">Heading</h1>
<p className="font-[family-name:var(--font-body)]">Body</p>
<code className="font-[family-name:var(--font-mono)]">Code</code>
```

---

## Quick Reference

```tsx
import { Logo, LogoMark, HeroMark, Icon, BrandSymbol } from '@/components/brand';

// Navigation
<nav>
  <LogoMark size={32} />
  <span>GETMVX</span>
</nav>

// Hero section
<section>
  <HeroMark size={160} />
  <h1>The Gateway to Building</h1>
</section>

// Feature grid
<div>
  <Icon name="code" size={32} variant="stroke" />
  <Icon name="security" size={32} variant="filled" />
</div>

// Decorative background
<BrandSymbol name="portal-ring" size={400} className="opacity-10" />
```

---

## Source

Generated with [OpenDesign](https://open-design.ai/) using the GETMVX brand prompt. See `tasks/brand-prompt.md` for the full generation prompt.
