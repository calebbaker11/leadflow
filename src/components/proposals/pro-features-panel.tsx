'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Zap, ChevronDown, ChevronUp, Copy, Check } from 'lucide-react'
import { toast } from 'sonner'

interface Objection {
  objection: string
  response: string
}

interface FollowUpEmail {
  day: number
  subject: string
  body: string
}

interface ProFeaturesPanelProps {
  proposalId: string
  hasProposalText: boolean
}

export function ProFeaturesPanel({ proposalId, hasProposalText }: ProFeaturesPanelProps) {
  const [plan, setPlan] = useState<'pro' | 'paid' | 'none' | null>(null)

  const [objections, setObjections] = useState<Objection[] | null>(null)
  const [loadingObjections, setLoadingObjections] = useState(false)
  const [objectionsOpen, setObjectionsOpen] = useState(false)

  const [emails, setEmails] = useState<FollowUpEmail[] | null>(null)
  const [loadingEmails, setLoadingEmails] = useState(false)
  const [emailsOpen, setEmailsOpen] = useState(false)

  const [copiedIdx, setCopiedIdx] = useState<number | null>(null)

  useEffect(() => {
    fetch('/api/user/plan')
      .then((r) => r.json())
      .then((d) => setPlan(d.plan))
      .catch(() => setPlan('none'))
  }, [])

  async function generateObjections() {
    setLoadingObjections(true)
    setObjectionsOpen(true)
    try {
      const res = await fetch(`/api/proposals/${proposalId}/objections`, { method: 'POST' })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setObjections(data.objections)
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to generate objections')
    } finally {
      setLoadingObjections(false)
    }
  }

  async function generateFollowUps() {
    setLoadingEmails(true)
    setEmailsOpen(true)
    try {
      const res = await fetch(`/api/proposals/${proposalId}/followups`, { method: 'POST' })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setEmails(data.emails)
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to generate follow-ups')
    } finally {
      setLoadingEmails(false)
    }
  }

  async function copyEmail(text: string, idx: number) {
    await navigator.clipboard.writeText(text)
    setCopiedIdx(idx)
    setTimeout(() => setCopiedIdx(null), 2000)
  }

  if (plan === null) return null

  if (plan !== 'pro') {
    return (
      <div className="mt-6 rounded-xl border border-accent/20 bg-accent/5 p-5">
        <div className="flex items-center gap-2 mb-2">
          <Zap className="h-4 w-4 text-accent" />
          <p className="text-sm font-semibold text-text-primary">LeadFlow Pro features</p>
        </div>
        <p className="text-xs text-text-secondary mb-4">
          Upgrade to Pro to unlock AI objection detection, multi-touch follow-up sequences, and brand voice customization.
        </p>
        <Button
          size="sm"
          variant="outline"
          onClick={() => window.open('/subscribe/pro', '_blank')}
        >
          <Zap className="h-3.5 w-3.5" />
          Upgrade to Pro — $89/month
        </Button>
      </div>
    )
  }

  return (
    <div className="mt-6 flex flex-col gap-3">
      <div className="flex items-center gap-2">
        <Zap className="h-4 w-4 text-accent" />
        <p className="text-sm font-semibold text-text-primary">Pro features</p>
      </div>

      {/* Objection Detection */}
      <div className="rounded-xl border border-border bg-card">
        <button
          className="flex w-full items-center justify-between p-4 text-left"
          onClick={() => setObjectionsOpen((o) => !o)}
        >
          <div>
            <p className="text-sm font-medium text-text-primary">Objection detection</p>
            <p className="text-xs text-text-muted">Anticipate what your client might push back on</p>
          </div>
          {objectionsOpen ? (
            <ChevronUp className="h-4 w-4 text-text-muted flex-shrink-0" />
          ) : (
            <ChevronDown className="h-4 w-4 text-text-muted flex-shrink-0" />
          )}
        </button>

        {objectionsOpen && (
          <div className="border-t border-border px-4 pb-4 pt-3">
            {!objections && !loadingObjections && (
              <Button
                size="sm"
                variant="secondary"
                onClick={generateObjections}
                disabled={!hasProposalText}
              >
                {hasProposalText ? 'Generate objections' : 'Generate a proposal first'}
              </Button>
            )}
            {loadingObjections && (
              <p className="text-xs text-text-muted animate-pulse">Analyzing proposal...</p>
            )}
            {objections && (
              <div className="flex flex-col gap-4">
                {objections.map((o, i) => (
                  <div key={i} className="flex flex-col gap-1">
                    <p className="text-xs font-semibold text-warning">
                      &ldquo;{o.objection}&rdquo;
                    </p>
                    <p className="text-xs text-text-secondary leading-relaxed">{o.response}</p>
                  </div>
                ))}
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={generateObjections}
                  loading={loadingObjections}
                  className="self-start"
                >
                  Regenerate
                </Button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Follow-up Sequences */}
      <div className="rounded-xl border border-border bg-card">
        <button
          className="flex w-full items-center justify-between p-4 text-left"
          onClick={() => setEmailsOpen((o) => !o)}
        >
          <div>
            <p className="text-sm font-medium text-text-primary">Follow-up sequence</p>
            <p className="text-xs text-text-muted">4-email cadence to close the deal</p>
          </div>
          {emailsOpen ? (
            <ChevronUp className="h-4 w-4 text-text-muted flex-shrink-0" />
          ) : (
            <ChevronDown className="h-4 w-4 text-text-muted flex-shrink-0" />
          )}
        </button>

        {emailsOpen && (
          <div className="border-t border-border px-4 pb-4 pt-3">
            {!emails && !loadingEmails && (
              <Button
                size="sm"
                variant="secondary"
                onClick={generateFollowUps}
                disabled={!hasProposalText}
              >
                {hasProposalText ? 'Generate follow-up sequence' : 'Generate a proposal first'}
              </Button>
            )}
            {loadingEmails && (
              <p className="text-xs text-text-muted animate-pulse">Writing your sequence...</p>
            )}
            {emails && (
              <div className="flex flex-col gap-4">
                {emails.map((email, i) => (
                  <div
                    key={i}
                    className="rounded-lg border border-border bg-surface p-3 flex flex-col gap-1.5"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-accent">Day {email.day}</span>
                      <button
                        onClick={() => copyEmail(`Subject: ${email.subject}\n\n${email.body}`, i)}
                        className="text-text-muted hover:text-text-secondary transition-colors"
                        title="Copy email"
                      >
                        {copiedIdx === i ? (
                          <Check className="h-3.5 w-3.5 text-success" />
                        ) : (
                          <Copy className="h-3.5 w-3.5" />
                        )}
                      </button>
                    </div>
                    <p className="text-xs font-medium text-text-primary">
                      Subject: {email.subject}
                    </p>
                    <p className="text-xs text-text-secondary leading-relaxed whitespace-pre-wrap">
                      {email.body}
                    </p>
                  </div>
                ))}
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={generateFollowUps}
                  loading={loadingEmails}
                  className="self-start"
                >
                  Regenerate
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
