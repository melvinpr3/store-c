import { supabase } from "./supabase";
import { Order } from "./types";

export interface CreateOrderParams {
  store_id: string;
  shipping_address: Record<string, unknown>;
  shipping_cost?: number;
}

export interface CreateOrderItem {
  product_id: string;
  quantity: number;
  size?: string;
}

export async function createOrderWithItems(
  params: CreateOrderParams,
  items: CreateOrderItem[]
): Promise<Order> {
  const { data, error } = await supabase.rpc("create_order_with_items", {
    p_store_id: params.store_id,
    p_shipping_address: params.shipping_address,
    p_items: items,
    p_shipping_cost: params.shipping_cost ?? 0,
  });

  if (error) {
    console.error("create_order_with_items error:", error);
    throw error;
  }

  // Trigger Telegram notification asynchronously
  if (typeof window !== "undefined") {
    fetch("/api/orders/notify-telegram", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ orderId: data.id }),
    }).catch((err) => console.error("Failed to notify Telegram on order creation in Store B:", err));
  }

  return data as Order;
}
