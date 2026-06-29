import { supabase } from "./supabase";

export async function fetchOrderPaymentToken(orderId: string): Promise<string> {
  const {
    data: { session },
  } = await supabase.auth.getSession();

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  if (session?.access_token) {
    headers["Authorization"] = `Bearer ${session.access_token}`;
  }

  const res = await fetch(`/api/orders/${orderId}/payment-token`, {
    method: "POST",
    headers,
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error || "Impossibile generare il token di pagamento");
  }

  const { token } = await res.json();
  return token;
}
