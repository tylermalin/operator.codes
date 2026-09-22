"use client";

import { useState } from "react";

type ApiKeyRow = {
  id: string;
  key_prefix: string;
  rate_limit_quota: number;
  is_active: boolean;
  created_at: string;
};

// Initial list comes from the server component that renders this
// (app/dashboard/page.tsx), not a client-side fetch on mount. Fetching
// only happens here in response to a user action (create), inside an
// event handler, never inside an effect.
export default function KeyManager({
  initialKeys,
}: {
  initialKeys: ApiKeyRow[];
}) {
  const [keys, setKeys] = useState<ApiKeyRow[]>(initialKeys);
  const [newKey, setNewKey] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);

  async function refreshKeys() {
    const res = await fetch("/api/keys");
    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      setError(body.error ?? "Could not load keys");
      return;
    }
    const data = await res.json();
    setKeys(data.keys);
  }

  async function handleCreate() {
    setCreating(true);
    setNewKey(null);
    const res = await fetch("/api/keys", { method: "POST" });
    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      setError(body.error ?? "Could not create key");
      setCreating(false);
      return;
    }
    const data = await res.json();
    setNewKey(data.rawKey);
    await refreshKeys();
    setCreating(false);
  }

  if (error) {
    return <p className="text-sm text-muted">{error}</p>;
  }

  return (
    <div>
      {newKey && (
        <div className="border border-accent-border bg-accent-dim rounded-lg p-4 mb-4">
          <p className="text-xs text-muted mb-1">
            Copy this now, it won&apos;t be shown again:
          </p>
          <code className="font-mono text-sm break-all">{newKey}</code>
        </div>
      )}

      <div className="space-y-2 mb-4">
        {keys.length === 0 && (
          <p className="text-sm text-muted">No API keys yet.</p>
        )}
        {keys.map((key) => (
          <div
            key={key.id}
            className="flex items-center justify-between border border-border rounded-lg px-4 py-2.5 text-sm"
          >
            <code className="font-mono text-xs text-muted">
              {key.key_prefix}...
            </code>
            <span className="text-xs text-faint">
              {key.rate_limit_quota}/min
            </span>
          </div>
        ))}
      </div>

      <button
        onClick={handleCreate}
        disabled={creating}
        className="border border-border-md rounded-full px-4 py-2 text-sm hover:border-border-hi transition-colors disabled:opacity-50"
      >
        {creating ? "..." : "Generate new key"}
      </button>
    </div>
  );
}
