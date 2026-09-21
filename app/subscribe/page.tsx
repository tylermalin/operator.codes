import type { Metadata } from "next";
import SubscribeForm from "@/components/subscribe-form";

export const metadata: Metadata = { title: "Subscribe" };

export default function SubscribePage() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-16">
      <h1 className="text-4xl font-bold mb-4">Subscribe</h1>
      <p className="text-muted mb-8 max-w-lg">
        Essays on AI systems, climate infrastructure, legal engineering, and
        protocol design. No spam, no growth-hacking, unsubscribe whenever.
      </p>
      <SubscribeForm />
    </div>
  );
}
