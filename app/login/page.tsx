"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "sent" | "error">(
    "idle",
  );

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const supabase = createClient();
    if (!supabase) {
      setStatus("error");
      return;
    }
    setStatus("loading");
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: `${window.location.origin}/auth/confirm` },
    });
    setStatus(error ? "error" : "sent");
  }

  if (status === "sent") {
    return (
      <div className="max-w-md mx-auto px-6 py-24 text-center">
        <h1 className="text-2xl font-bold mb-3">Check your email.</h1>
        <p className="text-muted">Click the link to sign in.</p>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto px-6 py-24">
      <h1 className="text-2xl font-bold mb-6">Sign in</h1>
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@company.com"
          className="flex-1 bg-surface border border-border-md rounded-full px-4 py-2.5 text-sm placeholder:text-faint focus:outline-none focus:border-accent-border"
        />
        <button
          type="submit"
          disabled={status === "loading"}
          className="bg-accent text-background font-medium rounded-full px-5 py-2.5 text-sm hover:bg-accent-light transition-colors disabled:opacity-50"
        >
          {status === "loading" ? "..." : "Send link"}
        </button>
      </form>
      {status === "error" && (
        <p className="text-red text-sm mt-3">
          Sign-in isn&apos;t configured yet, or something broke.
        </p>
      )}
    </div>
  );
}
