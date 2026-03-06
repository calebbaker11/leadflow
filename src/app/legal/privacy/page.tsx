import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Privacy Policy — LeadFlow',
}

export default function PrivacyPage() {
  const effectiveDate = 'March 6, 2026'

  return (
    <div className="min-h-screen bg-background">
      <nav className="border-b border-border/50 bg-background/80 backdrop-blur-sm">
        <div className="mx-auto flex h-16 max-w-4xl items-center justify-between px-6">
          <Link href="/" className="flex items-center">
            <img src="/logo.svg" alt="LeadFlow" className="h-8" />
          </Link>
          <Link href="/" className="text-sm text-text-muted hover:text-text-secondary transition-colors">
            ← Back to home
          </Link>
        </div>
      </nav>

      <main className="mx-auto max-w-3xl px-6 py-16">
        <h1 className="text-3xl font-bold text-text-primary mb-2">Privacy Policy</h1>
        <p className="text-sm text-text-muted mb-10">Effective date: {effectiveDate}</p>

        <div className="prose prose-invert prose-sm max-w-none space-y-8 text-text-secondary leading-relaxed">

          <section>
            <h2 className="text-lg font-semibold text-text-primary mb-3">1. Overview</h2>
            <p>
              LeadFlow (&ldquo;we&rdquo;, &ldquo;our&rdquo;, &ldquo;us&rdquo;) is committed to protecting your privacy.
              This Privacy Policy explains how we collect, use, and protect your information when you use our Service.
              By using LeadFlow, you agree to the practices described in this policy.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-text-primary mb-3">2. Information We Collect</h2>
            <p className="font-medium text-text-primary mb-2">Information you provide:</p>
            <ul className="list-disc list-inside space-y-1 mb-4">
              <li>Account information: email address, name, and password</li>
              <li>Proposal content: client names, project details, scope, pricing, and notes you enter</li>
              <li>Payment information: processed securely by Stripe — we do not store card details</li>
              <li>Brand voice preferences and account settings</li>
            </ul>
            <p className="font-medium text-text-primary mb-2">Information collected automatically:</p>
            <ul className="list-disc list-inside space-y-1">
              <li>Usage data: pages visited, features used, proposal counts</li>
              <li>Device and browser information</li>
              <li>IP address and approximate location</li>
              <li>Authentication tokens and session data</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-text-primary mb-3">3. How We Use Your Information</h2>
            <p>We use your information to:</p>
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li>Provide, operate, and improve the Service</li>
              <li>Generate AI proposals using your inputs (processed via OpenAI)</li>
              <li>Process payments and manage subscriptions via Stripe</li>
              <li>Send transactional emails (account confirmation, billing receipts)</li>
              <li>Respond to support requests</li>
              <li>Detect and prevent fraud or abuse</li>
              <li>Comply with legal obligations</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-text-primary mb-3">4. AI Processing</h2>
            <p>
              When you generate a proposal, the project details you provide are sent to OpenAI&apos;s API for processing.
              This data is subject to{' '}
              <a
                href="https://openai.com/policies/privacy-policy"
                target="_blank"
                rel="noopener noreferrer"
                className="text-accent hover:underline"
              >
                OpenAI&apos;s Privacy Policy
              </a>
              . We use the API in a way that opts out of data being used to train OpenAI models. We recommend
              avoiding including sensitive personal data in proposal inputs beyond what is necessary.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-text-primary mb-3">5. Information Sharing</h2>
            <p>We do not sell your personal information. We may share your information with:</p>
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li>
                <strong className="text-text-primary">Supabase</strong> — database and authentication provider
              </li>
              <li>
                <strong className="text-text-primary">Stripe</strong> — payment processing
              </li>
              <li>
                <strong className="text-text-primary">OpenAI</strong> — AI proposal generation
              </li>
              <li>
                <strong className="text-text-primary">Law enforcement</strong> — when required by law or to protect
                our rights
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-text-primary mb-3">6. Data Retention</h2>
            <p>
              We retain your account data for as long as your account is active. Proposals and associated data are
              retained until you delete them or close your account. After account deletion, we may retain anonymized
              usage statistics. Payment records are retained as required by financial regulations.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-text-primary mb-3">7. Security</h2>
            <p>
              We take reasonable technical and organizational measures to protect your data, including encryption in
              transit (TLS), row-level security in our database, and secure authentication. No system is completely
              secure, and we cannot guarantee absolute security.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-text-primary mb-3">8. Your Rights</h2>
            <p>Depending on your location, you may have the right to:</p>
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li>Access the personal data we hold about you</li>
              <li>Correct inaccurate data</li>
              <li>Request deletion of your data (&ldquo;right to be forgotten&rdquo;)</li>
              <li>Export your data in a portable format</li>
              <li>Object to or restrict certain processing</li>
            </ul>
            <p className="mt-3">
              To exercise these rights, contact us at{' '}
              <a href="mailto:privacy@leadflow.app" className="text-accent hover:underline">
                privacy@leadflow.app
              </a>
              . We will respond within 30 days.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-text-primary mb-3">9. Cookies</h2>
            <p>
              We use cookies and similar technologies solely for authentication and session management. We do not use
              third-party advertising cookies or tracking pixels.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-text-primary mb-3">10. Children&apos;s Privacy</h2>
            <p>
              The Service is not directed to children under 18. We do not knowingly collect personal information from
              children. If you believe we have collected information from a child, contact us and we will delete it.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-text-primary mb-3">11. Changes to This Policy</h2>
            <p>
              We may update this Privacy Policy from time to time. We will notify you of material changes via email or
              a prominent notice in the Service. The &ldquo;Effective date&rdquo; at the top indicates when this policy
              was last updated.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-text-primary mb-3">12. Contact</h2>
            <p>
              For privacy-related questions or requests, contact us at{' '}
              <a href="mailto:privacy@leadflow.app" className="text-accent hover:underline">
                privacy@leadflow.app
              </a>
              .
            </p>
          </section>
        </div>
      </main>

      <footer className="border-t border-border/50 py-8 px-6 mt-8">
        <div className="mx-auto max-w-3xl flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-text-muted">
          <p>© {new Date().getFullYear()} LeadFlow. All rights reserved.</p>
          <div className="flex gap-4">
            <Link href="/legal/terms" className="hover:text-text-secondary transition-colors">Terms</Link>
            <Link href="/legal/privacy" className="hover:text-text-secondary transition-colors">Privacy</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
