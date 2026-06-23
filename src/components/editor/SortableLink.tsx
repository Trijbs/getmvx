"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type { Link } from "../../../prisma/generated/prisma/client";

interface SortableLinkProps {
  link: Link;
  onDelete: (id: string) => void;
  onToggle: (id: string, isActive: boolean) => void;
}

export function SortableLink({ link, onDelete, onToggle }: SortableLinkProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: link.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`flex items-center gap-3 rounded-lg border bg-[var(--bg3)] px-4 py-3 transition-all ${
        isDragging ? "border-[var(--accent)] shadow-lg" : "border-[var(--border)]"
      } ${!link.isActive ? "opacity-50" : ""}`}
    >
      {/* Drag handle */}
      <button
        {...attributes}
        {...listeners}
        className="cursor-grab text-[var(--muted)] active:cursor-grabbing"
      >
        ⠿
      </button>

      {/* Icon */}
      {link.icon && <span className="text-lg">{link.icon}</span>}

      {/* Content */}
      <div className="flex-1 min-w-0">
        <p className="truncate text-sm font-500">{link.title}</p>
        <p className="truncate text-xs text-[var(--muted)]">{link.url}</p>
      </div>

      {/* Toggle */}
      <button
        onClick={() => onToggle(link.id, !link.isActive)}
        className={`rounded-full px-2 py-0.5 text-[10px] font-600 ${
          link.isActive
            ? "bg-[var(--green)]/12 text-[var(--green)]"
            : "bg-[var(--muted)]/12 text-[var(--muted)]"
        }`}
      >
        {link.isActive ? "ON" : "OFF"}
      </button>

      {/* Delete */}
      <button
        onClick={() => onDelete(link.id)}
        className="text-[var(--muted)] transition-colors hover:text-[var(--red)]"
      >
        ✕
      </button>
    </div>
  );
}
