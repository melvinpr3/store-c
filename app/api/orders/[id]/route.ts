import { NextRequest, NextResponse } from "next/server";
import { verifyOrderPaymentToken } from "../../../../lib/order-token";
import { createServiceClient } from "../../../../lib/supabase-server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: orderId } = await params;
    const token = request.nextUrl.searchParams.get("token");

    if (!token || !verifyOrderPaymentToken(token, orderId)) {
      return NextResponse.json({ error: "Token non valido o scaduto" }, { status: 401 });
    }

    const supabase = createServiceClient();
    const { data: order, error } = await supabase
      .from("orders")
      .select(
        "id, order_number, total, subtotal, shipping_cost, shipping_address, status, payment_status, order_items(id, product_name, product_image, brand, price, quantity, size)"
      )
      .eq("id", orderId)
      .single();

    if (error || !order) {
      return NextResponse.json({ error: "Ordine non trovato" }, { status: 404 });
    }

    if (order.status !== "pending" || order.payment_status !== "pending") {
      return NextResponse.json({ error: "Ordine non pagabile" }, { status: 400 });
    }

    return NextResponse.json({ order });
  } catch (error) {
    console.error("fetch order error:", error);
    return NextResponse.json({ error: "Errore interno" }, { status: 500 });
  }
}
