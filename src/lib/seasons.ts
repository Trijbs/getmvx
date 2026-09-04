export interface Season {
  id: string;
  name: string;
  emoji: string;
  palette: {
    bg1: string;
    bg2: string;
    accent: string;
    text: string;
  };
  active: boolean;
}

function inRange(date: Date, month: number, startDay: number, endDay: number): boolean {
  const m = date.getMonth();
  const d = date.getDate();
  if (m !== month) return false;
  return d >= startDay && d <= endDay;
}

function aroundEaster(date: Date): boolean {
  // Easter Sunday 2026: April 5
  const easter = new Date(2026, 3, 5);
  const diff = Math.abs(date.getTime() - easter.getTime());
  return diff <= 7 * 86_400_000;
}

const SEASONS: Season[] = [
  {
    id: "christmas",
    name: "Happy Holidays",
    emoji: "\u{1F384}",
    palette: {
      bg1: "#1a0a0a",
      bg2: "#2d1215",
      accent: "#e63946",
      text: "#f1faee",
    },
    active: true,
  },
  {
    id: "newyear",
    name: "New Year",
    emoji: "\u{1F389}",
    palette: {
      bg1: "#0a0a1a",
      bg2: "#12122d",
      accent: "#ffd700",
      text: "#f0eff4",
    },
    active: true,
  },
  {
    id: "halloween",
    name: "Spooky Season",
    emoji: "\u{1F383}",
    palette: {
      bg1: "#1a0e00",
      bg2: "#2d1a05",
      accent: "#ff6b00",
      text: "#f0eff4",
    },
    active: true,
  },
  {
    id: "easter",
    name: "Spring",
    emoji: "\u{1F331}",
    palette: {
      bg1: "#0a1a0a",
      bg2: "#122d12",
      accent: "#7ec87e",
      text: "#f0eff4",
    },
    active: true,
  },
];

export function getCurrentSeason(date?: Date): Season | null {
  const d = date ?? new Date();

  if (aroundEaster(d)) {
    return SEASONS.find((s) => s.id === "easter") ?? null;
  }

  if (inRange(d, 11, 1, 27)) {
    return SEASONS.find((s) => s.id === "christmas") ?? null;
  }

  if (inRange(d, 11, 28, 31) || inRange(d, 0, 1, 3)) {
    return SEASONS.find((s) => s.id === "newyear") ?? null;
  }

  if (inRange(d, 9, 15, 31)) {
    return SEASONS.find((s) => s.id === "halloween") ?? null;
  }

  return null;
}
