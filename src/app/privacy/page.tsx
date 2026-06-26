import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy — MVX",
  description: "MVX Privacy Policy",
};

export default function PrivacyPage() {
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
          Privacy Policy
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
              MVX is operated by trijbsworld.nl, based in the Netherlands. We
              are the data controller for personal data processed in connection
              with your use of the Service. Questions about this policy:{" "}
              <a
                href="mailto:privacy@getmvx.cc"
                className="text-[var(--accent)] hover:underline"
              >
                privacy@getmvx.cc
              </a>
              .
            </p>
          </section>

          <section>
            <h2 className="mb-3 font-[family-name:var(--font-barlow)] text-xl font-700 text-[var(--text)]">
              2. Data We Collect
            </h2>
            <div className="space-y-4">
              <div>
                <p className="mb-1 font-[family-name:var(--font-barlow)] font-700 text-[var(--text)]">
                  Account data
                </p>
                <p>
                  Email address and username when you register. Lawful basis:{" "}
                  <em>contract</em> (necessary to provide the Service).
                </p>
              </div>
              <div>
                <p className="mb-1 font-[family-name:var(--font-barlow)] font-700 text-[var(--text)]">
                  Profile content
                </p>
                <p>
                  Display name, bio, links, profile photo, and any other content
                  you add to your public page. Lawful basis: <em>contract</em>.
                </p>
              </div>
              <div>
                <p className="mb-1 font-[family-name:var(--font-barlow)] font-700 text-[var(--text)]">
                  Payment data
                </p>
                <p>
                  Pro subscriptions are processed by Gumroad, who acts as
                  merchant of record. We do not store your card or payment
                  details. We receive only a subscription status signal from
                  Gumroad. Gumroad&apos;s privacy policy governs how they handle
                  your payment data.
                </p>
              </div>
              <div>
                <p className="mb-1 font-[family-name:var(--font-barlow)] font-700 text-[var(--text)]">
                  Usage data
                </p>
                <p>
                  IP address, browser type, pages visited, and timestamps
                  collected automatically when you use the Service. Lawful
                  basis: <em>legitimate interests</em> (security, performance,
                  and improving the Service).
                </p>
              </div>
              <div>
                <p className="mb-1 font-[family-name:var(--font-barlow)] font-700 text-[var(--text)]">
                  Communications
                </p>
                <p>
                  If you contact us by email, we retain that correspondence.
                  Lawful basis: <em>legitimate interests</em>.
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="mb-3 font-[family-name:var(--font-barlow)] text-xl font-700 text-[var(--text)]">
              3. How We Use Your Data
            </h2>
            <ul className="list-inside list-disc space-y-1.5">
              <li>Provide, operate, and improve the Service</li>
              <li>Send transactional emails (account confirmation, password resets)</li>
              <li>Notify you of changes to these policies (at least 14 days notice)</li>
              <li>Prevent fraud, abuse, and illegal activity</li>
              <li>Comply with legal obligations</li>
            </ul>
            <p className="mt-3">
              We do not sell your personal data. We do not use your data for
              advertising profiling.
            </p>
          </section>

          <section>
            <h2 className="mb-3 font-[family-name:var(--font-barlow)] text-xl font-700 text-[var(--text)]">
              4. Third-Party Processors
            </h2>
            <p className="mb-4">
              We share data only with processors necessary to operate the
              Service. All processors are bound by data processing agreements
              (DPAs).
            </p>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[var(--muted)]/20">
                    <th className="pb-2 pr-4 text-left font-[family-name:var(--font-barlow)] font-700 text-[var(--text)]">
                      Provider
                    </th>
                    <th className="pb-2 pr-4 text-left font-[family-name:var(--font-barlow)] font-700 text-[var(--text)]">
                      Purpose
                    </th>
                    <th className="pb-2 text-left font-[family-name:var(--font-barlow)] font-700 text-[var(--text)]">
                      Data transferred
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--muted)]/10">
                  <tr>
                    <td className="py-2 pr-4">Gumroad</td>
                    <td className="py-2 pr-4">Payment processing (merchant of record)</td>
                    <td className="py-2">Email, subscription status</td>
                  </tr>
                  <tr>
                    <td className="py-2 pr-4">Brevo</td>
                    <td className="py-2 pr-4">Transactional email</td>
                    <td className="py-2">Email address, name</td>
                  </tr>
                  <tr>
                    <td className="py-2 pr-4">Cloudflare</td>
                    <td className="py-2 pr-4">CDN, DDoS protection, file storage (R2)</td>
                    <td className="py-2">IP address, request metadata, uploaded files</td>
                  </tr>
                  <tr>
                    <td className="py-2 pr-4">Neon</td>
                    <td className="py-2 pr-4">Database hosting</td>
                    <td className="py-2">All account and profile data</td>
                  </tr>
                  <tr>
                    <td className="py-2 pr-4">Resend</td>
                    <td className="py-2 pr-4">Email delivery</td>
                    <td className="py-2">Email address, email content</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          <section>
            <h2 className="mb-3 font-[family-name:var(--font-barlow)] text-xl font-700 text-[var(--text)]">
              5. Cookies and Tracking
            </h2>
            <p className="mb-3">
              We use essential cookies only — those strictly necessary for the
              Service to function (session management, authentication). We do
              not use advertising or tracking cookies.
            </p>
            <p>
              Essential cookies do not require your consent under the ePrivacy
              Directive. You can block cookies in your browser settings, but
              this may prevent you from logging in.
            </p>
          </section>

          <section>
            <h2 className="mb-3 font-[family-name:var(--font-barlow)] text-xl font-700 text-[var(--text)]">
              6. International Transfers
            </h2>
            <p>
              Some of our processors (Cloudflare, Neon, Brevo) may process data
              outside the European Economic Area. Where this occurs, we ensure
              appropriate safeguards are in place — such as Standard Contractual
              Clauses (SCCs) approved by the European Commission.
            </p>
          </section>

          <section>
            <h2 className="mb-3 font-[family-name:var(--font-barlow)] text-xl font-700 text-[var(--text)]">
              7. Data Retention
            </h2>
            <ul className="list-inside list-disc space-y-1.5">
              <li>
                <strong className="text-[var(--text)]">Account data:</strong>{" "}
                retained while your account is active, deleted within 30 days
                of account deletion
              </li>
              <li>
                <strong className="text-[var(--text)]">Usage logs:</strong>{" "}
                retained for up to 90 days for security and debugging
              </li>
              <li>
                <strong className="text-[var(--text)]">Billing records:</strong>{" "}
                retained for 7 years as required by Dutch tax law
              </li>
            </ul>
          </section>

          <section>
            <h2 className="mb-3 font-[family-name:var(--font-barlow)] text-xl font-700 text-[var(--text)]">
              8. Children
            </h2>
            <p>
              MVX is not directed at children under 16. We do not knowingly
              collect data from anyone under 16. If you believe we hold data
              about a child under 16, contact{" "}
              <a
                href="mailto:privacy@getmvx.cc"
                className="text-[var(--accent)] hover:underline"
              >
                privacy@getmvx.cc
              </a>{" "}
              and we will delete it.
            </p>
          </section>

          <section>
            <h2 className="mb-3 font-[family-name:var(--font-barlow)] text-xl font-700 text-[var(--text)]">
              9. Your Rights Under GDPR
            </h2>
            <p className="mb-3">
              If you are in the EU or EEA, you have the following rights
              regarding your personal data:
            </p>
            <ul className="list-inside list-disc space-y-1.5">
              <li>
                <strong className="text-[var(--text)]">Access</strong> — request
                a copy of the data we hold about you
              </li>
              <li>
                <strong className="text-[var(--text)]">Rectification</strong>{" "}
                — correct inaccurate data
              </li>
              <li>
                <strong className="text-[var(--text)]">Erasure</strong> —
                request deletion of your data (&ldquo;right to be forgotten&rdquo;)
              </li>
              <li>
                <strong className="text-[var(--text)]">
                  Restriction of processing
                </strong>{" "}
                — limit how we use your data in certain circumstances
              </li>
              <li>
                <strong className="text-[var(--text)]">
                  Data portability
                </strong>{" "}
                — receive your data in a machine-readable format
              </li>
              <li>
                <strong className="text-[var(--text)]">Object</strong> — object
                to processing based on legitimate interests
              </li>
            </ul>
            <p className="mt-3">
              To exercise any of these rights, email{" "}
              <a
                href="mailto:privacy@getmvx.cc"
                className="text-[var(--accent)] hover:underline"
              >
                privacy@getmvx.cc
              </a>
              . We will respond within 30 days. You also have the right to lodge
              a complaint with the Dutch Data Protection Authority (
              <a
                href="https://autoriteitpersoonsgegevens.nl"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[var(--accent)] hover:underline"
              >
                autoriteitpersoonsgegevens.nl
              </a>
              ).
            </p>
          </section>

          <section>
            <h2 className="mb-3 font-[family-name:var(--font-barlow)] text-xl font-700 text-[var(--text)]">
              10. Changes to This Policy
            </h2>
            <p>
              We may update this Privacy Policy from time to time. We will
              notify you of material changes via email at least 14 days before
              they take effect. The latest version is always available at{" "}
              <Link href="/privacy" className="text-[var(--accent)] hover:underline">
                getmvx.cc/privacy
              </Link>
              .
            </p>
          </section>

          <section>
            <h2 className="mb-3 font-[family-name:var(--font-barlow)] text-xl font-700 text-[var(--text)]">
              11. Contact
            </h2>
            <p>
              Data protection enquiries:{" "}
              <a
                href="mailto:privacy@getmvx.cc"
                className="text-[var(--accent)] hover:underline"
              >
                privacy@getmvx.cc
              </a>
              <br />
              General contact:{" "}
              <a
                href="mailto:hello@getmvx.cc"
                className="text-[var(--accent)] hover:underline"
              >
                hello@getmvx.cc
              </a>
              <br />
              Operator: trijbsworld.nl, Netherlands
            </p>
          </section>
        </div>

        <div className="mt-12 flex gap-6 text-sm text-[var(--muted)]">
          <Link href="/" className="hover:text-[var(--text)]">
            ← Back to MVX
          </Link>
          <Link href="/terms" className="hover:text-[var(--text)]">
            Terms of Service →
          </Link>
        </div>
      </div>
    </div>
  );
}
