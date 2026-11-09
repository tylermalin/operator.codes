import SubscribeForm from "@/components/subscribe-form";

// Renders only when access === "full": a free essay, or a premium one
// a pro viewer can already read in full. Preview/blocked essays get
// PaywallBlock instead, which already points at /subscribe, so two
// competing CTAs never share a page.
export default function EssaySubscribeCta() {
  return (
    <aside className="mt-20 rounded-[14px] border border-border bg-surface px-6 py-8 sm:px-10 sm:py-10">
      <p className="type-title text-[2rem]">Get the next one by email.</p>
      <p className="mt-3 max-w-md text-[16px] leading-relaxed text-muted">
        New Operator essays as they publish. Unsubscribe anytime.
      </p>
      <div className="mt-6">
        <SubscribeForm />
      </div>
    </aside>
  );
}
