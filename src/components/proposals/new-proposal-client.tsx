'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Topbar } from '@/components/layout/topbar'
import { ProposalForm } from '@/components/proposals/proposal-form'
import { ProposalPreview } from '@/components/proposals/proposal-preview'
import { Button } from '@/components/ui/button'
import type { ProposalFormData } from '@/types'
import type { ProposalUsage } from '@/lib/proposal-limits'
import { toast } from 'sonner'
import { FileText } from 'lucide-react'
import { cn } from '@/lib/utils'

interface NewProposalClientProps {
  usage: ProposalUsage
}

export function NewProposalClient({ usage }: NewProposalClientProps) {
  const router = useRouter()
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
      toast.success('Proposal generated successfully')
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

      {isNearLimit && (
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
            <ProposalPreview
              content={proposal.generated_proposal_text}
              clientName={proposal.client_name}
            />
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
                  professional, client-ready proposal powered by GPT-4.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
