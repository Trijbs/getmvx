"use client";

import { useState, useCallback } from "react";

interface CssEditorProps {
  value: string;
  onChange: (css: string) => void;
}

export function CssEditor({ value, onChange }: CssEditorProps) {
  const [localValue, setLocalValue] = useState(value);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setLocalValue(e.target.value);
      onChange(e.target.value);
    },
    [onChange]
  );

  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <label className="text-sm font-500">Custom CSS</label>
        <span className="rounded bg-[var(--accent-dim)] px-2 py-0.5 text-[10px] font-600 text-[var(--accent)]">
          PRO
        </span>
      </div>
      <textarea
        value={localValue}
        onChange={handleChange}
        rows={10}
        spellCheck={false}
        className="w-full rounded-lg border border-[var(--border2)] bg-[var(--bg)] px-4 py-3 font-[family-name:var(--font-dm-mono)] text-xs leading-relaxed text-[var(--text)] outline-none transition-[border-color] placeholder:text-[var(--muted)] focus:border-[var(--accent)]"
        placeholder={`/* Add custom CSS to your profile */\n\n.profile-card {\n  border-radius: 0;\n}\n\n.link-button {\n  text-transform: uppercase;\n}`}
      />
      <p className="mt-1.5 text-xs text-[var(--muted)]">
        CSS will be applied to your public profile page
      </p>
    </div>
  );
}
