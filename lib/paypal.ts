/**
 * PayPal REST API v2 — Server-side client for Store-C (Maisonelle)
 *
 * Handles OAuth2 token management, order creation, and payment capture.
 * CRITICAL: No Aurelio/Arealusso identifiers must ever be sent to PayPal.
 */

// ─── Configuration ──────────────────────────────────────────────────────────

const PAYPAL_CLIENT_ID = process.env.PAYPAL_CLIENT_ID!;
const PAYPAL_CLIENT_SECRET = process.env.PAYPAL_CLIENT_SECRET!;
const PAYPAL_API_BASE = process.env.PAYPAL_API_BASE || "https://api-m.sandbox.paypal.com";

function assertPayPalConfig() {
  if (!PAYPAL_CLIENT_ID || !PAYPAL_CLIENT_SECRET) {
    throw new Error("PayPal credentials (PAYPAL_CLIENT_ID / PAYPAL_CLIENT_SECRET) are not configured");
  }
}

// ─── OAuth2 Token (cached) ──────────────────────────────────────────────────

let cachedToken: { token: string; expiresAt: number } | null = null;

export async function getPayPalAccessToken(): Promise<string> {
  assertPayPalConfig();

  // Return cached token if still valid (with 60s buffer)
  if (cachedToken && Date.now() < cachedToken.expiresAt - 60_000) {
    return cachedToken.token;
  }

  const credentials = Buffer.from(`${PAYPAL_CLIENT_ID}:${PAYPAL_CLIENT_SECRET}`).toString("base64");

  const res = await fetch(`${PAYPAL_API_BASE}/v1/oauth2/token`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${credentials}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "grant_type=client_credentials",
  });

  if (!res.ok) {
    const text = await res.text();
    console.error("PayPal OAuth error:", res.status, text);
    throw new Error(`PayPal OAuth failed: ${res.status}`);
  }

  const data = await res.json();
  cachedToken = {
    token: data.access_token,
    expiresAt: Date.now() + data.expires_in * 1000,
  };

  return cachedToken.token;
}

// ─── Types ──────────────────────────────────────────────────────────────────

export interface PayPalOrderItem {
  name: string;
  quantity: number;
  unit_amount: string; // e.g. "199.00"
}

export interface CreatePayPalOrderParams {
  /** Internal order number (NXS-XXXXXX format) — used as custom_id */
  orderNumber: string;
  /** Total amount in EUR */
  amount: string;
  /** Breakdown: item_total */
  itemTotal: string;
  /** Breakdown: shipping cost */
  shippingCost: string;
  /** Line items (product names only — no Aurelio refs) */
  items: PayPalOrderItem[];
  /** Where PayPal redirects after approval */
  returnUrl: string;
  /** Where PayPal redirects on cancel */
  cancelUrl: string;
}

export interface PayPalCreateOrderResponse {
  id: string;
  status: string;
  approve_url: string;
}

export interface PayPalCaptureResponse {
  id: string;
  status: string;
  capture_id: string;
}

// ─── Create PayPal Order ────────────────────────────────────────────────────

export async function createPayPalOrder(
  params: CreatePayPalOrderParams
): Promise<PayPalCreateOrderResponse> {
  const accessToken = await getPayPalAccessToken();

  const payload = {
    intent: "CAPTURE",
    purchase_units: [
      {
        reference_id: "default",
        custom_id: params.orderNumber, // NXS-XXXXXX — never Aurelio IDs
        description: "Maisonelle — Ordine",
        amount: {
          currency_code: "EUR",
          value: params.amount,
          breakdown: {
            item_total: {
              currency_code: "EUR",
              value: params.itemTotal,
            },
            shipping: {
              currency_code: "EUR",
              value: params.shippingCost,
            },
          },
        },
        items: params.items.map((item) => ({
          name: item.name.substring(0, 127), // PayPal max 127 chars
          quantity: String(item.quantity),
          unit_amount: {
            currency_code: "EUR",
            value: item.unit_amount,
          },
          category: "PHYSICAL_GOODS",
        })),
      },
    ],
    payment_source: {
      paypal: {
        experience_context: {
          brand_name: "Maisonelle",
          landing_page: "LOGIN",
          user_action: "PAY_NOW",
          return_url: params.returnUrl,
          cancel_url: params.cancelUrl,
        },
      },
    },
  };

  const res = await fetch(`${PAYPAL_API_BASE}/v2/checkout/orders`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
      Prefer: "return=representation",
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const text = await res.text();
    console.error("PayPal create order error:", res.status, text);
    throw new Error(`PayPal create order failed: ${res.status}`);
  }

  const data = await res.json();

  // Extract the approval URL from HATEOAS links
  const approveLink = data.links?.find(
    (link: { rel: string; href: string }) => link.rel === "payer-action"
  );

  if (!approveLink) {
    throw new Error("PayPal did not return an approval URL");
  }

  return {
    id: data.id,
    status: data.status,
    approve_url: approveLink.href,
  };
}

// ─── Capture PayPal Order ───────────────────────────────────────────────────

export async function capturePayPalOrder(
  paypalOrderId: string
): Promise<PayPalCaptureResponse> {
  const accessToken = await getPayPalAccessToken();

  const res = await fetch(
    `${PAYPAL_API_BASE}/v2/checkout/orders/${paypalOrderId}/capture`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
        Prefer: "return=representation",
      },
    }
  );

  if (!res.ok) {
    const text = await res.text();
    console.error("PayPal capture error:", res.status, text);
    throw new Error(`PayPal capture failed: ${res.status}`);
  }

  const data = await res.json();

  // Extract capture ID from the first purchase unit's first capture
  const captureId =
    data.purchase_units?.[0]?.payments?.captures?.[0]?.id || data.id;

  return {
    id: data.id,
    status: data.status,
    capture_id: captureId,
  };
}

// ─── Verify Webhook Signature ───────────────────────────────────────────────

export async function verifyPayPalWebhook(
  headers: Record<string, string>,
  body: string
): Promise<boolean> {
  const webhookId = process.env.PAYPAL_WEBHOOK_ID;
  if (!webhookId) {
    console.warn("PAYPAL_WEBHOOK_ID not configured — skipping verification");
    return false;
  }

  const accessToken = await getPayPalAccessToken();

  const verifyPayload = {
    auth_algo: headers["paypal-auth-algo"],
    cert_url: headers["paypal-cert-url"],
    transmission_id: headers["paypal-transmission-id"],
    transmission_sig: headers["paypal-transmission-sig"],
    transmission_time: headers["paypal-transmission-time"],
    webhook_id: webhookId,
    webhook_event: JSON.parse(body),
  };

  const res = await fetch(
    `${PAYPAL_API_BASE}/v1/notifications/verify-webhook-signature`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(verifyPayload),
    }
  );

  if (!res.ok) {
    console.error("PayPal webhook verification failed:", res.status);
    return false;
  }

  const data = await res.json();
  return data.verification_status === "SUCCESS";
}
