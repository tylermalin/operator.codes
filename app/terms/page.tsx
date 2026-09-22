import type { Metadata } from "next";

export const metadata: Metadata = { title: "Terms of Service" };

export default function TermsPage() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-24">
      <p className="font-mono text-sm text-muted mb-6">
        operator.codes / terms
      </p>
      <h1 className="text-4xl sm:text-5xl font-normal tracking-tight mb-4">
        Terms of Service
      </h1>
      <p className="font-mono text-xs text-faint mb-12">
        Last updated September 22, 2026
      </p>
      <div className="prose-essay">
        <p>
          These terms govern your use of operator.codes (the &quot;Site&quot;),
          operated by Tyler Malin (&quot;we,&quot; &quot;us,&quot; or &quot;Operator&quot;). By
          visiting the Site, subscribing to the newsletter, applying for a
          Build Session, or purchasing anything offered here, you agree to
          these terms. If you don&apos;t agree, don&apos;t use the Site.
        </p>

        <h2>What the Site is</h2>
        <p>
          Operator publishes essays on AI systems, climate infrastructure,
          legal engineering, and protocol design. Some content is free to
          everyone; some is reserved for paid subscribers. The Site also
          offers Build Sessions (a paid consulting engagement you can apply
          for), and may offer downloadable digital products and API access
          for paid subscribers.
        </p>

        <h2>Accounts</h2>
        <p>
          Some features require an account. You&apos;re responsible for keeping
          your login credentials secure and for anything that happens under
          your account. You must be able to form a binding contract to
          create one, which generally means you&apos;re 18 or older, or the age
          of majority where you live.
        </p>

        <h2>Subscriptions and payments</h2>
        <p>
          Paid tiers, when offered, are billed on a recurring basis through
          our payment processor (Stripe) until you cancel. We don&apos;t store
          your card details ourselves. Cancel anytime; cancellation takes
          effect at the end of the current billing period. Fees already
          paid are non-refundable except where required by law.
        </p>

        <h2>Digital downloads</h2>
        <p>
          Purchasing a digital product gives you a personal, non-exclusive,
          non-transferable license to use it. You can&apos;t redistribute,
          resell, or publicly share purchased files without our written
          permission.
        </p>

        <h2>API access</h2>
        <p>
          If your tier includes API access, keys are issued to you
          personally and are subject to the rate limits shown in your
          dashboard. Don&apos;t share your key, attempt to circumvent rate
          limits, or use API access to scrape, republish, or bulk-extract
          Site content beyond ordinary use. We can revoke a key at any time
          for misuse.
        </p>

        <h2>Build Sessions</h2>
        <p>
          Applying for a Build Session is a request, not a commitment on
          either side. We review applications and follow up if there&apos;s a
          fit. Any actual engagement is governed by a separate agreement
          negotiated at that time, not by these terms.
        </p>

        <h2>Content and intellectual property</h2>
        <p>
          Essays, illustrations, and other content on the Site are owned by
          Tyler Malin or licensed to Operator, and are protected by
          copyright. You may read, link to, and share individual essays for
          personal, non-commercial purposes. You may not republish,
          mirror, or use Site content, in whole or substantial part, to
          train or fine-tune a machine learning model, without our prior
          written permission.
        </p>

        <h2>Acceptable use</h2>
        <p>
          Don&apos;t use the Site to violate any law, infringe anyone&apos;s rights,
          transmit malware, attempt unauthorized access to our systems, or
          interfere with the Site&apos;s normal operation.
        </p>

        <h2>No warranty</h2>
        <p>
          The Site and its content are provided &quot;as is,&quot; without
          warranties of any kind. Essays reflect analysis and opinion, not
          legal, financial, or investment advice, and nothing here creates
          an attorney-client relationship. We don&apos;t guarantee the Site
          will be error-free, uninterrupted, or secure.
        </p>

        <h2>Limitation of liability</h2>
        <p>
          To the fullest extent the law allows, we aren&apos;t liable for any
          indirect, incidental, or consequential damages arising from your
          use of the Site. Our total liability for any claim is limited to
          the amount you paid us in the twelve months before the claim
          arose, or $100 if you haven&apos;t paid us anything.
        </p>

        <h2>Termination</h2>
        <p>
          We can suspend or terminate your access for violating these
          terms. You can stop using the Site, or unsubscribe from the
          newsletter, at any time.
        </p>

        <h2>Changes to these terms</h2>
        <p>
          We may update these terms as the Site changes. We&apos;ll update the
          date above when we do. Continuing to use the Site after a change
          means you accept the new terms.
        </p>

        <h2>Governing law</h2>
        <p>
          These terms are governed by the laws of the State of California,
          without regard to conflict-of-law principles.
        </p>

        <h2>Contact</h2>
        <p>
          Questions about these terms: <a href="mailto:hello@operator.codes">hello@operator.codes</a>.
        </p>
      </div>
    </div>
  );
}
