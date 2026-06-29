import crypto from "crypto";

const WHOP_API_KEY = process.env.WHOP_API_KEY!;
const WHOP_COMPANY_ID = process.env.WHOP_COMPANY_ID!;

// Allow sandbox override via WHOP_API_BASE env var
// Sandbox: https://sandbox-api.whop.com/api/v1
// Production: https://api.whop.com/api/v1
const WHOP_API_BASE =
  process.env.WHOP_API_BASE || "https://api.whop.com/api/v1";

export interface CreateWhopCheckoutParams {
  orderId: string;
  orderNumber: string;
  amount: number;
  paymentToken: string;
  cancelUrl: string;
  returnUrl: string;
}

export interface WhopCheckoutResponse {
  id: string;
  purchase_url: string;
}

export async function createWhopCheckout(
  params: CreateWhopCheckoutParams
): Promise<WhopCheckoutResponse> {
  if (!WHOP_API_KEY || !WHOP_COMPANY_ID) {
    throw new Error("Whop credentials (WHOP_API_KEY / WHOP_COMPANY_ID) are not configured");
  }

  // Create a checkout configuration on Whop
  const response = await fetch(`${WHOP_API_BASE}/checkout_configurations`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${WHOP_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      currency: "eur",
      plan: {
        company_id: WHOP_COMPANY_ID,
        initial_price: params.amount,
        plan_type: "one_time",
        currency: "eur",
        title: `Maisonelle — Ordine ${params.orderNumber}`,
      },
      redirect_url: params.returnUrl,
      metadata: {
        order_id: params.orderId,
        order_number: params.orderNumber,
        token: params.paymentToken,
      },
    }),
  });

  if (!response.ok) {
    const text = await response.text();
    console.error("Whop checkout configuration error:", response.status, text);
    throw new Error(`Whop checkout configuration creation failed: ${response.status}`);
  }

  const data = await response.json();
  if (!data.purchase_url) {
    throw new Error("Whop did not return a purchase_url");
  }

  return {
    id: data.id,
    purchase_url: data.purchase_url,
  };
}

export async function verifyWhopWebhook(
  headers: Record<string, string>,
  body: string
): Promise<boolean> {
  const webhookSecret = process.env.WHOP_WEBHOOK_SECRET;
  if (!webhookSecret) {
    console.warn("WHOP_WEBHOOK_SECRET not configured — skipping verification");
    return false;
  }

  // Extract headers case-insensitively
  const hId = headers["webhook-id"] || headers["svix-id"];
  const hTimestamp = headers["webhook-timestamp"] || headers["svix-timestamp"];
  const hSignature = headers["webhook-signature"] || headers["svix-signature"];

  if (!hId || !hTimestamp || !hSignature) {
    console.warn("Whop webhook verification: missing required headers");
    return false;
  }

  // Prevent replay attacks: verify timestamp (tolerance: 5 minutes)
  const tolerance = 5 * 60; // 5 minutes
  const now = Math.floor(Date.now() / 1000);
  const timestamp = parseInt(hTimestamp, 10);
  if (isNaN(timestamp) || Math.abs(now - timestamp) > tolerance) {
    console.warn("Whop webhook verification: timestamp outside tolerance limit");
    return false;
  }

  // Construct the signature payload: `${webhook_id}.${webhook_timestamp}.${body}`
  const signedContent = `${hId}.${hTimestamp}.${body}`;

  // Parse the webhook secret — Whop uses 'ws_' prefix (raw hex), Svix uses 'whsec_' (base64)
  let secretKey: string;
  let secretEncoding: BufferEncoding;
  if (webhookSecret.startsWith("whsec_")) {
    secretKey = webhookSecret.substring(6);
    secretEncoding = "base64";
  } else if (webhookSecret.startsWith("ws_")) {
    secretKey = webhookSecret.substring(3);
    secretEncoding = "hex";
  } else {
    // Unknown prefix — try base64
    secretKey = webhookSecret;
    secretEncoding = "base64";
  }

  try {
    const secretBuffer = Buffer.from(secretKey, secretEncoding);
    const computedSignature = crypto
      .createHmac("sha256", secretBuffer)
      .update(signedContent)
      .digest("base64");

    // Whop signature header format: v1,base64_signature (possibly multiple space-separated)
    const signatureParts = hSignature.split(" ");
    let verified = false;

    for (const part of signatureParts) {
      const [version, sig] = part.split(",");
      if (version === "v1" && sig) {
        const sigBuffer = Buffer.from(sig, "base64");
        const computedBuffer = Buffer.from(computedSignature, "base64");

        if (
          sigBuffer.length === computedBuffer.length &&
          crypto.timingSafeEqual(sigBuffer, computedBuffer)
        ) {
          verified = true;
          break;
        }
      }
    }

    return verified;
  } catch (error) {
    console.error("Whop webhook verification error:", error);
    return false;
  }
}
