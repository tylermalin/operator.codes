import { createHmac, timingSafeEqual } from "crypto";

// A bare `?email=` unsubscribe link is an open oracle: anyone who
// knows an address could silently unsubscribe it. This signs the
// email with an HMAC so only a link that actually went out in a real
// send is valid. Reuses RESEND_API_KEY as the HMAC key rather than
// adding a new secret to provision — it's already private, already
// required for email to function at all, and the threat model here
// is "stop a stranger from unsubscribing an address they don't
// control," not defending a high-value secret.
const secret = process.env.RESEND_API_KEY;

export function signUnsubscribeToken(email: string): string | null {
  if (!secret) return null;
  return createHmac("sha256", secret).update(email).digest("hex");
}

export function verifyUnsubscribeToken(email: string, token: string): boolean {
  const expected = signUnsubscribeToken(email);
  if (!expected) return false;
  const a = Buffer.from(expected);
  const b = Buffer.from(token);
  return a.length === b.length && timingSafeEqual(a, b);
}
