import { NextRequest, NextResponse } from "next/server";
import { verifyOrderPaymentToken } from "../../../../lib/order-token";
import { createServiceClient } from "../../../../lib/supabase-server";
import { createPayPalOrder } from "../../../../lib/paypal";

/**
 * GET /api/paypal/redirect?order_id=X&token=T
 *
 * Direct redirect endpoint that verifies the payment token, fetches order details,
 * creates the PayPal order with Velan branding, updates the DB with the paypal_order_id,
 * and immediately redirects the user's browser to the PayPal checkout/login screen.
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
    // 2. Fetch order + items from the shared DB
    const supabase = createServiceClient();
    const { data: order, error: fetchError } = await supabase
      .from("orders")
      .select(
        "id, order_number, total, subtotal, shipping_cost, discount_amount, status, payment_status, store_id, order_items(id, product_name, brand, price, quantity)"
      )
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

    // 3. Build PayPal order — ONLY Velan branding, zero Aurelio references
    const items = (order.order_items || []).map(
      (item: any) => ({
        name: item.product_name,
        quantity: item.quantity,
        unit_amount: item.price.toFixed(2),
      })
    );

    // 4. Create PayPal order
    const paypalOrder = await createPayPalOrder({
      orderNumber: order.order_number,
      amount: order.total.toFixed(2),
      itemTotal: order.subtotal.toFixed(2),
      shippingCost: order.shipping_cost.toFixed(2),
      discountAmount: (order.discount_amount || 0) > 0 ? Number(order.discount_amount).toFixed(2) : undefined,
      items,
      returnUrl: `${origin}/api/paypal/return?order_id=${orderId}&token=${encodeURIComponent(token)}`,
      cancelUrl: `${origin}/api/paypal/cancel?order_id=${orderId}&token=${encodeURIComponent(token)}`,
    });

    // 5. Persist PayPal order ID in DB
    const { error: updateError } = await supabase
      .from("orders")
      .update({ paypal_order_id: paypalOrder.id })
      .eq("id", orderId);

    if (updateError) {
      console.error("Error updating order with paypal_order_id in direct redirect:", updateError);
    }

    // 6. Direct HTTP 302 Redirect to PayPal's approve URL
    return NextResponse.redirect(paypalOrder.approve_url);
  } catch (error: any) {
    console.error("PayPal direct redirect error:", error);
    return errorRedirect(error?.message || "Errore durante la creazione dell'ordine PayPal");
  }
}
