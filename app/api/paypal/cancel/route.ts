import { NextRequest, NextResponse } from "next/server";
import { verifyOrderPaymentToken } from "../../../../lib/order-token";
import { createServiceClient } from "../../../../lib/supabase-server";

/**
 * GET /api/paypal/cancel?order_id=X&token=T
 *
 * This endpoint is hit when the user cancels the PayPal payment flow.
 * It identifies the originating store for the order and redirects the user
 * back to the correct store's checkout page or homepage with cancellation flags.
 */
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const orderId = searchParams.get("order_id");
  const token = searchParams.get("token");
  const origin = request.nextUrl.origin;

  const fallbackRedirect = () => {
    const storeAUrl = process.env.STORE_A_REDIRECT_URL || "http://localhost:3000";
    return NextResponse.redirect(`${storeAUrl}/checkout?cancel=true`);
  };

  if (!orderId || !token) {
    return fallbackRedirect();
  }

  // 1. Verify HMAC payment token
  const payload = verifyOrderPaymentToken(token, orderId);
  if (!payload) {
    return fallbackRedirect();
  }

  try {
    // 2. Fetch order to know which store it belongs to
    const supabase = createServiceClient();
    const { data: order, error } = await supabase
      .from("orders")
      .select("store_id")
      .eq("id", orderId)
      .single();

    if (error || !order) {
      return fallbackRedirect();
    }

    // 3. Redirect back to the correct originating store
    if (order.store_id === "store-c") {
      return NextResponse.redirect(`${origin}?checkout_cancel=true`);
    } else {
      const storeAUrl = process.env.STORE_A_REDIRECT_URL || "http://localhost:3000";
      return NextResponse.redirect(`${storeAUrl}/checkout?cancel=true`);
    }
  } catch (err) {
    console.error("PayPal cancel redirect error:", err);
    return fallbackRedirect();
  }
}
