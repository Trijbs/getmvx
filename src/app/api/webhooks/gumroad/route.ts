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

    // AUTHENTICITY GATE: every ping must carry our seller_id.
    const sellerId = data["seller_id"];
    if (!verifySellerId(sellerId)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Gumroad echoes back query params under url_params[key].
    const userId = data["url_params[user_id]"];
    const resourceName = data["resource_name"];
    const saleId = data["sale_id"];
    const isTest = data["test"] === "true";

    if (!userId) {
      return NextResponse.json({ received: true });
    }

    switch (resourceName) {
      case "sale":
      case "subscription_restarted": {
        if (!isTest && saleId) {
          const saleOk = await verifySale(saleId);
          if (!saleOk) {
            return NextResponse.json(
              { error: "Sale verification failed" },
              { status: 400 }
            );
          }
        }
        await setProStatus(userId, true);
        break;
      }

      case "subscription_ended":
      case "cancellation":
        await setProStatus(userId, false);
        break;

      default:
        break;
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("[gumroad webhook] error:", error);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
