import { NextRequest, NextResponse } from "next/server";
import { verifyOrderPaymentToken } from "../../../../lib/order-token";
import { createServiceClient } from "../../../../lib/supabase-server";
import { capturePayPalOrder } from "../../../../lib/paypal";
import { sendOrderConfirmationEmail } from "../../../../lib/email";

/**
 * POST /api/paypal/capture-order
 *
 * Captures a PayPal payment after user approval.
 * Verifies the HMAC token, calls PayPal capture, and updates the order in DB.
 */
export async function POST(request: NextRequest) {
  try {
    const { paypal_order_id, order_id, token } = (await request.json()) as {
      paypal_order_id?: string;
      order_id?: string;
      token?: string;
    };

    if (!paypal_order_id || !order_id || !token) {
      return NextResponse.json(
        { error: "Parametri mancanti" },
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

    // 2. Verify the order exists and has the matching paypal_order_id
    const supabase = createServiceClient();
    const { data: order, error: fetchError } = await supabase
      .from("orders")
      .select("id, status, payment_status, paypal_order_id")
      .eq("id", order_id)
      .single();

    if (fetchError || !order) {
      return NextResponse.json(
        { error: "Ordine non trovato" },
        { status: 404 }
      );
    }

    if (order.paypal_order_id !== paypal_order_id) {
      return NextResponse.json(
        { error: "PayPal order ID non corrisponde" },
        { status: 400 }
      );
    }

    if (order.payment_status === "paid") {
      // Already captured (e.g. by webhook) — idempotent success
      return NextResponse.json({ success: true, already_captured: true });
    }

    if (order.status !== "pending" || order.payment_status !== "pending") {
      return NextResponse.json(
        { error: "Ordine non pagabile" },
        { status: 400 }
      );
    }

    // 3. Capture the PayPal payment
    const capture = await capturePayPalOrder(paypal_order_id);

    if (capture.status !== "COMPLETED") {
      console.error("PayPal capture not completed:", capture);
      return NextResponse.json(
        { error: `Pagamento non completato: stato ${capture.status}` },
        { status: 400 }
      );
    }

    // 4. Update order in DB
    const { error: updateError } = await supabase
      .from("orders")
      .update({
        status: "confirmed",
        payment_status: "paid",
        payment_method: "paypal",
        paypal_capture_id: capture.capture_id,
      })
      .eq("id", order_id);

    if (updateError) {
      console.error("DB update after capture failed:", updateError);
      return NextResponse.json(
        { error: "Pagamento catturato ma errore aggiornamento DB" },
        { status: 500 }
      );
    }

    // Invia l'email di conferma ordine (await per evitare terminazione prematura del serverless handler)
    await sendOrderConfirmationEmail(order_id).catch(console.error);

    return NextResponse.json({ success: true, capture_id: capture.capture_id });
  } catch (error) {
    console.error("PayPal capture-order error:", error);
    return NextResponse.json(
      { error: "Errore durante la cattura del pagamento" },
      { status: 500 }
    );
  }
}
