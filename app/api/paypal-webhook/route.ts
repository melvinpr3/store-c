import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "../../../lib/supabase-server";
import { verifyPayPalWebhook } from "../../../lib/paypal";
import { sendOrderConfirmationEmail } from "../../../lib/email";

/**
 * POST /api/paypal-webhook
 *
 * Receives PayPal IPN/Webhook notifications.
 * Acts as a safety net — if the return URL capture fails,
 * this ensures the order is still marked as paid.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.text();

    // 1. Verify webhook signature (if PAYPAL_WEBHOOK_ID is configured)
    const headers: Record<string, string> = {};
    request.headers.forEach((value, key) => {
      headers[key.toLowerCase()] = value;
    });

    const isValid = await verifyPayPalWebhook(headers, body);
    if (!isValid && process.env.PAYPAL_WEBHOOK_ID) {
      console.warn("PayPal webhook signature verification failed");
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }

    // 2. Parse webhook event
    const event = JSON.parse(body);
    const eventType = event.event_type;

    console.log(`PayPal webhook received: ${eventType}`);

    // 3. Handle PAYMENT.CAPTURE.COMPLETED
    if (eventType === "PAYMENT.CAPTURE.COMPLETED") {
      const capture = event.resource;
      const captureId = capture?.id;
      // The custom_id field contains our order_number (NXS-XXXXXX)
      const orderNumber = capture?.custom_id;

      if (!orderNumber) {
        console.warn("PayPal webhook: missing custom_id in capture resource");
        return NextResponse.json({ received: true });
      }

      const supabase = createServiceClient();

      // Look up order by order_number
      const { data: order, error: fetchError } = await supabase
        .from("orders")
        .select("id, payment_status")
        .eq("order_number", orderNumber)
        .single();

      if (fetchError || !order) {
        console.warn(`PayPal webhook: order not found for order_number=${orderNumber}`);
        return NextResponse.json({ received: true });
      }

      // Idempotent: skip if already paid
      if (order.payment_status === "paid") {
        console.log(`PayPal webhook: order ${orderNumber} already paid, skipping`);
        return NextResponse.json({ received: true });
      }

      // Update order
      const { error: updateError } = await supabase
        .from("orders")
        .update({
          status: "confirmed",
          payment_status: "paid",
          payment_method: "paypal",
          paypal_capture_id: captureId,
        })
        .eq("id", order.id);

      if (updateError) {
        console.error("PayPal webhook: DB update failed:", updateError);
        return NextResponse.json(
          { error: "DB update failed" },
          { status: 500 }
        );
      }

      console.log(`PayPal webhook: order ${orderNumber} marked as paid`);
      
      // Invia l'email di conferma ordine
      await sendOrderConfirmationEmail(order.id).catch(console.error);
    }

    // 4. Handle CHECKOUT.ORDER.APPROVED (optional — we mainly rely on capture)
    if (eventType === "CHECKOUT.ORDER.APPROVED") {
      console.log("PayPal webhook: order approved, awaiting capture");
    }

    // Always return 200 to PayPal to acknowledge receipt
    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("PayPal webhook error:", error);
    // Return 200 to avoid PayPal retrying on parse errors
    return NextResponse.json({ received: true });
  }
}
