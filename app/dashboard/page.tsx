import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import KeyManager from "@/components/key-manager";
import UpgradeButton from "@/components/upgrade-button";

export default async function DashboardPage() {
  const supabase = await createClient();
  if (!supabase) {
    return (
      <div className="max-w-2xl mx-auto px-6 py-24 text-center">
        <p className="text-muted">Dashboard isn&apos;t configured yet.</p>
      </div>
    );
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("tier")
    .eq("id", user.id)
    .single();

  const { data: initialKeys } = await supabase
    .from("api_keys")
    .select("id, key_prefix, rate_limit_quota, is_active, created_at")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  return (
    <div className="max-w-2xl mx-auto px-6 py-24">
      <h1 className="text-3xl sm:text-4xl font-normal tracking-tight mb-2">
        Dashboard
      </h1>
      <p className="text-muted mb-12">{user.email}</p>

      <div className="border border-border rounded-2xl p-8 mb-12">
        <p className="font-mono text-xs text-muted mb-2">Current tier</p>
        <p className="text-xl font-normal capitalize">
          {profile?.tier ?? "free"}
        </p>
        {profile?.tier !== "pro" && (
          <UpgradeButton />
        )}
      </div>

      <h2 className="font-mono text-sm text-muted mb-6">API keys</h2>
      <KeyManager initialKeys={initialKeys ?? []} />
    </div>
  );
}
