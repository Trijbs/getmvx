interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  size: number;
  decay: number;
  alpha: number;
}

interface ConfettiOptions {
  particleCount?: number;
  spread?: number;
  colors?: string[];
}

const DEFAULT_COLORS = [
  "#ff6b6b",
  "#ffd93d",
  "#6bcb77",
  "#4d96ff",
  "#ff6ec7",
  "#a66cff",
  "#ff9f43",
];

function createCanvas(): HTMLCanvasElement {
  const canvas = document.createElement("canvas");
  canvas.style.cssText =
    "position:fixed;inset:0;width:100vw;height:100vh;pointer-events:none;z-index:99999";
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  document.body.appendChild(canvas);
  return canvas;
}

function createParticles(opts: ConfettiOptions): Particle[] {
  const {
    particleCount = 120,
    spread = 70,
    colors = DEFAULT_COLORS,
  } = opts;
  const particles: Particle[] = [];
  const baseAngle = -Math.PI / 2;
  const spreadRad = (spread * Math.PI) / 180;

  for (let i = 0; i < particleCount; i++) {
    const angle = baseAngle + (Math.random() - 0.5) * spreadRad;
    const velocity = 8 + Math.random() * 12;
    particles.push({
      x: window.innerWidth / 2 + (Math.random() - 0.5) * 200,
      y: window.innerHeight / 2,
      vx: Math.cos(angle) * velocity * (0.8 + Math.random() * 0.4),
      vy: Math.sin(angle) * velocity * (0.8 + Math.random() * 0.4),
      color: colors[Math.floor(Math.random() * colors.length)],
      size: 4 + Math.random() * 6,
      decay: 0.012 + Math.random() * 0.015,
      alpha: 1,
    });
  }
  return particles;
}

export function fireConfetti(opts?: ConfettiOptions): void {
  if (typeof document === "undefined") return;

  const canvas = createCanvas();
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    canvas.remove();
    return;
  }

  const particles = createParticles(opts ?? {});
  const gravity = 0.35;
  let frame: number;
  const context = ctx;

  function tick(): void {
    context.clearRect(0, 0, canvas.width, canvas.height);

    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i];
      p.vy += gravity;
      p.x += p.vx;
      p.y += p.vy;
      p.alpha -= p.decay;

      if (p.alpha <= 0) {
        particles.splice(i, 1);
        continue;
      }

      context.globalAlpha = p.alpha;
      context.fillStyle = p.color;
      context.beginPath();
      context.fillRect(p.x - p.size / 2, p.y - p.size / 2, p.size, p.size);
    }

    if (particles.length > 0) {
      frame = requestAnimationFrame(tick);
    } else {
      cancelAnimationFrame(frame);
      canvas.remove();
    }
  }

  frame = requestAnimationFrame(tick);
}
