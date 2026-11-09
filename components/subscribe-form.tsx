"use client";

import { useCallback, useId, useState } from "react";
import { useSubscribe } from "@/components/subscribe/use-subscribe";
import Toast, { SUBSCRIBED_MESSAGE } from "@/components/subscribe/toast";

// Inline subscribe: field + primary button on one line, stacking on
// narrow screens. Used on the home page, /subscribe, and the end of
// every free essay. Confirms with the same toast as the header button,
// and swaps the form for a short line so the page reflects the state.
export default function SubscribeForm() {
  const [email, setEmail] = useState("");
  const [toast, setToast] = useState(false);
  const { status, error, subscribe } = useSubscribe();
  const id = useId();
  const dismiss = useCallback(() => setToast(false), []);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (await subscribe(email)) setToast(true);
  }

  return (
    <>
      {status === "done" ? (
        <p className="text-[15px] text-muted">
          Subscribed as <span className="text-foreground">{email}</span>.
        </p>
      ) : (
        <form onSubmit={onSubmit} className="w-full max-w-md">
          <div className="flex flex-col gap-2.5 sm:flex-row">
            <label htmlFor={`${id}-email`} className="sr-only">
              Email address
            </label>
            <input
              id={`${id}-email`}
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@example.com"
              aria-invalid={status === "error"}
              aria-describedby={error ? `${id}-error` : undefined}
              className="field h-11 flex-1 rounded-full px-5 text-[15px]"
            />
            <button
              type="submit"
              disabled={status === "loading"}
              className="btn-primary h-11 rounded-full px-6 text-[15px]"
            >
              {status === "loading" ? "Subscribing…" : "Subscribe"}
            </button>
          </div>
          {error && (
            <p id={`${id}-error`} role="alert" className="mt-2.5 px-1 text-sm text-red">
              {error}
            </p>
          )}
        </form>
      )}
      {toast && <Toast message={SUBSCRIBED_MESSAGE} onDismiss={dismiss} />}
    </>
  );
}
