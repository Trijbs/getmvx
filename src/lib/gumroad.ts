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
  if (!token || !saleId) return false;

  try {
    const res = await fetch(
      `${GUMROAD_API}/sales/${encodeURIComponent(saleId)}?access_token=${encodeURIComponent(token)}`,
      { signal: AbortSignal.timeout(5000) }
    );
    if (!res.ok) return false;

    const data = (await res.json()) as {
      success?: boolean;
      sale?: { seller_id?: string };
    };
    if (!data.success || !data.sale) return false;

    // Belt-and-suspenders: if the sale carries a seller_id, it must be ours.
    const expectedSeller = process.env.GUMROAD_SELLER_ID;
    if (
      expectedSeller &&
      data.sale.seller_id &&
      data.sale.seller_id !== expectedSeller
    ) {
      return false;
    }
    return true;
  } catch {
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
