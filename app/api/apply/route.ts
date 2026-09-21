import { NextRequest, NextResponse } from "next/server";

// Same swappable-backend pattern as /api/subscribe. Point this at
// Formspree, a database, or a Slack webhook once that decision is made.
export async function POST(req: NextRequest) {
  const body = await req.json();

  if (!body.email || !body.problem) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  console.log("apply:", body);

  return NextResponse.json({ ok: true });
}
