'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Topbar } from '@/components/layout/topbar'
import { ProposalForm } from '@/components/proposals/proposal-form'
import { ProposalPreview } from '@/components/proposals/proposal-preview'
import { Button } from '@/components/ui/button'
import type { ProposalFormData } from '@/types'
import type { ProposalUsage } from '@/lib/proposal-limits'
import { toast } from 'sonner'
import { FileText, PartyPopper, Sparkles } from 'lucide-react'
import { cn } from '@/lib/utils'

interface NewProposalClientProps {
  usage: ProposalUsage
}

export function NewProposalClient({ usage }: NewProposalClientProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const isWelcome = searchParams.get('welcome') === '1'
  const [generating, setGenerating] = useState(false)
  const [proposal, setProposal] = useState<{ id: string; generated_proposal_text: string; client_name: string } | null>(null)

  async function handleGenerate(formData: ProposalFormData) {
    setGenerating(true)
    try {
      const res = await fetch('/api/proposals/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to generate proposal')
      setProposal(data.proposal)
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setGenerating(false)
    }
  }

  const remaining = usage.limit - usage.used
  const isNearLimit = remaining <= 1 && remaining > 0

  const usageDescription = usage.plan === 'trial'
    ? `${remaining} of ${usage.limit} trial proposal${usage.limit !== 1 ? 's' : ''} remaining`
    : `${remaining} of ${usage.limit} proposals remaining this month`

  return (
    <div className="flex flex-col h-full">
      <Topbar
        title="New Proposal"
        description={usageDescription}
        action={
          proposal ? (
            <Button size="sm" onClick={() => router.push(`/proposals/${proposal.id}`)}>
              <FileText className="h-3.5 w-3.5" />
              View &amp; Export
            </Button>
          ) : undefined
        }
      />

      {isWelcome && !proposal && (
        <div className="mx-6 mt-4 rounded-lg border border-accent/20 bg-accent/5 px-4 py-3 flex items-start gap-3">
          <PartyPopper className="h-4 w-4 text-accent flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-text-primary">Welcome to LeadFlow!</p>
            <p className="text-xs text-text-muted mt-0.5">
              Your trial is active. Fill in the form on the left and hit <strong>Generate Proposal</strong> — your first AI proposal is ready in seconds.
            </p>
          </div>
        </div>
      )}

      {isNearLimit && !isWelcome && (
        <div className={cn(
          'mx-6 mt-4 rounded-lg border px-4 py-2.5 text-xs',
          'border-warning/30 bg-warning/5 text-warning'
        )}>
          Last proposal{usage.plan === 'trial' ? ' in your free trial' : ' for this billing period'} — use it wisely.
        </div>
      )}

      <div className="flex flex-1 overflow-hidden">
        <div className="w-[420px] flex-shrink-0 border-r border-border overflow-y-auto p-6">
          <ProposalForm onGenerate={handleGenerate} loading={generating} />
        </div>
        <div className="flex-1 overflow-y-auto p-6">
          {proposal ? (
            <div className="flex flex-col gap-4 h-full">
              <div className="flex items-start gap-3 rounded-lg border border-success/20 bg-success/5 px-4 py-3 flex-shrink-0">
                <Sparkles className="h-4 w-4 text-success flex-shrink-0 mt-0.5" />
                <p className="text-xs text-text-secondary">
                  <span className="font-semibold text-success">Proposal ready.</span>{' '}
                  This proposal is written to help you stand out and win the client faster — review it, then share or export when you&apos;re happy with it.
                </p>
              </div>
              <ProposalPreview
                content={proposal.generated_proposal_text}
                clientName={proposal.client_name}
              />
            </div>
          ) : (
            <div className="flex h-full flex-col items-center justify-center gap-4 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-border bg-card">
                <FileText className="h-7 w-7 text-text-muted" />
              </div>
              <div>
                <p className="text-sm font-medium text-text-secondary mb-1">
                  Your proposal preview appears here
                </p>
                <p className="text-xs text-text-muted max-w-xs">
                  Fill in the form and click &ldquo;Generate Proposal&rdquo; to create a
                  professional, client-ready proposal powered by GPT-4o.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
