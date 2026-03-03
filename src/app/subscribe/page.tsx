'use client'

import { useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Check, AlertCircle } from 'lucide-react'
import { toast } from 'sonner'

const included = [
  '7-day free trial — no charge today',
  'Up to 30 proposals per month',
  'GPT-4o powered generation',
  'PDF export',
  'Shareable proposal links',
  'Freelancer, Agency, Contractor & Consultant templates',
  'Proposal pipeline & analytics',
  'Cancel anytime',
]

export default function SubscribePage() {
  return (
    <Suspense>
      <SubscribeContent />
    </Suspense>
  )
}

function SubscribeContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const canceled = searchParams.get('canceled')
  const [loading, setLoading] = useState(false)

  async function handleSubscribe() {
    setLoading(true)

    try {
      const res = await fetch('/api/stripe/checkout', { method: 'POST' })
      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Failed to create checkout session')
      }

      window.location.href = data.url
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Something went wrong')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-6 py-16">
      <div className="mb-10">
        <img src="/logo.svg" alt="LeadFlow" className="h-8 mx-auto" />
      </div>

      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-text-primary mb-2">
            Try LeadFlow free for 7 days
          </h1>
          <p className="text-sm text-text-secondary">
            Full access during your trial. Then $49/month — cancel anytime.
          </p>
        </div>

        {canceled && (
          <div className="flex items-start gap-3 rounded-lg border border-warning/20 bg-warning/5 p-4 mb-6">
            <AlertCircle className="h-4 w-4 text-warning flex-shrink-0 mt-0.5" />
            <p className="text-sm text-text-secondary">
              Payment was canceled. No charges were made. You can try again below.
            </p>
          </div>
        )}

        <div className="rounded-2xl border border-accent/20 bg-card p-8 shadow-glow">
          <div className="text-center mb-6">
            <div className="inline-flex items-center gap-1.5 rounded-full border border-success/30 bg-success/10 px-3 py-1 mb-3">
              <span className="text-xs font-semibold text-success">7-day free trial</span>
            </div>
            <div className="flex items-baseline justify-center gap-1 mb-1">
              <span className="text-4xl font-bold text-text-primary">$0</span>
              <span className="text-text-muted text-sm">today</span>
            </div>
            <p className="text-xs text-text-muted">then $49/month after your trial ends</p>
          </div>

          <ul className="flex flex-col gap-2.5 mb-7">
            {included.map((item) => (
              <li key={item} className="flex items-center gap-2.5 text-sm text-text-secondary">
                <div className="flex h-4 w-4 items-center justify-center rounded-full bg-accent/10 flex-shrink-0">
                  <Check className="h-2.5 w-2.5 text-accent" />
                </div>
                {item}
              </li>
            ))}
          </ul>

          <Button
            onClick={handleSubscribe}
            loading={loading}
            size="lg"
            className="w-full"
          >
            Start free trial
          </Button>

          <p className="text-center text-xs text-text-muted mt-4">
            Card required. No charge for 7 days. Secured by Stripe.
          </p>
        </div>

        <p className="text-center text-xs text-text-muted mt-6">
          Already subscribed?{' '}
          <button
            onClick={() => router.push('/dashboard')}
            className="text-accent hover:text-accent-hover transition-colors"
          >
            Go to dashboard
          </button>
        </p>
      </div>
    </div>
  )
}
