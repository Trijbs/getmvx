export const EGG_DEV = "dev";
export const EGG_SEASONAL = "seasonal";
export const EGG_LOGO = "logo";

export const ALL_EGGS: string[] = [EGG_DEV, EGG_SEASONAL, EGG_LOGO];

export function allEggsFound(eggs: string[]): boolean {
  return ALL_EGGS.every((egg) => eggs.includes(egg));
}

export function isValidEgg(egg: string): boolean {
  return ALL_EGGS.includes(egg);
}

const STORAGE_KEY = "mvx-eggs";

export function getFoundEggs(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((e): e is string => typeof e === "string");
  } catch {
    return [];
  }
}

export function recordEgg(eggId: string): string[] {
  const eggs = getFoundEggs();
  if (eggs.includes(eggId)) return eggs;
  const updated = [...eggs, eggId];
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch {
    // Storage quota or private browsing — ignore.
  }
  return updated;
}
