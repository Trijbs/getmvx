import { prisma } from "@/lib/db";

const GUMROAD_API = "https://api.gumroad.com/v2";

/**
 * Confirm a webhook's seller_id matches our store. Fails closed: if
 * GUMROAD_SELLER_ID isn't configured, no webhook is trusted.
 */
export function verifySellerId(sellerId: string | undefined): boolean {
  const expected = process.env.GUMROAD_SELLER_ID;
  if (!expected || !sellerId) return false;
  return sellerId === expected;
}

/**
 * Confirm a sale is genuine by fetching it from Gumroad's API with our access
 * token. The token is scoped to our account, so a successful lookup means the
 * sale really belongs to us. Fails closed on any error or missing config.
 */
export async function verifySale(saleId: string | undefined): Promise<boolean> {
  const token = process.env.GUMROAD_ACCESS_TOKEN;
  if (!token || !saleId) {
    console.warn("[gumroad verifySale] missing token or saleId", {
      hasToken: Boolean(token),
      saleId: saleId ?? "(none)",
    });
    return false;
  }

  try {
    const res = await fetch(
      `${GUMROAD_API}/sales/${encodeURIComponent(saleId)}?access_token=${encodeURIComponent(token)}`,
      { signal: AbortSignal.timeout(5000) }
    );
    console.log("[gumroad verifySale] /v2/sales lookup:", {
      saleId,
      status: res.status,
      ok: res.ok,
    });
    if (!res.ok) {
      const body = await res.text().catch(() => "");
      console.warn("[gumroad verifySale] non-OK body:", body.slice(0, 300));
      return false;
    }

    const data = (await res.json()) as {
      success?: boolean;
      sale?: { seller_id?: string; product_permalink?: string };
    };
    // Log the seller_id the sales API returns so we can SEE its format (numeric
    // vs obfuscated) without it being able to break the flow.
    console.log("[gumroad verifySale] result:", {
      success: data.success,
      hasSale: Boolean(data.sale),
      saleSellerId: data.sale?.seller_id ?? "(none)",
      envSellerId: process.env.GUMROAD_SELLER_ID ?? "(unset)",
      productPermalink: data.sale?.product_permalink ?? "(none)",
    });

    // A successful, token-scoped lookup already proves the sale belongs to our
    // account — the access token only returns our own sales. We deliberately do
    // NOT compare sale.seller_id against GUMROAD_SELLER_ID: those use different
    // id formats (numeric vs obfuscated), so the comparison would wrongly reject
    // real sales (exactly the bug that broke the seller_id gate).
    return Boolean(data.success && data.sale);
  } catch (err) {
    console.error("[gumroad verifySale] fetch error", err);
    return false;
  }
}

/**
 * Grant or revoke the PRO badge for a user. On grant, we skip creation if a PRO
 * badge already exists so retried webhooks don't double-create (the Badge model
 * has no (userId, type) unique key to upsert against).
 */
export async function setProStatus(
  userId: string,
  isPro: boolean
): Promise<void> {
  if (isPro) {
    const existing = await prisma.badge.findFirst({
      where: { userId, type: "PRO" },
    });

    if (!existing) {
      await prisma.badge.create({
        data: {
          userId,
          type: "PRO",
          label: "Pro",
        },
      });
    }
  } else {
    await prisma.badge.deleteMany({
      where: { userId, type: "PRO" },
    });
  }
}

export const GUMROAD_PRODUCT_URL =
  process.env.NEXT_PUBLIC_GUMROAD_PRODUCT_URL ?? "";
