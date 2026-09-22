import SubscribeForm from "@/components/subscribe-form";

// Renders only when access === "full": a free essay, or a premium one
// a pro viewer can already read in full. Preview/blocked essays get
// PaywallBlock instead, which already points at /subscribe — adding
// this alongside it there would be two competing CTAs on one page.
// This fills the one case that had nothing: someone who just read the
// whole thing for free and liked it.
export default function EssaySubscribeCta() {
  return (
    <div className="mt-16 pt-12 border-t border-border">
      <p className="text-lg font-normal mb-2">Enjoyed this?</p>
      <p className="text-muted text-sm mb-6 max-w-md leading-relaxed">
        New essays land in your inbox as they&apos;re published. No spam, no
        growth-hacking, unsubscribe whenever.
      </p>
      <SubscribeForm />
    </div>
  );
}
