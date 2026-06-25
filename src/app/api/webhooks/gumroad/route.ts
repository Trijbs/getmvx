import { NextRequest, NextResponse } from "next/server";
import { setProStatus, verifySellerId, verifySale } from "@/lib/gumroad";

// Gumroad sends application/x-www-form-urlencoded, not JSON.
// Do NOT use req.json() here.
export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const data = Object.fromEntries(formData.entries()) as Record<
      string,
      string
    >;

    // ── TEMP DIAGNOSTIC LOGGING (remove once the flow is confirmed) ──────────
    // Dump the entire incoming payload so we can see exactly what Gumroad sends
    // — field names, whether user_id is echoed, the test flag, seller_id, etc.
    console.log("[gumroad webhook] === incoming ping ===");
    console.log("[gumroad webhook] keys:", Object.keys(data).join(", "));
    console.log("[gumroad webhook] payload:", JSON.stringify(data));
    // ────────────────────────────────────────────────────────────────────────

    // AUTHENTICITY GATE: every ping must carry our seller_id. Without this the
    // endpoint is a free-Pro button — anyone could POST a fake "sale".
    const sellerId = data["seller_id"];
    const sellerOk = verifySellerId(sellerId);
    console.log("[gumroad webhook] seller_id check:", {
      received: sellerId ?? "(none)",
      envSet: Boolean(process.env.GUMROAD_SELLER_ID),
      ok: sellerOk,
    });
    if (!sellerOk) {
      console.warn("[gumroad webhook] REJECT 401: seller_id mismatch/missing");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Gumroad echoes back query params under url_params[key].
    // We pass ?user_id=... on the checkout link, so it arrives here.
    const userId = data["url_params[user_id]"];
    const resourceName = data["resource_name"];
    const saleId = data["sale_id"];
    // Gumroad sends test=true for seller "test" purchases. Those sales aren't
    // retrievable via the sales API, so we can't verifySale() them — but the
    // seller_id gate above already proves the ping came from our account, which
    // is enough to grant a test upgrade.
    const isTest = data["test"] === "true";

    console.log("[gumroad webhook] parsed:", {
      resourceName,
      userId: userId ?? "(MISSING)",
      saleId: saleId ?? "(none)",
      isTest,
      urlParamKeys: Object.keys(data).filter((k) => k.startsWith("url_params")),
    });

    if (!userId) {
      console.warn(
        "[gumroad webhook] NO user_id — ping can't be mapped to an account. " +
          "Either checkout didn't go through the in-app button, or Gumroad " +
          "isn't echoing url_params. Returning 200 without granting."
      );
      return NextResponse.json({ received: true });
    }

    switch (resourceName) {
      case "sale":
      case "subscription_restarted": {
        // Confirm a real sale with Gumroad before granting. Test purchases skip
        // this (no API record); subscription restarts may arrive without a
        // sale_id; the seller_id gate above already authenticated both.
        if (!isTest && saleId) {
          const saleOk = await verifySale(saleId);
          console.log("[gumroad webhook] verifySale:", { saleId, ok: saleOk });
          if (!saleOk) {
            console.warn("[gumroad webhook] REJECT 400: sale failed verification");
            return NextResponse.json(
              { error: "Sale verification failed" },
              { status: 400 }
            );
          }
        }
        await setProStatus(userId, true);
        console.log("[gumroad webhook] GRANTED Pro ->", userId);
        break;
      }

      case "subscription_ended":
      case "cancellation":
        await setProStatus(userId, false);
        console.log("[gumroad webhook] REVOKED Pro ->", userId);
        break;

      // subscription_updated — no access change, ignore.
      default:
        console.log("[gumroad webhook] ignored resource_name:", resourceName);
        break;
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("[gumroad webhook] ERROR", error);
    // Return 500 so Gumroad retries (it retries on non-200 for up to 3 hours).
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
