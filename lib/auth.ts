import { createClient } from "@/lib/supabase/server";

export type ViewerTier = "anonymous" | "free" | "pro";

export async function getViewerTier(): Promise<ViewerTier> {
  const supabase = await createClient();
  if (!supabase) return "anonymous"; // Supabase not provisioned yet

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return "anonymous";

  const { data: profile } = await supabase
    .from("profiles")
    .select("tier")
    .eq("id", user.id)
    .single();

  return profile?.tier === "pro" ? "pro" : "free";
}
