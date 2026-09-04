"use client";

import { useState, useCallback } from "react";
import { Lock } from "@/components/ui/Lock";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import { CSS_TEMPLATES, cssTemplateById } from "@/lib/css-templates";

interface CssEditorProps {
  value: string;
  onChange: (css: string) => void;
  isPro: boolean;
  /** Called when a Free user tries to activate a Pro control (routes to upsell). */
  onLocked?: () => void;
}

export function CssEditor({ value, onChange, isPro, onLocked }: CssEditorProps) {
  const [pendingTemplateId, setPendingTemplateId] = useState<string | null>(null);

  const handleTemplateClick = useCallback(
    (id: string) => {
      if (isPro) {
        setPendingTemplateId(id);
      } else {
        // Free tier: live-preview the template in the iframe but gate applying.
        const t = cssTemplateById(id);
        if (t) onChange(t.css);
        onLocked?.();
      }
    },
    [isPro, onChange, onLocked]
  );

  const confirmApply = useCallback(() => {
    const t = pendingTemplateId ? cssTemplateById(pendingTemplateId) : undefined;
    if (t) onChange(t.css);
    setPendingTemplateId(null);
  }, [pendingTemplateId, onChange]);

  return (
    <div className="space-y-5">
      {/* Template gallery */}
      <div>
        <div className="mb-2 flex items-center justify-between">
          <label className="text-sm font-500">Styling templates</label>
          <span className="rounded bg-[var(--accent-dim)] px-2 py-0.5 text-[10px] font-600 text-[var(--accent)]">
            PRO
          </span>
        </div>
        <div className="grid grid-cols-2 gap-2">
          {CSS_TEMPLATES.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => handleTemplateClick(t.id)}
              className="group rounded-xl border border-[var(--border2)] p-3 text-left transition-all hover:border-[var(--accent)] hover:bg-[var(--bg3)]"
              title={t.description}
            >
              <div className="mb-2 flex items-center gap-2">
                <span
                  className="h-6 w-6 rounded-full border border-white/10"
                  style={{ background: t.accent }}
                />
                <span className="truncate text-sm font-600">{t.name}</span>
              </div>
              <p className="line-clamp-2 text-[11px] leading-snug text-[var(--muted)]">
                {t.description}
              </p>
            </button>
          ))}
        </div>
        {!isPro && (
          <p className="mt-2 text-[11px] text-[var(--muted)]">
            Pro members can apply and keep a template. You can preview any of
            these live in the panel — apply to upgrade.
          </p>
        )}
      </div>

      {/* Custom CSS textarea (PRO) */}
      <Lock
        locked={!isPro}
        feature="custom-css"
        onTry={onLocked}
      >
        <div>
          <div className="mb-2 flex items-center justify-between">
            <label className="text-sm font-500">Custom CSS</label>
            <span className="rounded bg-[var(--accent-dim)] px-2 py-0.5 text-[10px] font-600 text-[var(--accent)]">
              PRO
            </span>
          </div>
          <textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            rows={10}
            spellCheck={false}
            className="w-full rounded-lg border border-[var(--border2)] bg-[var(--bg)] px-4 py-3 font-[family-name:var(--font-dm-mono)] text-xs leading-relaxed text-[var(--text)] outline-none transition-[border-color] placeholder:text-[var(--muted)] focus:border-[var(--accent)]"
            placeholder={`/* Add custom CSS to your profile (targets the data-mvx-* hooks) */\n\n[data-mvx-link] {\n  border-radius: 999px;\n}`}
          />
          <p className="mt-1.5 text-xs text-[var(--muted)]">
            CSS applies to your public profile (target the{" "}
            <code>data-mvx-*</code> hooks for stable styling).
          </p>
        </div>
      </Lock>

      <ConfirmDialog
        open={pendingTemplateId !== null}
        title="Apply template?"
        message="This will replace your current custom CSS with the selected template. You can continue editing after."
        confirmLabel="Replace CSS"
        onConfirm={confirmApply}
        onCancel={() => setPendingTemplateId(null)}
      />
    </div>
  );
}
