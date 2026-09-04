"use client";

import { useCallback, useRef, useState } from "react";
import { Logo } from "@/components/brand/Logo";

interface RainbowLogoProps {
  onEggTrigger?: (eggId: string) => void;
  size?: number;
  className?: string;
}

const RAINBOW_DURATION_MS = 1200;
const HUE_STEP_MS = 40;

export function RainbowLogo({ onEggTrigger, size = 48, className = "" }: RainbowLogoProps) {
  const [hue, setHue] = useState<number | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const handleClick = useCallback(() => {
    if (timerRef.current !== null) return;

    onEggTrigger?.("logo");
    let current = 0;

    timerRef.current = setInterval(() => {
      current = (current + 15) % 360;
      setHue(current);
    }, HUE_STEP_MS);

    setTimeout(() => {
      if (timerRef.current !== null) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      setHue(null);
    }, RAINBOW_DURATION_MS);
  }, [onEggTrigger]);

  const filterStyle: React.CSSProperties | undefined =
    hue !== null ? { filter: `hue-rotate(${hue}deg) brightness(1.15)` } : undefined;

  return (
    <button
      type="button"
      onClick={handleClick}
      className={`inline-flex cursor-pointer items-center justify-center transition-transform duration-200 hover:scale-105 active:scale-95 ${className}`}
      aria-label="MVX Logo"
      style={filterStyle}
    >
      <Logo size={size} variant="primary" />
    </button>
  );
}
