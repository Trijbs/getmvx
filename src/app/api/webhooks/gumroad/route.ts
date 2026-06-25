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

    // AUTHENTICITY GATE: every ping must carry our seller_id. Without this the
    // endpoint is a free-Pro button — anyone could POST a fake "sale".
    if (!verifySellerId(data["seller_id"])) {
      console.warn("[gumroad webhook] rejected: seller_id mismatch");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Gumroad echoes back query params under url_params[key].
    // We pass ?user_id=... on the checkout link, so it arrives here.
    const userId = data["url_params[user_id]"];
    const resourceName = data["resource_name"];
    const saleId = data["sale_id"];

    if (!userId) {
      // Log but don't error — test pings from Gumroad won't have user_id.
      console.warn("[gumroad webhook] missing user_id", { resourceName, saleId });
      return NextResponse.json({ received: true });
    }

    switch (resourceName) {
      case "sale":
      case "subscription_restarted": {
        // Confirm a real sale with Gumroad before granting. Subscription
        // restarts may arrive without a sale_id; the seller_id gate above
        // already authenticated those.
        if (saleId && !(await verifySale(saleId))) {
          console.warn("[gumroad webhook] rejected: sale failed verification", {
            saleId,
          });
          return NextResponse.json(
            { error: "Sale verification failed" },
            { status: 400 }
          );
        }
        await setProStatus(userId, true);
        break;
      }

      case "subscription_ended":
      case "cancellation":
        await setProStatus(userId, false);
        break;

      // subscription_updated — no access change, ignore.
      default:
        break;
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("[gumroad webhook] error", error);
    // Return 500 so Gumroad retries (it retries on non-200 for up to 3 hours).
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
