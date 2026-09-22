import Stripe from "stripe";

const secretKey = process.env.STRIPE_SECRET_KEY;

export function getStripe(): Stripe | null {
  if (!secretKey) return null;
  return new Stripe(secretKey, { apiVersion: "2026-08-26.dahlia" });
}
