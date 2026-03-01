import { createClient } from '@/lib/supabase/server'
import { Topbar } from '@/components/layout/topbar'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { formatDate } from '@/lib/utils'
import type { Proposal } from '@/types'
import { FileText, Plus } from 'lucide-react'
import Link from 'next/link'

const statusVariant: Record<string, 'default' | 'success' | 'warning' | 'danger' | 'accent'> = {
  draft: 'default',
  sent: 'accent',
  accepted: 'success',
  declined: 'danger',
}

export default async function ProposalsPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: proposals = [] } = await supabase
    .from('proposals')
    .select('*')
    .eq('user_id', user!.id)
    .order('created_at', { ascending: false })

  return (
    <div className="flex flex-col">
      <Topbar
        title="Proposals"
        description={`${proposals.length} total`}
        action={
          <Link href="/proposals/new">
            <Button size="sm">
              <Plus className="h-3.5 w-3.5" />
              New proposal
            </Button>
          </Link>
        }
      />

      <div className="p-6">
        {proposals.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-16 gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-surface">
                <FileText className="h-6 w-6 text-text-muted" />
              </div>
              <div className="text-center">
                <p className="text-base font-semibold text-text-secondary mb-1">
                  No proposals yet
                </p>
                <p className="text-sm text-text-muted max-w-xs">
                  Create your first AI-powered proposal and start closing deals faster.
                </p>
              </div>
              <Link href="/proposals/new">
                <Button>
                  <Plus className="h-4 w-4" />
                  Create your first proposal
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="flex flex-col gap-2">
            {proposals.map((proposal: Proposal) => (
              <Link key={proposal.id} href={`/proposals/${proposal.id}`}>
                <Card hover>
                  <CardContent className="flex items-center gap-4 p-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-surface flex-shrink-0">
                      <FileText className="h-4.5 w-4.5 text-text-muted" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <p className="text-sm font-semibold text-text-primary truncate">
                          {proposal.client_name}
                        </p>
                        <Badge variant={statusVariant[proposal.status] || 'default'}>
                          {proposal.status}
                        </Badge>
                      </div>
                      <p className="text-xs text-text-muted truncate">
                        {proposal.business_type && `${proposal.business_type} · `}
                        {proposal.price && `${proposal.price} · `}
                        {proposal.timeline && `${proposal.timeline} · `}
                        {formatDate(proposal.created_at)}
                      </p>
                    </div>

                    <div className="flex-shrink-0">
                      {proposal.generated_proposal_text ? (
                        <span className="text-xs text-success">Generated</span>
                      ) : (
                        <span className="text-xs text-text-muted">Draft</span>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
