"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface AdminUserSummary {
  id: string;
  email: string;
  role: string;
  suspended: boolean;
  isPro: boolean;
  adminNote: string | null;
  username: string | null;
  isPublic: boolean;
}

interface Props {
  user: AdminUserSummary;
  isSelf: boolean;
  isLastAdmin: boolean;
}

export function UserActions({ user, isSelf, isLastAdmin }: Props) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [note, setNote] = useState(user.adminNote ?? "");

  async function call(
    method: "PATCH" | "DELETE" | "POST",
    body: Record<string, unknown>,
    path = `/api/admin/users/${user.id}`
  ) {
    setBusy(true);
    setError(null);
    try {
      const res = await fetch(path, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.error ?? `Request failed (${res.status})`);
      }
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Request failed");
    } finally {
      setBusy(false);
    }
  }

  const btn =
    "w-full rounded-md border border-[color:var(--border,rgba(255,255,255,0.15))] px-3 py-1.5 text-sm text-left hover:bg-[color:rgba(255,255,255,0.05)] disabled:opacity-40";

  return (
    <aside className="h-fit rounded-lg border border-[color:var(--border,rgba(255,255,255,0.08))] p-4">
      <h2 className="text-sm font-medium opacity-70">Actions</h2>
      {error && <p className="mt-2 text-xs text-red-400">{error}</p>}

      <div className="mt-3 flex flex-col gap-2">
        {user.suspended ? (
          <button
            className={btn}
            disabled={busy}
            onClick={() => call("PATCH", { action: "unsuspend" })}
          >
            Unsuspend
          </button>
        ) : (
          <button
            className={btn}
            disabled={busy || isSelf}
            title={isSelf ? "You can't suspend yourself" : undefined}
            onClick={() => {
              const reason = window.prompt("Suspension reason:");
              if (reason !== null)
                call("PATCH", { action: "suspend", reason });
            }}
          >
            Suspend user
          </button>
        )}

        <button
          className={btn}
          disabled={busy}
          onClick={() =>
            call("POST", { pro: !user.isPro }, `/api/admin/users/${user.id}/grant`)
          }
        >
          {user.isPro ? "Revoke Pro" : "Grant Pro"}
        </button>

        <label className="mt-2 text-xs opacity-60">
          Role
          <select
            className="mt-1 w-full rounded-md border border-[color:var(--border,rgba(255,255,255,0.15))] bg-transparent px-2 py-1.5 text-sm"
            defaultValue={user.role}
            disabled={busy || (isSelf && isLastAdmin)}
            onChange={(e) => {
              const role = e.target.value;
              if (
                window.confirm(`Change role of ${user.email} to ${role}?`)
              ) {
                call("PATCH", { action: "setRole", role });
              } else {
                e.target.value = user.role;
              }
            }}
          >
            <option value="USER">USER</option>
            <option value="MODERATOR">MODERATOR</option>
            <option value="ADMIN">ADMIN</option>
          </select>
          {isSelf && isLastAdmin && (
            <span className="mt-1 block text-[11px] opacity-50">
              Last admin can&apos;t demote themselves
            </span>
          )}
        </label>

        {user.username && user.isPublic && (
          <button
            className={btn}
            disabled={busy}
            onClick={() =>
              window.confirm(`Unpublish /${user.username}?`) &&
              call("PATCH", { action: "unpublishProfile" })
            }
          >
            Unpublish profile
          </button>
        )}

        {user.username && (
          <button
            className={btn}
            disabled={busy}
            onClick={() => {
              const username = window.prompt(
                "New username (resets the public URL):",
                user.username ?? ""
              );
              if (username && username !== user.username)
                call("PATCH", { action: "resetUsername", username });
            }}
          >
            Reset username
          </button>
        )}

        <label className="mt-2 text-xs opacity-60">
          Internal note
          <textarea
            className="mt-1 w-full rounded-md border border-[color:var(--border,rgba(255,255,255,0.15))] bg-transparent px-2 py-1.5 text-sm"
            rows={3}
            value={note}
            onChange={(e) => setNote(e.target.value)}
          />
        </label>
        <button
          className={btn}
          disabled={busy || note === (user.adminNote ?? "")}
          onClick={() => call("PATCH", { action: "setNote", note })}
        >
          Save note
        </button>

        <button
          className={`${btn} mt-4 border-red-900 text-red-400`}
          disabled={busy || user.role === "ADMIN"}
          title={
            user.role === "ADMIN"
              ? "Demote the admin role before deleting"
              : undefined
          }
          onClick={() => {
            const typed = window.prompt(
              `This permanently deletes the account, profile, links, and files.\nType the user's email (${user.email}) to confirm:`
            );
            if (typed === user.email) call("DELETE", { confirm: typed });
            else if (typed !== null) setError("Email did not match — not deleted");
          }}
        >
          Delete user…
        </button>
      </div>
    </aside>
  );
}
