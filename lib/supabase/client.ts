import { createBrowserClient } from "@supabase/ssr";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Returns null instead of throwing when Supabase isn't provisioned yet.
// Every caller must handle the null case, treating the visitor as
// anonymous. This keeps the app runnable before the project exists.
export function createClient() {
  if (!url || !anonKey) return null;
  return createBrowserClient(url, anonKey);
}
