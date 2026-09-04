"use client";

import { X } from "lucide-react";
import { UpgradeButton } from "./UpgradeButton";

interface UpsellModalProps {
  open: boolean;
  title: string;
  message: string;
  userId: string;
  email: string;
  onClose: () => void;
}

export default function UpsellModal({
  open,
  title,
  message,
  userId,
  email,
  onClose,
}: UpsellModalProps) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[95] flex items-center justify-center bg-black/60 p-4"
      role="dialog"
      aria-modal="true"
      aria-label={title}
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-2xl border border-white/10 bg-[#15161a] p-6 text-center shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute right-4 top-4 text-white/50 transition-colors hover:text-white"
        >
          <X size={18} />
        </button>
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-[#9b7ef8] to-[#6d5ae0] text-2xl">
          🔒
        </div>
        <h3 className="font-[family-name:var(--font-barlow)] text-xl font-700 text-white">
          {title}
        </h3>
        <p className="mt-2 text-sm leading-relaxed text-white/70">{message}</p>
        <div className="mt-6">
          <UpgradeButton userId={userId} email={email} />
        </div>
        <p className="mt-3 text-[11px] text-white/50">
          Unlock every Pro feature with one subscription.
        </p>
      </div>
    </div>
  );
}
