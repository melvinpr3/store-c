import { NextRequest, NextResponse } from "next/server";
import { verifyOrderPaymentToken } from "../../../../lib/order-token";
import { createServiceClient } from "../../../../lib/supabase-server";
import { createWhopCheckout } from "../../../../lib/whop";

/**
 * GET /api/whop/redirect?order_id=X&token=T
 *
 * Direct redirect endpoint that verifies the payment token, fetches order details,
 * creates the Whop checkout configuration, updates the DB with the whop_checkout_id,
 * and immediately redirects the user's browser to the Whop checkout screen.
 */
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const orderId = searchParams.get("order_id");
  const token = searchParams.get("token");
  const origin = request.nextUrl.origin;

  // Fallback to the standard /pay page with an error parameter if direct redirect fails
  const errorRedirect = (msg: string) => {
    return NextResponse.redirect(
      `${origin}/pay?error=${encodeURIComponent(msg)}${orderId ? `&order_id=${orderId}` : ""}${token ? `&token=${encodeURIComponent(token)}` : ""}`
    );
  };

  if (!orderId || !token) {
    return errorRedirect("Parametri mancanti (order_id, token)");
  }

  // 1. Verify HMAC payment token
  const payload = verifyOrderPaymentToken(token, orderId);
  if (!payload) {
    return errorRedirect("Token di pagamento non valido o scaduto");
  }

  try {
    // 2. Fetch order details from the shared DB
    const supabase = createServiceClient();
    const { data: order, error: fetchError } = await supabase
      .from("orders")
      .select("id, order_number, total, status, payment_status, store_id")
      .eq("id", orderId)
      .single();

    if (fetchError || !order) {
      return errorRedirect("Ordine non trovato");
    }

    // Already paid — redirect directly to the success return logic
    if (order.payment_status === "paid") {
      const storeAUrl = process.env.STORE_A_REDIRECT_URL || "http://localhost:3000";
      if (order.store_id === "store-c") {
        return NextResponse.redirect(`${origin}?checkout_success=true&order_id=${orderId}`);
      } else {
        return NextResponse.redirect(`${storeAUrl}/checkout?success=true&order_id=${orderId}`);
      }
    }

    if (order.status !== "pending" || order.payment_status !== "pending") {
      return errorRedirect("Ordine non pagabile — già elaborato");
    }

    // 3. Build Whop checkout configuration
    const returnUrl = `${origin}/api/whop/return?order_id=${orderId}&token=${encodeURIComponent(token)}`;
    const cancelUrl = `${origin}/pay?order_id=${orderId}&token=${encodeURIComponent(token)}`;

    const whopCheckout = await createWhopCheckout({
      orderId: order.id,
      orderNumber: order.order_number,
      amount: order.total,
      paymentToken: token,
      cancelUrl,
      returnUrl,
    });

    // 4. Persist Whop checkout ID in DB
    const { error: updateError } = await supabase
      .from("orders")
      .update({ whop_checkout_id: whopCheckout.id })
      .eq("id", orderId);

    if (updateError) {
      console.warn("Error updating order with whop_checkout_id in direct redirect, attempting fallback:", updateError);
      // Fallback for compatibility if migration is not applied yet
      await supabase
        .from("orders")
        .update({ paypal_order_id: whopCheckout.id })
        .eq("id", orderId);
    }

    // 5. Direct HTTP 302 Redirect to Whop's purchase URL
    return NextResponse.redirect(whopCheckout.purchase_url);
  } catch (error: unknown) {
    console.error("Whop direct redirect error:", error);
    const message =
      error instanceof Error ? error.message : "Errore durante la creazione del pagamento con carta";
    return errorRedirect(message);
  }
}
