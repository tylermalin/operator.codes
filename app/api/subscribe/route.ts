import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";

// Writes to the `subscribers` table (email only, no account) via the
// service-role client, since subscribers has no public insert policy.
// Actual dispatch (Resend/Loops) still needs wiring in lib/email.ts;
// this route only handles capture, not delivery.
export async function POST(req: NextRequest) {
  const { email } = await req.json();

  if (!email || typeof email !== "string" || !email.includes("@")) {
    return NextResponse.json({ error: "Invalid email" }, { status: 400 });
  }

  const supabase = createServiceClient();
  if (!supabase) {
    // Supabase isn't provisioned yet. Fail loudly in dev rather than
    // silently pretending the subscribe worked.
    console.warn("subscribe: Supabase not configured, dropping", email);
    return NextResponse.json(
      { error: "Subscribe is not configured yet" },
      { status: 503 },
    );
  }

  const { error } = await supabase
    .from("subscribers")
    .upsert({ email, unsubscribed_at: null }, { onConflict: "email" });

  if (error) {
    console.error("subscribe error:", error);
    return NextResponse.json({ error: "Could not subscribe" }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
