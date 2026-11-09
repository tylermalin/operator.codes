import type { Metadata } from "next";
import SubscribeForm from "@/components/subscribe-form";

export const metadata: Metadata = {
  title: "Subscribe",
  alternates: { canonical: "/subscribe" },
};

export default function SubscribePage() {
  return (
    <div className="mx-auto max-w-3xl px-5 pb-8 pt-16 sm:px-8 sm:pt-24">
      <h1 className="type-title text-[clamp(2.75rem,6vw,4.5rem)] mb-5">
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
