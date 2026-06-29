import { NextRequest, NextResponse } from "next/server";
import { verifyOrderPaymentToken } from "../../../../lib/order-token";
import { createServiceClient } from "../../../../lib/supabase-server";
import { capturePayPalOrder } from "../../../../lib/paypal";
import { sendOrderConfirmationEmail } from "../../../../lib/email";

/**
 * GET /api/paypal/return?order_id=X&token=T&PayerID=...
 *
 * PayPal redirects here after the user approves the payment.
 * We capture the payment and redirect the user back to the appropriate store.
 */
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const orderId = searchParams.get("order_id");
  const token = searchParams.get("token");
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

  // 2. Fetch order to get PayPal order ID
  const supabase = createServiceClient();
  const { data: order, error: fetchError } = await supabase
    .from("orders")
    .select("id, paypal_order_id, payment_status, store_id")
    .eq("id", orderId)
    .single();

  if (fetchError || !order || !order.paypal_order_id) {
    return errorRedirect("Ordine non trovato o PayPal ID mancante");
  }

  // Already captured — just redirect
  if (order.payment_status === "paid") {
    return redirectToStore(origin, order.store_id, orderId);
  }

  try {
    // 3. Capture the PayPal payment
    const capture = await capturePayPalOrder(order.paypal_order_id);

    if (capture.status !== "COMPLETED") {
      return errorRedirect(`Pagamento non completato: ${capture.status}`);
    }

    // 4. Update order in DB
    await supabase
      .from("orders")
      .update({
        status: "confirmed",
        payment_status: "paid",
        payment_method: "paypal",
        paypal_capture_id: capture.capture_id,
      })
      .eq("id", orderId);

    // 5. Invia l'email di conferma ordine (await per evitare terminazione prematura del serverless handler)
    await sendOrderConfirmationEmail(orderId).catch(console.error);

    // 5. Redirect to the originating store
    return redirectToStore(origin, order.store_id, orderId);
  } catch (error) {
    console.error("PayPal return capture error:", error);
    return errorRedirect("Errore durante la cattura del pagamento");
  }
}

/**
 * Redirect user back to the originating store after successful payment.
 * - Store-B native orders → redirect to Store-B homepage with success flag
 * - Aurelio orders → redirect to Aurelio checkout with success flag
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
