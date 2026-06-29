import { NextRequest, NextResponse } from "next/server";
import { verifyOrderPaymentToken } from "../../../../lib/order-token";
import { createServiceClient } from "../../../../lib/supabase-server";

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * GET /api/whop/return?order_id=X&token=T&status=success
 *
 * Whop redirects here after the user completes the checkout.
 * We verify the payment token, check the status from Whop, wait briefly for the webhook
 * to update the database, and redirect the user back to the appropriate store.
 */
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const orderId = searchParams.get("order_id");
  const token = searchParams.get("token");
  const whopStatus = searchParams.get("status"); // 'success' or 'error'
  const origin = request.nextUrl.origin;

  // Fallback error page
  const errorRedirect = (msg: string) =>
    NextResponse.redirect(
      `${origin}/pay?error=${encodeURIComponent(msg)}${orderId ? `&order_id=${orderId}` : ""}${token ? `&token=${encodeURIComponent(token)}` : ""}`
    );

  if (!orderId || !token) {
    return errorRedirect("Parametri di ritorno mancanti");
  }

  // 1. Verify HMAC payment token
  const payload = verifyOrderPaymentToken(token, orderId);
  if (!payload) {
    return errorRedirect("Token non valido o scaduto");
  }

  // If Whop explicitly sent an error status
  if (whopStatus === "error") {
    return errorRedirect("Il pagamento tramite carta è stato annullato o ha riscontrato un errore");
  }

  const supabase = createServiceClient();

  // 2. Fetch order status
  const { data: initialOrder, error: fetchError } = await supabase
    .from("orders")
    .select("id, payment_status, store_id")
    .eq("id", orderId)
    .single();

  if (fetchError || !initialOrder) {
    return errorRedirect("Ordine non trovato");
  }

  let order = initialOrder;

  // 3. Webhook safety buffer:
  // If the webhook hasn't updated the DB yet, wait up to 2 seconds
  if (order.payment_status !== "paid" && whopStatus !== "error") {
    console.log(`Whop return: order ${orderId} not marked paid yet, waiting for webhook...`);
    await sleep(1500);

    // Re-fetch order status
    const { data: updatedOrder } = await supabase
      .from("orders")
      .select("id, payment_status, store_id")
      .eq("id", orderId)
      .single();

    if (updatedOrder) {
      order = updatedOrder;
    }
  }

  console.log(`Whop return: redirecting user. Final DB payment_status=${order.payment_status}`);

  // 4. Redirect to the originating store's success/homepage
  return redirectToStore(origin, order.store_id, orderId);
}

/**
 * Redirect user back to the originating store after successful payment.
 */
function redirectToStore(storeBOrigin: string, storeId: string, orderId: string) {
  if (storeId === "store-c") {
    // Store-B native order — stay on Store-B
    return NextResponse.redirect(`${storeBOrigin}?checkout_success=true&order_id=${orderId}`);
  } else {
    // Aurelio order — redirect back to Aurelio
    const storeAUrl = process.env.STORE_A_REDIRECT_URL || "http://localhost:3000";
    return NextResponse.redirect(`${storeAUrl}/checkout?success=true&order_id=${orderId}`);
  }
}
