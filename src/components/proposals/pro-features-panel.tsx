'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Zap, ChevronDown, ChevronUp, Copy, Check, Star, Lightbulb } from 'lucide-react'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

interface Objection {
  objection: string
  response: string
}

interface FollowUpEmail {
  day: number
  subject: string
  body: string
}

interface ScoreBreakdown {
  clarity: number
  persuasion: number
  personalization: number
  urgency: number
}

interface ProposalScore {
  score: number
  grade: string
  breakdown: ScoreBreakdown
  verdict: string
}

interface Suggestion {
  category: string
  title: string
  suggestion: string
}

interface ProFeaturesPanelProps {
  proposalId: string
  hasProposalText: boolean
}

const scoreColor = (n: number) =>
  n >= 80 ? 'text-success' : n >= 60 ? 'text-warning' : 'text-danger'

const scoreBarColor = (n: number) =>
  n >= 80 ? 'bg-success' : n >= 60 ? 'bg-warning' : 'bg-danger'

const categoryLabel: Record<string, string> = {
  urgency: 'Urgency',
  personalization: 'Personalization',
  clarity: 'Clarity',
  social_proof: 'Social Proof',
  closing: 'Closing',
  pricing: 'Pricing',
}

export function ProFeaturesPanel({ proposalId, hasProposalText }: ProFeaturesPanelProps) {
  const [plan, setPlan] = useState<'pro' | 'paid' | 'none' | null>(null)

  const [objections, setObjections] = useState<Objection[] | null>(null)
  const [loadingObjections, setLoadingObjections] = useState(false)
  const [objectionsOpen, setObjectionsOpen] = useState(false)

  const [emails, setEmails] = useState<FollowUpEmail[] | null>(null)
  const [loadingEmails, setLoadingEmails] = useState(false)
  const [emailsOpen, setEmailsOpen] = useState(false)

  const [score, setScore] = useState<ProposalScore | null>(null)
  const [loadingScore, setLoadingScore] = useState(false)
  const [scoreOpen, setScoreOpen] = useState(false)

  const [suggestions, setSuggestions] = useState<Suggestion[] | null>(null)
  const [loadingSuggestions, setLoadingSuggestions] = useState(false)
  const [suggestionsOpen, setSuggestionsOpen] = useState(false)

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

  async function generateScore() {
    setLoadingScore(true)
    setScoreOpen(true)
    try {
      const res = await fetch(`/api/proposals/${proposalId}/score`, { method: 'POST' })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setScore(data)
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to score proposal')
    } finally {
      setLoadingScore(false)
    }
  }

  async function generateSuggestions() {
    setLoadingSuggestions(true)
    setSuggestionsOpen(true)
    try {
      const res = await fetch(`/api/proposals/${proposalId}/suggestions`, { method: 'POST' })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setSuggestions(data.suggestions)
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to generate suggestions')
    } finally {
      setLoadingSuggestions(false)
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

      {/* Proposal Score */}
      <div className="rounded-xl border border-border bg-card">
        <button
          className="flex w-full items-center justify-between p-4 text-left"
          onClick={() => setScoreOpen((o) => !o)}
        >
          <div>
            <p className="text-sm font-medium text-text-primary">Proposal score</p>
            <p className="text-xs text-text-muted">Quality & confidence rating</p>
          </div>
          <div className="flex items-center gap-2">
            {score && (
              <span className={cn('text-sm font-bold', scoreColor(score.score))}>
                {score.grade}
              </span>
            )}
            {scoreOpen ? (
              <ChevronUp className="h-4 w-4 text-text-muted flex-shrink-0" />
            ) : (
              <ChevronDown className="h-4 w-4 text-text-muted flex-shrink-0" />
            )}
          </div>
        </button>

        {scoreOpen && (
          <div className="border-t border-border px-4 pb-4 pt-3">
            {!score && !loadingScore && (
              <Button
                size="sm"
                variant="secondary"
                onClick={generateScore}
                disabled={!hasProposalText}
              >
                <Star className="h-3.5 w-3.5" />
                {hasProposalText ? 'Score this proposal' : 'Generate a proposal first'}
              </Button>
            )}
            {loadingScore && (
              <p className="text-xs text-text-muted animate-pulse">Analyzing proposal quality...</p>
            )}
            {score && (
              <div className="flex flex-col gap-4">
                {/* Big score */}
                <div className="flex items-center gap-4">
                  <div className="flex flex-col items-center justify-center h-16 w-16 rounded-xl border border-border bg-surface flex-shrink-0">
                    <span className={cn('text-2xl font-bold tabular-nums', scoreColor(score.score))}>
                      {score.score}
                    </span>
                    <span className="text-[10px] text-text-muted">/100</span>
                  </div>
                  <div>
                    <p className={cn('text-lg font-bold', scoreColor(score.score))}>{score.grade}</p>
                    <p className="text-xs text-text-secondary leading-relaxed">{score.verdict}</p>
                  </div>
                </div>

                {/* Breakdown bars */}
                <div className="flex flex-col gap-2.5">
                  {(Object.entries(score.breakdown) as [keyof ScoreBreakdown, number][]).map(([key, val]) => (
                    <div key={key}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[11px] text-text-muted capitalize">{key}</span>
                        <span className={cn('text-[11px] font-semibold tabular-nums', scoreColor(val))}>
                          {val}
                        </span>
                      </div>
                      <div className="h-1.5 rounded-full bg-border overflow-hidden">
                        <div
                          className={cn('h-full rounded-full transition-all duration-500', scoreBarColor(val))}
                          style={{ width: `${val}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>

                <Button
                  size="sm"
                  variant="ghost"
                  onClick={generateScore}
                  loading={loadingScore}
                  className="self-start"
                >
                  Re-score
                </Button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Improvement Suggestions */}
      <div className="rounded-xl border border-border bg-card">
        <button
          className="flex w-full items-center justify-between p-4 text-left"
          onClick={() => setSuggestionsOpen((o) => !o)}
        >
          <div>
            <p className="text-sm font-medium text-text-primary">Improvement suggestions</p>
            <p className="text-xs text-text-muted">Specific changes to win this client</p>
          </div>
          {suggestionsOpen ? (
            <ChevronUp className="h-4 w-4 text-text-muted flex-shrink-0" />
          ) : (
            <ChevronDown className="h-4 w-4 text-text-muted flex-shrink-0" />
          )}
        </button>

        {suggestionsOpen && (
          <div className="border-t border-border px-4 pb-4 pt-3">
            {!suggestions && !loadingSuggestions && (
              <Button
                size="sm"
                variant="secondary"
                onClick={generateSuggestions}
                disabled={!hasProposalText}
              >
                <Lightbulb className="h-3.5 w-3.5" />
                {hasProposalText ? 'Get suggestions' : 'Generate a proposal first'}
              </Button>
            )}
            {loadingSuggestions && (
              <p className="text-xs text-text-muted animate-pulse">Finding improvements...</p>
            )}
            {suggestions && (
              <div className="flex flex-col gap-3">
                {suggestions.map((s, i) => (
                  <div key={i} className="flex gap-3">
                    <div className="flex h-6 w-6 items-center justify-center rounded-md bg-accent/10 flex-shrink-0 mt-0.5">
                      <Lightbulb className="h-3.5 w-3.5 text-accent" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-text-primary">
                        {s.title}
                        <span className="ml-1.5 text-[10px] font-normal text-text-muted uppercase tracking-wide">
                          {categoryLabel[s.category] ?? s.category}
                        </span>
                      </p>
                      <p className="text-xs text-text-secondary leading-relaxed mt-0.5">{s.suggestion}</p>
                    </div>
                  </div>
                ))}
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={generateSuggestions}
                  loading={loadingSuggestions}
                  className="self-start"
                >
                  Regenerate
                </Button>
              </div>
            )}
          </div>
        )}
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
