import type { Metadata } from "next";
import type { CSSProperties } from "react";
import {
  Logo,
  LogoMark,
  HeroMark,
  Icon,
  BrandSymbol,
  iconCategories,
  symbolNames,
} from "@/components/brand";

export const metadata: Metadata = {
  title: "Brand — MVX",
  description: "The MVX brand system: logos, icons, symbols, color, and type.",
};

type LogoVariant =
  | "primary"
  | "monochrome-light"
  | "monochrome-dark"
  | "simplified"
  | "monogram"
  | "portal"
  | "abstract";

const logoVariants: LogoVariant[] = [
  "primary",
  "monochrome-dark",
  "monochrome-light",
  "simplified",
  "monogram",
  "portal",
  "abstract",
];

const palette: { name: string; token: string; hex: string }[] = [
  { name: "Background", token: "--bg", hex: "#0c0c0e" },
  { name: "Surface", token: "--bg2", hex: "#131316" },
  { name: "Text", token: "--text", hex: "#f0eff4" },
  { name: "Secondary", token: "--text-secondary", hex: "#b8b7c0" },
  { name: "Muted", token: "--muted", hex: "#8a8998" },
  { name: "Accent", token: "--accent", hex: "#c9a96e" },
  { name: "Accent 2", token: "--accent2", hex: "#e8c98a" },
  { name: "Success", token: "--success", hex: "#4ecb8d" },
  { name: "Warning", token: "--warn", hex: "#e8a94e" },
  { name: "Danger", token: "--danger", hex: "#e85555" },
];

const sectionStyle: CSSProperties = {
  maxWidth: 1080,
  margin: "0 auto",
  padding: "0 24px 64px",
};

const cardStyle: CSSProperties = {
  background: "var(--bg2)",
  border: "1px solid var(--border)",
  borderRadius: "var(--radius)",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  gap: 12,
  padding: 24,
  minHeight: 140,
};

const labelStyle: CSSProperties = {
  fontFamily: "var(--font-mono)",
  fontSize: 11,
  color: "var(--muted)",
  letterSpacing: 0.4,
};

const headingStyle: CSSProperties = {
  fontFamily: "var(--font-display)",
  fontSize: 13,
  fontWeight: 600,
  letterSpacing: 2,
  textTransform: "uppercase",
  color: "var(--muted)",
  margin: "0 0 20px",
};

export default function BrandPage() {
  return (
    <main style={{ background: "var(--bg)", color: "var(--text)", minHeight: "100vh", paddingTop: 80 }}>
      <header style={{ ...sectionStyle, textAlign: "center", paddingBottom: 72 }}>
        <div style={{ display: "flex", justifyContent: "center", marginBottom: 28 }}>
          <HeroMark size={140} />
        </div>
        <h1 style={{ fontFamily: "var(--font-display)", fontSize: 56, fontWeight: 800, letterSpacing: -1, margin: "0 0 8px" }}>
          MVX Brand System
        </h1>
        <p style={{ fontFamily: "var(--font-body)", fontSize: 18, color: "var(--text-secondary)", margin: 0 }}>
          The Gateway to Building. Your identity, fully yours.
        </p>
      </header>

      <section style={sectionStyle}>
        <h2 style={headingStyle}>Logo</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: 16 }}>
          {logoVariants.map((variant) => (
            <div key={variant} style={cardStyle}>
              <Logo size={84} variant={variant} />
              <span style={labelStyle}>{variant}</span>
            </div>
          ))}
          <div style={cardStyle}>
            <span style={{ color: "var(--text)", display: "inline-flex" }}>
              <LogoMark size={48} />
            </span>
            <span style={labelStyle}>logomark</span>
          </div>
        </div>
      </section>

      <section style={sectionStyle}>
        <h2 style={headingStyle}>Wordmark</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 16 }}>
          <div style={{ ...cardStyle, flexDirection: "row", justifyContent: "flex-start", gap: 20, minHeight: 120 }}>
            <Logo size={56} variant="primary" />
            <span style={{ fontFamily: "var(--font-display)", fontSize: 44, fontWeight: 700 }}>
              getmv<span style={{ color: "var(--accent)" }}>x</span>
            </span>
          </div>
          <div style={cardStyle}>
            <span style={{ fontFamily: "var(--font-body)", fontWeight: 600, fontSize: 40, letterSpacing: 1 }}>
              mv<span style={{ color: "var(--accent)" }}>x</span>
            </span>
            <span style={labelStyle}>compact / favicon</span>
          </div>
        </div>
      </section>

      <section style={sectionStyle}>
        <h2 style={headingStyle}>Color</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))", gap: 12 }}>
          {palette.map((c) => (
            <div key={c.token} style={{ border: "1px solid var(--border)", borderRadius: "var(--radius)", overflow: "hidden" }}>
              <div style={{ background: c.hex, height: 72 }} />
              <div style={{ padding: "10px 12px" }}>
                <div style={{ fontFamily: "var(--font-body)", fontSize: 13, fontWeight: 500 }}>{c.name}</div>
                <div style={labelStyle}>{c.hex}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section style={sectionStyle}>
        <h2 style={headingStyle}>Typography</h2>
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <div style={{ borderBottom: "1px solid var(--border)", paddingBottom: 20 }}>
            <span style={labelStyle}>Barlow Condensed · Display</span>
            <p style={{ fontFamily: "var(--font-display)", fontSize: 48, fontWeight: 700, margin: "8px 0 0" }}>
              Build without limits
            </p>
          </div>
          <div style={{ borderBottom: "1px solid var(--border)", paddingBottom: 20 }}>
            <span style={labelStyle}>Inter · Body</span>
            <p style={{ fontFamily: "var(--font-body)", fontSize: 18, color: "var(--text-secondary)", margin: "8px 0 0" }}>
              The most customizable link-in-bio platform, built for creators who refuse to blend in.
            </p>
          </div>
          <div>
            <span style={labelStyle}>DM Mono · Labels & code</span>
            <p style={{ fontFamily: "var(--font-mono)", fontSize: 15, color: "var(--accent)", margin: "8px 0 0" }}>
              getmvx.cc/yourname
            </p>
          </div>
        </div>
      </section>

      {Object.entries(iconCategories).map(([category, names]) => (
        <section key={category} style={sectionStyle}>
          <h2 style={headingStyle}>Icons · {category}</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(120px, 1fr))", gap: 12 }}>
            {names.map((name) => (
              <div key={name} style={{ ...cardStyle, minHeight: 110, gap: 14, color: "var(--text)" }}>
                <div style={{ display: "flex", gap: 16, color: "var(--accent)" }}>
                  <Icon name={name} size={26} variant="stroke" />
                  <Icon name={name} size={26} variant="filled" />
                </div>
                <span style={labelStyle}>{name}</span>
              </div>
            ))}
          </div>
        </section>
      ))}

      <section style={sectionStyle}>
        <h2 style={headingStyle}>Symbols</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))", gap: 12 }}>
          {symbolNames.map((name) => (
            <div key={name} style={{ ...cardStyle, color: "var(--accent)", minHeight: 150 }}>
              <BrandSymbol name={name} size={88} />
              <span style={labelStyle}>{name}</span>
            </div>
          ))}
        </div>
      </section>

      <footer style={{ ...sectionStyle, textAlign: "center", color: "var(--muted)", fontFamily: "var(--font-mono)", fontSize: 12 }}>
        MVX · getmvx.cc · The Gateway to Building
      </footer>
    </main>
  );
}
