'use client'

import { useEffect, useState, useCallback } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Topbar } from '@/components/layout/topbar'
import { ProposalForm } from '@/components/proposals/proposal-form'
import { ProposalPreview } from '@/components/proposals/proposal-preview'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Select } from '@/components/ui/select'
import type { Proposal, ProposalFormData } from '@/types'
import { toast } from 'sonner'
import { Printer, Link2, Trash2, RefreshCw } from 'lucide-react'
import { generateShareUrl } from '@/lib/utils'

const statusOptions = [
  { value: 'draft', label: 'Draft' },
  { value: 'sent', label: 'Sent' },
  { value: 'accepted', label: 'Accepted' },
  { value: 'declined', label: 'Declined' },
]

const statusVariant: Record<string, 'default' | 'success' | 'warning' | 'danger' | 'accent'> = {
  draft: 'default',
  sent: 'accent',
  accepted: 'success',
  declined: 'danger',
}

export default function ProposalDetailPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const [proposal, setProposal] = useState<Proposal | null>(null)
  const [loading, setLoading] = useState(true)
  const [generating, setGenerating] = useState(false)
  const [sharingUrl, setSharingUrl] = useState<string | null>(null)

  const fetchProposal = useCallback(async () => {
    const res = await fetch(`/api/proposals/${id}`)
    if (!res.ok) {
      router.push('/proposals')
      return
    }
    const data = await res.json()
    setProposal(data.proposal)
    if (data.proposal.is_shared) {
      setSharingUrl(generateShareUrl(data.proposal.share_token))
    }
    setLoading(false)
  }, [id, router])

  useEffect(() => {
    fetchProposal()
  }, [fetchProposal])

  async function handleRegenerate(formData: ProposalFormData) {
    setGenerating(true)

    try {
      const res = await fetch('/api/proposals/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ proposalId: id, ...formData }),
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error)

      setProposal(data.proposal)
      toast.success('Proposal regenerated')
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to regenerate')
    } finally {
      setGenerating(false)
    }
  }

  async function handleStatusChange(status: string) {
    const res = await fetch(`/api/proposals/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    })

    if (res.ok) {
      const data = await res.json()
      setProposal(data.proposal)
      toast.success(`Status updated to ${status}`)
    }
  }

  async function handleShare() {
    if (sharingUrl) {
      await navigator.clipboard.writeText(sharingUrl)
      toast.success('Share link copied to clipboard')
      return
    }

    const res = await fetch(`/api/proposals/${id}/share`, { method: 'POST' })
    const data = await res.json()

    if (res.ok) {
      setSharingUrl(data.url)
      await navigator.clipboard.writeText(data.url)
      toast.success('Share link created and copied to clipboard')
    } else {
      toast.error(data.error)
    }
  }

  function handlePrint() {
    window.print()
  }

  async function handleDelete() {
    if (!confirm('Delete this proposal? This cannot be undone.')) return

    const res = await fetch(`/api/proposals/${id}`, { method: 'DELETE' })
    if (res.ok) {
      toast.success('Proposal deleted')
      router.push('/proposals')
    }
  }

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="flex items-center gap-2 text-sm text-text-muted">
          <RefreshCw className="h-4 w-4 animate-spin" />
          Loading...
        </div>
      </div>
    )
  }

  if (!proposal) return null

  return (
    <div className="flex flex-col h-full">
      <div className="no-print">
      <Topbar
        title={proposal.client_name}
        description={proposal.business_type || 'Proposal'}
        action={
          <div className="flex items-center gap-2">
            <Badge variant={statusVariant[proposal.status] || 'default'}>
              {proposal.status}
            </Badge>
            <Select
              options={statusOptions}
              value={proposal.status}
              onChange={(e) => handleStatusChange(e.target.value)}
              className="h-8 text-xs w-32"
            />
            <Button variant="outline" size="sm" onClick={handleShare}>
              <Link2 className="h-3.5 w-3.5" />
              {sharingUrl ? 'Copy link' : 'Share'}
            </Button>
            <Button variant="secondary" size="sm" onClick={handlePrint} className="no-print">
              <Printer className="h-3.5 w-3.5" />
              Export PDF
            </Button>
            <Button variant="danger" size="sm" onClick={handleDelete}>
              <Trash2 className="h-3.5 w-3.5" />
            </Button>
          </div>
        }
      />
      </div>

      <div className="flex flex-1 overflow-hidden no-print">
        {/* Form Panel */}
        <div className="w-[420px] flex-shrink-0 border-r border-border overflow-y-auto p-6">
          <ProposalForm
            initialData={{
              client_name: proposal.client_name,
              business_type: proposal.business_type || '',
              template_type: proposal.template_type,
              scope: proposal.scope || '',
              price: proposal.price || '',
              timeline: proposal.timeline || '',
              additional_notes: proposal.additional_notes || '',
            }}
            onGenerate={handleRegenerate}
            loading={generating}
          />
        </div>

        {/* Preview Panel */}
        <div className="flex-1 overflow-y-auto p-6">
          {proposal.generated_proposal_text ? (
            <ProposalPreview
              content={proposal.generated_proposal_text}
              clientName={proposal.client_name}
            />
          ) : (
            <div className="flex h-full flex-col items-center justify-center gap-3 text-center">
              <p className="text-sm text-text-secondary">No proposal generated yet</p>
              <p className="text-xs text-text-muted">
                Hit &ldquo;Generate Proposal&rdquo; to create the proposal content
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Print-only full view */}
      {proposal.generated_proposal_text && (
        <div className="print-only hidden">
          <ProposalPreview
            content={proposal.generated_proposal_text}
            clientName={proposal.client_name}
            printMode
          />
        </div>
      )}
    </div>
  )
}
