import { NextRequest, NextResponse } from "next/server";
import { subscribeContact, sendWelcomeEmail } from "@/lib/email";

// Resend is the subscriber database. No Supabase dependency here:
// Supabase stays reserved for login/premium-dashboard/API keys/
// purchases, provisioned later, but subscriber capture doesn't wait
// on that. Resend's Contacts model (global, keyed by email, upsert
// on re-add) is a complete subscriber list on its own.
export async function POST(req: NextRequest) {
  const { email } = await req.json();

  if (!email || typeof email !== "string" || !email.includes("@")) {
    return NextResponse.json({ error: "Invalid email" }, { status: 400 });
  }

  const result = await subscribeContact(email);
  if (!result.ok) {
    if (result.reason === "not_configured") {
      console.warn("subscribe: Resend not configured, dropping", email);
      return NextResponse.json(
        { error: "Subscribe is not configured yet" },
        { status: 503 },
      );
    }
    return NextResponse.json({ error: "Could not subscribe" }, { status: 500 });
  }

  // Best-effort: they're subscribed per Resend regardless of whether
  // the welcome email itself succeeds.
  await sendWelcomeEmail(email);

  return NextResponse.json({ ok: true });
}
