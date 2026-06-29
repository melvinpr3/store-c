import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "../../../lib/supabase-server";
import { verifyWhopWebhook } from "../../../lib/whop";
import { sendOrderConfirmationEmail } from "../../../lib/email";

/**
 * POST /api/whop-webhook
 *
 * Receives Whop webhook notifications.
 * Marks the order as paid when payment.succeeded is received.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.text();

    // 1. Collect headers (case-insensitive)
    const headers: Record<string, string> = {};
    request.headers.forEach((value, key) => {
      headers[key.toLowerCase()] = value;
    });

    // 2. Log raw event for debugging
    console.log("Whop webhook raw body (first 500 chars):", body.substring(0, 500));

    // 3. Verify webhook signature (non-blocking for debugging — logs warning but continues)
    const isValid = await verifyWhopWebhook(headers, body);
    if (!isValid && process.env.WHOP_WEBHOOK_SECRET) {
      console.warn(
        "Whop webhook: signature verification failed — processing anyway for debugging. " +
          "Ensure WHOP_WEBHOOK_SECRET matches the signing secret in the Whop dashboard."
      );
      // Uncomment to enforce once webhooks are confirmed working:
      // return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }

    // 4. Parse event
    let event: Record<string, unknown>;
    try {
      event = JSON.parse(body) as Record<string, unknown>;
    } catch {
      console.error("Whop webhook: failed to parse JSON body");
      return NextResponse.json({ received: true });
    }

    // 5. Log event type for debugging
    const eventType = event.type as string | undefined;
    console.log(`Whop webhook event type: "${eventType}"`);
    console.log(
      "Whop webhook event data keys:",
      JSON.stringify(Object.keys((event.data as Record<string, unknown>) || {}))
    );

    // 6. Handle payment — Whop may send "payment.succeeded" or variations
    const isPaymentSucceeded =
      eventType === "payment.succeeded" ||
      eventType === "payment_succeeded" ||
      eventType === "Payment.succeeded";

    if (isPaymentSucceeded) {
      const payment = event.data as Record<string, unknown>;
      const paymentId = payment?.id as string | undefined;
      const metadata = payment?.metadata as Record<string, string> | undefined;

      console.log(
        "Whop webhook payment data:",
        JSON.stringify(payment).substring(0, 500)
      );
      console.log("Whop webhook metadata:", JSON.stringify(metadata));

      const orderId = metadata?.order_id;
      const orderNumber = metadata?.order_number;

      if (!orderId) {
        console.warn(
          `Whop webhook: missing order_id in metadata. Full metadata: ${JSON.stringify(metadata)}`
        );
        return NextResponse.json({ received: true });
      }

      console.log(
        `Whop webhook: processing payment for order_id=${orderId}, order_number=${orderNumber}`
      );

      const supabase = createServiceClient();

      // Look up order by id
      const { data: order, error: fetchError } = await supabase
        .from("orders")
        .select("id, payment_status, order_number")
        .eq("id", orderId)
        .single();

      if (fetchError || !order) {
        console.warn(
          `Whop webhook: order not found for id=${orderId}. DB error: ${JSON.stringify(fetchError)}`
        );
        return NextResponse.json({ received: true });
      }

      // Idempotent: skip if already paid
      if (order.payment_status === "paid") {
        console.log(
          `Whop webhook: order ${order.order_number} already paid, skipping`
        );
        return NextResponse.json({ received: true });
      }

      // Update order status
      const { error: updateError } = await supabase
        .from("orders")
        .update({
          status: "confirmed",
          payment_status: "paid",
          payment_method: "whop",
          whop_payment_id: paymentId,
        })
        .eq("id", order.id);

      if (updateError) {
        console.error("Whop webhook: DB update failed:", updateError);
        return NextResponse.json({ error: "DB update failed" }, { status: 500 });
      }

      console.log(
        `Whop webhook: ✅ order ${order.order_number} marked as paid (whop_payment_id=${paymentId})`
      );

      // Send confirmation email + Telegram notification
      await sendOrderConfirmationEmail(order.id).catch(console.error);
    } else {
      console.log(
        `Whop webhook: unhandled event type "${eventType}" — ignoring`
      );
    }

    // Always return 200 to Whop to acknowledge receipt
    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Whop webhook error:", error);
    return NextResponse.json({ received: true });
  }
}
