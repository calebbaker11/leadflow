import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import { ProposalPreview } from '@/components/proposals/proposal-preview'
import { Zap } from 'lucide-react'
import Link from 'next/link'
import type { Metadata } from 'next'

interface Props {
  params: { token: string }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const supabase = createClient()
  const { data } = await supabase
    .from('proposals')
    .select('client_name')
    .eq('share_token', params.token)
    .eq('is_shared', true)
    .single()

  return {
    title: data ? `Proposal for ${data.client_name}` : 'Proposal',
  }
}

export default async function PublicProposalPage({ params }: Props) {
  const supabase = createClient()

  const { data: proposal } = await supabase
    .from('proposals')
    .select('*')
    .eq('share_token', params.token)
    .eq('is_shared', true)
    .single()

  if (!proposal || !proposal.generated_proposal_text) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Minimal header */}
      <header className="border-b border-border/50 bg-background/80 backdrop-blur-sm">
        <div className="mx-auto flex h-14 max-w-4xl items-center justify-between px-6">
          <p className="text-xs text-text-muted">
            Proposal for{' '}
            <span className="text-text-secondary font-medium">{proposal.client_name}</span>
          </p>
          <Link
            href="/"
            className="flex items-center gap-1.5 text-xs text-text-muted hover:text-text-secondary transition-colors"
          >
            <Zap className="h-3 w-3 text-accent" />
            Made with LeadFlow
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-6 py-10">
        <ProposalPreview
          content={proposal.generated_proposal_text}
          clientName={proposal.client_name}
        />
      </main>
    </div>
  )
}
