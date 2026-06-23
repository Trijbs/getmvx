import { Nav } from "@/components/landing/Nav";
import { Hero } from "@/components/landing/Hero";
import { StatsBar } from "@/components/landing/StatsBar";
import { Features } from "@/components/landing/Features";
import { Customize } from "@/components/landing/Customize";
import { Pricing } from "@/components/landing/Pricing";
import { Waitlist } from "@/components/landing/Waitlist";
import { Footer } from "@/components/landing/Footer";

export default function Home() {
  return (
    <>
      <div className="glow-line fixed left-0 right-0 top-0 z-[200] h-px opacity-60 bg-[linear-gradient(90deg,transparent_0%,var(--accent)_40%,var(--accent2)_60%,transparent_100%)]" />
      <Nav />
      <main>
        <Hero />
        <StatsBar />
        <Features />
        <Customize />
        <Pricing />
        <Waitlist />
      </main>
      <Footer />
    </>
  );
}
