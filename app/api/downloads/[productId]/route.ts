import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getPresignedDownloadUrl } from "@/lib/blob";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ productId: string }> },
) {
  const { productId } = await params;

  const supabase = await createClient();
  if (!supabase) {
    return NextResponse.json(
      { error: "Downloads are not configured yet" },
      { status: 503 },
    );
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Sign in first" }, { status: 401 });
  }

  // Ownership check happens against `purchases`, not `products`, on
  // purpose: owning the product record tells you nothing about whether
  // this user paid for it.
  const { data: purchase } = await supabase
    .from("purchases")
    .select("id")
    .eq("user_id", user.id)
    .eq("product_id", productId)
    .single();

  if (!purchase) {
    return NextResponse.json({ error: "No purchase found" }, { status: 403 });
  }

  const { data: product } = await supabase
    .from("products")
    .select("blob_pathname")
    .eq("id", productId)
    .single();

  if (!product) {
    return NextResponse.json({ error: "Unknown product" }, { status: 404 });
  }

  const url = await getPresignedDownloadUrl(product.blob_pathname);
  if (!url) {
    return NextResponse.json(
      { error: "Storage is not configured yet" },
      { status: 503 },
    );
  }

  return NextResponse.json({ url });
}
