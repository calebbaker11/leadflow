import Link from 'next/link'
import { Button } from '@/components/ui/button'
import {
  ArrowRight,
  FileText,
  Share2,
  TrendingUp,
  Check,
  ChevronRight,
  Sparkles,
} from 'lucide-react'

const features = [
  {
    icon: Sparkles,
    title: 'Generate in seconds',
    description:
      'Describe the project, hit generate. GPT-4o writes a complete, professional proposal — scoped, priced, and ready to send.',
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

const steps = [
  {
    number: '01',
    title: 'Describe your project',
    description:
      'Enter the client name, project details, budget, and timeline. Takes less than a minute.',
  },
  {
    number: '02',
    title: 'Generate with AI',
    description:
      'GPT-4o writes a complete, professional proposal tailored to your business type and project scope.',
  },
  {
    number: '03',
    title: 'Send and close',
    description:
      'Export as PDF or share a clean link. Your client reads a polished proposal — and signs.',
  },
]

const includedItems = [
  '7-day free trial — 5 proposals included',
  '30 proposals per month after trial',
  'GPT-4o powered generation',
  'PDF export',
  'Shareable proposal links',
  'All 4 business templates',
  'Dashboard analytics',
  'Cancel anytime',
]

const proItems = [
  '7-day free trial — 5 proposals included',
  '100 proposals per month after trial',
  'AI-powered objection detection with built-in counter angles',
  'Multi-touch follow-up sequences that increase response rates',
  'Brand voice customization for premium positioning',
  'Pricing optimization insights that maximize deal value',
  'Everything in LeadFlow Base included',
  'Cancel anytime',
]

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="fixed top-0 inset-x-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-sm">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
          <div className="flex items-center">
            <img src="/logo.svg" alt="LeadFlow" className="h-8" />
          </div>
          <div className="flex items-center gap-6">
            <Link
              href="#how-it-works"
              className="text-sm text-text-muted hover:text-text-primary transition-colors hidden sm:block"
            >
              How it works
            </Link>
            <Link
              href="#pricing"
              className="text-sm text-text-muted hover:text-text-primary transition-colors hidden sm:block"
            >
              Pricing
            </Link>
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
      <section className="relative pt-36 pb-28 px-6 overflow-hidden">
        {/* Background glow */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              'radial-gradient(ellipse 80% 50% at 50% -10%, rgba(99,102,241,0.2) 0%, transparent 70%)',
          }}
        />
        {/* Subtle grid */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage:
              'linear-gradient(rgba(248,248,248,1) 1px, transparent 1px), linear-gradient(90deg, rgba(248,248,248,1) 1px, transparent 1px)',
            backgroundSize: '60px 60px',
          }}
        />

        <div className="mx-auto max-w-4xl text-center relative">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 rounded-full border border-accent/20 bg-accent/5 px-4 py-1.5 mb-8">
            <Sparkles className="h-3 w-3 text-accent" />
            <span className="text-xs font-medium text-accent">
              Powered by GPT-4o · Built for closers
            </span>
          </div>

          {/* Headline */}
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight leading-[1.08] text-balance mb-6">
            <span className="text-text-primary">Win more clients</span>
            <br />
            <span
              style={{
                background: 'linear-gradient(135deg, #818cf8 0%, #6366f1 40%, #a78bfa 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              with better proposals
            </span>
          </h1>

          <p className="text-lg md:text-xl text-text-secondary max-w-2xl mx-auto leading-relaxed mb-10">
            LeadFlow generates professional, client-ready proposals in 60 seconds.
            Stop losing deals to poorly written quotes — let AI do the heavy lifting.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
            <Link href="/signup">
              <Button size="lg" className="gap-2 w-full sm:w-auto px-8">
                Start free — 7-day trial
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link
              href="/login"
              className="text-sm text-text-muted hover:text-text-secondary transition-colors"
            >
              Already have an account? Sign in →
            </Link>
          </div>

          {/* Trust chips */}
          <div className="flex flex-wrap items-center justify-center gap-5 text-xs text-text-muted">
            <span className="flex items-center gap-1.5">
              <Check className="h-3.5 w-3.5 text-success" />
              No charge for 7 days
            </span>
            <span className="flex items-center gap-1.5">
              <Check className="h-3.5 w-3.5 text-success" />
              Cancel anytime
            </span>
            <span className="flex items-center gap-1.5">
              <Check className="h-3.5 w-3.5 text-success" />
              Setup in under 2 minutes
            </span>
          </div>
        </div>
      </section>

      {/* Stats bar */}
      <section className="border-y border-border/50 bg-surface/40">
        <div className="mx-auto max-w-5xl px-6 py-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { value: '< 60s', label: 'Average creation time' },
              { value: 'GPT-4o', label: 'AI model used' },
              { value: '4', label: 'Business templates' },
              { value: '7 days', label: 'Free trial, no charge' },
            ].map((stat) => (
              <div key={stat.label}>
                <p className="text-2xl md:text-3xl font-bold text-text-primary mb-1">
                  {stat.value}
                </p>
                <p className="text-xs text-text-muted">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="py-24 px-6 border-b border-border/50">
        <div className="mx-auto max-w-5xl">
          <div className="text-center mb-14">
            <p className="text-xs font-semibold uppercase tracking-widest text-accent mb-3">
              How it works
            </p>
            <h2 className="text-3xl font-bold text-text-primary mb-3">
              From idea to sent proposal in 3 steps
            </h2>
            <p className="text-text-secondary text-sm max-w-lg mx-auto">
              No templates to fill out. No formatting to fight with. Just describe the job and let
              LeadFlow handle the rest.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 relative">
            <div className="hidden md:block absolute top-8 left-[calc(16.67%+2rem)] right-[calc(16.67%+2rem)] h-px bg-gradient-to-r from-transparent via-border to-transparent" />
            {steps.map((step) => (
              <div key={step.number} className="flex flex-col items-center text-center p-6">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-accent/20 bg-accent/5 mb-5 relative z-10">
                  <span className="text-lg font-bold text-accent">{step.number}</span>
                </div>
                <h3 className="text-sm font-semibold text-text-primary mb-2">{step.title}</h3>
                <p className="text-sm text-text-secondary leading-relaxed">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Before / After */}
      <section className="py-24 px-6 border-b border-border/50">
        <div className="mx-auto max-w-5xl">
          <div className="text-center mb-14">
            <p className="text-xs font-semibold uppercase tracking-widest text-accent mb-3">
              The difference
            </p>
            <h2 className="text-3xl font-bold text-text-primary mb-3">
              From scattered notes to winning proposals
            </h2>
            <p className="text-text-secondary text-sm">
              What used to take hours now takes 60 seconds.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="rounded-2xl border border-danger/20 bg-danger/5 p-8">
              <div className="flex items-center gap-2 mb-6">
                <div className="h-2 w-2 rounded-full bg-danger" />
                <p className="text-xs font-semibold uppercase tracking-wider text-danger">
                  Before LeadFlow
                </p>
              </div>
              <ul className="flex flex-col gap-4">
                {[
                  'Copy-paste from old proposals',
                  'Hours formatting in Google Docs',
                  'Inconsistent pricing language',
                  'Weak calls to action',
                  'Clients ghost you after the quote',
                  'Lost deals to faster competitors',
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3 text-sm text-text-secondary">
                    <span className="mt-0.5 text-danger flex-shrink-0">✕</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-2xl border border-success/20 bg-success/5 p-8">
              <div className="flex items-center gap-2 mb-6">
                <div className="h-2 w-2 rounded-full bg-success" />
                <p className="text-xs font-semibold uppercase tracking-wider text-success">
                  After LeadFlow
                </p>
              </div>
              <ul className="flex flex-col gap-4">
                {[
                  'Professional proposals in 60 seconds',
                  'Beautifully formatted every time',
                  'Confident, clear pricing presentation',
                  'Persuasive next steps built in',
                  'Clients click the link and sign',
                  'More deals closed, less time writing',
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3 text-sm text-text-secondary">
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
      <section className="py-24 px-6 border-b border-border/50">
        <div className="mx-auto max-w-5xl">
          <div className="text-center mb-14">
            <p className="text-xs font-semibold uppercase tracking-widest text-accent mb-3">
              Features
            </p>
            <h2 className="text-3xl font-bold text-text-primary mb-3">
              Everything you need to win the deal
            </h2>
            <p className="text-text-secondary text-sm">
              Built for service businesses who close deals.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-5">
            {features.map((feature) => {
              const Icon = feature.icon
              return (
                <div
                  key={feature.title}
                  className="rounded-2xl border border-border bg-card p-7 flex gap-5 hover:border-accent/30 hover:bg-card-hover transition-all duration-200"
                >
                  <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-accent/10">
                    <Icon className="h-5 w-5 text-accent" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-text-primary mb-2">
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

          <div className="flex flex-wrap justify-center gap-2 mt-8">
            {[
              'Freelancer templates',
              'Agency templates',
              'Contractor templates',
              'Consultant templates',
            ].map((f) => (
              <span
                key={f}
                className="inline-flex items-center gap-1.5 rounded-full border border-border bg-surface px-3 py-1.5 text-xs text-text-muted"
              >
                <Check className="h-3 w-3 text-success" />
                {f}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Early adopter CTA */}
      <section className="py-24 px-6 border-b border-border/50">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-xs font-semibold uppercase tracking-widest text-accent mb-3">
            Early access
          </p>
          <h2 className="text-3xl font-bold text-text-primary mb-4">
            Be among the first to close faster
          </h2>
          <p className="text-text-secondary text-sm max-w-lg mx-auto mb-8">
            LeadFlow is built for freelancers, agencies, contractors, and consultants who are tired of losing deals to slow, unprofessional quotes. Try it free — no risk.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-5 text-sm text-text-muted">
            <span className="flex items-center gap-1.5">
              <Check className="h-3.5 w-3.5 text-success" />
              No credit card gymnastics — 7 days free
            </span>
            <span className="flex items-center gap-1.5">
              <Check className="h-3.5 w-3.5 text-success" />
              Real AI, real proposals
            </span>
            <span className="flex items-center gap-1.5">
              <Check className="h-3.5 w-3.5 text-success" />
              Cancel anytime
            </span>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-24 px-6 border-b border-border/50">
        <div className="mx-auto max-w-4xl">
          <div className="text-center mb-10">
            <p className="text-xs font-semibold uppercase tracking-widest text-accent mb-3">
              Pricing
            </p>
            <h2 className="text-3xl font-bold text-text-primary mb-3">Two plans. Built to scale with you.</h2>
            <p className="text-text-secondary text-sm">
              Start free. Upgrade when you're ready to close at a higher level.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* LeadFlow Plan */}
            <div className="rounded-2xl border border-accent/20 bg-card p-8 relative overflow-hidden flex flex-col">
              <div
                className="pointer-events-none absolute top-0 inset-x-0 h-px"
                style={{
                  background:
                    'linear-gradient(90deg, transparent, rgba(99,102,241,0.6), transparent)',
                }}
              />
              <div className="mb-6">
                <p className="text-xs font-semibold uppercase tracking-widest text-accent mb-3">LeadFlow Base</p>
                <div className="flex items-baseline gap-1 mb-2">
                  <span className="text-5xl font-bold text-text-primary">$39</span>
                  <span className="text-text-muted text-sm">/month</span>
                </div>
                <p className="text-sm text-text-secondary">
                  For freelancers, agencies, contractors, and consultants
                </p>
              </div>

              <ul className="flex flex-col gap-3 mb-8 flex-1">
                {includedItems.map((item) => (
                  <li key={item} className="flex items-center gap-3 text-sm text-text-secondary">
                    <div className="flex h-5 w-5 items-center justify-center rounded-full bg-accent/10 flex-shrink-0">
                      <Check className="h-3 w-3 text-accent" />
                    </div>
                    {item}
                  </li>
                ))}
              </ul>

              <Link href="/signup" className="block">
                <Button size="lg" variant="outline" className="w-full">
                  Start your free trial
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </Link>

              <p className="text-center text-xs text-text-muted mt-4">
                Card required. No charge for 7 days. Cancel anytime.
              </p>
            </div>

            {/* LeadFlow Pro Plan */}
            <div className="rounded-2xl border border-accent/40 bg-card p-8 shadow-glow relative overflow-hidden flex flex-col">
              <div
                className="pointer-events-none absolute top-0 inset-x-0 h-px"
                style={{
                  background:
                    'linear-gradient(90deg, transparent, rgba(99,102,241,0.9), transparent)',
                }}
              />
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-3">
                  <p className="text-xs font-semibold uppercase tracking-widest text-accent">LeadFlow Pro</p>
                  <span className="rounded-full border border-accent/20 bg-accent/10 px-2 py-0.5 text-xs font-semibold text-accent">
                    Most powerful
                  </span>
                </div>
                <div className="flex items-baseline gap-1 mb-2">
                  <span className="text-5xl font-bold text-text-primary">$89</span>
                  <span className="text-text-muted text-sm">/month</span>
                </div>
                <p className="text-sm text-text-secondary">
                  Advanced sales optimization designed for serious closers
                </p>
              </div>

              <ul className="flex flex-col gap-3 mb-8 flex-1">
                {proItems.map((item) => (
                  <li key={item} className="flex items-center gap-3 text-sm text-text-secondary">
                    <div className="flex h-5 w-5 items-center justify-center rounded-full bg-accent/10 flex-shrink-0">
                      <Check className="h-3 w-3 text-accent" />
                    </div>
                    {item}
                  </li>
                ))}
              </ul>

              <Link href="/subscribe/pro" className="block">
                <Button size="lg" className="w-full">
                  Start your free trial
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </Link>

              <p className="text-center text-xs text-text-muted mt-4">
                Card required. No charge for 7 days. Cancel anytime.
              </p>
            </div>
          </div>

          <p className="text-center text-xs text-text-muted mt-8 max-w-xl mx-auto">
            Pro isn&apos;t just about generating proposals — it&apos;s about engineering higher close rates and accelerating predictable revenue.
          </p>
        </div>
      </section>

      {/* CTA banner */}
      <section className="py-28 px-6 border-b border-border/50 relative overflow-hidden">
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              'radial-gradient(ellipse 70% 80% at 50% 50%, rgba(99,102,241,0.13) 0%, transparent 70%)',
          }}
        />
        <div className="mx-auto max-w-3xl text-center relative">
          <h2 className="text-4xl md:text-5xl font-bold text-text-primary mb-5 text-balance">
            Your next proposal could close
            <br />
            <span
              style={{
                background: 'linear-gradient(135deg, #818cf8 0%, #6366f1 50%, #a78bfa 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              in 60 seconds
            </span>
          </h2>
          <p className="text-text-secondary text-lg mb-10 max-w-xl mx-auto">
            Stop losing deals to slow, unprofessional quotes. Let AI write your proposals in 60 seconds.
          </p>
          <Link href="/signup">
            <Button size="lg" className="gap-2 px-10">
              Start your free trial
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
          <p className="mt-4 text-xs text-text-muted">Card required · No charge for 7 days · Cancel anytime</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/50 py-12 px-6">
        <div className="mx-auto max-w-6xl">
          <div className="flex flex-col md:flex-row items-start justify-between gap-10 mb-10">
            <div>
              <div className="flex items-center mb-3">
                <img src="/logo.svg" alt="LeadFlow" className="h-8" />
              </div>
              <p className="text-xs text-text-muted max-w-xs leading-relaxed">
                AI-powered proposal generation for freelancers, agencies, contractors, and
                consultants.
              </p>
            </div>
            <div className="flex gap-12">
              <div className="flex flex-col gap-3">
                <p className="text-xs font-semibold text-text-secondary uppercase tracking-wider">
                  Product
                </p>
                <Link
                  href="#how-it-works"
                  className="text-xs text-text-muted hover:text-text-secondary transition-colors"
                >
                  How it works
                </Link>
                <Link
                  href="#pricing"
                  className="text-xs text-text-muted hover:text-text-secondary transition-colors"
                >
                  Pricing
                </Link>
                <Link
                  href="/signup"
                  className="text-xs text-text-muted hover:text-text-secondary transition-colors"
                >
                  Get started
                </Link>
              </div>
              <div className="flex flex-col gap-3">
                <p className="text-xs font-semibold text-text-secondary uppercase tracking-wider">
                  Account
                </p>
                <Link
                  href="/login"
                  className="text-xs text-text-muted hover:text-text-secondary transition-colors"
                >
                  Sign in
                </Link>
                <Link
                  href="/signup"
                  className="text-xs text-text-muted hover:text-text-secondary transition-colors"
                >
                  Create account
                </Link>
              </div>
            </div>
          </div>
          <div className="border-t border-border/50 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-xs text-text-muted">
              © {new Date().getFullYear()} LeadFlow. All rights reserved.
            </p>
            <p className="text-xs text-text-muted">Built for closers.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
