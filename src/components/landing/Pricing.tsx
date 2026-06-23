export function Pricing() {
  return (
    <section id="pricing" className="mx-auto max-w-[1100px] px-[5%] py-25 text-center">
      <span className="mb-4 block font-[family-name:var(--font-dm-mono)] text-xs tracking-[0.1em] text-[var(--accent)]">
        // simple pricing
      </span>
      <h2 className="mb-4 font-[family-name:var(--font-barlow)] text-[clamp(36px,4vw,54px)] font-800 leading-tight">
        Free forever. Pro when you&apos;re ready.
      </h2>
      <p className="mx-auto max-w-[520px] text-base leading-relaxed text-[var(--muted)]">
        No trial limits. No hidden seats. Start for free and upgrade when it
        makes sense. Not because we forced your hand.
      </p>

      <div className="mt-15 grid grid-cols-1 gap-5 text-left md:grid-cols-2">
        {/* FREE */}
        <div className="rounded-[20px] border border-[var(--border2)] bg-[var(--bg2)] p-10">
          <div className="mb-3 font-[family-name:var(--font-dm-mono)] text-xs tracking-[0.1em] text-[var(--muted)]">
            FREE
          </div>
          <div className="mb-1 font-[family-name:var(--font-barlow)] text-[56px] font-800 leading-none">
            €<span>0</span>
          </div>
          <div className="mb-6 text-[13px] text-[var(--muted)]">
            forever, no credit card needed
          </div>
          <div className="mb-8 text-sm leading-relaxed text-[var(--muted)]">
            Everything you need to get started and build a real, functional
            profile page.
          </div>
          <ul className="mb-9 flex flex-col gap-3">
            {[
              { text: "Unlimited links with icons", included: true },
              { text: "Basic themes (10 presets)", included: true },
              { text: "View counter on your profile", included: true },
              { text: "Social platform icons", included: true },
              { text: "Early adopter + community badges", included: true },
              { text: "getmvx.cc/yourname URL", included: true },
              { text: "Mobile optimized", included: true },
              { text: "Analytics dashboard", included: false },
              { text: "Custom domain", included: false },
              { text: "File / image hosting", included: false },
              { text: "Platform widgets", included: false },
              { text: "CSS injection", included: false },
            ].map((item) => (
              <li
                key={item.text}
                className={`flex items-start gap-2.5 text-sm ${
                  item.included ? "" : "text-[var(--muted)]"
                }`}
              >
                <span
                  className={`mt-0.5 shrink-0 font-700 ${
                    item.included ? "text-[var(--green)]" : "text-[var(--muted)]"
                  }`}
                >
                  {item.included ? "✓" : "✕"}
                </span>
                {item.text}
              </li>
            ))}
          </ul>
      <a
        href="/register"
        className="block w-full rounded-[10px] border border-[var(--border2)] bg-transparent py-3.5 text-center text-[15px] font-600 text-[var(--text)] transition-all hover:border-white/25"
      >
        Start for free
      </a>
        </div>

        {/* PRO */}
        <div className="relative rounded-[20px] border border-[var(--accent)] bg-[var(--bg2)] p-10" style={{ background: "linear-gradient(180deg, rgba(201,169,110,0.06) 0%, var(--bg2) 60%)" }}>
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-[var(--accent)] px-3.5 py-1 font-[family-name:var(--font-dm-mono)] text-[11px] font-700 tracking-wider text-[var(--bg)]">
            MOST POPULAR
          </div>
          <div className="mb-3 font-[family-name:var(--font-dm-mono)] text-xs tracking-[0.1em] text-[var(--muted)]">
            PRO
          </div>
          <div className="mb-1 font-[family-name:var(--font-barlow)] text-[56px] font-800 leading-none">
            €<span>4.99</span>
          </div>
          <div className="mb-6 text-[13px] text-[var(--muted)]">
            per month · or €39.99/yr (save 33%)
          </div>
          <div className="mb-8 text-sm leading-relaxed text-[var(--muted)]">
            Full control over every pixel. The platform for creators who take
            their identity seriously.
          </div>
          <ul className="mb-9 flex flex-col gap-3">
            {[
              "Everything in Free",
              "Full theme customization",
              "CSS injection (write anything)",
              "Analytics dashboard (clicks, sources, geo)",
              "Custom domain (CNAME / A record)",
              "10GB file & image hosting",
              "Live platform widgets (Twitch, Spotify, Discord, Steam)",
              "Animated backgrounds (particles, gradients, video)",
              "Font picker (900+ fonts)",
              "Pro badge on your profile",
              "Priority support",
              "Verified badge (optional add-on, €4.99 once)",
            ].map((item) => (
              <li
                key={item}
                className="flex items-start gap-2.5 text-sm"
              >
                <span className="mt-0.5 shrink-0 font-700 text-[var(--green)]">
                  ✓
                </span>
                {item}
              </li>
            ))}
          </ul>
      <a
        href="/register"
        className="block w-full rounded-[10px] bg-[var(--accent)] py-3.5 text-center text-[15px] font-600 text-[var(--bg)] transition-all hover:bg-[var(--accent2)]"
      >
        Get Pro for €4.99/mo
      </a>
        </div>
      </div>
    </section>
  );
}
