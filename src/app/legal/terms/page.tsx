import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Terms of Service — LeadFlow',
}

export default function TermsPage() {
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
        <h1 className="text-3xl font-bold text-text-primary mb-2">Terms of Service</h1>
        <p className="text-sm text-text-muted mb-10">Effective date: {effectiveDate}</p>

        <div className="prose prose-invert prose-sm max-w-none space-y-8 text-text-secondary leading-relaxed">

          <section>
            <h2 className="text-lg font-semibold text-text-primary mb-3">1. Acceptance of Terms</h2>
            <p>
              By accessing or using LeadFlow (&ldquo;Service&rdquo;), you agree to be bound by these Terms of Service
              (&ldquo;Terms&rdquo;). If you do not agree to these Terms, do not use the Service. These Terms apply to all
              visitors, users, and others who access the Service.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-text-primary mb-3">2. Description of Service</h2>
            <p>
              LeadFlow is an AI-powered proposal generation platform that helps freelancers, agencies, contractors, and
              consultants create professional business proposals. The Service uses third-party AI models (including
              OpenAI&apos;s GPT-4o) to generate proposal content based on information you provide.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-text-primary mb-3">3. Accounts and Registration</h2>
            <p>
              You must create an account to use the Service. You are responsible for maintaining the confidentiality of
              your account credentials and for all activity that occurs under your account. You must provide accurate,
              current, and complete information during registration. You must be at least 18 years old to use the Service.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-text-primary mb-3">4. Subscriptions and Billing</h2>
            <p>
              The Service is offered on a subscription basis. By starting a free trial, you agree to provide valid payment
              information. Your trial period is 7 days, after which you will be charged the applicable subscription fee
              unless you cancel before the trial ends.
            </p>
            <p className="mt-3">
              Subscriptions automatically renew at the end of each billing period. You may cancel at any time through
              your account settings. Cancellation takes effect at the end of the current billing period — you retain
              access until then. We do not offer refunds for partial billing periods.
            </p>
            <p className="mt-3">
              We reserve the right to change subscription pricing with 30 days&apos; notice to your registered email
              address.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-text-primary mb-3">5. Proposal Limits</h2>
            <p>
              Each subscription plan includes a set number of AI-generated proposals per billing period. Unused proposals
              do not carry over between billing periods. Proposal counts reset at the start of each billing cycle.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-text-primary mb-3">6. Acceptable Use</h2>
            <p>You agree not to use the Service to:</p>
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li>Generate content that is unlawful, fraudulent, or deceptive</li>
              <li>Violate any applicable laws or regulations</li>
              <li>Infringe the intellectual property rights of others</li>
              <li>Attempt to reverse-engineer, scrape, or copy the Service</li>
              <li>Use automated tools to access the Service beyond normal usage</li>
              <li>Resell or sublicense access to the Service</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-text-primary mb-3">7. AI-Generated Content</h2>
            <p>
              The Service uses AI to generate proposal content. You acknowledge that AI-generated content may contain
              errors, inaccuracies, or content that requires editing. You are solely responsible for reviewing,
              editing, and approving all content before sending it to clients. LeadFlow does not guarantee the accuracy,
              quality, or fitness for purpose of AI-generated proposals.
            </p>
            <p className="mt-3">
              You own the proposals you create using the Service. By using the Service, you grant LeadFlow a limited
              license to process your inputs and outputs for the purpose of providing and improving the Service.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-text-primary mb-3">8. Intellectual Property</h2>
            <p>
              The Service, including its software, design, and content (excluding user-generated proposals), is owned by
              LeadFlow and protected by intellectual property laws. You may not copy, modify, distribute, or create
              derivative works from the Service without express written permission.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-text-primary mb-3">9. Disclaimers</h2>
            <p>
              THE SERVICE IS PROVIDED &ldquo;AS IS&rdquo; AND &ldquo;AS AVAILABLE&rdquo; WITHOUT WARRANTIES OF ANY KIND,
              EXPRESS OR IMPLIED. LEADFLOW DOES NOT WARRANT THAT THE SERVICE WILL BE UNINTERRUPTED, ERROR-FREE, OR
              THAT AI-GENERATED CONTENT WILL BE ACCURATE OR SUITABLE FOR YOUR PURPOSES. YOUR USE OF THE SERVICE IS AT
              YOUR OWN RISK.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-text-primary mb-3">10. Limitation of Liability</h2>
            <p>
              TO THE MAXIMUM EXTENT PERMITTED BY LAW, LEADFLOW SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL,
              SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING LOSS OF PROFITS, DATA, OR GOODWILL, ARISING FROM
              YOUR USE OF THE SERVICE. OUR TOTAL LIABILITY TO YOU FOR ANY CLAIMS SHALL NOT EXCEED THE AMOUNT YOU PAID
              TO LEADFLOW IN THE 12 MONTHS PRECEDING THE CLAIM.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-text-primary mb-3">11. Termination</h2>
            <p>
              We reserve the right to suspend or terminate your account at any time for violation of these Terms or for
              any other reason with reasonable notice. You may terminate your account at any time by canceling your
              subscription and contacting us to delete your data.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-text-primary mb-3">12. Changes to Terms</h2>
            <p>
              We may update these Terms from time to time. We will notify you of material changes via email or a
              prominent notice in the Service. Continued use of the Service after changes take effect constitutes
              your acceptance of the updated Terms.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-text-primary mb-3">13. Governing Law</h2>
            <p>
              These Terms are governed by and construed in accordance with applicable law. Any disputes arising from
              these Terms or your use of the Service shall be resolved through binding arbitration or in a court of
              competent jurisdiction.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-text-primary mb-3">14. Contact</h2>
            <p>
              If you have questions about these Terms, please contact us at{' '}
              <a href="mailto:support@leadflow.app" className="text-accent hover:underline">
                support@leadflow.app
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
