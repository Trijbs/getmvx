"use client";

import type { Theme } from "../../../prisma/generated/prisma/client";

interface ThemePickerProps {
  themes: Theme[];
  selected: string;
  onSelect: (id: string) => void;
}

export function ThemePicker({ themes, selected, onSelect }: ThemePickerProps) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
      {themes.map((theme) => {
        const config = theme.config as Record<string, string>;
        const isSelected = selected === theme.id;

        return (
          <button
            key={theme.id}
            onClick={() => onSelect(theme.id)}
            className={`rounded-xl border p-3 text-left transition-all ${
              isSelected
                ? "border-[var(--accent)] bg-[var(--accent-dim)]"
                : "border-[var(--border)] bg-[var(--bg3)] hover:border-[var(--border2)]"
            }`}
          >
            {/* Theme preview */}
            <div
              className="mb-2 h-16 rounded-lg overflow-hidden"
              style={{ background: config.background || "#111" }}
            >
              <div className="flex h-full flex-col items-center justify-center gap-1 p-2">
                <div
                  className="h-3 w-8 rounded"
                  style={{ background: config.accentColor || "#9b7ef8" }}
                />
                <div
                  className="h-2 w-12 rounded opacity-50"
                  style={{ background: config.textColor || "#fff" }}
                />
                <div
                  className="h-2 w-10 rounded opacity-30"
                  style={{ background: config.textColor || "#fff" }}
                />
              </div>
            </div>
            <p className="text-xs font-500">{theme.name}</p>
            {isSelected && (
              <p className="mt-0.5 text-[10px] text-[var(--accent)]">Active</p>
            )}
          </button>
        );
      })}
    </div>
  );
}
