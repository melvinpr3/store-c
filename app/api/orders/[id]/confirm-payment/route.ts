import { NextRequest, NextResponse } from "next/server";
import { verifyOrderPaymentToken } from "../../../../../lib/order-token";
import { createServiceClient } from "../../../../../lib/supabase-server";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: orderId } = await params;
    const body = await request.json();
    const { token, payment_method } = body as {
      token?: string;
      payment_method?: string;
    };

    if (!token || !payment_method) {
      return NextResponse.json({ error: "Parametri mancanti" }, { status: 400 });
    }

    const payload = verifyOrderPaymentToken(token, orderId);
    if (!payload) {
      return NextResponse.json({ error: "Token non valido o scaduto" }, { status: 401 });
    }

    const supabase = createServiceClient();
    
    // Build query — for guest orders (user_id is NULL in DB), 
    // payload.userId is "guest", so we filter with .is("user_id", null)
    let query = supabase
      .from("orders")
      .select("id, user_id, status, payment_status")
      .eq("id", orderId);

    if (payload.userId === "guest") {
      query = query.is("user_id", null);
    } else {
      query = query.eq("user_id", payload.userId);
    }

    const { data: order, error: fetchError } = await query.single();

    if (fetchError || !order) {
      return NextResponse.json({ error: "Ordine non trovato" }, { status: 404 });
    }

    if (order.status !== "pending" || order.payment_status !== "pending") {
      return NextResponse.json({ error: "Ordine già elaborato" }, { status: 400 });
    }

    const { error: updateError } = await supabase
      .from("orders")
      .update({
        status: "confirmed",
        payment_status: "paid",
        payment_method,
      })
      .eq("id", orderId);

    if (updateError) {
      console.error("confirm-payment update error:", updateError);
      return NextResponse.json({ error: "Errore aggiornamento ordine" }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("confirm-payment error:", error);
    return NextResponse.json({ error: "Errore interno" }, { status: 500 });
  }
}
