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
      <div className="max-w-md mx-auto px-6 py-32 text-center">
        <h1 className="text-2xl sm:text-3xl font-normal tracking-tight mb-4">
          Check your email.
        </h1>
        <p className="text-muted">Click the link to sign in.</p>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto px-6 py-32">
      <h1 className="text-2xl sm:text-3xl font-normal tracking-tight mb-8">
        Sign in
      </h1>
      <form onSubmit={handleSubmit} className="flex gap-3">
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@company.com"
          className="flex-1 bg-surface border border-border-md rounded-full px-4 py-2.5 text-sm placeholder:text-faint transition-colors focus:border-accent-border"
        />
        <button
          type="submit"
          disabled={status === "loading"}
          className="btn-primary rounded-full px-5 py-2.5 text-sm font-medium disabled:opacity-50"
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
