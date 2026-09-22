"use client";

import { useState, useSyncExternalStore } from "react";

// Progressive enhancement, not two competing UIs: on a device with
// the native Web Share API (mostly mobile), one Share button opens
// the OS sheet, which already offers every target plus copy. On
// desktop, where there's no native sheet, explicit X/LinkedIn links
// plus a copy-link fallback.
//
// Feature detection via useSyncExternalStore rather than an effect +
// setState: navigator.share's presence never changes during a
// session, so there's nothing to subscribe to (no-op unsubscribe),
// and the server snapshot is pinned to false so hydration can't
// mismatch against SSR output that has no `navigator` at all.
const noopSubscribe = () => () => {};
function getShareSnapshot() {
  return typeof navigator !== "undefined" && typeof navigator.share === "function";
}
function getServerShareSnapshot() {
  return false;
}

export default function ShareBar({ url, title }: { url: string; title: string }) {
  const canNativeShare = useSyncExternalStore(
    noopSubscribe,
    getShareSnapshot,
    getServerShareSnapshot,
  );
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard API can be denied or unavailable; fail quietly
      // rather than showing an error for a non-critical action.
    }
  }

  async function handleNativeShare() {
    try {
      await navigator.share({ title, url });
    } catch {
      // AbortError on user cancel is expected, not a failure.
    }
  }

  const xHref = `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`;
  const linkedInHref = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;

  return (
    <div className="flex items-center gap-5 font-mono text-xs text-muted mb-16">
      <span className="text-faint">Share</span>
      {canNativeShare ? (
        <button onClick={handleNativeShare} className="link-underline">
          Share
        </button>
      ) : (
        <>
          <a
            href={xHref}
            target="_blank"
            rel="noopener noreferrer"
            className="link-underline"
          >
            X
          </a>
          <a
            href={linkedInHref}
            target="_blank"
            rel="noopener noreferrer"
            className="link-underline"
          >
            LinkedIn
          </a>
        </>
      )}
      <button onClick={handleCopy} className="link-underline">
        {copied ? "Copied" : "Copy link"}
      </button>
    </div>
  );
}
