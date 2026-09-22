import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { generateApiKey } from "@/lib/api-keys";

export async function GET() {
  const supabase = await createClient();
  if (!supabase) {
    return NextResponse.json(
      { error: "Not configured yet" },
      { status: 503 },
    );
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Sign in first" }, { status: 401 });
  }

  // RLS on api_keys already restricts this to the caller's own rows;
  // the .eq is belt-and-suspenders, not the actual security boundary.
  const { data: keys, error } = await supabase
    .from("api_keys")
    .select("id, key_prefix, rate_limit_quota, is_active, created_at")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: "Could not list keys" }, { status: 500 });
  }

  return NextResponse.json({ keys });
}

export async function POST() {
  const supabase = await createClient();
  if (!supabase) {
    return NextResponse.json(
      { error: "Not configured yet" },
      { status: 503 },
    );
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Sign in first" }, { status: 401 });
  }

  const { rawKey, hashedKey, prefix } = generateApiKey();

  const { error } = await supabase.from("api_keys").insert({
    user_id: user.id,
    hashed_key: hashedKey,
    key_prefix: prefix,
  });

  if (error) {
    return NextResponse.json({ error: "Could not create key" }, { status: 500 });
  }

  // rawKey is returned exactly once. The client is responsible for
  // showing it to the user and never persisting it beyond this response.
  return NextResponse.json({ rawKey, prefix });
}
