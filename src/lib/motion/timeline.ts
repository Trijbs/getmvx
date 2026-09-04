"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect, useRef, type RefObject } from "react";
import { useIsDesktop } from "@/hooks/useIsDesktop";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

gsap.registerPlugin(ScrollTrigger);
ScrollTrigger.config({ ignoreMobileResize: true });

let refreshOnLoadInstalled = false;

function ensureRefreshOnWindowLoad() {
  if (typeof window === "undefined" || refreshOnLoadInstalled) return;
  refreshOnLoadInstalled = true;
  window.addEventListener("load", () => {
    requestAnimationFrame(() => ScrollTrigger.refresh());
  });
}

export interface ScrollTimelineContext {
  gsap: typeof gsap;
  tl: gsap.core.Timeline;
  q: (selector: string) => Element[];
  section: HTMLElement;
}

export interface ScrollTimelineOptions {
  start?: string | number | (() => number);
  end?: string | number | (() => number);
  scrub?: boolean | number;
  markers?: boolean;
  build: (ctx: ScrollTimelineContext) => void;
}

export function useScrollTimeline(
  sectionRef: RefObject<HTMLElement | null>,
  options: ScrollTimelineOptions,
): void {
  const reducedMotion = usePrefersReducedMotion();
  const isDesktopView = useIsDesktop();
  const optionsRef = useRef(options);

  useEffect(() => {
    optionsRef.current = options;
  }, [options]);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section || reducedMotion || !isDesktopView) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: section,
          start: optionsRef.current.start ?? "top top",
          end: optionsRef.current.end ?? "+=2500",
          scrub: optionsRef.current.scrub ?? true,
          markers: optionsRef.current.markers ?? false,
        },
      });

      optionsRef.current.build({
        gsap,
        tl,
        q: (selector) => Array.from(section.querySelectorAll(selector)),
        section,
      });
    }, section);

    ensureRefreshOnWindowLoad();
    const raf = requestAnimationFrame(() => ScrollTrigger.refresh());

    return () => {
      cancelAnimationFrame(raf);
      ctx.revert();
    };
  }, [reducedMotion, isDesktopView, sectionRef]);
}