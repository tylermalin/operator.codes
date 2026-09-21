import { NextRequest, NextResponse } from "next/server";

// Placeholder subscribe handler. Swap the body of this function for
// whichever ESP gets picked (Beehiiv, ConvertKit, etc). Keeping the
// route contract stable (POST { email }) means the frontend never
// changes when the backend does.
export async function POST(req: NextRequest) {
  const { email } = await req.json();

  if (!email || typeof email !== "string" || !email.includes("@")) {
    return NextResponse.json({ error: "Invalid email" }, { status: 400 });
  }

  // TODO: wire to real ESP. For now this is a no-op success so the
  // frontend flow can be built and tested end to end.
  console.log("subscribe:", email);

  return NextResponse.json({ ok: true });
}
