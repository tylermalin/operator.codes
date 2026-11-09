"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";
import { useSubscribe } from "./use-subscribe";
import Toast, { SUBSCRIBED_MESSAGE } from "./toast";

// Subscribe in the page chrome: an outlined button with a bell that
// opens a small email popover. On success the popover closes and a
// toast confirms. Escape or a click outside closes it; focus moves to
// the field on open and back to the button on close.
export default function SubscribeButton({
  size = "md",
}: {
  size?: "sm" | "md";
}) {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [toast, setToast] = useState(false);
  const { status, error, subscribe, reset } = useSubscribe();
  const wrapRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const panelId = useId();
  const errorId = useId();

  const close = useCallback((returnFocus = true) => {
    setOpen(false);
    if (returnFocus) buttonRef.current?.focus();
  }, []);

  useEffect(() => {
    if (!open) return;
    inputRef.current?.focus();
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") close();
    }
    function onClick(e: MouseEvent) {
      if (!wrapRef.current?.contains(e.target as Node)) close(false);
    }
    document.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onClick);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onClick);
    };
  }, [open, close]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (await subscribe(email)) {
      setEmail("");
      close();
      setToast(true);
      reset();
    }
  }

  const dismissToast = useCallback(() => setToast(false), []);
  const pad = size === "sm" ? "h-9 px-4 text-sm" : "h-11 px-5 text-[15px]";

  return (
    <div ref={wrapRef} className="relative">
      <button
        ref={buttonRef}
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => (open ? close() : setOpen(true))}
        className={`btn-secondary inline-flex items-center gap-2 rounded-full ${pad}`}
      >
        <svg
          aria-hidden
          viewBox="0 0 20 20"
          className="h-4 w-4"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M5 8a5 5 0 0110 0c0 4 1.5 5.5 1.5 5.5h-13S5 12 5 8z" />
          <path d="M8.5 16.5a1.6 1.6 0 003 0" />
        </svg>
        Subscribe
      </button>

      {open && (
        <div
          id={panelId}
          role="dialog"
          aria-label="Subscribe to Operator"
          className="absolute right-0 top-[calc(100%+10px)] z-[55] w-[min(340px,calc(100vw-2rem))] rounded-2xl border border-border-md bg-surface p-3 shadow-[0_16px_48px_rgba(0,0,0,0.55)]"
        >
          <form onSubmit={onSubmit} className="flex flex-col gap-2.5">
            <label htmlFor={`${panelId}-email`} className="sr-only">
              Email address
            </label>
            <input
              ref={inputRef}
              id={`${panelId}-email`}
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@example.com"
              aria-invalid={status === "error"}
              aria-describedby={error ? errorId : undefined}
              className="field h-11 rounded-xl px-4 text-[15px]"
            />
            <button
              type="submit"
              disabled={status === "loading" || !email}
              className="btn-primary h-11 rounded-xl text-[15px]"
            >
              {status === "loading" ? "Subscribing…" : "Submit"}
            </button>
            {error && (
              <p id={errorId} role="alert" className="px-1 text-sm text-red">
                {error}
              </p>
            )}
            <p className="px-1 pb-0.5 text-xs leading-relaxed text-muted">
              New essays by email. Unsubscribe anytime.
            </p>
          </form>
        </div>
      )}

      {toast && <Toast message={SUBSCRIBED_MESSAGE} onDismiss={dismissToast} />}
    </div>
  );
}
