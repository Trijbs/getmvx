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

const favicon = "/brand/favicons/getmvx-favicon.jpg";

export const metadata: Metadata = {
  title: "MVX — Your identity, fully yours",
  description:
    "The most customizable link-in-bio platform. Free forever, or go Pro for full control. Built for creators, gamers, brands, and anyone who refuses to blend in.",
  metadataBase: new URL("https://getmvx.cc"),
  icons: {
    icon: favicon,
    shortcut: favicon,
    apple: favicon,
  },
  openGraph: {
    title: "MVX — Your identity, fully yours",
    description:
      "The most customizable link-in-bio platform. Free forever, or go Pro for full control.",
    url: "https://getmvx.cc",
    siteName: "MVX",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "MVX — Your identity, fully yours",
    description:
      "The most customizable link-in-bio platform. Free forever, or go Pro for full control.",
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
