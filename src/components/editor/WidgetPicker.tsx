"use client";

interface Widget {
  id: string;
  type: "twitch" | "spotify" | "discord" | "youtube" | "steam";
  label: string;
  enabled: boolean;
  config?: Record<string, string>;
}

interface WidgetPickerProps {
  widgets: Widget[];
  onChange: (widgets: Widget[]) => void;
}

const widgetOptions = [
  {
    type: "twitch" as const,
    icon: "🎮",
    label: "Twitch",
    desc: "Show live status",
  },
  {
    type: "spotify" as const,
    icon: "🎵",
    label: "Spotify",
    desc: "Now playing",
  },
  {
    type: "discord" as const,
    icon: "💬",
    label: "Discord",
    desc: "Member count",
  },
  {
    type: "youtube" as const,
    icon: "▶",
    label: "YouTube",
    desc: "Latest video",
  },
  {
    type: "steam" as const,
    icon: "🎮",
    label: "Steam",
    desc: "Currently playing",
  },
];

export function WidgetPicker({ widgets, onChange }: WidgetPickerProps) {
  function toggleWidget(type: string) {
    const existing = widgets.find((w) => w.type === type);
    if (existing) {
      onChange(widgets.filter((w) => w.type !== type));
    } else {
      onChange([
        ...widgets,
        {
          id: crypto.randomUUID(),
          type: type as Widget["type"],
          label: widgetOptions.find((w) => w.type === type)?.label || type,
          enabled: true,
        },
      ]);
    }
  }

  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <label className="text-sm font-500">Platform widgets</label>
        <span className="rounded bg-[var(--accent-dim)] px-2 py-0.5 text-[10px] font-600 text-[var(--accent)]">
          PRO
        </span>
      </div>
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
        {widgetOptions.map((opt) => {
          const isEnabled = widgets.some((w) => w.type === opt.type);
          return (
            <button
              key={opt.type}
              onClick={() => toggleWidget(opt.type)}
              className={`flex items-center gap-3 rounded-lg border px-4 py-3 text-left transition-all ${
                isEnabled
                  ? "border-[var(--accent)] bg-[var(--accent-dim)]"
                  : "border-[var(--border)] bg-[var(--bg3)] hover:border-[var(--border2)]"
              }`}
            >
              <span className="text-xl">{opt.icon}</span>
              <div>
                <p className="text-sm font-500">{opt.label}</p>
                <p className="text-xs text-[var(--muted)]">{opt.desc}</p>
              </div>
              {isEnabled && (
                <span className="ml-auto text-[var(--accent)]">✓</span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
