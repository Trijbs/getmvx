interface LogoProps {
  size?: number;
  variant?: 'primary' | 'monochrome-light' | 'monochrome-dark' | 'simplified' | 'monogram' | 'portal' | 'abstract';
  className?: string;
}

export function Logo({ size = 120, variant = 'primary', className = '' }: LogoProps) {
  const baseProps = {
    width: size,
    height: size,
    viewBox: '0 0 120 120',
    fill: 'none',
    className,
  };

  switch (variant) {
    case 'primary':
      return (
        <svg {...baseProps}>
          <rect x="12" y="12" width="96" height="96" rx="12" stroke="#f0eff4" strokeWidth="1.5" fill="none" />
          <rect x="32" y="38" width="6" height="44" rx="3" fill="var(--accent)" />
          <rect x="82" y="38" width="6" height="44" rx="3" fill="var(--accent)" />
          <rect x="32" y="35" width="56" height="6" rx="3" fill="var(--accent)" />
          <rect x="44" y="44" width="32" height="32" rx="4" transform="rotate(45 60 60)" stroke="var(--accent)" strokeWidth="1.5" fill="none" />
          <circle cx="60" cy="60" r="9" stroke="#f0eff4" strokeWidth="1.5" fill="none" />
          <circle cx="60" cy="60" r="2.5" fill="var(--accent)" />
        </svg>
      );

    case 'monochrome-light':
      return (
        <svg {...baseProps} style={{ background: '#f0eff4', borderRadius: '12px' }}>
          <rect x="12" y="12" width="96" height="96" rx="12" stroke="#0c0c0e" strokeWidth="1.5" fill="none" />
          <rect x="32" y="38" width="6" height="44" rx="3" fill="#0c0c0e" />
          <rect x="82" y="38" width="6" height="44" rx="3" fill="#0c0c0e" />
          <rect x="32" y="35" width="56" height="6" rx="3" fill="#0c0c0e" />
          <rect x="44" y="44" width="32" height="32" rx="4" transform="rotate(45 60 60)" stroke="#0c0c0e" strokeWidth="1.5" fill="none" />
          <circle cx="60" cy="60" r="9" stroke="#0c0c0e" strokeWidth="1.5" fill="none" />
          <circle cx="60" cy="60" r="2.5" fill="#0c0c0e" />
        </svg>
      );

    case 'monochrome-dark':
      return (
        <svg {...baseProps}>
          <rect x="12" y="12" width="96" height="96" rx="12" stroke="#f0eff4" strokeWidth="1.5" fill="none" />
          <rect x="32" y="38" width="6" height="44" rx="3" fill="#f0eff4" />
          <rect x="82" y="38" width="6" height="44" rx="3" fill="#f0eff4" />
          <rect x="32" y="35" width="56" height="6" rx="3" fill="#f0eff4" />
          <rect x="44" y="44" width="32" height="32" rx="4" transform="rotate(45 60 60)" stroke="#f0eff4" strokeWidth="1.5" fill="none" />
          <circle cx="60" cy="60" r="9" stroke="#f0eff4" strokeWidth="1.5" fill="none" />
          <circle cx="60" cy="60" r="2.5" fill="#f0eff4" />
        </svg>
      );

    case 'simplified':
      return (
        <svg {...baseProps}>
          <rect x="12" y="12" width="96" height="96" rx="12" stroke="#f0eff4" strokeWidth="1.5" fill="none" />
          <rect x="32" y="38" width="6" height="44" rx="3" fill="var(--accent)" />
          <rect x="82" y="38" width="6" height="44" rx="3" fill="var(--accent)" />
          <rect x="32" y="35" width="56" height="6" rx="3" fill="var(--accent)" />
        </svg>
      );

    case 'monogram':
      return (
        <svg {...baseProps}>
          <rect x="12" y="12" width="96" height="96" rx="12" fill="var(--bg2)" />
          <text x="60" y="78" textAnchor="middle" fill="var(--accent)" fontFamily="var(--font-display)" fontWeight="700" fontSize="48">M</text>
        </svg>
      );

    case 'portal':
      return (
        <svg {...baseProps}>
          <rect x="12" y="12" width="96" height="96" rx="12" fill="var(--bg2)" />
          <circle cx="60" cy="60" r="36" stroke="var(--accent)" strokeWidth="1.5" fill="none" />
          <circle cx="60" cy="60" r="20" stroke="var(--accent)" strokeWidth="1" fill="none" opacity="0.5" />
          <circle cx="60" cy="60" r="6" fill="var(--accent)" />
        </svg>
      );

    case 'abstract':
      return (
        <svg {...baseProps}>
          <rect x="12" y="12" width="96" height="96" rx="12" fill="var(--bg2)" />
          <rect x="30" y="30" width="60" height="60" rx="8" transform="rotate(45 60 60)" stroke="var(--accent)" strokeWidth="1.5" fill="none" />
          <circle cx="60" cy="60" r="12" fill="var(--accent)" />
        </svg>
      );

    default:
      return null;
  }
}

export function LogoMark({ size = 32, className = '' }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" className={className}>
      <rect x="3" y="3" width="26" height="26" rx="4" stroke="currentColor" strokeWidth="1.5" fill="none" />
      <rect x="10" y="10" width="12" height="12" rx="2" transform="rotate(45 16 16)" stroke="var(--accent)" strokeWidth="1.5" fill="none" />
      <circle cx="16" cy="16" r="4" stroke="var(--accent)" strokeWidth="1.5" fill="none" />
    </svg>
  );
}

export function HeroMark({ size = 160, className = '' }: { size?: number; className?: string }) {
  return (
    <div className={`relative ${className}`} style={{ width: size, height: size }}>
      <div
        className="absolute inset-[-40px] rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, var(--accent-glow) 0%, transparent 70%)' }}
      />
      <svg viewBox="0 0 160 160" fill="none" width={size} height={size}>
        <rect x="16" y="16" width="128" height="128" rx="16" stroke="#f0eff4" strokeWidth="2" fill="none" />
        <rect x="40" y="48" width="8" height="64" rx="4" fill="var(--accent)" />
        <rect x="112" y="48" width="8" height="64" rx="4" fill="var(--accent)" />
        <rect x="40" y="44" width="80" height="8" rx="4" fill="var(--accent)" />
        <rect x="60" y="60" width="40" height="40" rx="6" transform="rotate(45 80 80)" stroke="var(--accent)" strokeWidth="2" fill="none" />
        <circle cx="80" cy="80" r="12" stroke="#f0eff4" strokeWidth="1.5" fill="none" />
        <circle cx="80" cy="80" r="3" fill="var(--accent)" />
        <circle cx="80" cy="56" r="2" fill="var(--accent)" opacity="0.6" />
        <circle cx="80" cy="104" r="2" fill="var(--accent)" opacity="0.6" />
        <circle cx="56" cy="80" r="2" fill="var(--accent)" opacity="0.6" />
        <circle cx="104" cy="80" r="2" fill="var(--accent)" opacity="0.6" />
      </svg>
    </div>
  );
}
