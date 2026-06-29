import { NextRequest, NextResponse } from "next/server";
import { verifyOrderPaymentToken } from "../../../../lib/order-token";
import { createServiceClient } from "../../../../lib/supabase-server";
import { createWhopCheckout } from "../../../../lib/whop";

/**
 * POST /api/whop/create-order
 *
 * Called by the /pay page when the user clicks "Paga con Carta (Whop)".
 * Verifies the payment token, fetches the order, creates a Whop checkout configuration,
 * and returns the purchase URL for redirect.
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

    // 2. Fetch order from shared DB
    const supabase = createServiceClient();
    const { data: order, error: fetchError } = await supabase
      .from("orders")
      .select("id, order_number, total, status, payment_status")
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

    // 3. Build Whop checkout configuration
    const origin = request.nextUrl.origin;
    const returnUrl = `${origin}/api/whop/return?order_id=${order_id}&token=${encodeURIComponent(token)}`;
    const cancelUrl = `${origin}/pay?order_id=${order_id}&token=${encodeURIComponent(token)}`;

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
      .eq("id", order_id);

    if (updateError) {
      console.warn("DB update of whop_checkout_id failed, attempting fallback to paypal_order_id:", updateError);
      // Fallback for compatibility if migration is not applied yet
      await supabase
        .from("orders")
        .update({ paypal_order_id: whopCheckout.id })
        .eq("id", order_id);
    }

    return NextResponse.json({
      whop_checkout_id: whopCheckout.id,
      purchase_url: whopCheckout.purchase_url,
    });
  } catch (error) {
    console.error("Whop create-order error:", error);
    return NextResponse.json(
      { error: "Errore durante la creazione del pagamento con carta" },
      { status: 500 }
    );
  }
}
