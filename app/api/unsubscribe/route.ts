import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { verifyUnsubscribeToken } from "@/lib/unsubscribe-token";

const apiKey = process.env.RESEND_API_KEY;
const client = apiKey ? new Resend(apiKey) : null;

// GET so this works as a plain link clicked from an email client, no
// form or JS required. Token-gated: see lib/unsubscribe-token.ts for
// why a bare ?email= link isn't safe to ship.
export async function GET(req: NextRequest) {
  const email = req.nextUrl.searchParams.get("email");
  const token = req.nextUrl.searchParams.get("token");

  if (!email || !token || !verifyUnsubscribeToken(email, token)) {
    return NextResponse.json({ error: "Invalid unsubscribe link" }, { status: 400 });
  }

  if (!client) {
    return NextResponse.json(
      { error: "Unsubscribe is not configured yet" },
      { status: 503 },
    );
  }

  const { error } = await client.contacts.update({ email, unsubscribed: true });
  if (error) {
    console.error("unsubscribe failed:", error);
    return NextResponse.json({ error: "Could not unsubscribe" }, { status: 500 });
  }

  return new NextResponse(
    `<!DOCTYPE html><html><head><meta charset="utf-8"><title>Unsubscribed</title></head><body style="font-family:sans-serif;max-width:32rem;margin:4rem auto;padding:0 1.5rem;color:#1f2937;">
      <p>You're unsubscribed. ${email} won't receive Operator emails going forward.</p>
      <p><a href="https://operator.codes">Back to operator.codes</a></p>
    </body></html>`,
    { headers: { "Content-Type": "text/html" } },
  );
}
