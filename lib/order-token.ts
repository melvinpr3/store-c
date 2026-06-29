import crypto from "crypto";

const TOKEN_TTL_MS = 60 * 60 * 1000; // 1 hour

export interface OrderPaymentTokenPayload {
  orderId: string;
  userId: string;
  exp: number;
}

function getSecret(): string {
  const secret = process.env.ORDER_PAYMENT_TOKEN_SECRET;
  if (!secret) {
    throw new Error("ORDER_PAYMENT_TOKEN_SECRET is not configured");
  }
  return secret;
}

export function signOrderPaymentToken(orderId: string, userId: string): string {
  const payload: OrderPaymentTokenPayload = {
    orderId,
    userId,
    exp: Date.now() + TOKEN_TTL_MS,
  };
  const data = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const sig = crypto.createHmac("sha256", getSecret()).update(data).digest("base64url");
  return `${data}.${sig}`;
}

export function verifyOrderPaymentToken(
  token: string,
  orderId: string
): OrderPaymentTokenPayload | null {
  try {
    const [data, sig] = token.split(".");
    if (!data || !sig) return null;

    const expected = crypto.createHmac("sha256", getSecret()).update(data).digest("base64url");
    const sigBuf = Buffer.from(sig);
    const expectedBuf = Buffer.from(expected);
    if (sigBuf.length !== expectedBuf.length || !crypto.timingSafeEqual(sigBuf, expectedBuf)) {
      return null;
    }

    const payload = JSON.parse(
      Buffer.from(data, "base64url").toString("utf8")
    ) as OrderPaymentTokenPayload;

    if (payload.orderId !== orderId) return null;
    if (payload.exp < Date.now()) return null;

    return payload;
  } catch {
    return null;
  }
}
