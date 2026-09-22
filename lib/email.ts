import { Resend } from "resend";

// Newsletter ESP and subscriber database, both. Decision: Resend
// over Loops (API-first Contacts/Segments/Broadcasts fits a
// code-first stack), and Resend Contacts over a Supabase table
// (Tyler: not using Supabase for this — Resend's Contacts model,
// global and keyed by email, is already a complete subscriber list,
// no separate store needed). Supabase stays reserved for
// login/premium-dashboard/API keys/purchases, provisioned later.
//
// Scope of what this file does: capture a subscriber into Resend and
// send a welcome email. Sending an actual issue when an essay
// publishes is a separate, not-yet-built step — see the commit
// message for what that would take.

const apiKey = process.env.RESEND_API_KEY;
const segmentId = process.env.RESEND_SEGMENT_ID;
const fromAddress =
  process.env.RESEND_FROM_ADDRESS || "Operator <hello@operator.codes>";

const client = apiKey ? new Resend(apiKey) : null;

export const emailConfigured = Boolean(client && segmentId);

type SubscribeResult =
  | { ok: true }
  | { ok: false; reason: "not_configured" | "error" };

// Adds the address as a Resend Contact in the configured Segment.
// Resend's own docs describe re-adding an existing email as an
// update, not a duplicate, so a second subscribe from the same
// address is treated as success here too rather than surfaced as an
// error to the person filling out the form.
export async function subscribeContact(email: string): Promise<SubscribeResult> {
  if (!client || !segmentId) return { ok: false, reason: "not_configured" };

  const { error } = await client.contacts.create({
    email,
    unsubscribed: false,
    segments: [{ id: segmentId }],
  });

  if (error) {
    console.error("resend subscribeContact failed:", error);
    return { ok: false, reason: "error" };
  }

  return { ok: true };
}

export async function sendWelcomeEmail(email: string): Promise<void> {
  if (!client) return;

  const { error } = await client.emails.send({
    from: fromAddress,
    to: email,
    subject: "You're subscribed to Operator",
    html: `<p>You're on the list. New essays on AI systems, climate infrastructure, legal engineering, and protocol design land in your inbox as they're published.</p><p><a href="https://operator.codes/essays">Read the archive</a> in the meantime.</p>`,
  });

  if (error) {
    console.error("resend welcome email failed:", error);
  }
}
