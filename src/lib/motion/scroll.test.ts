import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { subscribeScrollFrame } from "./scroll";

type FrameCallback = (timestamp: number) => void;

const frames: FrameCallback[] = [];
let frameId = 0;

function advanceFrames(count = 1) {
  for (let i = 0; i < count; i++) {
    const cb = frames.shift();
    if (cb) cb(performance.now());
  }
}

describe("scroll driver", () => {
  beforeEach(() => {
    frames.length = 0;
    frameId = 0;
    vi.stubGlobal("requestAnimationFrame", (cb: FrameCallback) => {
      frames.push(cb);
      return ++frameId;
    });
    vi.stubGlobal("cancelAnimationFrame", vi.fn());
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("keeps firing callbacks on every animation frame", () => {
    const seen: number[] = [];
    const unsubscribe = subscribeScrollFrame(() => {
      seen.push(seen.length);
    });

    expect(frames.length).toBe(1);
    advanceFrames(3);

    expect(seen.length).toBe(3);

    unsubscribe();
    advanceFrames(1);
    expect(seen.length).toBe(3);
  });
});