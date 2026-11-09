"use client";

import { useEffect } from "react";

// Confirmation toast, bottom right. Announced politely to screen
// readers, dismissible, auto-hides after `duration` ms.
export default function Toast({
  message,
  onDismiss,
  duration = 6000,
}: {
  message: string;
  onDismiss: () => void;
  duration?: number;
}) {
  useEffect(() => {
    const t = setTimeout(onDismiss, duration);
    return () => clearTimeout(t);
  }, [onDismiss, duration]);

  return (
    <div
      role="status"
      aria-live="polite"
      className="toast fixed z-[60] bottom-6 right-4 left-4 sm:left-auto sm:right-6 sm:w-[380px] flex items-start gap-3 glass-strong rounded-2xl px-5 py-4"
    >
      <svg
        aria-hidden
        viewBox="0 0 20 20"
        className="mt-0.5 h-5 w-5 shrink-0 text-accent"
        fill="currentColor"
      >
        <path
          fillRule="evenodd"
          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.7-9.3a1 1 0 00-1.4-1.4L9 10.6 7.7 9.3a1 1 0 10-1.4 1.4l2 2a1 1 0 001.4 0l4-4z"
          clipRule="evenodd"
        />
      </svg>
      <p className="flex-1 text-[15px] leading-snug">{message}</p>
      <button
        type="button"
        onClick={onDismiss}
        aria-label="Dismiss"
        className="-mr-1 -mt-0.5 rounded-md p-1 text-muted hover:text-foreground"
      >
        <svg aria-hidden viewBox="0 0 20 20" className="h-4 w-4" fill="currentColor">
          <path d="M6.3 5.3a1 1 0 00-1.4 1.4L8.6 10l-3.7 3.3a1 1 0 101.4 1.4L10 11.4l3.7 3.3a1 1 0 001.4-1.4L11.4 10l3.7-3.3a1 1 0 00-1.4-1.4L10 8.6 6.3 5.3z" />
        </svg>
      </button>
    </div>
  );
}

export const SUBSCRIBED_MESSAGE =
  "You're subscribed. A welcome email is on its way.";
