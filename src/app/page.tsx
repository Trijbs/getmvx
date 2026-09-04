import dynamic from "next/dynamic";
import { Nav } from "@/components/landing/Nav";
import { Hero } from "@/components/landing/Hero";
import { StatsBar } from "@/components/landing/StatsBar";
import { BrandTransition } from "@/components/landing/BrandTransition";
import { CollectionStory } from "@/components/landing/CollectionStory";
import { FeatureStory } from "@/components/landing/FeatureStory";
import { Lookbook } from "@/components/landing/Lookbook";
import { Pricing } from "@/components/landing/Pricing";
import { Waitlist } from "@/components/landing/Waitlist";
import { Footer } from "@/components/landing/Footer";
import { ScrollProvider } from "@/components/motion/ScrollProvider";
import { ScrollProgress } from "@/components/motion/ScrollProgress";
import { ScrollReveal } from "@/components/motion/ScrollReveal";

const Customize = dynamic(
  () => import("@/components/landing/Customize").then((m) => m.Customize),
  {
    loading: () => (
      <div className="mx-auto grid min-h-[480px] max-w-[1280px] grid-cols-1 items-center gap-[60px] px-[5%] lg:grid-cols-2">
        <div className="hidden h-96 animate-pulse rounded-2xl bg-[var(--surface)] lg:block" />
      </div>
    ),
  }
);

export default function Home() {
  return (
    <ScrollProvider>
      <div className="glow-line fixed left-0 right-0 top-0 z-[200] h-px opacity-60 bg-[linear-gradient(90deg,transparent_0%,var(--accent)_40%,var(--accent2)_60%,transparent_100%)]" />
      <div className="grain" aria-hidden="true" />
      <Nav />
      <ScrollProgress />
      <main id="main-content">
        <Hero />
        <StatsBar />
        <BrandTransition />
        <CollectionStory />
        <FeatureStory />
        <Lookbook />
        <Customize />
        <ScrollReveal>
          <Pricing />
        </ScrollReveal>
        <Waitlist />
      </main>
      <Footer />
    </ScrollProvider>
  );
}