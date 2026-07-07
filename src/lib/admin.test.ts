import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import type { Session } from "next-auth";

// requireAdmin's dependencies are mocked so these tests exercise the gate
// logic itself — no DB, no request context.
const mockAuth = vi.fn();
const mockFindUnique = vi.fn();
const mockAuditCreate = vi.fn();
const mockHeaders = vi.fn();

vi.mock("@/lib/auth", () => ({
  auth: (...args: unknown[]) => mockAuth(...args),
}));
vi.mock("@/lib/db", () => ({
  prisma: {
    user: { findUnique: (...args: unknown[]) => mockFindUnique(...args) },
    adminAuditLog: {
      create: (...args: unknown[]) => mockAuditCreate(...args),
    },
  },
}));
vi.mock("next/headers", () => ({
  headers: (...args: unknown[]) => mockHeaders(...args),
}));
vi.mock("next/navigation", () => ({
  notFound: () => {
    // Mirror Next's behavior: notFound() throws and never returns.
    throw new Error("NEXT_NOT_FOUND");
  },
}));

import {
  isAdmin,
  isModerator,
  parseAllowlist,
  ipAllowed,
  requireAdmin,
} from "@/lib/admin";

function session(role: string, provider = "credentials"): Session {
  return {
    user: { id: "user_1", email: "op@getmvx.cc", role, provider },
    expires: "2099-01-01T00:00:00.000Z",
  } as Session;
}

function headersWith(entries: Record<string, string>) {
  return new Headers(entries);
}

beforeEach(() => {
  mockAuth.mockReset();
  mockFindUnique.mockReset();
  mockAuditCreate.mockReset().mockResolvedValue({});
  mockHeaders.mockReset().mockResolvedValue(headersWith({}));
});

afterEach(() => {
  vi.unstubAllEnvs();
});

describe("role predicates", () => {
  it("isAdmin accepts only ADMIN", () => {
    expect(isAdmin(session("ADMIN"))).toBe(true);
    expect(isAdmin(session("MODERATOR"))).toBe(false);
    expect(isAdmin(session("USER"))).toBe(false);
    expect(isAdmin(null)).toBe(false);
  });

  it("isModerator accepts ADMIN and MODERATOR", () => {
    expect(isModerator(session("ADMIN"))).toBe(true);
    expect(isModerator(session("MODERATOR"))).toBe(true);
    expect(isModerator(session("USER"))).toBe(false);
    expect(isModerator(null)).toBe(false);
  });
});

describe("IP allowlist", () => {
  it("parses comma-separated entries, ignoring whitespace and empties", () => {
    expect(parseAllowlist("1.2.3.4, 5.6.7.8 ,")).toEqual([
      "1.2.3.4",
      "5.6.7.8",
    ]);
    expect(parseAllowlist(undefined)).toEqual([]);
    expect(parseAllowlist("")).toEqual([]);
  });

  it("passes every IP when the allowlist is disabled (empty)", () => {
    expect(ipAllowed("9.9.9.9", [])).toBe(true);
  });

  it("only passes listed IPs when enabled", () => {
    expect(ipAllowed("1.2.3.4", ["1.2.3.4"])).toBe(true);
    expect(ipAllowed("9.9.9.9", ["1.2.3.4"])).toBe(false);
  });
});

describe("requireAdmin", () => {
  // Parametrized guard for the whole surface: every non-admin state 404s.
  const deniedStates: Array<[string, () => void]> = [
    ["logged out", () => mockAuth.mockResolvedValue(null)],
    ["USER role", () => mockAuth.mockResolvedValue(session("USER"))],
    ["MODERATOR role", () => mockAuth.mockResolvedValue(session("MODERATOR"))],
    [
      "ADMIN token but demoted in DB",
      () => {
        mockAuth.mockResolvedValue(session("ADMIN"));
        mockFindUnique.mockResolvedValue({ role: "USER", suspendedAt: null });
      },
    ],
    [
      "ADMIN token but suspended in DB",
      () => {
        mockAuth.mockResolvedValue(session("ADMIN"));
        mockFindUnique.mockResolvedValue({
          role: "ADMIN",
          suspendedAt: new Date(),
        });
      },
    ],
    [
      "ADMIN token but user deleted in DB",
      () => {
        mockAuth.mockResolvedValue(session("ADMIN"));
        mockFindUnique.mockResolvedValue(null);
      },
    ],
  ];

  for (const [name, arrange] of deniedStates) {
    it(`404s when ${name}`, async () => {
      arrange();
      await expect(requireAdmin()).rejects.toThrow("NEXT_NOT_FOUND");
    });
  }

  it("returns the session for a live DB-confirmed admin", async () => {
    mockAuth.mockResolvedValue(session("ADMIN"));
    mockFindUnique.mockResolvedValue({ role: "ADMIN", suspendedAt: null });
    const result = await requireAdmin();
    expect(result.user.id).toBe("user_1");
  });

  it("audits denied probes from authenticated users but not anonymous ones", async () => {
    mockAuth.mockResolvedValue(session("USER"));
    await expect(requireAdmin()).rejects.toThrow("NEXT_NOT_FOUND");
    expect(mockAuditCreate).toHaveBeenCalledTimes(1);
    expect(mockAuditCreate.mock.calls[0][0].data.action).toBe(
      "admin.access_denied"
    );

    mockAuditCreate.mockClear();
    mockAuth.mockResolvedValue(null);
    await expect(requireAdmin()).rejects.toThrow("NEXT_NOT_FOUND");
    expect(mockAuditCreate).not.toHaveBeenCalled();
  });

  it("404s a DB-confirmed admin from an unlisted IP when the allowlist is set", async () => {
    vi.stubEnv("ADMIN_IP_ALLOWLIST", "10.0.0.1");
    mockAuth.mockResolvedValue(session("ADMIN"));
    mockFindUnique.mockResolvedValue({ role: "ADMIN", suspendedAt: null });
    mockHeaders.mockResolvedValue(
      headersWith({ "x-forwarded-for": "203.0.113.7" })
    );
    await expect(requireAdmin()).rejects.toThrow("NEXT_NOT_FOUND");
  });

  it("admits a DB-confirmed admin from a listed IP", async () => {
    vi.stubEnv("ADMIN_IP_ALLOWLIST", "10.0.0.1, 10.0.0.2");
    mockAuth.mockResolvedValue(session("ADMIN"));
    mockFindUnique.mockResolvedValue({ role: "ADMIN", suspendedAt: null });
    mockHeaders.mockResolvedValue(
      headersWith({ "x-forwarded-for": "10.0.0.2, 172.16.0.1" })
    );
    await expect(requireAdmin()).resolves.toBeTruthy();
  });

  it("enforces the OAuth requirement only when ADMIN_REQUIRE_OAUTH=true", async () => {
    mockFindUnique.mockResolvedValue({ role: "ADMIN", suspendedAt: null });

    // Flag off (default): credentials admin passes.
    mockAuth.mockResolvedValue(session("ADMIN", "credentials"));
    await expect(requireAdmin()).resolves.toBeTruthy();

    // Flag on: credentials admin is refused, OAuth admin passes.
    vi.stubEnv("ADMIN_REQUIRE_OAUTH", "true");
    mockAuth.mockResolvedValue(session("ADMIN", "credentials"));
    await expect(requireAdmin()).rejects.toThrow("NEXT_NOT_FOUND");
    mockAuth.mockResolvedValue(session("ADMIN", "google"));
    await expect(requireAdmin()).resolves.toBeTruthy();
  });
});
