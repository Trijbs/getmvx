import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service — MVX",
  description: "MVX Terms of Service",
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-[var(--bg)] px-4 py-16">
      <div className="mx-auto max-w-[720px]">
        {/* Header */}
        <Link
          href="/"
          className="mb-10 block text-center font-[family-name:var(--font-barlow)] text-3xl font-800 text-[var(--text)]"
        >
          mv<span className="text-[var(--accent)]">x</span>
        </Link>

        <h1 className="mb-2 font-[family-name:var(--font-barlow)] text-[32px] font-700 text-[var(--text)]">
          Terms of Service
        </h1>
        <p className="mb-10 text-sm text-[var(--muted)]">
          Last updated: June 2026
        </p>

        <div className="space-y-8 text-[15px] leading-7 text-[var(--text2)]">
          <section>
            <h2 className="mb-3 font-[family-name:var(--font-barlow)] text-xl font-700 text-[var(--text)]">
              1. Who We Are
            </h2>
            <p>
              MVX (&ldquo;the Service&rdquo;) is a link-in-bio platform operated
              by trijbsworld.nl (&ldquo;we&rdquo;, &ldquo;us&rdquo;,
              &ldquo;our&rdquo;). By creating an account or using the Service,
              you agree to these Terms. If you do not agree, do not use the
              Service.
            </p>
          </section>

          <section>
            <h2 className="mb-3 font-[family-name:var(--font-barlow)] text-xl font-700 text-[var(--text)]">
              2. Eligibility
            </h2>
            <p>
              You must be at least <strong className="text-[var(--text)]">16 years old</strong> to
              use the Service. By registering, you confirm you meet this
              requirement. We do not knowingly collect data from anyone under
              16 — if we become aware of this, we will delete the account.
            </p>
          </section>

          <section>
            <h2 className="mb-3 font-[family-name:var(--font-barlow)] text-xl font-700 text-[var(--text)]">
              3. Your Account
            </h2>
            <p className="mb-3">
              You are responsible for maintaining the security of your account
              credentials and for all activity that occurs under your account.
              You must provide accurate information when creating an account.
            </p>
            <p>
              You may delete your account at any time from your account
              settings. Upon deletion, your public profile and associated data
              will be removed within 30 days. Notify us immediately at{" "}
              <a
                href="mailto:hello@getmvx.cc"
                className="text-[var(--accent)] hover:underline"
              >
                hello@getmvx.cc
              </a>{" "}
              if you believe your account has been compromised.
            </p>
          </section>

          <section>
            <h2 className="mb-3 font-[family-name:var(--font-barlow)] text-xl font-700 text-[var(--text)]">
              4. Acceptable Use
            </h2>
            <p className="mb-3">You agree not to use MVX to:</p>
            <ul className="list-inside list-disc space-y-1.5 text-[var(--text2)]">
              <li>Post illegal, harmful, abusive, or defamatory content</li>
              <li>
                Post child sexual abuse material (CSAM) or any sexual content
                involving minors — this results in immediate termination and
                reporting to authorities
              </li>
              <li>Distribute spam, malware, phishing links, or fraudulent content</li>
              <li>Impersonate any person or entity</li>
              <li>Violate the intellectual property rights of others</li>
              <li>
                Attempt to gain unauthorised access to our systems or other
                users&apos; accounts
              </li>
              <li>
                Use automated tools to scrape or abuse the Service without our
                written permission
              </li>
            </ul>
            <p className="mt-3">
              We reserve the right to remove content and suspend or terminate
              accounts that violate these rules. To report abuse, email{" "}
              <a
                href="mailto:abuse@getmvx.cc"
                className="text-[var(--accent)] hover:underline"
              >
                abuse@getmvx.cc
              </a>
              .
            </p>
          </section>

          <section>
            <h2 className="mb-3 font-[family-name:var(--font-barlow)] text-xl font-700 text-[var(--text)]">
              5. User Content
            </h2>
            <p>
              You retain ownership of all content you post on MVX. By posting
              content, you grant us a non-exclusive, worldwide, royalty-free
              licence to host, display, and distribute that content solely for
              the purpose of operating the Service. You are solely responsible
              for your content and for ensuring it does not infringe on the
              rights of others.
            </p>
          </section>

          <section>
            <h2 className="mb-3 font-[family-name:var(--font-barlow)] text-xl font-700 text-[var(--text)]">
              6. Pro Subscriptions
            </h2>
            <p className="mb-3">
              MVX Pro is a paid subscription billed monthly (€4.99) or
              annually (€39.99) through Gumroad. Gumroad acts as the merchant
              of record for all transactions. Subscriptions automatically renew
              unless cancelled before the renewal date. You may cancel at any
              time from your account settings.
            </p>
            <p className="mb-3">
              <strong className="text-[var(--text)]">
                EU right of withdrawal.
              </strong>{" "}
              Under EU consumer law you generally have a 14-day right to
              withdraw from a digital service purchase. By accessing Pro
              features immediately after purchase you expressly request that
              the service begins immediately, and you acknowledge that your
              right of withdrawal is forfeited upon first use. If you cancel
              within 14 days without having used any Pro features, contact us
              for a full refund.
            </p>
            <p>
              Outside of this right, subscriptions are non-refundable. We may
              issue refunds at our discretion in exceptional circumstances such
              as extended service outages. Contact{" "}
              <a
                href="mailto:hello@getmvx.cc"
                className="text-[var(--accent)] hover:underline"
              >
                hello@getmvx.cc
              </a>{" "}
              for any billing questions.
            </p>
          </section>

          <section>
            <h2 className="mb-3 font-[family-name:var(--font-barlow)] text-xl font-700 text-[var(--text)]">
              7. Intellectual Property
            </h2>
            <p>
              The MVX name, logo, and the Service itself (excluding user
              content) are the property of trijbsworld.nl. You may not copy,
              modify, distribute, or reverse-engineer any part of the Service
              without our written permission.
            </p>
          </section>

          <section>
            <h2 className="mb-3 font-[family-name:var(--font-barlow)] text-xl font-700 text-[var(--text)]">
              8. Disclaimers and Limitation of Liability
            </h2>
            <p className="mb-3">
              The Service is provided &ldquo;as is&rdquo; without warranties of
              any kind. We do not guarantee uninterrupted or error-free
              operation.
            </p>
            <p className="mb-3">
              To the maximum extent permitted by law, we shall not be liable for
              any indirect, incidental, special, or consequential damages arising
              from your use of the Service.
            </p>
            <p>
              Our total liability to you will not exceed the amount you paid us
              in the 12 months preceding the claim, or €50 if you have made no
              payments. Nothing in these Terms limits liability for death or
              personal injury caused by negligence, fraud, or any liability that
              cannot be limited by law.
            </p>
          </section>

          <section>
            <h2 className="mb-3 font-[family-name:var(--font-barlow)] text-xl font-700 text-[var(--text)]">
              9. Termination
            </h2>
            <p>
              We may suspend or terminate your account at any time if we believe
              you have violated these Terms. You may delete your account at any
              time from your account settings. Upon deletion, your public profile
              and associated data will be removed.
            </p>
          </section>

          <section>
            <h2 className="mb-3 font-[family-name:var(--font-barlow)] text-xl font-700 text-[var(--text)]">
              10. Governing Law
            </h2>
            <p>
              These Terms are governed by the laws of the Netherlands. If you
              are an EU consumer, you also benefit from the mandatory protections
              of the consumer laws of your country of residence. The European
              Commission provides an Online Dispute Resolution platform at{" "}
              <a
                href="https://ec.europa.eu/consumers/odr"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[var(--accent)] hover:underline"
              >
                ec.europa.eu/consumers/odr
              </a>
              .
            </p>
          </section>

          <section>
            <h2 className="mb-3 font-[family-name:var(--font-barlow)] text-xl font-700 text-[var(--text)]">
              11. Changes to These Terms
            </h2>
            <p>
              We may update these Terms from time to time. We will notify you of
              material changes via email at least 14 days before they take
              effect. Continued use of MVX after changes take effect constitutes
              your acceptance of the revised Terms.
            </p>
          </section>

          <section>
            <h2 className="mb-3 font-[family-name:var(--font-barlow)] text-xl font-700 text-[var(--text)]">
              12. Contact
            </h2>
            <p>
              Questions about these Terms?{" "}
              <a
                href="mailto:hello@getmvx.cc"
                className="text-[var(--accent)] hover:underline"
              >
                hello@getmvx.cc
              </a>
              <br />
              Abuse reports:{" "}
              <a
                href="mailto:abuse@getmvx.cc"
                className="text-[var(--accent)] hover:underline"
              >
                abuse@getmvx.cc
              </a>
            </p>
          </section>
        </div>

        <div className="mt-12 flex gap-6 text-sm text-[var(--muted)]">
          <Link href="/" className="hover:text-[var(--text)]">
            ← Back to MVX
          </Link>
          <Link href="/privacy" className="hover:text-[var(--text)]">
            Privacy Policy →
          </Link>
        </div>
      </div>
    </div>
  );
}
