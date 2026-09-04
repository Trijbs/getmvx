"use client";

import { X } from "lucide-react";

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmDialog({
  open,
  title,
  message,
  confirmLabel = "Replace",
  cancelLabel = "Cancel",
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[90] flex items-center justify-center bg-black/60 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-title"
      onClick={onCancel}
    >
      <div
        className="w-full max-w-sm rounded-2xl border border-white/10 bg-[#15161a] p-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between">
          <h3 id="confirm-title" className="font-[family-name:var(--font-barlow)] text-lg font-700">
            {title}
          </h3>
          <button
            type="button"
            onClick={onCancel}
            aria-label="Close"
            className="text-white/50 transition-colors hover:text-white"
          >
            <X size={18} />
          </button>
        </div>
        <p className="mt-2 text-sm leading-relaxed text-white/70">{message}</p>
        <div className="mt-6 flex justify-end gap-2">
          <button
            type="button"
            onClick={onCancel}
            className="rounded-lg border border-white/10 px-4 py-2 text-sm text-white/70 transition-colors hover:bg-white/5"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="rounded-lg bg-white px-4 py-2 text-sm font-600 text-black transition-colors hover:bg-white/90"
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
