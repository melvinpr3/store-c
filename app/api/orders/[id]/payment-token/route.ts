import { NextRequest, NextResponse } from "next/server";
import { signOrderPaymentToken } from "../../../../../lib/order-token";
import { createServiceClient, getUserFromBearer } from "../../../../../lib/supabase-server";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: orderId } = await params;
    const user = await getUserFromBearer(request); // can be null for guests

    const supabase = createServiceClient(); // use service client to bypass RLS and fetch order

    // Fetch the order
    const { data: order, error } = await supabase
      .from("orders")
      .select("id, user_id, status, payment_status")
      .eq("id", orderId)
      .single();

    if (error) {
      // PGRST116 means zero rows were returned (not found)
      if (error.code === "PGRST116") {
        return NextResponse.json({ error: "Ordine non trovato" }, { status: 404 });
      }
      console.error("payment-token database error:", error);
      return NextResponse.json(
        { error: "Errore di connessione al database", details: error.message },
        { status: 500 }
      );
    }

    if (!order) {
      return NextResponse.json({ error: "Ordine non trovato" }, { status: 404 });
    }

    // Verify ownership
    if (order.user_id) {
      // Order belongs to a user, so the user must be authenticated and match
      if (!user || order.user_id !== user.id) {
        return NextResponse.json({ error: "Non autorizzato" }, { status: 401 });
      }
    } else {
      // Guest order (user_id is null) - anyone who knows the random UUID can request the token
      // which is secure since guest order UUIDs are unguessable capability tokens.
    }

    if (order.status !== "pending" || order.payment_status !== "pending") {
      return NextResponse.json({ error: "Ordine non pagabile" }, { status: 400 });
    }

    const token = signOrderPaymentToken(orderId, user?.id || "guest");
    return NextResponse.json({ token });
  } catch (error) {
    console.error("payment-token error:", error);
    return NextResponse.json({ error: "Errore interno" }, { status: 500 });
  }
}
