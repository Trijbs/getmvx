import { type SVGProps } from 'react';

interface IconProps extends SVGProps<SVGSVGElement> {
  name: string;
  size?: number;
  variant?: 'stroke' | 'filled';
}

const ICONS: Record<string, { stroke: string; filled: string }> = {
  // Creation
  design: {
    stroke: '<rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" stroke-width="2" fill="none"/><circle cx="12" cy="12" r="3" stroke="currentColor" stroke-width="2" fill="none"/><path d="M12 3v3M12 18v3M3 12h3M18 12h3" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>',
    filled: '<rect x="3" y="3" width="18" height="18" rx="2" fill="currentColor" opacity="0.15"/><circle cx="12" cy="12" r="3" fill="currentColor"/><path d="M12 3v3M12 18v3M3 12h3M18 12h3" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>',
  },
  draw: {
    stroke: '<path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"/><path d="M15 5l4 4" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>',
    filled: '<path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" fill="currentColor" opacity="0.15"/><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"/>',
  },
  build: {
    stroke: '<rect x="2" y="7" width="20" height="14" rx="2" stroke="currentColor" stroke-width="2" fill="none"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" stroke="currentColor" stroke-width="2" fill="none"/><path d="M12 12v2" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>',
    filled: '<rect x="2" y="7" width="20" height="14" rx="2" fill="currentColor" opacity="0.15"/><rect x="2" y="7" width="20" height="14" rx="2" stroke="currentColor" stroke-width="2" fill="none"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" stroke="currentColor" stroke-width="2" fill="none"/>',
  },
  prototype: {
    stroke: '<path d="M12 2L2 7l10 5 10-5-10-5Z" stroke="currentColor" stroke-width="2" fill="none" stroke-linejoin="round"/><path d="M2 17l10 5 10-5" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"/><path d="M2 12l10 5 10-5" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"/>',
    filled: '<path d="M12 2L2 7l10 5 10-5-10-5Z" fill="currentColor" opacity="0.15"/><path d="M12 2L2 7l10 5 10-5-10-5Z" stroke="currentColor" stroke-width="2" fill="none" stroke-linejoin="round"/><path d="M2 17l10 5 10-5" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"/><path d="M2 12l10 5 10-5" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"/>',
  },
  publish: {
    stroke: '<path d="M12 3v12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><path d="M8 11l4 4 4-4" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"/><path d="M20 17v2a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-2" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round"/>',
    filled: '<path d="M12 3v12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><path d="M8 11l4 4 4-4" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"/><path d="M20 17v2a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-2" fill="currentColor" opacity="0.15"/><path d="M20 17v2a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-2" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round"/>',
  },
  // Development
  code: {
    stroke: '<path d="M8 6l-6 6 6 6" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"/><path d="M16 6l6 6-6 6" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"/>',
    filled: '<path d="M8 6l-6 6 6 6" stroke="currentColor" stroke-width="2.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/><path d="M16 6l6 6-6 6" stroke="currentColor" stroke-width="2.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/>',
  },
  api: {
    stroke: '<path d="M4 6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6Z" stroke="currentColor" stroke-width="2" fill="none"/><path d="M9 9h6M9 12h6M9 15h4" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>',
    filled: '<path d="M4 6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6Z" fill="currentColor" opacity="0.15"/><path d="M4 6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6Z" stroke="currentColor" stroke-width="2" fill="none"/><path d="M9 9h6M9 12h6M9 15h4" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>',
  },
  database: {
    stroke: '<ellipse cx="12" cy="5" rx="8" ry="3" stroke="currentColor" stroke-width="2" fill="none"/><path d="M4 5v14c0 1.66 3.58 3 8 3s8-1.34 8-3V5" stroke="currentColor" stroke-width="2" fill="none"/><path d="M4 12c0 1.66 3.58 3 8 3s8-1.34 8-3" stroke="currentColor" stroke-width="2" fill="none"/>',
    filled: '<ellipse cx="12" cy="5" rx="8" ry="3" fill="currentColor" opacity="0.15"/><ellipse cx="12" cy="5" rx="8" ry="3" stroke="currentColor" stroke-width="2" fill="none"/><path d="M4 5v14c0 1.66 3.58 3 8 3s8-1.34 8-3V5" stroke="currentColor" stroke-width="2" fill="none"/>',
  },
  server: {
    stroke: '<rect x="4" y="2" width="16" height="6" rx="2" stroke="currentColor" stroke-width="2" fill="none"/><rect x="4" y="10" width="16" height="6" rx="2" stroke="currentColor" stroke-width="2" fill="none"/><circle cx="8" cy="5" r="1" fill="currentColor"/><circle cx="8" cy="13" r="1" fill="currentColor"/><path d="M12 19v2M8 21h8" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>',
    filled: '<rect x="4" y="2" width="16" height="6" rx="2" fill="currentColor" opacity="0.15"/><rect x="4" y="10" width="16" height="6" rx="2" fill="currentColor" opacity="0.15"/><rect x="4" y="2" width="16" height="6" rx="2" stroke="currentColor" stroke-width="2" fill="none"/><rect x="4" y="10" width="16" height="6" rx="2" stroke="currentColor" stroke-width="2" fill="none"/><circle cx="8" cy="5" r="1" fill="currentColor"/><circle cx="8" cy="13" r="1" fill="currentColor"/>',
  },
  terminal: {
    stroke: '<rect x="2" y="3" width="20" height="18" rx="2" stroke="currentColor" stroke-width="2" fill="none"/><path d="M6 9l4 3-4 3" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"/><path d="M12 15h6" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>',
    filled: '<rect x="2" y="3" width="20" height="18" rx="2" fill="currentColor" opacity="0.15"/><rect x="2" y="3" width="20" height="18" rx="2" stroke="currentColor" stroke-width="2" fill="none"/><path d="M6 9l4 3-4 3" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"/><path d="M12 15h6" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>',
  },
  // Discovery
  search: {
    stroke: '<circle cx="11" cy="11" r="7" stroke="currentColor" stroke-width="2" fill="none"/><path d="M21 21l-4.35-4.35" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>',
    filled: '<circle cx="11" cy="11" r="7" fill="currentColor" opacity="0.15"/><circle cx="11" cy="11" r="7" stroke="currentColor" stroke-width="2" fill="none"/><path d="M21 21l-4.35-4.35" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>',
  },
  explore: {
    stroke: '<circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="2" fill="none"/><polygon points="14.5 9.5 9.5 14.5 7 17 9.5 14.5 14.5 9.5 17 7" stroke="currentColor" stroke-width="2" fill="none" stroke-linejoin="round"/>',
    filled: '<circle cx="12" cy="12" r="9" fill="currentColor" opacity="0.15"/><circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="2" fill="none"/><polygon points="14.5 9.5 9.5 14.5 7 17 9.5 14.5 14.5 9.5 17 7" fill="currentColor" opacity="0.3"/>',
  },
  navigate: {
    stroke: '<polygon points="12 2 19 22 12 18 5 22 12 2" stroke="currentColor" stroke-width="2" fill="none" stroke-linejoin="round"/>',
    filled: '<polygon points="12 2 19 22 12 18 5 22 12 2" fill="currentColor" opacity="0.15"/><polygon points="12 2 19 22 12 18 5 22 12 2" stroke="currentColor" stroke-width="2" fill="none" stroke-linejoin="round"/>',
  },
  research: {
    stroke: '<path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20" stroke="currentColor" stroke-width="2" fill="none"/><path d="M8 7h8M8 11h5" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>',
    filled: '<path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20" fill="currentColor" opacity="0.15"/><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20" stroke="currentColor" stroke-width="2" fill="none"/><path d="M8 7h8M8 11h5" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>',
  },
  archive: {
    stroke: '<rect x="2" y="3" width="20" height="5" rx="1" stroke="currentColor" stroke-width="2" fill="none"/><path d="M4 8v11a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8" stroke="currentColor" stroke-width="2" fill="none"/><path d="M10 12h4" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>',
    filled: '<rect x="2" y="3" width="20" height="5" rx="1" fill="currentColor" opacity="0.15"/><rect x="2" y="3" width="20" height="5" rx="1" stroke="currentColor" stroke-width="2" fill="none"/><path d="M4 8v11a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8" stroke="currentColor" stroke-width="2" fill="none"/>',
  },
  // Productivity
  tasks: {
    stroke: '<rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" stroke-width="2" fill="none"/><path d="M9 12l2 2 4-4" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"/>',
    filled: '<rect x="3" y="3" width="18" height="18" rx="2" fill="currentColor" opacity="0.15"/><path d="M9 12l2 2 4-4" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"/>',
  },
  workflow: {
    stroke: '<circle cx="5" cy="12" r="3" stroke="currentColor" stroke-width="2" fill="none"/><circle cx="19" cy="6" r="3" stroke="currentColor" stroke-width="2" fill="none"/><circle cx="19" cy="18" r="3" stroke="currentColor" stroke-width="2" fill="none"/><path d="M8 10l8-2M8 14l8 2" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>',
    filled: '<circle cx="5" cy="12" r="3" fill="currentColor" opacity="0.15"/><circle cx="19" cy="6" r="3" fill="currentColor" opacity="0.15"/><circle cx="19" cy="18" r="3" fill="currentColor" opacity="0.15"/><path d="M8 10l8-2M8 14l8 2" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>',
  },
  planning: {
    stroke: '<rect x="3" y="4" width="18" height="18" rx="2" stroke="currentColor" stroke-width="2" fill="none"/><path d="M16 2v4M8 2v4M3 10h18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><path d="M8 14h.01M12 14h.01M16 14h.01M8 18h.01M12 18h.01" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>',
    filled: '<rect x="3" y="4" width="18" height="18" rx="2" fill="currentColor" opacity="0.15"/><path d="M16 2v4M8 2v4M3 10h18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>',
  },
  documents: {
    stroke: '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6Z" stroke="currentColor" stroke-width="2" fill="none" stroke-linejoin="round"/><path d="M14 2v6h6" stroke="currentColor" stroke-width="2" fill="none"/><path d="M8 13h8M8 17h5" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>',
    filled: '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6Z" fill="currentColor" opacity="0.15"/><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6Z" stroke="currentColor" stroke-width="2" fill="none" stroke-linejoin="round"/><path d="M14 2v6h6" stroke="currentColor" stroke-width="2" fill="none"/>',
  },
  collaboration: {
    stroke: '<circle cx="9" cy="7" r="4" stroke="currentColor" stroke-width="2" fill="none"/><path d="M2 21v-2a4 4 0 0 1 4-4h6a4 4 0 0 1 4 4v2" stroke="currentColor" stroke-width="2" fill="none"/><circle cx="19" cy="7" r="3" stroke="currentColor" stroke-width="2" fill="none"/><path d="M22 21v-1.5a3 3 0 0 0-2-2.83" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round"/>',
    filled: '<circle cx="9" cy="7" r="4" fill="currentColor" opacity="0.15"/><path d="M2 21v-2a4 4 0 0 1 4-4h6a4 4 0 0 1 4 4v2" fill="currentColor" opacity="0.1"/><circle cx="9" cy="7" r="4" stroke="currentColor" stroke-width="2" fill="none"/><path d="M2 21v-2a4 4 0 0 1 4-4h6a4 4 0 0 1 4 4v2" stroke="currentColor" stroke-width="2" fill="none"/>',
  },
  // Intelligence
  ai: {
    stroke: '<circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="2" fill="none"/><path d="M12 7v5l3 3" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round"/><circle cx="12" cy="12" r="2" stroke="currentColor" stroke-width="2" fill="none"/>',
    filled: '<circle cx="12" cy="12" r="9" fill="currentColor" opacity="0.15"/><path d="M12 7v5l3 3" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round"/><circle cx="12" cy="12" r="2" fill="currentColor"/>',
  },
  neural: {
    stroke: '<circle cx="6" cy="6" r="3" stroke="currentColor" stroke-width="2" fill="none"/><circle cx="18" cy="6" r="3" stroke="currentColor" stroke-width="2" fill="none"/><circle cx="6" cy="18" r="3" stroke="currentColor" stroke-width="2" fill="none"/><circle cx="18" cy="18" r="3" stroke="currentColor" stroke-width="2" fill="none"/><circle cx="12" cy="12" r="3" stroke="currentColor" stroke-width="2" fill="none"/><path d="M8.5 7.5l2 2M13.5 10.5l2-2M8.5 16.5l2-2M13.5 13.5l2 2" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>',
    filled: '<circle cx="12" cy="12" r="3" fill="currentColor"/><circle cx="6" cy="6" r="3" fill="currentColor" opacity="0.15"/><circle cx="18" cy="6" r="3" fill="currentColor" opacity="0.15"/><circle cx="6" cy="18" r="3" fill="currentColor" opacity="0.15"/><circle cx="18" cy="18" r="3" fill="currentColor" opacity="0.15"/><path d="M8.5 7.5l2 2M13.5 10.5l2-2M8.5 16.5l2-2M13.5 13.5l2 2" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>',
  },
  analysis: {
    stroke: '<path d="M3 20h18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><path d="M5 16l4-8 4 4 4-10 4 6" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"/>',
    filled: '<path d="M3 20h18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><path d="M5 16l4-8 4 4 4-10 4 6" stroke="currentColor" stroke-width="2.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/>',
  },
  automation: {
    stroke: '<path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><circle cx="12" cy="12" r="4" stroke="currentColor" stroke-width="2" fill="none"/>',
    filled: '<circle cx="12" cy="12" r="4" fill="currentColor" opacity="0.15"/><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>',
  },
  knowledge: {
    stroke: '<path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2V3Z" stroke="currentColor" stroke-width="2" fill="none"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7V3Z" stroke="currentColor" stroke-width="2" fill="none"/>',
    filled: '<path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2V3Z" fill="currentColor" opacity="0.15"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7V3Z" fill="currentColor" opacity="0.15"/><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2V3Z" stroke="currentColor" stroke-width="2" fill="none"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7V3Z" stroke="currentColor" stroke-width="2" fill="none"/>',
  },
  // System
  settings: {
    stroke: '<circle cx="12" cy="12" r="3" stroke="currentColor" stroke-width="2" fill="none"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>',
    filled: '<circle cx="12" cy="12" r="3" fill="currentColor"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>',
  },
  security: {
    stroke: '<path d="M12 2l8 4v6c0 5.55-3.84 10.74-8 12-4.16-1.26-8-6.45-8-12V6l8-4Z" stroke="currentColor" stroke-width="2" fill="none" stroke-linejoin="round"/><path d="M9 12l2 2 4-4" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"/>',
    filled: '<path d="M12 2l8 4v6c0 5.55-3.84 10.74-8 12-4.16-1.26-8-6.45-8-12V6l8-4Z" fill="currentColor" opacity="0.15"/><path d="M9 12l2 2 4-4" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"/>',
  },
  permissions: {
    stroke: '<rect x="3" y="11" width="18" height="11" rx="2" stroke="currentColor" stroke-width="2" fill="none"/><path d="M7 11V7a5 5 0 0 1 10 0v4" stroke="currentColor" stroke-width="2" fill="none"/><circle cx="12" cy="16" r="2" stroke="currentColor" stroke-width="2" fill="none"/>',
    filled: '<rect x="3" y="11" width="18" height="11" rx="2" fill="currentColor" opacity="0.15"/><path d="M7 11V7a5 5 0 0 1 10 0v4" stroke="currentColor" stroke-width="2" fill="none"/><circle cx="12" cy="16" r="2" fill="currentColor"/>',
  },
  network: {
    stroke: '<circle cx="12" cy="5" r="3" stroke="currentColor" stroke-width="2" fill="none"/><circle cx="5" cy="19" r="3" stroke="currentColor" stroke-width="2" fill="none"/><circle cx="19" cy="19" r="3" stroke="currentColor" stroke-width="2" fill="none"/><path d="M12 8v3M8.5 16l2-5M15.5 16l-2-5" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>',
    filled: '<circle cx="12" cy="5" r="3" fill="currentColor" opacity="0.15"/><circle cx="5" cy="19" r="3" fill="currentColor" opacity="0.15"/><circle cx="19" cy="19" r="3" fill="currentColor" opacity="0.15"/><path d="M12 8v3M8.5 16l2-5M15.5 16l-2-5" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>',
  },
  cloud: {
    stroke: '<path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10Z" stroke="currentColor" stroke-width="2" fill="none" stroke-linejoin="round"/>',
    filled: '<path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10Z" fill="currentColor" opacity="0.15"/><path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10Z" stroke="currentColor" stroke-width="2" fill="none" stroke-linejoin="round"/>',
  },
};

export function Icon({ name, size = 24, variant = 'stroke', className = '', ...props }: IconProps) {
  const icon = ICONS[name];
  if (!icon) return null;

  const svgContent = icon[variant];
  if (!svgContent) return null;

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      dangerouslySetInnerHTML={{ __html: svgContent }}
      {...props}
    />
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
