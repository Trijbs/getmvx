import { Fragment, type ReactNode } from "react";

// Safe bio markdown subset. Renders to React elements — no HTML passthrough,
// no dangerouslySetInnerHTML — so it cannot introduce XSS. Supported:
//   **bold**  *italic*  [text](https://url)  - list items  line breaks
// Unknown markup is rendered literally as text.

const SAFE_SCHEMES = ["http:", "https:", "mailto:"];

function safeHref(raw: string): string | undefined {
  let cleaned = raw.trim();
  // Allow protocol-relative //example.com too
  if (cleaned.startsWith("//")) cleaned = `https:${cleaned}`;
  try {
    const u = new URL(cleaned);
    return SAFE_SCHEMES.includes(u.protocol) ? cleaned : undefined;
  } catch {
    return undefined;
  }
}

function parseInline(text: string): ReactNode[] {
  // Inline syntax: [text](url), **bold**, *italic* (order matters).
  const out: ReactNode[] = [];
  const re = /(\*\*([^*]+)\*\*)|(\*([^*]+)\*)|\[([^\]]+)\]\(([^)\s]+)\)/g;
  let last = 0;
  let m: RegExpExecArray | null;
  let key = 0;
  while ((m = re.exec(text)) !== null) {
    if (m.index > last) {
      out.push(text.slice(last, m.index));
    }
    if (m[1] != null) {
      out.push(<strong key={key++}>{m[2]}</strong>);
    } else if (m[3] != null) {
      out.push(<em key={key++}>{m[4]}</em>);
    } else {
      const href = safeHref(m[6]);
      if (href) {
        out.push(
          <a key={key++} href={href} target="_blank" rel="noopener noreferrer">
            {m[5]}
          </a>
        );
      } else {
        out.push(m[5]);
      }
    }
    last = m.index + m[0].length;
  }
  if (last < text.length) out.push(text.slice(last));
  return out;
}

/**
 * Render a bio string (safe subset) to React nodes.
 * Lines starting with "- " become list items; other lines wrap in <br/>.
 */
export function renderBioMarkdown(bio: string): ReactNode {
  const lines = bio.split(/\r?\n/);
  const blocks: ReactNode[] = [];
  let i = 0;
  while (i < lines.length) {
    const line = lines[i].trimEnd();
    if (/^-\s+/.test(line)) {
      const items: ReactNode[] = [];
      while (i < lines.length && /^-\s+/.test(lines[i])) {
        items.push(
          <li key={i} className="mvx-bio-item flex gap-2">
            <span aria-hidden>•</span>
            <span>{parseInline(lines[i].replace(/^-\s+/, ""))}</span>
          </li>
        );
        i++;
      }
      blocks.push(
        <ul key={`ul${i}`} className="mvx-bio-list mb-1 flex flex-col gap-0.5">
          {items}
        </ul>
      );
    } else {
      const buf: ReactNode[] = [];
      const startIdx = i;
      while (i < lines.length && !/^-\s+/.test(lines[i])) {
        buf.push(parseInline(lines[i]));
        i++;
        if (i < lines.length && !/^-\s+/.test(lines[i])) buf.push(<br key={`br${i}`} />);
      }
      if (buf.length) blocks.push(<Fragment key={`p${startIdx}`}>{buf}</Fragment>);
    }
  }
  return <>{blocks}</>;
}
