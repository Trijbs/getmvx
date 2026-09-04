"use client";

import { useEffect, useRef, useState } from "react";

const socialIcons: Record<string, string> = {
  "🔗": "Link",
  "𝕏": "Twitter/X",
  "▶": "YouTube",
  "📸": "Instagram",
  "💬": "Discord",
  "🎵": "TikTok",
  "🎮": "Twitch",
  "🎧": "Spotify",
  "🐙": "GitHub",
  "💼": "LinkedIn",
  "🌐": "Website",
  "📧": "Email",
  "📝": "Blog",
  "🛒": "Shop",
  "💡": "Portfolio",
};

type LinkData = { title: string; url: string; icon?: string; groupId?: string };

interface AddLinkModalProps {
  /** Present when editing an existing link */
  initialData?: { id: string } & LinkData;
  /** Available section names derived from existing links */
  sections?: string[];
  onAdd?: (data: LinkData) => void;
  onEdit?: (id: string, data: LinkData) => void;
  onClose: () => void;
}

export function AddLinkModal({
  initialData,
  sections = [],
  onAdd,
  onEdit,
  onClose,
}: AddLinkModalProps) {
  const isEditing = Boolean(initialData);
  const [title, setTitle] = useState(initialData?.title ?? "");
  const [url, setUrl] = useState(initialData?.url ?? "");
  const [icon, setIcon] = useState(initialData?.icon ?? "🔗");
  const [groupId, setGroupId] = useState(initialData?.groupId ?? "");
  const [showIcons, setShowIcons] = useState(false);
  const [errors, setErrors] = useState<{ title?: string; url?: string }>({});
  const titleInputRef = useRef<HTMLInputElement>(null);

  // Focus the title input on open and handle Escape-to-close
  useEffect(() => {
    titleInputRef.current?.focus();
  }, []);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [onClose]);

  // Focus trap: keep Tab cycling within the dialog
  useEffect(() => {
    const dialog = document.getElementById("add-link-dialog");
    if (!dialog) return;
    const focusable =
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';
    const handleTab = (e: KeyboardEvent) => {
      if (e.key !== "Tab") return;
      const els = Array.from(
        dialog.querySelectorAll<HTMLElement>(focusable)
      ).filter((el) => !el.hasAttribute("disabled"));
      if (els.length === 0) return;
      const first = els[0];
      const last = els[els.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", handleTab);
    return () => document.removeEventListener("keydown", handleTab);
  }, []);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const newErrors: { title?: string; url?: string } = {};
    if (!title.trim()) newErrors.title = "Title is required";
    if (!url.trim()) newErrors.url = "URL is required";
    else {
      try {
        const parsed = new URL(url);
        if (!["http:", "https:"].includes(parsed.protocol)) {
          newErrors.url = "Must be a valid http/https URL";
        }
      } catch {
        newErrors.url = "Must be a valid URL";
      }
    }
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    const data: LinkData = { title, url, icon, groupId: groupId || undefined };

    if (isEditing && initialData && onEdit) {
      onEdit(initialData.id, data);
    } else if (onAdd) {
      onAdd(data);
    }
  }

  return (
    <div id="add-link-dialog" className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm" role="dialog" aria-modal="true" aria-labelledby="add-link-title">
      <div className="w-full max-w-[420px] rounded-[16px] border border-[var(--border2)] bg-[var(--bg2)] p-6">
        <h2 id="add-link-title" className="mb-4 font-[family-name:var(--font-barlow)] text-lg font-700">
          {isEditing ? "Edit link" : "Add link"}
        </h2>

        <form onSubmit={handleSubmit}>
          {/* Icon picker */}
          <div className="mb-4">
            <label className="mb-1.5 block text-sm font-500">Icon</label>
            <button
              type="button"
              onClick={() => setShowIcons(!showIcons)}
              className="flex items-center gap-2 rounded-lg border border-[var(--border2)] bg-[var(--bg3)] px-4 py-2.5 text-sm"
            >
              <span className="text-lg">{icon}</span>
              <span className="text-[var(--muted)]">
                {socialIcons[icon] || "Choose"}
              </span>
            </button>
            {showIcons && (
              <div className="mt-2 grid grid-cols-5 gap-2 rounded-lg border border-[var(--border2)] bg-[var(--bg3)] p-3">
                {Object.entries(socialIcons).map(([emoji, name]) => (
                  <button
                    key={emoji}
                    type="button"
                    onClick={() => {
                      setIcon(emoji);
                      setShowIcons(false);
                    }}
                    className={`flex flex-col items-center gap-1 rounded-lg p-2 text-xs transition-all ${
                      icon === emoji
                        ? "bg-[var(--accent-dim)] text-[var(--accent)]"
                        : "text-[var(--muted)] hover:bg-[var(--bg4)]"
                    }`}
                  >
                    <span className="text-lg">{emoji}</span>
                    <span className="truncate w-full text-center">{name}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Title */}
          <div className="mb-4">
            <label className="mb-1.5 block text-sm font-500">Title</label>
            <input
              ref={titleInputRef}
              type="text"
              value={title}
              onChange={(e) => { setTitle(e.target.value); if (errors.title) setErrors((p) => ({ ...p, title: undefined })); }}
              aria-invalid={!!errors.title}
              className={`w-full rounded-lg border bg-[var(--bg3)] px-4 py-3 text-sm text-[var(--text)] outline-none transition-[border-color] placeholder:text-[var(--muted)] focus:border-[var(--accent)] ${errors.title ? "border-red-500/60" : "border-[var(--border2)]"}`}
              placeholder="My Portfolio"
            />
            {errors.title && (
              <p className="mt-1 text-xs text-red-400" role="alert">{errors.title}</p>
            )}
          </div>

          {/* URL */}
          <div className="mb-4">
            <label className="mb-1.5 block text-sm font-500">URL</label>
            <input
              type="text"
              value={url}
              onChange={(e) => { setUrl(e.target.value); if (errors.url) setErrors((p) => ({ ...p, url: undefined })); }}
              aria-invalid={!!errors.url}
              className={`w-full rounded-lg border bg-[var(--bg3)] px-4 py-3 text-sm text-[var(--text)] outline-none transition-[border-color] placeholder:text-[var(--muted)] focus:border-[var(--accent)] ${errors.url ? "border-red-500/60" : "border-[var(--border2)]"}`}
              placeholder="https://example.com"
            />
            {errors.url && (
              <p className="mt-1 text-xs text-red-400" role="alert">{errors.url}</p>
            )}
          </div>

          {/* Section */}
          <div className="mb-6">
            <label className="mb-1.5 block text-sm font-500">
              Section <span className="text-[var(--muted)] font-400">(optional)</span>
            </label>
            <input
              type="text"
              value={groupId}
              onChange={(e) => setGroupId(e.target.value)}
              list="section-suggestions"
              className="w-full rounded-lg border border-[var(--border2)] bg-[var(--bg3)] px-4 py-3 text-sm text-[var(--text)] outline-none transition-[border-color] placeholder:text-[var(--muted)] focus:border-[var(--accent)]"
              placeholder="e.g. Social, Work…"
            />
            {sections.length > 0 && (
              <datalist id="section-suggestions">
                {sections.map((s) => (
                  <option key={s} value={s} />
                ))}
              </datalist>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-lg border border-[var(--border2)] px-4 py-2.5 text-sm font-500 text-[var(--muted)] transition-all hover:bg-[var(--bg3)]"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 rounded-lg bg-[var(--accent)] px-4 py-2.5 text-sm font-600 text-[var(--bg)] transition-all hover:bg-[var(--accent2)]"
            >
              {isEditing ? "Save changes" : "Add link"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
