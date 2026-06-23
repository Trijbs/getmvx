import { type SVGProps } from 'react';

interface SymbolProps extends SVGProps<SVGSVGElement> {
  name: string;
  size?: number;
}

const SYMBOLS: Record<string, string> = {
  'portal-ring': `<circle cx="60" cy="60" r="48" stroke="currentColor" stroke-width="1.5" fill="none"/>
    <circle cx="60" cy="60" r="36" stroke="currentColor" stroke-width="1" fill="none" opacity="0.6"/>
    <circle cx="60" cy="60" r="24" stroke="currentColor" stroke-width="1" fill="none" opacity="0.3"/>
    <circle cx="60" cy="60" r="4" fill="currentColor"/>
    <line x1="60" y1="12" x2="60" y2="24" stroke="currentColor" stroke-width="1.5"/>
    <line x1="60" y1="96" x2="60" y2="108" stroke="currentColor" stroke-width="1.5"/>
    <line x1="12" y1="60" x2="24" y2="60" stroke="currentColor" stroke-width="1.5"/>
    <line x1="96" y1="60" x2="108" y2="60" stroke="currentColor" stroke-width="1.5"/>`,

  'data-node': `<circle cx="60" cy="60" r="20" stroke="currentColor" stroke-width="1.5" fill="none"/>
    <circle cx="60" cy="60" r="6" fill="currentColor"/>
    <circle cx="60" cy="24" r="4" stroke="currentColor" stroke-width="1.5" fill="none"/>
    <circle cx="60" cy="96" r="4" stroke="currentColor" stroke-width="1.5" fill="none"/>
    <circle cx="24" cy="60" r="4" stroke="currentColor" stroke-width="1.5" fill="none"/>
    <circle cx="96" cy="60" r="4" stroke="currentColor" stroke-width="1.5" fill="none"/>
    <line x1="60" y1="40" x2="60" y2="28" stroke="currentColor" stroke-width="1"/>
    <line x1="60" y1="80" x2="60" y2="92" stroke="currentColor" stroke-width="1"/>
    <line x1="40" y1="60" x2="28" y2="60" stroke="currentColor" stroke-width="1"/>
    <line x1="80" y1="60" x2="92" y2="60" stroke="currentColor" stroke-width="1"/>`,

  constellation: `<circle cx="24" cy="36" r="3" fill="currentColor"/>
    <circle cx="48" cy="24" r="3" fill="currentColor"/>
    <circle cx="72" cy="48" r="3" fill="currentColor"/>
    <circle cx="96" cy="36" r="3" fill="currentColor"/>
    <circle cx="36" cy="72" r="3" fill="currentColor"/>
    <circle cx="60" cy="60" r="4" fill="currentColor"/>
    <circle cx="84" cy="84" r="3" fill="currentColor"/>
    <circle cx="48" cy="96" r="3" fill="currentColor"/>
    <line x1="24" y1="36" x2="48" y2="24" stroke="currentColor" stroke-width="0.75" opacity="0.5"/>
    <line x1="48" y1="24" x2="72" y2="48" stroke="currentColor" stroke-width="0.75" opacity="0.5"/>
    <line x1="72" y1="48" x2="96" y2="36" stroke="currentColor" stroke-width="0.75" opacity="0.5"/>
    <line x1="36" y1="72" x2="60" y2="60" stroke="currentColor" stroke-width="0.75" opacity="0.5"/>
    <line x1="60" y1="60" x2="84" y2="84" stroke="currentColor" stroke-width="0.75" opacity="0.5"/>
    <line x1="48" y1="96" x2="60" y2="60" stroke="currentColor" stroke-width="0.75" opacity="0.5"/>
    <line x1="60" y1="60" x2="72" y2="48" stroke="currentColor" stroke-width="0.75" opacity="0.5"/>`,

  'coordinate-marker': `<line x1="60" y1="16" x2="60" y2="104" stroke="currentColor" stroke-width="0.75" opacity="0.3"/>
    <line x1="16" y1="60" x2="104" y2="60" stroke="currentColor" stroke-width="0.75" opacity="0.3"/>
    <circle cx="60" cy="60" r="32" stroke="currentColor" stroke-width="1" fill="none" opacity="0.4"/>
    <rect x="52" y="52" width="16" height="16" rx="2" stroke="currentColor" stroke-width="1.5" fill="none"/>
    <circle cx="60" cy="60" r="3" fill="currentColor"/>
    <text x="60" y="18" text-anchor="middle" fill="currentColor" font-family="monospace" font-size="8" opacity="0.6">N</text>
    <text x="60" y="110" text-anchor="middle" fill="currentColor" font-family="monospace" font-size="8" opacity="0.6">S</text>
    <text x="14" y="63" text-anchor="middle" fill="currentColor" font-family="monospace" font-size="8" opacity="0.6">W</text>
    <text x="106" y="63" text-anchor="middle" fill="currentColor" font-family="monospace" font-size="8" opacity="0.6">E</text>`,

  'orbital-path': `<ellipse cx="60" cy="60" rx="48" ry="24" stroke="currentColor" stroke-width="1" fill="none" opacity="0.4"/>
    <ellipse cx="60" cy="60" rx="48" ry="24" stroke="currentColor" stroke-width="1" fill="none" opacity="0.4" transform="rotate(60 60 60)"/>
    <ellipse cx="60" cy="60" rx="48" ry="24" stroke="currentColor" stroke-width="1" fill="none" opacity="0.4" transform="rotate(120 60 60)"/>
    <circle cx="60" cy="60" r="8" fill="currentColor"/>
    <circle cx="60" cy="36" r="4" fill="currentColor" opacity="0.7"/>
    <circle cx="84" cy="72" r="4" fill="currentColor" opacity="0.7"/>
    <circle cx="36" cy="72" r="4" fill="currentColor" opacity="0.7"/>`,

  'signal-wave': `<path d="M16 60 Q32 30 48 60 Q64 90 80 60 Q96 30 112 60" stroke="currentColor" stroke-width="1.5" fill="none"/>
    <path d="M16 60 Q32 40 48 60 Q64 80 80 60 Q96 40 112 60" stroke="currentColor" stroke-width="1" fill="none" opacity="0.5"/>
    <path d="M16 60 Q32 50 48 60 Q64 70 80 60 Q96 50 112 60" stroke="currentColor" stroke-width="0.75" fill="none" opacity="0.3"/>
    <circle cx="16" cy="60" r="3" fill="currentColor"/>
    <circle cx="112" cy="60" r="3" fill="currentColor"/>`,

  'modular-grid': `<rect x="16" y="16" width="28" height="28" rx="4" stroke="currentColor" stroke-width="1.5" fill="none"/>
    <rect x="52" y="16" width="28" height="28" rx="4" stroke="currentColor" stroke-width="1.5" fill="none"/>
    <rect x="88" y="16" width="16" height="28" rx="4" stroke="currentColor" stroke-width="1" fill="none" opacity="0.5"/>
    <rect x="16" y="52" width="28" height="28" rx="4" stroke="currentColor" stroke-width="1.5" fill="none"/>
    <rect x="52" y="52" width="52" height="28" rx="4" stroke="currentColor" stroke-width="1.5" fill="none"/>
    <rect x="16" y="88" width="28" height="16" rx="4" stroke="currentColor" stroke-width="1" fill="none" opacity="0.5"/>
    <rect x="52" y="88" width="28" height="16" rx="4" stroke="currentColor" stroke-width="1" fill="none" opacity="0.5"/>
    <rect x="88" y="88" width="16" height="16" rx="4" stroke="currentColor" stroke-width="1" fill="none" opacity="0.5"/>`,

  'energy-particle': `<circle cx="60" cy="60" r="3" fill="currentColor"/>
    <circle cx="60" cy="60" r="16" stroke="currentColor" stroke-width="0.75" fill="none" opacity="0.6"/>
    <circle cx="60" cy="60" r="28" stroke="currentColor" stroke-width="0.5" fill="none" opacity="0.4"/>
    <circle cx="60" cy="60" r="40" stroke="currentColor" stroke-width="0.5" fill="none" opacity="0.2"/>
    <line x1="60" y1="16" x2="60" y2="44" stroke="currentColor" stroke-width="0.75" opacity="0.4"/>
    <line x1="60" y1="76" x2="60" y2="104" stroke="currentColor" stroke-width="0.75" opacity="0.4"/>
    <line x1="16" y1="60" x2="44" y2="60" stroke="currentColor" stroke-width="0.75" opacity="0.4"/>
    <line x1="76" y1="60" x2="104" y2="60" stroke="currentColor" stroke-width="0.75" opacity="0.4"/>`,

  'geometric-frame': `<rect x="16" y="16" width="88" height="88" rx="4" stroke="currentColor" stroke-width="1.5" fill="none"/>
    <rect x="28" y="28" width="64" height="64" rx="4" stroke="currentColor" stroke-width="1" fill="none" opacity="0.5"/>
    <rect x="40" y="40" width="40" height="40" rx="4" stroke="currentColor" stroke-width="1" fill="none" opacity="0.3"/>
    <line x1="16" y1="16" x2="40" y2="40" stroke="currentColor" stroke-width="0.75" opacity="0.4"/>
    <line x1="104" y1="16" x2="80" y2="40" stroke="currentColor" stroke-width="0.75" opacity="0.4"/>
    <line x1="16" y1="104" x2="40" y2="80" stroke="currentColor" stroke-width="0.75" opacity="0.4"/>
    <line x1="104" y1="104" x2="80" y2="80" stroke="currentColor" stroke-width="0.75" opacity="0.4"/>`,

  wayfinding: `<polygon points="60,16 76,52 60,44 44,52" fill="currentColor"/>
    <line x1="60" y1="52" x2="60" y2="104" stroke="currentColor" stroke-width="1.5"/>
    <circle cx="60" cy="104" r="4" stroke="currentColor" stroke-width="1.5" fill="none"/>
    <line x1="36" y1="76" x2="84" y2="76" stroke="currentColor" stroke-width="0.75" opacity="0.4"/>
    <line x1="44" y1="88" x2="76" y2="88" stroke="currentColor" stroke-width="0.75" opacity="0.3"/>`,
};

export function BrandSymbol({ name, size = 120, className = '', ...props }: SymbolProps) {
  const svgContent = SYMBOLS[name];
  if (!svgContent) return null;

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 120 120"
      fill="none"
      className={className}
      dangerouslySetInnerHTML={{ __html: svgContent }}
      {...props}
    />
  );
}

export const symbolNames = Object.keys(SYMBOLS);
