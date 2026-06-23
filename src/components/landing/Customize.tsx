"use client";

import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent,
} from "react";

type Tier = "pro" | "free";
type CategoryId =
  | "layouts"
  | "backgrounds"
  | "typography"
  | "button-styles"
  | "css-injection";

type Category = {
  id: CategoryId;
  label: string;
  tier: Tier;
  description: string;
  previewVariant: string;
  variants: readonly string[];
};

const CATEGORIES: readonly Category[] = [
  {
    id: "layouts",
    label: "Layouts",
    tier: "pro",
    description:
      "Centered, left-aligned, card-style, minimal, editorial. Or build your own grid",
    previewVariant: "layout",
    variants: ["centered", "left-aligned", "card-style", "minimal", "editorial"],
  },
  {
    id: "backgrounds",
    label: "Backgrounds",
    tier: "pro",
    description:
      "Solid, gradient, animated particles, blur-glass, video loop, uploaded image",
    previewVariant: "background",
    variants: ["solid", "gradient", "particles", "blur-glass", "video loop", "image"],
  },
  {
    id: "typography",
    label: "Typography",
    tier: "pro",
    description: "900+ Google Fonts, custom font upload, size scale, weight control",
    previewVariant: "typography",
    variants: ["Barlow Condensed", "Playfair Display", "Space Grotesk", "Bebas Neue", "DM Mono"],
  },
  {
    id: "button-styles",
    label: "Button styles",
    tier: "free",
    description: "Pill, square, outlined, ghost, filled, neon glow. Per-link overrides",
    previewVariant: "buttons",
    variants: ["pill", "square", "outlined", "ghost", "filled", "neon glow"],
  },
  {
    id: "css-injection",
    label: "CSS injection",
    tier: "pro",
    description:
      "Write raw CSS directly. No restrictions. Total power for those who want it.",
    previewVariant: "css",
    variants: ["custom properties", "transforms", "filters", "animations"],
  },
] as const;

const TYPOGRAPHY_FONTS = [
  { headline: "var(--font-barlow)", body: "var(--font-inter)" },
  { headline: "'Playfair Display', Georgia, serif", body: "'Cormorant Garamond', Georgia, serif" },
  { headline: "'Space Grotesk', system-ui, sans-serif", body: "'Space Grotesk', system-ui, sans-serif" },
  { headline: "'Bebas Neue', var(--font-barlow)", body: "var(--font-inter)" },
  { headline: "var(--font-dm-mono)", body: "var(--font-dm-mono)" },
] as const;

const LINKS = ["✦ Portfolio", "📩 Book a project", "🖼 Behance work"] as const;

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const onChange = () => setReduced(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  return reduced;
}

function Spotlight({
  active,
  reducedMotion,
  className = "",
}: {
  active: boolean;
  reducedMotion: boolean;
  className?: string;
}) {
  if (!active) return null;

  return (
    <div
      aria-hidden
      className={`pointer-events-none absolute inset-0 rounded-[inherit] ring-2 ring-[var(--accent)]/45 transition-opacity duration-300 ${className} ${
        reducedMotion ? "opacity-80" : "customize-spotlight"
      }`}
    />
  );
}

function TierBadge({ tier }: { tier: Tier }) {
  return (
    <span
      className={`ml-auto shrink-0 rounded-full px-2 py-0.5 font-[family-name:var(--font-dm-mono)] text-[10px] font-600 ${
        tier === "pro"
          ? "bg-[var(--accent-dim)] text-[var(--accent)]"
          : "bg-[var(--success)]/12 text-[var(--success)]"
      }`}
    >
      {tier === "pro" ? "PRO" : "FREE"}
    </span>
  );
}

