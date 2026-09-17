import { describe, expect, test } from "vitest";
import {
  detectIcon,
  detectSource,
  extractLinks,
  type ImportedLink,
} from "./import-links";

describe("detectSource", () => {
  test("accepts linktr.ee profiles", () => {
    expect(detectSource("https://linktr.ee/coolperson")).toEqual({
      source: "linktree",
      url: "https://linktr.ee/coolperson",
    });
  });

  test("accepts guns.lol profiles", () => {
    expect(detectSource("https://guns.lol/artist")).toEqual({
      source: "guns.lol",
      url: "https://guns.lol/artist",
    });
  });

  test("rejects foreign and non-http hosts", () => {
    expect(detectSource("https://example.com/page")).toBeNull();
    expect(detectSource("ftp://linktr.ee/x")).toBeNull();
    expect(detectSource("not a url")).toBeNull();
  });
});

describe("detectIcon", () => {
  test("maps known platforms", () => {
    expect(detectIcon("youtube.com")).toBe("youtube");
    expect(detectIcon("open.spotify.com")).toBe("spotify");
    expect(detectIcon("discord.gg")).toBe("discord");
    expect(detectIcon("x.com")).toBe("x");
  });

  test("falls back to type or generic link", () => {
    expect(detectIcon("medium.com")).toBe("blog");
    expect(detectIcon("etsy.com")).toBe("shop");
    expect(detectIcon("behance.net")).toBe("portfolio");
    expect(detectIcon("weird-site.io")).toBe("link");
  });
});

describe("extractLinks", () => {
  test("extracts external anchors from a linktree page", () => {
    const html = `
      <html><body>
        <div class="tls-wrapper">
          <a href="https://youtube.com/@me">
            <span class="btn-title">YouTube</span>
          </a>
          <a href="https://instagram.com/me?utm_source=linktree&utm_medium=button">
            <span class="btn-title">Instagram</span>
          </a>
          <a href="https://linktr.ee/coolperson">
            <span class="btn-title">Internal</span>
          </a>
        </div>
      </body></html>`;

    const links = extractLinks(html, "linktree", "https://linktr.ee/coolperson");

    expect(links.map((l) => l.title)).toEqual(["YouTube", "Instagram"]);
    expect(links[0].icon).toBe("youtube");
    expect(links[1].url).toBe("https://instagram.com/me");
  });

  test("extracts card links from a guns.lol page", () => {
    const html = `
      <html><body><main>
        <a class="card" href="https://twitch.tv/streamer">
          <div class="card-title">Watch me live</div>
        </a>
        <a class="card" href="https://discord.gg/invite">
          <div class="card-title">Join the Discord</div>
        </a>
        <a href="https://guns.lol">guns.lol</a>
      </main></body></html>`;

    const links = extractLinks(html, "guns.lol", "https://guns.lol/artist");

    expect(links.map((l: ImportedLink) => l.title)).toEqual([
      "Watch me live",
      "Join the Discord",
    ]);
    expect(links.every((l) => l.url.startsWith("http"))).toBe(true);
    expect(links.some((l) => l.url.includes("guns.lol"))).toBe(false);
  });

  test("dedupes repeated URLs and drops empty titles", () => {
    const html = `
      <html><body>
        <a href="https://a.com/one">One</a>
        <a href="https://a.com/one">One again</a>
        <a href="https://a.com/two"><img src="/x.png" alt=""></a>
      </body></html>`;

    const links = extractLinks(html, "linktree", "https://linktr.ee/x");

    expect(links).toHaveLength(1);
    expect(links[0].title).toBe("One");
  });

  test("strips marketing parameters from imported urls", () => {
    const html = `
      <html><body>
        <a href="https://shop.example.com/item?utm_source=linktree&foo=1&fbclid=abc">Shop</a>
      </body></html>`;

    const links = extractLinks(html, "linktree", "https://linktr.ee/x");

    expect(links[0].url).toBe("https://shop.example.com/item?foo=1");
  });
});