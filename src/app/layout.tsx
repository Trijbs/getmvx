import type { Metadata } from "next";
import { Barlow_Condensed, Inter, DM_Mono } from "next/font/google";
import "./globals.css";

const barlow = Barlow_Condensed({
  variable: "--font-barlow",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  display: "swap",
});

const dmMono = DM_Mono({
  variable: "--font-dm-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "MVX — Your identity, fully yours",
  description:
    "The most customizable link-in-bio platform. Free forever, or go Pro for full control. Built for creators, gamers, brands, and anyone who refuses to blend in.",
  metadataBase: new URL("https://getmvx.cc"),
  manifest: "/site.webmanifest",
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon-32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-16.png", sizes: "16x16", type: "image/png" },
    ],
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  openGraph: {
    title: "MVX — Your identity, fully yours",
    description:
      "The most customizable link-in-bio platform. Free forever, or go Pro for full control.",
    url: "https://getmvx.cc",
    siteName: "MVX",
    type: "website",
    images: [
      {
        url: "/brand/social/og-default.png",
        width: 1200,
        height: 630,
        alt: "MVX — Your identity, fully yours",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "MVX — Your identity, fully yours",
    description:
      "The most customizable link-in-bio platform. Free forever, or go Pro for full control.",
    images: ["/brand/social/og-default.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${barlow.variable} ${inter.variable} ${dmMono.variable}`}
    >
      <body>{children}</body>
    </html>
  );
}
