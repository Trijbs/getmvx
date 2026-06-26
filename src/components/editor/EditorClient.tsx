"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { SortableLink } from "@/components/editor/SortableLink";
import { AddLinkModal } from "@/components/editor/AddLinkModal";
import { ThemePicker } from "@/components/editor/ThemePicker";
import { FontPicker } from "@/components/editor/FontPicker";
import { CssEditor } from "@/components/editor/CssEditor";
import { WidgetPicker } from "@/components/editor/WidgetPicker";
import { ProfilePreviewCard } from "@/components/editor/ProfilePreviewCard";
import type { Profile, Link, Theme } from "../../../prisma/generated/prisma/client";

type ProfileWithRelations = Profile & {
  links: Link[];
  theme: Theme | null;
};

interface EditorClientProps {
  profile: ProfileWithRelations;
  themes: Theme[];
}

interface Widget {
  id: string;
  type: "twitch" | "spotify" | "discord" | "youtube" | "steam";
  label: string;
  enabled: boolean;
  config?: Record<string, string>;
}

const LAYOUT_OPTIONS = [
  { value: "centered", label: "Centered", icon: "⊟" },
  { value: "grid", label: "Grid", icon: "⊞" },
  { value: "minimal", label: "Minimal", icon: "≡" },
] as const;

type LayoutType = (typeof LAYOUT_OPTIONS)[number]["value"];

// ── Section collapse helper ────────────────────────────────────────────────
function Section({
  title,
  defaultOpen = true,
  children,
}: {
  title: string;
  defaultOpen?: boolean;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <section className="mb-6 rounded-[14px] border border-[var(--border)] bg-[var(--bg2)] p-5">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between text-sm font-600"
      >
        <span>{title}</span>
        <span
          className="text-[var(--muted)] transition-transform duration-200"
          style={{ display: "inline-block", transform: open ? "rotate(180deg)" : "rotate(0deg)" }}
        >
          ▾
        </span>
      </button>
      {open && <div className="mt-4">{children}</div>}
    </section>
  );
}

