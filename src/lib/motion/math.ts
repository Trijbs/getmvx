export function clamp(value: number, min = 0, max = 1): number {
  return Math.min(max, Math.max(min, value));
}

export function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

export function mapRange(
  value: number,
  fromMin: number,
  fromMax: number,
  toMin: number,
  toMax: number,
): number {
  const t = (value - fromMin) / (fromMax - fromMin || 1);
  return lerp(toMin, toMax, clamp(t, 0, 1));
}

export function mapRangeUnclamped(
  value: number,
  fromMin: number,
  fromMax: number,
  toMin: number,
  toMax: number,
): number {
  const t = (value - fromMin) / (fromMax - fromMin || 1);
  return lerp(toMin, toMax, t);
}

export function easeOutExpo(t: number): number {
  return t >= 1 ? 1 : 1 - Math.pow(2, -10 * t);
}

export function easeOutCubic(t: number): number {
  return 1 - Math.pow(1 - clamp(t), 3);
}

export function easeInOutCubic(t: number): number {
  const n = clamp(t);
  return n < 0.5 ? 4 * n * n * n : 1 - Math.pow(-2 * n + 2, 3) / 2;
}

export function damp(current: number, target: number, lambda: number, dt: number): number {
  return lerp(current, target, 1 - Math.exp(-lambda * dt));
}