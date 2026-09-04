export type ScrollDirection = 1 | -1 | 0;

export interface ScrollState {
  y: number;
  rawY: number;
  velocity: number;
  direction: ScrollDirection;
  viewportW: number;
  viewportH: number;
  documentH: number;
  smooth: boolean;
  paused: boolean;
}

function createInitialState(): ScrollState {
  return {
    y: 0,
    rawY: 0,
    velocity: 0,
    direction: 0,
    viewportW: 0,
    viewportH: 0,
    documentH: 0,
    smooth: true,
    paused: false,
  };
}

type LoopCallback = (state: ScrollState) => void;

const state: ScrollState = createInitialState();
const frameCallbacks = new Set<LoopCallback>();
const storeListeners = new Set<() => void>();

let rafId: number | null = null;
let lastTimestamp = 0;
let previousTargetY = 0;
let smoothVelocity = 0;

const VELOCITY_NORMALIZER = 0.035;

function emitStore() {
  storeListeners.forEach((listener) => listener());
}

function tick(timestamp: number) {
  const deltas = timestamp - lastTimestamp;
  lastTimestamp = timestamp;

  if (typeof window !== "undefined") {
    const targetY = window.scrollY;
    const viewportW = window.innerWidth;
    const viewportH = window.innerHeight;

    const rawVelocity = targetY - previousTargetY;
    if (targetY > previousTargetY + 1) {
      state.direction = 1;
    } else if (targetY < previousTargetY - 1) {
      state.direction = -1;
    }
    previousTargetY = targetY;

    if (!state.paused) {
      const alpha = state.smooth ? 1 - Math.exp(-16 / Math.max(deltas, 4)) : 1;
      state.y += (targetY - state.y) * alpha;
    } else {
      state.y = targetY;
    }
    state.rawY = targetY;
    state.viewportW = viewportW;
    state.viewportH = viewportH;
    state.documentH = document.documentElement.scrollHeight;
    smoothVelocity += (rawVelocity - smoothVelocity) * 0.12;
    state.velocity = Math.max(-1, Math.min(1, smoothVelocity / (viewportH * VELOCITY_NORMALIZER || 1)));
  }

  emitStore();
  frameCallbacks.forEach((callback) => callback(state));
}

function ensureRafRunning() {
  if (rafId === null && (frameCallbacks.size > 0 || storeListeners.size > 0)) {
    lastTimestamp = performance.now();
    previousTargetY = typeof window !== "undefined" ? window.scrollY : 0;
    rafId = requestAnimationFrame(tick);
  }
}

function cancelRafIfIdle() {
  if (rafId !== null && frameCallbacks.size === 0 && storeListeners.size === 0) {
    cancelAnimationFrame(rafId);
    rafId = null;
  }
}

export function subscribeScrollStore(listener: () => void): () => void {
  storeListeners.add(listener);
  ensureRafRunning();
  return () => {
    storeListeners.delete(listener);
    cancelRafIfIdle();
  };
}

export function getScrollState(): ScrollState {
  ensureRafRunning();
  return state;
}

export function subscribeScrollFrame(callback: LoopCallback): () => void {
  frameCallbacks.add(callback);
  ensureRafRunning();
  return () => {
    frameCallbacks.delete(callback);
    cancelRafIfIdle();
  };
}

export function pauseScrollState() {
  state.paused = true;
  state.smooth = false;
}

export function resumeScrollState(smooth = true) {
  state.smooth = smooth;
  state.paused = false;
}