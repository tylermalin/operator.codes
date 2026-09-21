"use client";

import { useState } from "react";

// Simplified single-page port of the original 5-step wizard from the
// legacy static site. The original step logic (name/role -> problem ->
// constraints -> stakes -> review) is worth porting verbatim if the
// conversion data says the multi-step flow matters. This version trades
// that friction for shipping speed. See plan notes.

export default function ApplyPage() {
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">(
    "idle",
  );

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");
    const form = new FormData(e.currentTarget);
    const payload = Object.fromEntries(form.entries());
    try {
      const res = await fetch("/api/apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error();
      setStatus("done");
    } catch {
      setStatus("error");
    }
  }

  if (status === "done") {
    return (
      <div className="max-w-2xl mx-auto px-6 py-24 text-center">
        <h1 className="text-3xl font-bold mb-4">Application sent.</h1>
        <p className="text-muted">
          If it&apos;s a fit, you&apos;ll hear back directly.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-6 py-16">
      <h1 className="text-4xl font-bold mb-2">Apply for a session</h1>
      <p className="text-muted mb-10">
        Not an idea. A specific problem you need built or structured.
      </p>
      <form onSubmit={handleSubmit} className="space-y-6">
        <Field label="Name" name="name" type="text" required />
        <Field label="Email" name="email" type="email" required />
        <Field
          label="What are we building?"
          name="problem"
          type="textarea"
          required
        />
        <Field
          label="What are the constraints?"
          name="constraints"
          type="textarea"
        />
        <Field label="Why does this matter?" name="stakes" type="textarea" />
        <button
          type="submit"
          disabled={status === "loading"}
          className="bg-accent text-background font-medium rounded-full px-6 py-3 text-sm hover:bg-accent-light transition-colors disabled:opacity-50"
        >
          {status === "loading" ? "Sending..." : "Submit application"}
        </button>
        {status === "error" && (
          <p className="text-red text-sm">Something broke. Try again.</p>
        )}
      </form>
    </div>
  );
}

function Field({
  label,
  name,
  type,
  required,
}: {
  label: string;
  name: string;
  type: "text" | "email" | "textarea";
  required?: boolean;
}) {
  const baseClass =
    "w-full bg-surface border border-border-md rounded-lg px-4 py-3 text-sm placeholder:text-faint focus:outline-none focus:border-accent-border";
  return (
    <div>
      <label htmlFor={name} className="block text-sm font-medium mb-2">
        {label}
      </label>
      {type === "textarea" ? (
        <textarea id={name} name={name} required={required} rows={4} className={baseClass} />
      ) : (
        <input id={name} name={name} type={type} required={required} className={baseClass} />
      )}
    </div>
  );
}
