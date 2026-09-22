import type { Metadata } from "next";

export const metadata: Metadata = { title: "Privacy Policy" };

export default function PrivacyPage() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-24">
      <p className="font-mono text-sm text-muted mb-6">
        operator.codes / privacy
      </p>
      <h1 className="text-4xl sm:text-5xl font-normal tracking-tight mb-4">
        Privacy Policy
      </h1>
      <p className="font-mono text-xs text-faint mb-12">
        Last updated September 22, 2026
      </p>
      <div className="prose-essay">
        <p>
          This describes what operator.codes (the &quot;Site&quot;) collects, why,
          and what you can do about it. Tyler Malin operates the Site and
          is the data controller for information described here.
        </p>

        <h2>What we collect</h2>
        <ul>
          <li>
            <strong>Newsletter:</strong> your email address, when you
            subscribe. Nothing else is required to subscribe.
          </li>
          <li>
            <strong>Build Session applications:</strong> your name, email,
            and whatever project details you submit in the application
            form.
          </li>
          <li>
            <strong>Accounts:</strong> your email address and authentication
            data, if you create an account. We don&apos;t require a password,
            you sign in via a magic link.
          </li>
          <li>
            <strong>Payments:</strong> if you purchase a paid tier or a
            digital product, payment is processed directly by Stripe. We
            receive and store a reference to your Stripe customer and
            subscription records, not your full card number.
          </li>
          <li>
            <strong>API keys:</strong> if your tier includes API access, we
            store a one-way cryptographic hash of your key, not the key
            itself, along with usage and rate-limit data.
          </li>
          <li>
            <strong>Server logs:</strong> our hosting provider (Vercel)
            automatically logs standard request data (IP address, browser
            type, timestamps) for security and operational purposes, the
            way essentially all web infrastructure does.
          </li>
        </ul>
        <p>
          We don&apos;t run advertising or analytics tracking on the Site.
          There are no ad-network cookies and nothing here is sold to data
          brokers.
        </p>

        <h2>Cookies</h2>
        <p>
          The Site doesn&apos;t use cookies for advertising or tracking. If
          you create an account, a strictly necessary session cookie keeps
          you signed in. That&apos;s the only cookie use on the Site.
        </p>

        <h2>How we use it</h2>
        <ul>
          <li>Send the newsletter and essay notifications you signed up for</li>
          <li>Evaluate and respond to Build Session applications</li>
          <li>Provide account access, paid-tier content, and purchased downloads</li>
          <li>Process payments and prevent fraud</li>
          <li>Operate, secure, and improve the Site</li>
          <li>Comply with legal obligations</li>
        </ul>

        <h2>Who we share it with</h2>
        <p>
          We don&apos;t sell your data. We share it only with the service
          providers that make the Site work, each acting as a processor on
          our behalf:
        </p>
        <ul>
          <li><strong>Resend</strong>, for email delivery and the subscriber list</li>
          <li><strong>Vercel</strong>, for hosting and file storage</li>
          <li><strong>Supabase</strong>, for account authentication and data, where accounts are used</li>
          <li><strong>Stripe</strong>, for payment processing, where payments are used</li>
        </ul>
        <p>
          Each of these providers has its own privacy practices governing
          how they handle data on our behalf.
        </p>

        <h2>How long we keep it</h2>
        <p>
          Newsletter data is kept until you unsubscribe. Account and
          purchase data is kept while your account is active and for a
          reasonable period after, to meet legal, tax, and dispute-related
          obligations. Build Session application data is kept as long as
          reasonably needed to evaluate and follow up on it.
        </p>

        <h2>Your rights</h2>
        <p>
          You can unsubscribe from the newsletter at any time using the
          link in any email we send. For anything else, access,
          correction, deletion, or a copy of the data we hold about you,
          email <a href="mailto:hello@operator.codes">hello@operator.codes</a> and
          we&apos;ll handle it directly. If you&apos;re in the EU or UK, you also
          have the right to lodge a complaint with your local data
          protection authority. If you&apos;re a California resident, you have
          rights under the CCPA to know, delete, and opt out of the sale
          of personal information, though we don&apos;t sell personal
          information in the first place.
        </p>

        <h2>Children</h2>
        <p>
          The Site isn&apos;t directed at children, and we don&apos;t knowingly
          collect personal information from anyone under 13.
        </p>

        <h2>International transfers</h2>
        <p>
          Our service providers are based in or operate infrastructure in
          the United States. If you&apos;re accessing the Site from outside
          the US, your data will be processed there.
        </p>

        <h2>Security</h2>
        <p>
          We take reasonable measures to protect your data, but no method
          of transmission or storage is perfectly secure, and we can&apos;t
          guarantee absolute security.
        </p>

        <h2>Changes to this policy</h2>
        <p>
          We may update this policy as the Site changes. We&apos;ll update the
          date above when we do.
        </p>

        <h2>Contact</h2>
        <p>
          Questions about this policy or your data: <a href="mailto:hello@operator.codes">hello@operator.codes</a>.
        </p>
      </div>
    </div>
  );
}
