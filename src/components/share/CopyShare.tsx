"use client";

import { useState, useCallback } from "react";
import { Share2, Check } from "lucide-react";
import { useToast } from "@/components/ui/Toast";
import { fireConfetti } from "@/lib/confetti";

interface CopyShareProps {
  url: string;
  className?: string;
}

export function CopyShare({ url, className }: CopyShareProps) {
  const [copied, setCopied] = useState(false);
  const { addToast } = useToast();

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      addToast("Copied to clipboard!", "success");
      fireConfetti({ particleCount: 80, spread: 60 });
      setTimeout(() => setCopied(false), 2000);
    } catch {
      addToast("Failed to copy — try again", "error");
    }
  }, [url, addToast]);

  return (
    <button
      type="button"
      onClick={handleCopy}
      className={
        className ??
        "inline-flex items-center gap-2 rounded-lg border border-[var(--border)] bg-[var(--bg2)] px-4 py-2.5 text-sm font-500 text-[var(--text)] transition-all hover:border-[var(--accent)] hover:text-[var(--accent)]"
      }
    >
      {copied ? (
        <Check size={16} aria-hidden="true" className="text-green-500" />
      ) : (
        <Share2 size={16} aria-hidden="true" />
      )}
      {copied ? "Copied!" : "Share"}
    </button>
  );
}
