"use client";

import { useState } from "react";

const POPULAR_FONTS = [
  "Inter",
  "Roboto",
  "Open Sans",
  "Lato",
  "Poppins",
  "Montserrat",
  "Raleway",
  "Nunito",
  "DM Sans",
  "Work Sans",
  "Quicksand",
  "Outfit",
  "Plus Jakarta Sans",
  "Space Grotesk",
  "Manrope",
  "Barlow",
  "Barlow Condensed",
  "DM Mono",
  "JetBrains Mono",
  "Fira Code",
  "Playfair Display",
  "Merriweather",
  "Lora",
  "Source Serif 4",
  "Crimson Text",
];

interface FontPickerProps {
  selected: string;
  onSelect: (font: string) => void;
}

export function FontPicker({ selected, onSelect }: FontPickerProps) {
  const [showAll, setShowAll] = useState(false);
  const displayed = showAll ? POPULAR_FONTS : POPULAR_FONTS.slice(0, 12);

  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <label className="text-sm font-500">Font</label>
        <span className="rounded bg-[var(--accent-dim)] px-2 py-0.5 text-[10px] font-600 text-[var(--accent)]">
          PRO
        </span>
      </div>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
        {displayed.map((font) => (
          <button
            key={font}
            onClick={() => onSelect(font)}
            className={`rounded-lg border px-3 py-2.5 text-left text-sm transition-all ${
              selected === font
                ? "border-[var(--accent)] bg-[var(--accent-dim)]"
                : "border-[var(--border)] bg-[var(--bg3)] hover:border-[var(--border2)]"
            }`}
          >
            <span style={{ fontFamily: font }}>{font}</span>
          </button>
        ))}
      </div>
      {!showAll && POPULAR_FONTS.length > 12 && (
        <button
          onClick={() => setShowAll(true)}
          className="mt-2 text-xs text-[var(--accent)] hover:underline"
        >
          Show {POPULAR_FONTS.length - 12} more fonts
        </button>
      )}
    </div>
  );
}
