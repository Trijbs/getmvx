const features = [
  {
    icon: "🔗",
    title: "Unlimited links",
    desc: "Add as many links as you want with custom icons, labels, and ordering. Group them, section them, style them however you need.",
    tag: "free" as const,
  },
  {
    icon: "🎨",
    title: "Deep visual control",
    desc: "Choose your background, card layout, button shape, font, spacing, and color scheme. Pro users get access to raw CSS injection for total control.",
    tag: "pro" as const,
  },
  {
    icon: "📁",
    title: "Built-in file hosting",
    desc: "Upload images, short videos, or files directly to your profile. Share your work without linking off to yet another platform.",
    tag: "pro" as const,
  },
  {
    icon: "📊",
    title: "Real analytics",
    desc: "Profile views, link click-through rates, traffic sources, device breakdown, and geographic data. Know who's looking at your page and what they care about.",
    tag: "pro" as const,
  },
  {
    icon: "🎮",
    title: "Platform widgets",
    desc: "Live Twitch status, Discord member count, Spotify now playing, YouTube latest video, Steam status, and more. Pulled live onto your page.",
    tag: "pro" as const,
  },
  {
    icon: "✦",
    title: "Identity badges",
    desc: "Earn or purchase status badges that show on your profile. Pro badge, Verified, Early Adopter, Creator. Your reputation, visible at a glance.",
    tag: "both" as const,
  },
  {
    icon: "🌐",
    title: "Custom domain",
    desc: "Point your own domain to your MVX page. yourname.com, brandstudio.co, whatever you own. It's yours to use.",
    tag: "pro" as const,
  },
  {
    icon: "🔒",
    title: "Privacy-first",
    desc: "No ad tracking. No third-party pixels. We don't sell your data or your visitors' data. Your page is yours, not an ad surface.",
    tag: "free" as const,
  },
  {
    icon: "⚡",
    title: "Instant load speed",
    desc: "Static-first architecture with edge caching globally. Your profile loads in under 400ms anywhere in the world. First impressions are fast impressions.",
    tag: "free" as const,
  },
];

export function Features() {
  return (
    <section id="features" className="mx-auto max-w-[1280px] px-[5%] py-25">
      <span className="mb-4 block font-[family-name:var(--font-dm-mono)] text-xs tracking-[0.1em] text-[var(--accent)]">
        // what you get
      </span>
      <h2 className="mb-4 font-[family-name:var(--font-barlow)] text-[clamp(36px,4vw,54px)] font-800 leading-tight">
        Everything you need.
        <br />
        Nothing you don&apos;t.
      </h2>
      <p className="max-w-[520px] text-base leading-relaxed text-[var(--muted)]">
        We looked at every link-in-bio tool and kept only what matters. Then
        added the things everyone else forgot to build.
      </p>

      <div className="mt-15 grid grid-cols-1 overflow-hidden rounded-[20px] border border-[var(--border)] bg-[var(--border)] sm:grid-cols-2 lg:grid-cols-3" style={{ gap: "1px" }}>
        {features.map((feat) => (
          <div
            key={feat.title}
            className="bg-[var(--bg2)] p-8 transition-colors hover:bg-[var(--bg3)]"
          >
            <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-[10px] bg-[var(--accent-dim)] text-xl">
              {feat.icon}
            </div>
            <div className="mb-2.5 text-[17px] font-600">{feat.title}</div>
            <div className="text-sm leading-relaxed text-[var(--muted)]">
              {feat.desc}
            </div>
            <span
              className={`mt-3.5 inline-block rounded-full px-2.5 py-0.5 font-[family-name:var(--font-dm-mono)] text-[11px] font-600 tracking-wide ${
                feat.tag === "pro"
                  ? "bg-[var(--accent-dim)] text-[var(--accent)]"
                  : "bg-[var(--green)]/12 text-[var(--green)]"
              }`}
            >
              {feat.tag === "pro" ? "PRO" : feat.tag === "both" ? "FREE + PRO" : "FREE"}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
