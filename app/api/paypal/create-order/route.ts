import { NextRequest, NextResponse } from "next/server";
import { verifyOrderPaymentToken } from "../../../../lib/order-token";
import { createServiceClient } from "../../../../lib/supabase-server";
import { createPayPalOrder } from "../../../../lib/paypal";

/**
 * POST /api/paypal/create-order
 *
 * Called by the /pay page when the user clicks "Paga con PayPal".
 * Verifies the payment token, fetches the order, creates a PayPal order,
 * and returns the approval URL for redirect.
 */
export async function POST(request: NextRequest) {
  try {
    const { order_id, token } = (await request.json()) as {
      order_id?: string;
      token?: string;
    };

    if (!order_id || !token) {
      return NextResponse.json(
        { error: "Parametri mancanti (order_id, token)" },
        { status: 400 }
      );
    }

    // 1. Verify HMAC payment token
    const payload = verifyOrderPaymentToken(token, order_id);
    if (!payload) {
      return NextResponse.json(
        { error: "Token non valido o scaduto" },
        { status: 401 }
      );
    }

    // 2. Fetch order + items from shared DB
    const supabase = createServiceClient();
    const { data: order, error: fetchError } = await supabase
      .from("orders")
      .select(
        "id, order_number, total, subtotal, shipping_cost, discount_amount, status, payment_status, order_items(id, product_name, brand, price, quantity)"
      )
      .eq("id", order_id)
      .single();

    if (fetchError || !order) {
      return NextResponse.json(
        { error: "Ordine non trovato" },
        { status: 404 }
      );
    }

    if (order.status !== "pending" || order.payment_status !== "pending") {
      return NextResponse.json(
        { error: "Ordine non pagabile — già elaborato" },
        { status: 400 }
      );
    }

    // 3. Build PayPal order — ONLY Velan branding, zero Aurelio refs
    const origin = request.nextUrl.origin;
    const storeAUrl = process.env.STORE_A_REDIRECT_URL || "http://localhost:3000";

    const items = (order.order_items || []).map(
      (item: { product_name: string; brand: string; price: number; quantity: number }) => ({
        name: item.product_name,
        quantity: item.quantity,
        unit_amount: item.price.toFixed(2),
      })
    );

    const paypalOrder = await createPayPalOrder({
      orderNumber: order.order_number,
      amount: order.total.toFixed(2),
      itemTotal: order.subtotal.toFixed(2),
      shippingCost: order.shipping_cost.toFixed(2),
      discountAmount: (order.discount_amount || 0) > 0 ? Number(order.discount_amount).toFixed(2) : undefined,
      items,
      returnUrl: `${origin}/api/paypal/return?order_id=${order_id}&token=${encodeURIComponent(token)}`,
      cancelUrl: `${origin}/pay?order_id=${order_id}&token=${encodeURIComponent(token)}`,
    });

    // 4. Persist PayPal order ID in DB
    await supabase
      .from("orders")
      .update({ paypal_order_id: paypalOrder.id })
      .eq("id", order_id);

    return NextResponse.json({
      paypal_order_id: paypalOrder.id,
      approve_url: paypalOrder.approve_url,
    });
  } catch (error) {
    console.error("PayPal create-order error:", error);
    return NextResponse.json(
      { error: "Errore durante la creazione dell'ordine PayPal" },
      { status: 500 }
    );
  }
}
