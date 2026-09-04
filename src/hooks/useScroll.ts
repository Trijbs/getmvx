"use client";

import { useEffect, useRef } from "react";
import { getScrollState, subscribeScrollFrame, type ScrollState } from "@/lib/motion/scroll";

export function useScrollState(): ScrollState {
  return getScrollState();
}

export function useScrollFrame(callback: (state: ScrollState) => void): void {
  const callbackRef = useRef(callback);

  useEffect(() => {
    callbackRef.current = callback;
  });

  useEffect(
    () =>
      subscribeScrollFrame((state) => {
        callbackRef.current(state);
      }),
    [],
  );
}