import { LogoMark } from "@/components/brand";

export function Footer() {
  return (
    <footer className="border-t border-[var(--border)] px-[5%] py-12">
      <div className="mx-auto flex max-w-[1280px] flex-col items-center gap-4 text-center">
        <div className="flex items-center gap-2.5 text-[var(--text)]">
          <LogoMark size={28} />
          <span className="font-[family-name:var(--font-barlow)] text-[18px] font-700 tracking-[0.08em] uppercase">
            GETMV<span className="text-[var(--accent)]">X</span>
          </span>
        </div>

        <p className="font-[family-name:var(--font-dm-mono)] text-xs tracking-wide text-[var(--muted)]">
          Your identity, fully yours.
        </p>

        <p className="text-[13px] text-[var(--muted)]">
          MVX by{" "}
          <a
            href="https://trijbsworld.nl"
            className="text-[var(--accent)] no-underline hover:underline"
          >
            trijbsworld.nl
          </a>{" "}
          · © 2026
        </p>
      </div>
    </footer>
  );
}
