"use client";

import { useState, useCallback } from "react";
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

export function EditorClient({ profile, themes }: EditorClientProps) {
  const [links, setLinks] = useState(profile.links);
  const [showAddLink, setShowAddLink] = useState(false);
  const [selectedTheme, setSelectedTheme] = useState(profile.themeId || "");
  const [bio, setBio] = useState(profile.bio || "");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event;
      if (!over || active.id === over.id) return;

      setLinks((items) => {
        const oldIndex = items.findIndex((i) => i.id === active.id);
        const newIndex = items.findIndex((i) => i.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    },
    []
  );

  async function handleAddLink(data: { title: string; url: string; icon?: string }) {
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
      setMessage("Link added!");
      setTimeout(() => setMessage(""), 2000);
    } catch {
      setMessage("Failed to add link");
      setTimeout(() => setMessage(""), 2000);
    }
  }

  async function handleDeleteLink(id: string) {
    try {
      const res = await fetch(`/api/links/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete");
      setLinks((prev) => prev.filter((l) => l.id !== id));
      setMessage("Link deleted");
      setTimeout(() => setMessage(""), 2000);
    } catch {
      setMessage("Failed to delete link");
      setTimeout(() => setMessage(""), 2000);
    }
  }

  async function handleToggleLink(id: string, isActive: boolean) {
    try {
      const res = await fetch(`/api/links/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive }),
      });
      if (!res.ok) throw new Error("Failed to update");
      setLinks((prev) =>
        prev.map((l) => (l.id === id ? { ...l, isActive } : l))
      );
    } catch {
      setMessage("Failed to update link");
      setTimeout(() => setMessage(""), 2000);
    }
  }

  async function handleSave() {
    setSaving(true);
    setMessage("");

    try {
      // Save bio
      await fetch("/api/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bio }),
      });

      // Save theme
      if (selectedTheme) {
        await fetch("/api/profile", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ themeId: selectedTheme }),
        });
      }

      // Save link order
      await fetch("/api/links/reorder", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          links: links.map((l, i) => ({ id: l.id, position: i })),
        }),
      });

      setMessage("Saved!");
      setTimeout(() => setMessage(""), 2000);
    } catch {
      setMessage("Failed to save");
      setTimeout(() => setMessage(""), 2000);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_340px]">
      {/* Left — Editor controls */}
      <div>
        {/* Header with save button */}
        <div className="mb-6 flex items-center justify-between">
          <h1 className="font-[family-name:var(--font-barlow)] text-2xl font-700">
            Editor
          </h1>
          <div className="flex items-center gap-3">
            {message && (
              <span className="text-sm text-[var(--green)]">{message}</span>
            )}
            <button
              onClick={handleSave}
              disabled={saving}
              className="rounded-lg bg-[var(--accent)] px-5 py-2 text-sm font-600 text-[var(--bg)] transition-all hover:bg-[var(--accent2)] disabled:opacity-50"
            >
              {saving ? "Saving..." : "Save changes"}
            </button>
          </div>
        </div>

        {/* Bio editor */}
        <section className="mb-6 rounded-[14px] border border-[var(--border)] bg-[var(--bg2)] p-5">
          <h2 className="mb-3 text-sm font-600">Bio</h2>
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            maxLength={160}
            rows={3}
            className="w-full resize-none rounded-lg border border-[var(--border2)] bg-[var(--bg3)] px-4 py-3 text-sm text-[var(--text)] outline-none transition-[border-color] placeholder:text-[var(--muted)] focus:border-[var(--accent)]"
            placeholder="Tell the world about yourself..."
          />
          <p className="mt-1.5 text-right text-xs text-[var(--muted)]">
            {bio.length}/160
          </p>
        </section>

        {/* Links section */}
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
                  {links.map((link) => (
                    <SortableLink
                      key={link.id}
                      link={link}
                      onDelete={handleDeleteLink}
                      onToggle={handleToggleLink}
                    />
                  ))}
                </div>
              </SortableContext>
            </DndContext>
          )}
        </section>

        {/* Theme picker */}
        <section className="rounded-[14px] border border-[var(--border)] bg-[var(--bg2)] p-5">
          <h2 className="mb-3 text-sm font-600">Theme</h2>
          <ThemePicker
            themes={themes}
            selected={selectedTheme}
            onSelect={setSelectedTheme}
          />
        </section>
      </div>

      {/* Right — Live preview */}
      <div className="sticky top-8 hidden lg:block">
        <p className="mb-3 text-xs font-500 text-[var(--muted)]">
          Live preview
        </p>
        <ProfilePreviewCard
          username={profile.username}
          bio={bio}
          links={links}
          themeId={selectedTheme}
          themes={themes}
        />
      </div>

      {/* Add link modal */}
      {showAddLink && (
        <AddLinkModal
          onAdd={handleAddLink}
          onClose={() => setShowAddLink(false)}
        />
      )}
    </div>
  );
}