export function Customize() {
  const [activeId, setActiveId] = useState<CategoryId>("layouts");
  const [variantIndex, setVariantIndex] = useState(0);
  const reducedMotion = usePrefersReducedMotion();
  const tabListRef = useRef<HTMLDivElement>(null);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const panelId = useId();

  const activeCategory =
    CATEGORIES.find((c) => c.id === activeId) ?? CATEGORIES[0];
  const activeVariant =
    activeCategory.variants[variantIndex % activeCategory.variants.length];

  const selectCategory = useCallback((id: CategoryId, advance = false) => {
    setActiveId((prev) => {
      if (prev === id && advance) {
        setVariantIndex((i) => i + 1);
        return prev;
      }
      setVariantIndex(0);
      return id;
    });
  }, []);

  useEffect(() => {
    if (reducedMotion) return;
    const interval = window.setInterval(() => {
      setVariantIndex((i) => i + 1);
    }, 2800);
    return () => window.clearInterval(interval);
  }, [activeId, reducedMotion]);

  useEffect(() => {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href =
      "https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Cormorant+Garamond&family=Playfair+Display:wght@500;700&family=Space+Grotesk:wght@400;500;600&display=swap";
    document.head.appendChild(link);
    return () => {
      document.head.removeChild(link);
    };
  }, []);

  const handleTabKeyDown = (e: KeyboardEvent<HTMLButtonElement>, index: number) => {
    let next = index;
    if (e.key === "ArrowDown" || e.key === "ArrowRight") {
      e.preventDefault();
      next = (index + 1) % CATEGORIES.length;
    } else if (e.key === "ArrowUp" || e.key === "ArrowLeft") {
      e.preventDefault();
      next = (index - 1 + CATEGORIES.length) % CATEGORIES.length;
    } else if (e.key === "Home") {
      e.preventDefault();
      next = 0;
    } else if (e.key === "End") {
      e.preventDefault();
      next = CATEGORIES.length - 1;
    } else {
      return;
    }
    tabRefs.current[next]?.focus();
    selectCategory(CATEGORIES[next].id);
  };

  const layoutVariant = activeId === "layouts" ? activeVariant : "centered";
  const bgVariant =
    activeId === "backgrounds" ? activeVariant : "gradient";
  const typoIndex = activeId === "typography" ? variantIndex : 0;
  const buttonVariant =
    activeId === "button-styles" ? activeVariant : "filled";
  const showCssSnippet = activeId === "css-injection";

  const fonts = TYPOGRAPHY_FONTS[typoIndex % TYPOGRAPHY_FONTS.length];

  const LAYOUT_CLASS_MAP: Record<string, string> = {
    centered: "text-center items-center",
    "left-aligned": "text-left items-start",
    "card-style": "text-center items-center px-3",
    minimal: "text-left items-start px-2",
    editorial: "text-left items-start pl-6 pr-4",
  };
  const layoutClasses =
    LAYOUT_CLASS_MAP[layoutVariant] ?? "text-center items-center";

  const isCardStyle = layoutVariant === "card-style";
  const isMinimal = layoutVariant === "minimal";
  const isEditorial = layoutVariant === "editorial";
  const alignStart =
    layoutVariant === "left-aligned" ||
    layoutVariant === "minimal" ||
    layoutVariant === "editorial";

  function getBannerStyle(): CSSProperties {
    switch (bgVariant) {
      case "solid":
        return { background: "#1a1408" };
      case "gradient":
        return {
          background: "linear-gradient(135deg,#1a1200,#2d2000,#1a1200)",
        };
      case "particles":
        return {
          background: "#0e0b06",
          backgroundImage:
            "radial-gradient(circle at 20% 30%, rgba(201,169,110,0.35) 1px, transparent 1px), radial-gradient(circle at 70% 60%, rgba(232,201,138,0.25) 1px, transparent 1px), radial-gradient(circle at 40% 80%, rgba(201,169,110,0.2) 1px, transparent 1px)",
          backgroundSize: "24px 24px, 32px 32px, 28px 28px",
        };
      case "blur-glass":
        return {
          background:
            "linear-gradient(135deg, rgba(201,169,110,0.25), rgba(26,18,0,0.6))",
          backdropFilter: "blur(12px)",
        };
      case "video loop":
        return {
          background:
            "linear-gradient(110deg,#1a1200,#3d2a00,#1a1200,#2d2000,#1a1200)",
          backgroundSize: "300% 100%",
          animation: reducedMotion ? undefined : "customize-video-loop 6s linear infinite",
        };
      case "image":
        return {
          backgroundImage:
            "linear-gradient(to bottom, rgba(14,11,6,0.2), rgba(14,11,6,0.85)), url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='120' viewBox='0 0 400 120'%3E%3Cdefs%3E%3ClinearGradient id='g' x1='0%25' y1='0%25' x2='100%25' y2='100%25'%3E%3Cstop offset='0%25' stop-color='%232d2000'/%3E%3Cstop offset='50%25' stop-color='%23c9a96e'/%3E%3Cstop offset='100%25' stop-color='%231a1200'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect fill='url(%23g)' width='400' height='120'/%3E%3C/svg%3E\")",
          backgroundSize: "cover",
          backgroundPosition: "center",
        };
      default:
        return {
          background: "linear-gradient(135deg,#1a1200,#2d2000,#1a1200)",
        };
    }
  }

  function getButtonClasses(label: string) {
    const base =
      "cursor-pointer py-2.5 text-center text-[13px] font-500 transition-all duration-300 hover:brightness-110";
    switch (buttonVariant) {
      case "pill":
        return `${base} rounded-full border border-[var(--accent)]/20 bg-[#1a1408] text-[var(--accent)]`;
      case "square":
        return `${base} rounded-none border border-[var(--accent)]/30 bg-[#1a1408] text-[var(--accent)]`;
      case "outlined":
        return `${base} rounded-[9px] border-2 border-[var(--accent)] bg-transparent text-[var(--accent)]`;
      case "ghost":
        return `${base} rounded-[9px] border border-transparent bg-transparent text-[#c9a96e]/90 hover:bg-[#1a1408]/60`;
      case "neon glow":
        return `${base} rounded-[9px] border border-[var(--accent)]/40 bg-[#1a1408] text-[var(--accent)] shadow-[0_0_16px_rgba(201,169,110,0.45),inset_0_0_12px_rgba(201,169,110,0.08)]`;
      case "filled":
      default:
        return `${base} rounded-[9px] border border-[var(--accent)]/20 bg-[#1a1408] text-[var(--accent)]`;
    }
  }

  const tabButtons = CATEGORIES.map((cat, i) => {
    const isActive = activeId === cat.id;
    return (
      <button
        key={cat.id}
        ref={(el) => {
          tabRefs.current[i] = el;
        }}
        id={`customize-tab-${cat.id}`}
        role="tab"
        type="button"
        aria-selected={isActive}
        aria-controls={panelId}
        tabIndex={isActive ? 0 : -1}
        onClick={() => selectCategory(cat.id, true)}
        onKeyDown={(e) => handleTabKeyDown(e, i)}
        className={`flex w-full shrink-0 items-center gap-3.5 rounded-[10px] border px-[18px] py-3.5 text-left transition-all duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)] ${
          isActive
            ? "border-[var(--accent)]/30 bg-[var(--accent-dim)] shadow-[inset_0_0_24px_var(--accent-glow)]"
            : "border-transparent hover:bg-[var(--bg3)]"
        }`}
      >
        <div
          className={`h-2 w-2 shrink-0 rounded-full bg-[var(--accent)] transition-opacity duration-300 ${
            isActive ? "opacity-100" : "opacity-0"
          }`}
        />
        <div className="min-w-0 flex-1">
          <strong className="block text-[15px] font-600">{cat.label}</strong>
          <span className="hidden text-[13px] text-[var(--muted)] lg:block">
            {cat.description}
          </span>
        </div>
        <TierBadge tier={cat.tier} />
      </button>
    );
  });

  return (
    <section id="customize" className="mx-auto max-w-[1280px] px-[5%] py-25">
      <div className="grid grid-cols-1 items-start gap-12 lg:grid-cols-2 lg:items-center lg:gap-20">
        {/* Left — header + tabs */}
        <div>
          <span className="mb-4 block font-[family-name:var(--font-dm-mono)] text-xs tracking-[0.1em] text-[var(--accent)]">
            // make it yours
          </span>
          <h2 className="mb-4 font-[family-name:var(--font-barlow)] text-[clamp(36px,4vw,54px)] font-800 leading-tight">
            Fully customizable.
            <br />
            Top to bottom.
          </h2>
          <p className="max-w-[520px] text-base leading-relaxed text-[var(--muted)]">
            Not a theme-picker with five options. Every visual decision on your
            page is yours to make. Or leave to our defaults if you don&apos;t
            care to fuss.
          </p>

          {/* Mobile: horizontal scroll tabs */}
          <div
            ref={tabListRef}
            role="tablist"
            aria-label="Customization categories"
            className="mt-8 flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] lg:hidden [&::-webkit-scrollbar]:hidden"
          >
            {CATEGORIES.map((cat, i) => {
              const isActive = activeId === cat.id;
              return (
                <button
                  key={cat.id}
                  ref={(el) => {
                    tabRefs.current[i] = el;
                  }}
                  id={`customize-tab-mobile-${cat.id}`}
                  role="tab"
                  type="button"
                  aria-selected={isActive}
                  aria-controls={panelId}
                  tabIndex={isActive ? 0 : -1}
                  onClick={() => selectCategory(cat.id, true)}
                  onKeyDown={(e) => handleTabKeyDown(e, i)}
                  className={`flex shrink-0 items-center gap-2 rounded-full border px-4 py-2 text-sm transition-all duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)] ${
                    isActive
                      ? "border-[var(--accent)]/30 bg-[var(--accent-dim)] text-[var(--text)]"
                      : "border-[var(--border)] text-[var(--muted)] hover:text-[var(--text)]"
                  }`}
                >
                  {cat.label}
                  <TierBadge tier={cat.tier} />
                </button>
              );
            })}
          </div>

          {/* Mobile: active category description */}
          <p className="mt-3 text-[13px] leading-relaxed text-[var(--muted)] lg:hidden">
            {activeCategory.description}
          </p>

          {/* Desktop: vertical tabs */}
          <div
            role="tablist"
            aria-label="Customization categories"
            aria-orientation="vertical"
            className="mt-8 hidden flex-col gap-1 lg:flex"
          >
            {tabButtons}
          </div>
        </div>

        {/* Right — live preview */}
        <div
          id={panelId}
          role="tabpanel"
          aria-labelledby={`customize-tab-${activeId}`}
          className="flex flex-col items-center gap-5"
        >
          <div className="relative w-[300px]">
            {showCssSnippet && (
              <div
                className={`absolute -right-2 top-8 z-20 max-w-[140px] rounded-lg border border-[var(--border2)] bg-[var(--bg2)]/95 px-2.5 py-2 font-[family-name:var(--font-dm-mono)] text-[9px] leading-relaxed text-[var(--accent)] shadow-[0_8px_24px_rgba(0,0,0,0.45)] backdrop-blur-sm transition-opacity duration-300 ${
                  reducedMotion ? "opacity-100" : "animate-in"
                }`}
              >
                <span className="text-[var(--muted)]">{"/* "}</span>
                {activeVariant}
                <span className="text-[var(--muted)]">{" */"}</span>
                <br />
                .profile {"{"}
                <br />
                &nbsp;&nbsp;--accent: #c9a96e;
                <br />
                {"}"}
              </div>
            )}

            <div
              className={`relative overflow-hidden rounded-[20px] border border-[var(--border2)] bg-[#0e0b06] transition-[box-shadow,transform] duration-300 ${
                showCssSnippet
                  ? "shadow-[0_0_0_1px_rgba(201,169,110,0.2),0_24px_48px_rgba(0,0,0,0.5)]"
                  : "shadow-[0_24px_48px_rgba(0,0,0,0.45)]"
              }`}
            >
              <Spotlight
                active={activeId === "layouts" || activeId === "css-injection"}
                reducedMotion={reducedMotion}
              />

              {/* Banner / background */}
              <div className="relative h-[90px] transition-all duration-300">
                <div
                  className={`absolute inset-0 transition-opacity duration-300 ${
                    bgVariant === "particles" && !reducedMotion
                      ? "customize-particles"
                      : ""
                  }`}
                  style={getBannerStyle()}
                />
                <Spotlight
                  active={activeId === "backgrounds"}
                  reducedMotion={reducedMotion}
                  className="rounded-none"
                />
              </div>

              {/* Body */}
              <div
                className={`relative flex flex-col pb-6 pt-0 transition-all duration-300 ${layoutClasses} ${
                  isCardStyle ? "px-3" : "px-5"
                }`}
              >
                {isCardStyle && (
                  <div className="relative -mt-4 rounded-2xl border border-[var(--border2)] bg-[#0e0b06]/90 p-4 shadow-inner">
                    <ProfileBody
                      activeId={activeId}
                      alignStart={alignStart}
                      fonts={fonts}
                      isEditorial={isEditorial}
                      isMinimal={isMinimal}
                      reducedMotion={reducedMotion}
                      getButtonClasses={getButtonClasses}
                    />
                  </div>
                )}
                {!isCardStyle && (
                  <ProfileBody
                    activeId={activeId}
                    alignStart={alignStart}
                    fonts={fonts}
                    isEditorial={isEditorial}
                    isMinimal={isMinimal}
                    reducedMotion={reducedMotion}
                    getButtonClasses={getButtonClasses}
                  />
                )}
              </div>
            </div>
          </div>

          <p className="font-[family-name:var(--font-dm-mono)] text-xs text-[var(--muted)] transition-opacity duration-300">
            <span className="text-[var(--accent)]">{activeVariant}</span>
            {" · "}
            {activeCategory.label.toLowerCase()}
          </p>
        </div>
      </div>
    </section>
  );
}