export function EditorClient({ profile, themes }: EditorClientProps) {
  // ── Core state ─────────────────────────────────────────────────────────
  const [links, setLinks] = useState(profile.links);
  const [showAddLink, setShowAddLink] = useState(false);
  const [editingLink, setEditingLink] = useState<Link | null>(null);
  const [selectedTheme, setSelectedTheme] = useState(profile.themeId || "");
  const [bio, setBio] = useState(profile.bio || "");
  const [customCss, setCustomCss] = useState(profile.customCss || "");
  const [layoutType, setLayoutType] = useState<LayoutType>(
    (profile.layoutType as LayoutType) || "centered"
  );
  const [avatarUrl, setAvatarUrl] = useState(profile.avatarUrl || "");
  const [avatarUploading, setAvatarUploading] = useState(false);
  const [widgets, setWidgets] = useState<Widget[]>([]);

  // ── Derive initial font from theme config ────────────────────────────
  const currentTheme = themes.find((t) => t.id === selectedTheme);
  const currentThemeConfig = (currentTheme?.config as Record<string, string>) ?? {};
  const [selectedFont, setSelectedFont] = useState(
    currentThemeConfig.fontFamily || "Inter"
  );

  // ── Dirty / auto-save state ─────────────────────────────────────────
  const [isDirty, setIsDirty] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const bioTimerRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  // ── Load widgets on mount ────────────────────────────────────────────
  useEffect(() => {
    fetch("/api/widgets")
      .then((r) => r.json())
      .then((data: Widget[]) => setWidgets(data))
      .catch(() => {});
  }, []);

  // ── DnD sensors ─────────────────────────────────────────────────────
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  // ── Derive section names from existing links ─────────────────────────
  const sections = Array.from(
    new Set(links.map((l) => l.groupId).filter((g): g is string => Boolean(g)))
  );

  // ── Handlers ─────────────────────────────────────────────────────────

  function markDirty() {
    setIsDirty(true);
  }

  function handleBioChange(val: string) {
    setBio(val);
    markDirty();
    // Auto-save bio after 1.5 s of inactivity
    clearTimeout(bioTimerRef.current);
    bioTimerRef.current = setTimeout(() => {
      fetch("/api/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bio: val }),
      }).catch(() => {});
    }, 1500);
  }

  const handleDragEnd = useCallback((event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    setLinks((items) => {
      const oldIndex = items.findIndex((i) => i.id === active.id);
      const newIndex = items.findIndex((i) => i.id === over.id);
      return arrayMove(items, oldIndex, newIndex);
    });
    markDirty();
  }, []);

  async function handleAddLink(data: {
    title: string;
    url: string;
    icon?: string;
    groupId?: string;
  }) {
    try {
      const res = await fetch("/api/links", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          profileId: profile.id,
          position: links.length,
        }),
      });
      if (!res.ok) throw new Error("Failed to add link");
      const newLink = (await res.json()) as Link;
      setLinks((prev) => [...prev, newLink]);
      setShowAddLink(false);
      flash("Link added!");
    } catch {
      flash("Failed to add link");
    }
  }

  async function handleDeleteLink(id: string) {
    try {
      const res = await fetch(`/api/links/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      setLinks((prev) => prev.filter((l) => l.id !== id));
      flash("Link deleted");
    } catch {
      flash("Failed to delete link");
    }
  }

  async function handleToggleLink(id: string, isActive: boolean) {
    // Optimistic
    setLinks((prev) => prev.map((l) => (l.id === id ? { ...l, isActive } : l)));
    try {
      const res = await fetch(`/api/links/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive }),
      });
      if (!res.ok) throw new Error();
    } catch {
      // Revert on failure
      setLinks((prev) => prev.map((l) => (l.id === id ? { ...l, isActive: !isActive } : l)));
      flash("Failed to update link");
    }
  }

  function handleEditLink(id: string) {
    const link = links.find((l) => l.id === id);
    if (link) setEditingLink(link);
  }

  async function handleUpdateLink(
    id: string,
    data: { title: string; url: string; icon?: string; groupId?: string }
  ) {
    try {
      const res = await fetch(`/api/links/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error();
      const updated = (await res.json()) as Link;
      setLinks((prev) => prev.map((l) => (l.id === id ? updated : l)));
      setEditingLink(null);
      flash("Link updated!");
    } catch {
      flash("Failed to update link");
    }
  }

  async function handleWidgetsChange(newWidgets: Widget[]) {
    const added = newWidgets.filter(
      (w) => !widgets.some((e) => e.type === w.type)
    );
    const removed = widgets.filter(
      (w) => !newWidgets.some((nw) => nw.type === w.type)
    );
    setWidgets(newWidgets);

    for (const w of added) {
      try {
        const res = await fetch("/api/widgets", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            type: w.type,
            label: w.label,
            enabled: true,
            position: newWidgets.indexOf(w),
          }),
        });
        if (res.ok) {
          const created = (await res.json()) as Widget;
          setWidgets((prev) =>
            prev.map((pw) => (pw.type === w.type ? created : pw))
          );
        }
      } catch {
        setWidgets(widgets);
      }
    }
    for (const w of removed) {
      try {
        await fetch(`/api/widgets/${w.id}`, { method: "DELETE" });
      } catch {
        setWidgets(widgets);
      }
    }
  }

  async function handleAvatarUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setAvatarUploading(true);
    try {
      const ext = file.name.split(".").pop() ?? "jpg";
      // 1. Get presigned URL from our server
      const presignRes = await fetch("/api/profile/avatar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contentType: file.type, ext }),
      });
      if (!presignRes.ok) throw new Error("Could not get upload URL");
      const { uploadUrl, publicUrl } = (await presignRes.json()) as {
        uploadUrl: string;
        publicUrl: string;
      };

      // 2. PUT directly to R2
      const uploadRes = await fetch(uploadUrl, {
        method: "PUT",
        headers: { "Content-Type": file.type },
        body: file,
      });
      if (!uploadRes.ok) throw new Error("Upload failed");

      // 3. Save URL on profile — append cache-buster so the browser re-fetches
      const finalUrl = `${publicUrl}?v=${Date.now()}`;
      await fetch("/api/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ avatarUrl: finalUrl }),
      });

      setAvatarUrl(finalUrl);
      flash("Avatar updated!");
    } catch {
      flash("Avatar upload failed");
    } finally {
      setAvatarUploading(false);
    }
  }

  async function handleSave() {
    setSaving(true);
    setMessage("");
    try {
      await fetch("/api/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bio, customCss, layoutType, ...(selectedTheme && { themeId: selectedTheme }) }),
      });
      if (selectedTheme) {
        await fetch(`/api/themes/${selectedTheme}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ config: { fontFamily: selectedFont } }),
        });
      }
      await fetch("/api/links/reorder", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          links: links.map((l, i) => ({ id: l.id, position: i })),
        }),
      });
      setIsDirty(false);
      flash("Saved!");
    } catch {
      flash("Failed to save");
    } finally {
      setSaving(false);
    }
  }

  function flash(msg: string) {
    setMessage(msg);
    setTimeout(() => setMessage(""), 2500);
  }

  // ── Group links by section ────────────────────────────────────────────
  // Links without groupId are in the default (unnamed) group.
  const groupedLinks: { groupId: string | null; links: Link[] }[] = [];
  for (const link of links) {
    const gid = link.groupId ?? null;
    const existing = groupedLinks.find((g) => g.groupId === gid);
    if (existing) {
      existing.links.push(link);
    } else {
      groupedLinks.push({ groupId: gid, links: [link] });
    }
  }

  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_340px]">
      {/* ── Left — Editor controls ── */}
      <div>
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <h1 className="font-[family-name:var(--font-barlow)] text-2xl font-700">
            Editor
          </h1>
          <div className="flex items-center gap-3">
            {isDirty && !saving && (
              <span className="text-xs text-[var(--muted)]">Unsaved changes</span>
            )}
            {message && (
              <span className="text-sm text-[var(--green)]">{message}</span>
            )}
            <button
              onClick={handleSave}
              disabled={saving || !isDirty}
              className="rounded-lg bg-[var(--accent)] px-5 py-2 text-sm font-600 text-[var(--bg)] transition-all hover:bg-[var(--accent2)] disabled:opacity-40"
            >
              {saving ? "Saving…" : "Save changes"}
            </button>
          </div>
        </div>

        {/* ── Avatar ── */}
        <Section title="Avatar" defaultOpen>
          <div className="flex items-center gap-5">
            {/* Preview */}
            <div className="relative shrink-0">
              {avatarUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={avatarUrl}
                  alt="Avatar"
                  className="h-16 w-16 rounded-full object-cover"
                />
              ) : (
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[var(--accent-dim)] text-2xl font-700 text-[var(--accent)]">
                  {profile.username.charAt(0).toUpperCase()}
                </div>
              )}
            </div>
            <div className="flex-1">
              <label className="block">
                <span className="cursor-pointer inline-flex items-center gap-2 rounded-lg border border-[var(--border2)] px-4 py-2 text-sm font-500 text-[var(--muted)] transition-all hover:border-[var(--accent)] hover:text-[var(--accent)]">
                  {avatarUploading ? "Uploading…" : "Upload image"}
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp,image/gif"
                    className="hidden"
                    onChange={handleAvatarUpload}
                    disabled={avatarUploading}
                  />
                </span>
              </label>
              <p className="mt-2 text-xs text-[var(--muted)]">
                JPG, PNG, WebP or GIF · max 4 MB
              </p>
            </div>
          </div>
        </Section>

        {/* ── Bio ── */}
        <Section title="Bio" defaultOpen>
          <textarea
            value={bio}
            onChange={(e) => handleBioChange(e.target.value)}
            maxLength={160}
            rows={3}
            className="w-full resize-none rounded-lg border border-[var(--border2)] bg-[var(--bg3)] px-4 py-3 text-sm text-[var(--text)] outline-none transition-[border-color] placeholder:text-[var(--muted)] focus:border-[var(--accent)]"
            placeholder="Tell the world about yourself…"
          />
          <p className="mt-1.5 text-right text-xs text-[var(--muted)]">
            {bio.length}/160
          </p>
        </Section>

        {/* ── Widgets ── */}
        <Section title="Widgets" defaultOpen>
          <WidgetPicker widgets={widgets} onChange={handleWidgetsChange} />
        </Section>

        {/* ── Links ── */}
        <section className="mb-6 rounded-[14px] border border-[var(--border)] bg-[var(--bg2)] p-5">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-sm font-600">Links</h2>
            <button
              onClick={() => setShowAddLink(true)}
              className="rounded-lg bg-[var(--accent-dim)] px-3 py-1.5 text-xs font-600 text-[var(--accent)] transition-all hover:bg-[var(--accent)]/20"
            >
              + Add link
            </button>
          </div>

          {links.length === 0 ? (
            <div className="rounded-lg border border-dashed border-[var(--border2)] py-8 text-center">
              <p className="text-sm text-[var(--muted)]">No links yet</p>
              <p className="mt-1 text-xs text-[var(--muted)]">
                Add your first link to get started
              </p>
            </div>
          ) : (
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext
                items={links.map((l) => l.id)}
                strategy={verticalListSortingStrategy}
              >
                <div className="flex flex-col gap-2">
                  {groupedLinks.map(({ groupId: gid, links: gLinks }) => (
                    <div key={gid ?? "__default__"}>
                      {gid && (
                        <p className="mb-1.5 mt-3 text-xs font-600 uppercase tracking-widest text-[var(--muted)]">
                          {gid}
                        </p>
                      )}
                      {gLinks.map((link) => (
                        <SortableLink
                          key={link.id}
                          link={link}
                          onDelete={handleDeleteLink}
                          onToggle={handleToggleLink}
                          onEdit={handleEditLink}
                        />
                      ))}
                    </div>
                  ))}
                </div>
              </SortableContext>
            </DndContext>
          )}
        </section>

        {/* ── Theme + Font + Layout ── */}
        <Section title="Appearance" defaultOpen>
          {/* Layout selector */}
          <p className="mb-2 text-xs font-600 text-[var(--muted)] uppercase tracking-widest">Layout</p>
          <div className="mb-5 flex gap-2">
            {LAYOUT_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => { setLayoutType(opt.value); markDirty(); }}
                className={`flex flex-1 flex-col items-center gap-1.5 rounded-lg border py-3 text-xs font-500 transition-all ${
                  layoutType === opt.value
                    ? "border-[var(--accent)] bg-[var(--accent-dim)] text-[var(--accent)]"
                    : "border-[var(--border2)] text-[var(--muted)] hover:border-[var(--accent)]/40"
                }`}
              >
                <span className="text-lg">{opt.icon}</span>
                {opt.label}
              </button>
            ))}
          </div>

          {/* Theme picker */}
          <p className="mb-2 text-xs font-600 text-[var(--muted)] uppercase tracking-widest">Theme</p>
          <ThemePicker
            themes={themes}
            selected={selectedTheme}
            onSelect={(id) => {
              setSelectedTheme(id);
              const t = themes.find((th) => th.id === id);
              const cfg = (t?.config as Record<string, string>) ?? {};
              setSelectedFont(cfg.fontFamily || "Inter");
              markDirty();
            }}
          />

          {/* Font picker */}
          <div className="mt-5 border-t border-[var(--border)] pt-5">
            <FontPicker
              selected={selectedFont}
              onSelect={(f) => { setSelectedFont(f); markDirty(); }}
            />
          </div>
        </Section>

        {/* ── Advanced — Custom CSS ── */}
        <Section title="Advanced (CSS)" defaultOpen={false}>
          <CssEditor value={customCss} onChange={(v) => { setCustomCss(v); markDirty(); }} />
        </Section>
      </div>

      {/* ── Right — Live preview ── */}
      <div className="sticky top-8 self-start hidden lg:block">
        <p className="mb-3 text-xs font-500 text-[var(--muted)]">Live preview</p>
        <ProfilePreviewCard
          username={profile.username}
          bio={bio}
          links={links}
          themeId={selectedTheme}
          themes={themes}
          fontFamily={selectedFont}
        />
      </div>

      {/* ── Modals ── */}
      {showAddLink && (
        <AddLinkModal
          sections={sections}
          onAdd={handleAddLink}
          onClose={() => setShowAddLink(false)}
        />
      )}
      {editingLink && (
        <AddLinkModal
          initialData={{
            id: editingLink.id,
            title: editingLink.title,
            url: editingLink.url,
            icon: editingLink.icon ?? undefined,
            groupId: editingLink.groupId ?? undefined,
          }}
          sections={sections}
          onEdit={handleUpdateLink}
          onClose={() => setEditingLink(null)}
        />
      )}
    </div>
  );
}
