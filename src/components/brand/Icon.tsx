import { type ReactNode, type SVGProps } from 'react';

interface IconProps extends SVGProps<SVGSVGElement> {
  name: string;
  size?: number;
  variant?: 'stroke' | 'filled';
}

// Shared defaults so every icon keeps a consistent stroke language.
const STROKE = {
  stroke: 'currentColor',
  strokeWidth: 2,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
  fill: 'none',
};

type IconNode = (variant: 'stroke' | 'filled') => ReactNode;

// Brand icon set, rendered as React elements (no dangerouslySetInnerHTML).
const ICONS: Record<string, { label?: string; node: IconNode }> = {
  // Creation
  design: {
    node: (v) => (
      <g>
        {v === 'filled' && <rect x="3" y="3" width="18" height="18" rx="2" fill="currentColor" opacity="0.15" />}
        <rect x="3" y="3" width="18" height="18" rx="2" {...STROKE} />
        <circle cx="12" cy="12" r="3" {...(v === 'filled' ? { fill: 'currentColor' } : {})} />
        <path d="M12 3v3M12 18v3M3 12h3M18 12h3" {...STROKE} />
      </g>
    ),
  },
  draw: {
    node: (v) => (
      <g>
        <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" {...(v === 'filled' ? { fill: 'currentColor', opacity: 0.15 } : {})} {...STROKE} />
        <path d="M15 5l4 4" {...STROKE} />
      </g>
    ),
  },
  build: {
    node: (v) => (
      <g>
        {v === 'filled' && <rect x="2" y="7" width="20" height="14" rx="2" fill="currentColor" opacity="0.15" />}
        <rect x="2" y="7" width="20" height="14" rx="2" {...STROKE} />
        <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" {...STROKE} />
        <path d="M12 12v2" {...STROKE} />
      </g>
    ),
  },
  prototype: {
    node: (v) => (
      <g>
        <path d="M12 2L2 7l10 5 10-5-10-5Z" {...(v === 'filled' ? { fill: 'currentColor', opacity: 0.15 } : {})} {...STROKE} />
        <path d="M2 17l10 5 10-5" {...STROKE} />
        <path d="M2 12l10 5 10-5" {...STROKE} />
      </g>
    ),
  },
  publish: {
    node: (v) => (
      <g>
        <path d="M12 3v12" {...STROKE} />
        <path d="M8 11l4 4 4-4" {...STROKE} />
        {v === 'filled' && <path d="M20 17v2a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-2" fill="currentColor" opacity="0.15" />}
        <path d="M20 17v2a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-2" {...STROKE} />
      </g>
    ),
  },
  // Development
  code: {
    node: () => (
      <g>
        <path d="M8 6l-6 6 6 6" {...STROKE} />
        <path d="M16 6l6 6-6 6" {...STROKE} />
      </g>
    ),
  },
  api: {
    node: (v) => (
      <g>
        {v === 'filled' && <rect x="4" y="6" width="16" height="12" rx="2" fill="currentColor" opacity="0.15" />}
        <rect x="4" y="4" width="16" height="16" rx="2" {...STROKE} />
        <path d="M9 9h6M9 12h6M9 15h4" {...STROKE} />
      </g>
    ),
  },
  database: {
    node: (v) => (
      <g>
        {v === 'filled' && <ellipse cx="12" cy="5" rx="8" ry="3" fill="currentColor" opacity="0.15" />}
        <ellipse cx="12" cy="5" rx="8" ry="3" {...STROKE} />
        <path d="M4 5v14c0 1.66 3.58 3 8 3s8-1.34 8-3V5" {...STROKE} />
      </g>
    ),
  },
  server: {
    node: (v) => (
      <g>
        {v === 'filled' && <path d="M4 2h16v6H4zM4 10h16v6H4z" fill="currentColor" opacity="0.15" />}
        <rect x="4" y="2" width="16" height="6" rx="2" {...STROKE} />
        <rect x="4" y="10" width="16" height="6" rx="2" {...STROKE} />
        <circle cx="8" cy="5" r="1" fill="currentColor" />
        <circle cx="8" cy="13" r="1" fill="currentColor" />
        <path d="M12 19v2M8 21h8" {...STROKE} />
      </g>
    ),
  },
  terminal: {
    node: (v) => (
      <g>
        {v === 'filled' && <rect x="2" y="3" width="20" height="18" rx="2" fill="currentColor" opacity="0.15" />}
        <rect x="2" y="3" width="20" height="18" rx="2" {...STROKE} />
        <path d="M6 9l4 3-4 3" {...STROKE} />
        <path d="M12 15h6" {...STROKE} />
      </g>
    ),
  },
  // Discovery
  search: {
    node: (v) => (
      <g>
        {v === 'filled' && <circle cx="11" cy="11" r="7" fill="currentColor" opacity="0.15" />}
        <circle cx="11" cy="11" r="7" {...STROKE} />
        <path d="M21 21l-4.35-4.35" {...STROKE} />
      </g>
    ),
  },
  explore: {
    node: (v) => (
      <g>
        {v === 'filled' && <circle cx="12" cy="12" r="9" fill="currentColor" opacity="0.15" />}
        <circle cx="12" cy="12" r="9" {...STROKE} />
        <polygon points="14.5 9.5 9.5 14.5 7 17 9.5 14.5 14.5 9.5 17 7" {...(v === 'filled' ? { fill: 'currentColor', opacity: 0.3 } : { fill: 'none', stroke: 'currentColor', strokeWidth: 2, strokeLinejoin: 'round' })} />
      </g>
    ),
  },
  navigate: {
    node: (v) => (
      <polygon points="12 2 19 22 12 18 5 22 12 2" {...(v === 'filled' ? { fill: 'currentColor', opacity: 0.15 } : { fill: 'none', stroke: 'currentColor', strokeWidth: 2, strokeLinejoin: 'round' })} />
    ),
  },
  research: {
    node: (v) => (
      <g>
        <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20" {...(v === 'filled' ? { fill: 'currentColor', opacity: 0.15 } : {})} {...STROKE} />
        <path d="M8 7h8M8 11h5" {...STROKE} />
      </g>
    ),
  },
  archive: {
    node: (v) => (
      <g>
        {v === 'filled' && <path d="M2 3h20v5H2z" fill="currentColor" opacity="0.15" />}
        <rect x="2" y="3" width="20" height="5" rx="1" {...STROKE} />
        <path d="M4 8v11a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8" {...STROKE} />
      </g>
    ),
  },
  // Productivity
  tasks: {
    node: (v) => (
      <g>
        {v === 'filled' && <rect x="3" y="3" width="18" height="18" rx="2" fill="currentColor" opacity="0.15" />}
        <rect x="3" y="3" width="18" height="18" rx="2" {...STROKE} />
        <path d="M9 12l2 2 4-4" {...STROKE} />
      </g>
    ),
  },
  workflow: {
    node: (v) => (
      <g>
        <circle cx="5" cy="12" r="3" {...(v === 'filled' ? { fill: 'currentColor', opacity: 0.15 } : {})} {...STROKE} />
        <circle cx="19" cy="6" r="3" {...(v === 'filled' ? { fill: 'currentColor', opacity: 0.15 } : {})} {...STROKE} />
        <circle cx="19" cy="18" r="3" {...(v === 'filled' ? { fill: 'currentColor', opacity: 0.15 } : {})} {...STROKE} />
        <path d="M8 10l8-2M8 14l8 2" {...STROKE} />
      </g>
    ),
  },
  planning: {
    node: (v) => (
      <g>
        {v === 'filled' && <rect x="3" y="4" width="18" height="18" rx="2" fill="currentColor" opacity="0.15" />}
        <rect x="3" y="4" width="18" height="18" rx="2" {...STROKE} />
        <path d="M16 2v4M8 2v4M3 10h18" {...STROKE} />
        <path d="M8 14h.01M12 14h.01M16 14h.01M8 18h.01M12 18h.01" {...STROKE} />
      </g>
    ),
  },
  documents: {
    node: (v) => (
      <g>
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6Z" {...(v === 'filled' ? { fill: 'currentColor', opacity: 0.15 } : {})} {...STROKE} />
        <path d="M14 2v6h6" {...STROKE} />
      </g>
    ),
  },
  collaboration: {
    node: (v) => (
      <g>
        <circle cx="9" cy="7" r="4" {...(v === 'filled' ? { fill: 'currentColor', opacity: 0.15 } : {})} {...STROKE} />
        <path d="M2 21v-2a4 4 0 0 1 4-4h6a4 4 0 0 1 4 4v2" {...STROKE} />
        <circle cx="19" cy="7" r="3" {...(v === 'filled' ? { fill: 'currentColor', opacity: 0.1 } : {})} {...STROKE} />
        <path d="M22 21v-1.5a3 3 0 0 0-2-2.83" {...STROKE} />
      </g>
    ),
  },
  // Intelligence
  ai: {
    node: (v) => (
      <g>
        {v === 'filled' && <circle cx="12" cy="12" r="9" fill="currentColor" opacity="0.15" />}
        <circle cx="12" cy="12" r="9" {...STROKE} />
        <path d="M12 7v5l3 3" {...STROKE} />
        <circle cx="12" cy="12" r="2" {...(v === 'filled' ? { fill: 'currentColor' } : {})} {...STROKE} />
      </g>
    ),
  },
  neural: {
    node: (v) => (
      <g>
        <circle cx="6" cy="6" r="3" {...(v === 'filled' ? { fill: 'currentColor', opacity: 0.15 } : {})} {...STROKE} />
        <circle cx="18" cy="6" r="3" {...(v === 'filled' ? { fill: 'currentColor', opacity: 0.15 } : {})} {...STROKE} />
        <circle cx="6" cy="18" r="3" {...(v === 'filled' ? { fill: 'currentColor', opacity: 0.15 } : {})} {...STROKE} />
        <circle cx="18" cy="18" r="3" {...(v === 'filled' ? { fill: 'currentColor', opacity: 0.15 } : {})} {...STROKE} />
        <circle cx="12" cy="12" r="3" {...(v === 'filled' ? { fill: 'currentColor' } : {})} {...STROKE} />
        <path d="M8.5 7.5l2 2M13.5 10.5l2-2M8.5 16.5l2-2M13.5 13.5l2 2" {...STROKE} />
      </g>
    ),
  },
  analysis: {
    node: (v) => (
      <g>
        <path d="M3 20h18" {...STROKE} />
        <path d="M5 16l4-8 4 4 4-10 4 6" stroke="currentColor" strokeWidth={v === 'filled' ? 2.5 : 2} strokeLinecap="round" strokeLinejoin="round" fill="none" />
      </g>
    ),
  },
  automation: {
    node: (v) => (
      <g>
        {v === 'filled' && <circle cx="12" cy="12" r="4" fill="currentColor" opacity="0.15" />}
        <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" {...STROKE} />
        <circle cx="12" cy="12" r="4" {...STROKE} />
      </g>
    ),
  },
  knowledge: {
    node: (v) => (
      <g>
        <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2V3Z" {...(v === 'filled' ? { fill: 'currentColor', opacity: 0.15 } : {})} {...STROKE} />
        <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7V3Z" {...(v === 'filled' ? { fill: 'currentColor', opacity: 0.15 } : {})} {...STROKE} />
      </g>
    ),
  },
  // System
  settings: {
    node: (v) => (
      <g>
        <circle cx="12" cy="12" r="3" {...(v === 'filled' ? { fill: 'currentColor' } : {})} {...STROKE} />
        <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" {...STROKE} />
      </g>
    ),
  },
  security: {
    node: (v) => (
      <g>
        <path d="M12 2l8 4v6c0 5.55-3.84 10.74-8 12-4.16-1.26-8-6.45-8-12V6l8-4Z" {...(v === 'filled' ? { fill: 'currentColor', opacity: 0.15 } : {})} {...STROKE} />
        <path d="M9 12l2 2 4-4" {...STROKE} />
      </g>
    ),
  },
  permissions: {
    node: (v) => (
      <g>
        {v === 'filled' && <rect x="3" y="11" width="18" height="11" rx="2" fill="currentColor" opacity="0.15" />}
        <rect x="3" y="11" width="18" height="11" rx="2" {...STROKE} />
        <path d="M7 11V7a5 5 0 0 1 10 0v4" {...STROKE} />
        <circle cx="12" cy="16" r="2" {...(v === 'filled' ? { fill: 'currentColor' } : {})} {...STROKE} />
      </g>
    ),
  },
  network: {
    node: (v) => (
      <g>
        <circle cx="12" cy="5" r="3" {...(v === 'filled' ? { fill: 'currentColor', opacity: 0.15 } : {})} {...STROKE} />
        <circle cx="5" cy="19" r="3" {...(v === 'filled' ? { fill: 'currentColor', opacity: 0.15 } : {})} {...STROKE} />
        <circle cx="19" cy="19" r="3" {...(v === 'filled' ? { fill: 'currentColor', opacity: 0.15 } : {})} {...STROKE} />
        <path d="M12 8v3M8.5 16l2-5M15.5 16l-2-5" {...STROKE} />
      </g>
    ),
  },
  cloud: {
    node: (v) => (
      <path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10Z" {...(v === 'filled' ? { fill: 'currentColor', opacity: 0.15 } : {})} {...STROKE} />
    ),
  },
} as const;

export function Icon({ name, size = 24, variant = 'stroke', className = '', ...props }: IconProps) {
  const icon = ICONS[name];
  if (!icon) return null;

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      aria-hidden="true"
      {...props}
    >
      {icon.node(variant)}
    </svg>
  );
}

export const iconNames = Object.keys(ICONS);

export const iconCategories = {
  creation: ['design', 'draw', 'build', 'prototype', 'publish'],
  development: ['code', 'api', 'database', 'server', 'terminal'],
  discovery: ['search', 'explore', 'navigate', 'research', 'archive'],
  productivity: ['tasks', 'workflow', 'planning', 'documents', 'collaboration'],
  intelligence: ['ai', 'neural', 'analysis', 'automation', 'knowledge'],
  system: ['settings', 'security', 'permissions', 'network', 'cloud'],
} as const;
