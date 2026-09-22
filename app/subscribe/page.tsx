import type { Metadata } from "next";
import SubscribeForm from "@/components/subscribe-form";

export const metadata: Metadata = { title: "Subscribe" };

export default function SubscribePage() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-24">
      <h1 className="text-4xl sm:text-5xl font-normal tracking-tight mb-5">
        Subscribe
      </h1>
      <p className="text-muted mb-10 max-w-lg text-lg leading-relaxed">
        Essays on AI systems, climate infrastructure, legal engineering, and
        protocol design. No spam, no growth-hacking, unsubscribe whenever.
      </p>
      <SubscribeForm />
    </div>
  );
}
