import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "../../../../lib/supabase-server";
import { sendTelegramNotification } from "../../../../lib/telegram";

interface ShippingAddress {
  full_name?: string;
  email?: string;
  phone?: string;
}

interface OrderItem {
  product_name: string;
  quantity: number;
  size?: string;
  price: number;
}

export async function POST(request: NextRequest) {
  try {
    const { orderId } = await request.json() as { orderId?: string };

    if (!orderId) {
      return NextResponse.json({ error: "Missing orderId" }, { status: 400 });
    }

    const supabase = createServiceClient();

    // Fetch complete order details including items
    const { data: order, error } = await supabase
      .from("orders")
      .select("*, order_items(*)")
      .eq("id", orderId)
      .single();

    if (error || !order) {
      console.error("Telegram notify-telegram (Store B): Order not found", error);
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    const storeName = order.store_id === "store-c" ? "Maisonelle" : "Aurelio";
    const customerName = order.customer_name || "Ospite";
    const customerEmail = order.customer_email || "N/D";
    const shippingAddress = order.shipping_address as unknown as ShippingAddress | null;

    // Fallback info if customer_name/email aren't directly populated yet
    const name = customerName === "Ospite" && shippingAddress?.full_name ? shippingAddress.full_name : customerName;
    const email = customerEmail === "N/D" && shippingAddress?.email ? shippingAddress.email : customerEmail;
    const phone = order.customer_phone || shippingAddress?.phone || "N/D";

    // Format items list
    const itemsList = ((order.order_items || []) as unknown as OrderItem[])
      .map((item) => `• <b>${item.product_name}</b> (Qty: ${item.quantity}, Taglia: ${item.size || "Unica"}) - €${item.price}`)
      .join("\n");

    const message = `<b>🆕 NUOVO ORDINE CREATO [PENDING]</b>\n\n` +
      `<b>Store:</b> ${storeName}\n` +
      `<b>Ordine N.:</b> #<code>${order.order_number}</code>\n` +
      `<b>Cliente:</b> ${name}\n` +
      `<b>Email:</b> ${email}\n` +
      `<b>Telefono:</b> ${phone}\n` +
      `<b>Totale:</b> €${Number(order.total).toFixed(2)} (Spedizione: €${Number(order.shipping_cost).toFixed(2)})\n\n` +
      `<b>Articoli:</b>\n${itemsList}`;

    await sendTelegramNotification(message);

    return NextResponse.json({ success: true });
  } catch (error) {
    const err = error as Error;
    console.error("Telegram API route error (Store B):", err);
    return NextResponse.json({ error: err.message || "Internal server error" }, { status: 500 });
  }
}
