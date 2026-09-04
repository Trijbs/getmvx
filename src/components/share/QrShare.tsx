"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import QRCode from "qrcode";
import { QrCode, X } from "lucide-react";
import { UpgradeButton } from "@/components/pro/UpgradeButton";

interface QrShareProps {
  url: string;
  isPro: boolean;
  userId: string;
  email: string;
  className?: string;
}

export function QrShare({
  url,
  isPro,
  userId,
  email,
  className,
}: QrShareProps) {
  const [open, setOpen] = useState(false);
  const [dataUrl, setDataUrl] = useState<string | null>(null);
  const popoverRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open || !isPro) return;
    let cancelled = false;
    QRCode.toDataURL(url, {
      width: 200,
      margin: 2,
      color: { dark: "#000000", light: "#ffffff" },
    })
      .then((result) => {
        if (!cancelled) setDataUrl(result);
      })
      .catch(() => {
        if (!cancelled) setDataUrl(null);
      });
    return () => {
      cancelled = true;
    };
  }, [open, isPro, url]);

  const close = useCallback(() => {
    setOpen(false);
    buttonRef.current?.focus();
  }, []);

  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") close();
    }
    function onClickOutside(e: MouseEvent) {
      if (
        popoverRef.current &&
        !popoverRef.current.contains(e.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(e.target as Node)
      ) {
        close();
      }
    }
    document.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onClickOutside);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onClickOutside);
    };
  }, [open, close]);

  return (
    <div className="relative inline-block">
      <button
        ref={buttonRef}
        type="button"
        onClick={() => setOpen((o) => !o)}
        className={
          className ??
          "inline-flex items-center gap-2 rounded-lg border border-[var(--border)] bg-[var(--bg2)] px-4 py-2.5 text-sm font-500 text-[var(--text)] transition-all hover:border-[var(--accent)] hover:text-[var(--accent)]"
        }
      >
        <QrCode size={16} aria-hidden="true" />
        QR Code
      </button>

      {open && (
        <div
          ref={popoverRef}
          role="dialog"
          aria-label="QR Code"
          className="absolute right-0 z-50 mt-2 w-[280px] rounded-xl border border-[var(--border)] bg-[var(--bg2)] p-5 shadow-xl"
        >
          <div className="mb-3 flex items-center justify-between">
            <span className="text-sm font-600 text-[var(--text)]">
              Scan to visit
            </span>
            <button
              type="button"
              onClick={close}
              className="rounded-md p-1 text-[var(--muted)] transition-colors hover:text-[var(--text)]"
              aria-label="Close"
            >
              <X size={16} />
            </button>
          </div>

          {isPro ? (
            <div className="flex flex-col items-center gap-3">
              {dataUrl ? (
                <img
                  src={dataUrl}
                  alt={`QR code for ${url}`}
                  width={200}
                  height={200}
                  className="rounded-lg border border-[var(--border)]"
                />
              ) : (
                <div className="flex h-[200px] w-[200px] items-center justify-center rounded-lg border border-[var(--border)] bg-[var(--bg3)]">
                  <span className="text-xs text-[var(--muted)]">
                    Generating…
                  </span>
                </div>
              )}
              <p className="text-center text-xs leading-relaxed text-[var(--muted)]">
                {url}
              </p>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-4">
              {/* Blurred placeholder QR */}
              <div className="relative h-[200px] w-[200px] overflow-hidden rounded-lg border border-[var(--border)] bg-[var(--bg3)]">
                <div className="absolute inset-0 flex items-center justify-center text-4xl opacity-20">
                  ▪▪▪▪▪
                </div>
                <div className="absolute inset-0 backdrop-blur-md" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="rounded-md bg-[var(--bg)]/80 px-3 py-1.5 text-xs font-600 text-[var(--accent)] backdrop-blur-sm">
                    PRO
                  </span>
                </div>
              </div>
              <p className="text-center text-xs leading-relaxed text-[var(--muted)]">
                QR codes are a PRO feature — upgrade to share your profile as a
                scannable code
              </p>
              <UpgradeButton userId={userId} email={email} />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
