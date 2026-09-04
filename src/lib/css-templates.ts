// Curated custom-CSS templates for the editor (PRO apply / FREE live-preview).
// Each targets the stable `data-mvx-*` hooks exposed by PublicProfile, so they
// render identically on the real page and in the live iframe preview.

export interface CssTemplate {
  id: string;
  name: string;
  description: string;
  /** Accent used for the gallery swatch. */
  accent: string;
  css: string;
}

export const CSS_TEMPLATES: CssTemplate[] = [
  {
    id: "neon-glow",
    name: "Neon Glow",
    description: "Glowing accents, deep contrast, punchy edges.",
    accent: "#39ff88",
    css: `
      [data-mvx-link] {
        border: 1px solid rgba(57,255,136,0.35) !important;
        box-shadow: 0 0 18px rgba(57,255,136,0.18), inset 0 0 12px rgba(57,255,136,0.06) !important;
        text-shadow: 0 0 8px rgba(57,255,136,0.6);
      }
      [data-mvx-link]:hover {
        box-shadow: 0 0 30px rgba(57,255,136,0.35), inset 0 0 16px rgba(57,255,136,0.1) !important;
        transform: translateY(-1px);
      }
      [data-mvx-name] { text-shadow: 0 0 22px currentColor; }
      [data-mvx-links] { gap: 12px; }
    `,
  },
  {
    id: "glassmorphism",
    name: "Glassmorphism",
    description: "Frosted translucency, soft blur, gentle depth.",
    accent: "#a5c8ff",
    css: `
      [data-mvx-header],
      [data-mvx-link] {
        backdrop-filter: blur(14px) saturate(140%);
        -webkit-backdrop-filter: blur(14px) saturate(140%);
      }
      [data-mvx-link] {
        background: rgba(255,255,255,0.08) !important;
        border: 1px solid rgba(255,255,255,0.18) !important;
        box-shadow: 0 8px 32px rgba(0,0,0,0.25) !important;
      }
      [data-mvx-link]:hover { background: rgba(255,255,255,0.14) !important; }
    `,
  },
  {
    id: "neo-brutalism",
    name: "Neo-Brutalism",
    description: "Hard shadows, thick borders, sharp corners.",
    accent: "#ffd657",
    css: `
      [data-mvx-link] {
        border-radius: 0 !important;
        border: 2px solid currentColor !important;
        box-shadow: 4px 4px 0 rgba(0,0,0,0.4) !important;
        background: transparent !important;
        font-weight: 700;
        letter-spacing: 0.02em;
      }
      [data-mvx-link]:hover {
        transform: translate(-2px,-2px);
        box-shadow: 6px 6px 0 rgba(0,0,0,0.4) !important;
      }
      [data-mvx-avatar] { border-radius: 0 !important; box-shadow: 4px 4px 0 rgba(0,0,0,0.3); }
    `,
  },
  {
    id: "minimal-high-contrast",
    name: "Minimal High-Contrast",
    description: "Bold type, hairline rules, monochrome calm.",
    accent: "#ffffff",
    css: `
      [data-mvx-links] { gap: 0; }
      [data-mvx-link] {
        border-radius: 0 !important;
        background: transparent !important;
        border: none !important;
        border-bottom: 1px solid rgba(255,255,255,0.18) !important;
        justify-content: space-between;
        font-weight: 500;
        letter-spacing: 0.01em;
      }
      [data-mvx-link]:hover { background: rgba(255,255,255,0.05) !important; }
      [data-mvx-name] { font-size: 1.9rem; letter-spacing: -0.02em; }
    `,
  },
  {
    id: "gradient-mesh",
    name: "Gradient Mesh",
    description: "Animated aurora gradient behind everything.",
    accent: "#7b61ff",
    css: `
      [data-mvx-profile] {
        background:
          radial-gradient(1200px 800px at 10% 10%, rgba(123,97,255,0.25), transparent 60%),
          radial-gradient(1000px 700px at 90% 20%, rgba(57,255,136,0.18), transparent 60%),
          radial-gradient(1100px 800px at 50% 100%, rgba(255,107,107,0.2), transparent 60%),
          #0b0b0f !important;
      }
    `,
  },
  {
    id: "terminal",
    name: "Terminal",
    description: "Monospace phosphor, blocky scanline vibe.",
    accent: "#00ff9c",
    css: `
      [data-mvx-profile] {
        font-family: "DM Mono", monospace !important;
        background: #050805 !important;
      }
      [data-mvx-name],
      [data-mvx-handle],
      [data-mvx-bio] { font-family: "DM Mono", monospace !important; }
      [data-mvx-link] {
        background: transparent !important;
        border: 1px solid #00ff9c !important;
        text-transform: uppercase;
        letter-spacing: 0.12em;
        font-size: 0.72rem;
      }
      [data-mvx-link]:hover { background: rgba(0,255,156,0.08) !important; }
      [data-mvx-handle]::before { content: "$ "; }
    `,
  },
  {
    id: "editorial",
    name: "Editorial",
    description: "Serif display, rules and rails, magazine feel.",
    accent: "#e8d5a4",
    css: `
      [data-mvx-name] {
        font-family: Georgia, 'Times New Roman', serif !important;
        font-weight: 400;
        letter-spacing: -0.02em;
      }
      [data-mvx-header] { border-bottom: 1px solid rgba(255,255,255,0.15); padding-bottom: 1.5rem; }
      [data-mvx-link] {
        background: transparent !important;
        border: none !important;
        border-bottom: 1px solid rgba(255,255,255,0.25) !important;
        border-radius: 0 !important;
        justify-content: space-between;
        font-family: Georgia, serif;
      }
      [data-mvx-bio] { font-family: Georgia, serif !important; }
    `,
  },
  {
    id: "rounded-soft",
    name: "Rounded Soft",
    description: "Big radii, pastel cards, pill buttons.",
    accent: "#ffb3c1",
    css: `
      [data-mvx-link] {
        border-radius: 999px !important;
        background: rgba(255,179,193,0.12) !important;
        border: 1px solid rgba(255,179,193,0.35) !important;
        padding: 0.95rem 1.25rem;
      }
      [data-mvx-link]:hover { background: rgba(255,179,193,0.2) !important; }
      [data-mvx-avatar] { border-radius: 30% !important; }
      [data-mvx-name] { letter-spacing: 0.01em; }
    `,
  },
];

export function cssTemplateById(id: string): CssTemplate | undefined {
  return CSS_TEMPLATES.find((t) => t.id === id);
}