function ProfileBody({
  activeId,
  alignStart,
  fonts,
  isEditorial,
  isMinimal,
  reducedMotion,
  getButtonClasses,
}: {
  activeId: CategoryId;
  alignStart: boolean;
  fonts: (typeof TYPOGRAPHY_FONTS)[number];
  isEditorial: boolean;
  isMinimal: boolean;
  reducedMotion: boolean;
  getButtonClasses: (label: string) => string;
}) {
  const rowAlign = alignStart ? "justify-start" : "justify-center";

  return (
    <>
      {!isMinimal && (
        <div className={`relative z-10 -mt-8 mb-3 flex w-full ${rowAlign}`}>
          <div className="flex h-[72px] w-[72px] items-center justify-center rounded-full bg-[#0e0b06] p-[3px]">
            <div className="flex h-full w-full items-center justify-center rounded-full bg-[linear-gradient(135deg,#c9a96e,#e8c98a)] text-2xl">
              🖤
            </div>
          </div>
        </div>
      )}

      <div
        className={`relative w-full ${isMinimal ? "mt-2" : ""} ${
          isEditorial ? "border-l-2 border-[var(--accent)]/40 pl-3" : ""
        }`}
      >
        <Spotlight
          active={activeId === "typography"}
          reducedMotion={reducedMotion}
        />

        {!isMinimal && (
          <div className={`mb-2.5 flex ${rowAlign}`}>
            <span className="rounded-full bg-[var(--accent)]/15 px-2.5 py-0.5 font-[family-name:var(--font-dm-mono)] text-[10px] font-600 tracking-wider text-[var(--accent)]">
              EARLY ADOPTER
            </span>
          </div>
        )}

        <div
          className={`mb-2.5 font-700 text-[#f0e8d0] transition-all duration-300 ${
            isEditorial ? "text-[22px] leading-none tracking-wide" : "text-[17px]"
          }`}
          style={{ fontFamily: fonts.headline }}
        >
          trijbsworld
        </div>
        <div
          className="mb-2.5 font-[family-name:var(--font-dm-mono)] text-xs text-[#5a4a2a] transition-all duration-300"
          style={{ fontFamily: fonts.body }}
        >
          @trijbs
        </div>
        <div
          className={`mb-3.5 text-xs leading-relaxed text-[#7a6a4a] transition-all duration-300 ${
            isEditorial ? "max-w-[85%] text-[13px] italic" : "px-1"
          }`}
          style={{ fontFamily: fonts.body }}
        >
          brand design studio. trijbsworld.nl. We make brands that last
        </div>
      </div>

      {!isMinimal && (
        <div className={`mb-4 flex gap-2 ${rowAlign}`}>
          {["📸", "🐙", "🌐", "💬"].map((icon) => (
            <span
              key={icon}
              className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#1a1408] text-[13px] text-[#7a6a4a]"
            >
              {icon}
            </span>
          ))}
        </div>
      )}

      <div className="relative flex w-full flex-col gap-2">
        <Spotlight
          active={activeId === "button-styles"}
          reducedMotion={reducedMotion}
        />
        {LINKS.map((link) => (
          <div key={link} className={getButtonClasses(link)}>
            {link}
          </div>
        ))}
      </div>
    </>
  );
}
