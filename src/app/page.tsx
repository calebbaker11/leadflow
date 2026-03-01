import Link from 'next/link'
import { Button } from '@/components/ui/button'
import {
  ArrowRight,
  Zap,
  FileText,
  Share2,
  TrendingUp,
  Check,
  ChevronRight,
} from 'lucide-react'

const features = [
  {
    icon: Zap,
    title: 'Generate in seconds',
    description:
      'Describe the project, hit generate. GPT-4 writes a complete, professional proposal — scoped, priced, and ready to send.',
  },
  {
    icon: FileText,
    title: 'Export as PDF',
    description:
      'One-click PDF export with beautiful formatting. Print-ready, branded, and polished every time.',
  },
  {
    icon: Share2,
    title: 'Send a share link',
    description:
      'Generate a unique link and send it to clients. No attachments, no back-and-forth — just a clean proposal URL.',
  },
  {
    icon: TrendingUp,
    title: 'Close more deals',
    description:
      'Professional proposals that instill confidence. Better proposals = higher close rates, period.',
  },
]

const includedItems = [
  '7 days free — no charge today',
  'Unlimited proposals',
  'GPT-4 powered generation',
  'PDF export',
  'Shareable proposal links',
  'All 4 business templates',
  'Dashboard analytics',
  'Cancel anytime',
]

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="fixed top-0 inset-x-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-sm">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-accent/10">
              <Zap className="h-3.5 w-3.5 text-accent" />
            </div>
            <span className="text-sm font-semibold text-text-primary">LeadFlow</span>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="text-sm text-text-secondary hover:text-text-primary transition-colors"
            >
              Sign in
            </Link>
            <Link href="/signup">
              <Button size="sm">Get started</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative pt-32 pb-24 px-6">
        <div className="mx-auto max-w-4xl text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 rounded-full border border-accent/20 bg-accent/5 px-4 py-1.5 mb-8">
            <Zap className="h-3 w-3 text-accent" />
            <span className="text-xs font-medium text-accent">AI-powered proposal builder</span>
          </div>

          {/* Headline */}
          <h1 className="text-5xl md:text-6xl font-bold tracking-tight text-text-primary leading-tight text-balance mb-6">
            Close more deals with{' '}
            <span className="text-accent">better proposals</span>
          </h1>

          <p className="text-lg text-text-secondary max-w-2xl mx-auto leading-relaxed mb-10">
            Stop losing deals to poorly written proposals. LeadFlow generates professional,
            client-ready proposals in seconds — so you can focus on the work, not the paperwork.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link href="/signup">
              <Button size="lg" className="gap-2 w-full sm:w-auto">
                Start free — 7-day trial
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <p className="text-sm text-text-muted">Then $49/month. Cancel anytime.</p>
          </div>
        </div>
      </section>

      {/* Before / After */}
      <section className="py-20 px-6 border-t border-border/50">
        <div className="mx-auto max-w-5xl">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-bold text-text-primary mb-3">
              From scattered notes to winning proposals
            </h2>
            <p className="text-text-secondary text-sm">
              What used to take hours now takes 60 seconds.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Before */}
            <div className="rounded-xl border border-danger/20 bg-danger/5 p-6">
              <p className="text-xs font-semibold uppercase tracking-wider text-danger mb-4">
                Before LeadFlow
              </p>
              <ul className="flex flex-col gap-3">
                {[
                  'Copy-paste from old proposals',
                  'Hours formatting in Google Docs',
                  'Inconsistent pricing language',
                  'Weak calls to action',
                  'Clients ghost you after the quote',
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2 text-sm text-text-secondary">
                    <span className="mt-1 text-danger">✕</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* After */}
            <div className="rounded-xl border border-success/20 bg-success/5 p-6">
              <p className="text-xs font-semibold uppercase tracking-wider text-success mb-4">
                After LeadFlow
              </p>
              <ul className="flex flex-col gap-3">
                {[
                  'Professional proposals in 60 seconds',
                  'Beautifully formatted every time',
                  'Confident, clear pricing presentation',
                  'Persuasive next steps built in',
                  'Clients click the link and sign',
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2 text-sm text-text-secondary">
                    <Check className="mt-0.5 h-3.5 w-3.5 flex-shrink-0 text-success" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-6 border-t border-border/50">
        <div className="mx-auto max-w-5xl">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-bold text-text-primary mb-3">
              Everything you need to win the deal
            </h2>
            <p className="text-text-secondary text-sm">Built for service businesses who close deals.</p>
          </div>

          <div className="grid sm:grid-cols-2 gap-6">
            {features.map((feature) => {
              const Icon = feature.icon
              return (
                <div
                  key={feature.title}
                  className="rounded-xl border border-border bg-card p-6 flex gap-4"
                >
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-accent/10">
                    <Icon className="h-5 w-5 text-accent" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-text-primary mb-1.5">
                      {feature.title}
                    </h3>
                    <p className="text-sm text-text-secondary leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-20 px-6 border-t border-border/50">
        <div className="mx-auto max-w-md">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-bold text-text-primary mb-3">Simple pricing</h2>
            <p className="text-text-secondary text-sm">One plan. Everything included.</p>
          </div>

          <div className="rounded-2xl border border-accent/20 bg-card p-8 shadow-glow">
            <div className="text-center mb-8">
              <div className="inline-flex items-center gap-1.5 rounded-full border border-success/30 bg-success/10 px-3 py-1 mb-3">
                <span className="text-xs font-semibold text-success">7-day free trial</span>
              </div>
              <div className="flex items-baseline justify-center gap-1 mb-2">
                <span className="text-4xl font-bold text-text-primary">$49</span>
                <span className="text-text-muted text-sm">/month</span>
              </div>
              <p className="text-sm text-text-secondary">
                For freelancers, agencies, contractors, and consultants
              </p>
            </div>

            <ul className="flex flex-col gap-3 mb-8">
              {includedItems.map((item) => (
                <li key={item} className="flex items-center gap-2.5 text-sm text-text-secondary">
                  <div className="flex h-5 w-5 items-center justify-center rounded-full bg-accent/10 flex-shrink-0">
                    <Check className="h-3 w-3 text-accent" />
                  </div>
                  {item}
                </li>
              ))}
            </ul>

            <Link href="/signup" className="block">
              <Button size="lg" className="w-full">
                Start free trial
                <ChevronRight className="h-4 w-4" />
              </Button>
            </Link>

            <p className="text-center text-xs text-text-muted mt-4">
              No charge for 7 days. Card required.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/50 py-10 px-6">
        <div className="mx-auto max-w-6xl flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="flex h-6 w-6 items-center justify-center rounded-md bg-accent/10">
              <Zap className="h-3 w-3 text-accent" />
            </div>
            <span className="text-sm font-semibold text-text-primary">LeadFlow</span>
          </div>
          <p className="text-xs text-text-muted">
            © {new Date().getFullYear()} LeadFlow. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  )
}
