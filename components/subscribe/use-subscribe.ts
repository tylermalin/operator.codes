"use client";

import { useState } from "react";

export type SubscribeStatus = "idle" | "loading" | "done" | "error";

// Shared submit logic for every subscribe surface (header popover,
// inline form, /subscribe page) so they behave and fail the same way.
export function useSubscribe() {
  const [status, setStatus] = useState<SubscribeStatus>("idle");
  const [error, setError] = useState<string | null>(null);

  async function subscribe(email: string): Promise<boolean> {
    setStatus("loading");
    setError(null);
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (res.status === 400) {
        setError("That email doesn't look right.");
        setStatus("error");
        return false;
      }
      if (!res.ok) throw new Error(String(res.status));
      setStatus("done");
      return true;
    } catch {
      setError("Couldn't subscribe just now. Try again in a minute.");
      setStatus("error");
      return false;
    }
  }

  function reset() {
    setStatus("idle");
    setError(null);
  }

  return { status, error, subscribe, reset };
}
