import { createClient } from '@/lib/supabase/server'
import { Topbar } from '@/components/layout/topbar'
import { StatsCard } from '@/components/dashboard/stats-card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { formatDate, extractPriceValue, formatCurrency } from '@/lib/utils'
import type { Proposal } from '@/types'
import { FileText, TrendingUp, CheckCircle, Clock, Plus } from 'lucide-react'
import Link from 'next/link'

const statusVariant: Record<string, 'default' | 'success' | 'warning' | 'danger' | 'accent'> = {
  draft: 'default',
  sent: 'accent',
  accepted: 'success',
  declined: 'danger',
}

export default async function DashboardPage() {
  const supabase = createClient()
  const { data: { session } } = await supabase.auth.getSession()
  const user = session!.user

  const { data } = await supabase
  .from('proposals')
  .select('*')
  .eq('user_id', user!.id)
  .order('created_at', { ascending: false })

const proposals = data ?? []
const total = proposals.length
  const sent = proposals.filter((p: Proposal) => p.status === 'sent').length
  const accepted = proposals.filter((p: Proposal) => p.status === 'accepted').length
  const closeRate = sent > 0 ? Math.round((accepted / sent) * 100) : 0

  const revenueOpportunity = proposals
    .filter((p: Proposal) => p.status === 'sent' || p.status === 'accepted')
    .reduce((sum: number, p: Proposal) => sum + extractPriceValue(p.price || '0'), 0)

  const recent = proposals.slice(0, 5)

  return (
    <div className="flex flex-col">
      <Topbar
        title="Dashboard"
        description="Track your proposals and deal pipeline"
        action={
          <Link href="/proposals/new">
            <Button size="sm">
              <Plus className="h-3.5 w-3.5" />
              New proposal
            </Button>
          </Link>
        }
      />

      <div className="p-6 flex flex-col gap-6">
        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatsCard
            title="Total Proposals"
            value={total}
            icon={FileText}
            description="All time"
          />
          <StatsCard
            title="Sent"
            value={sent}
            icon={Clock}
            description="Awaiting response"
          />
          <StatsCard
            title="Close Rate"
            value={`${closeRate}%`}
            icon={TrendingUp}
            description="Sent → Accepted"
            accent={closeRate > 0}
          />
          <StatsCard
            title="Revenue Opportunity"
            value={formatCurrency(revenueOpportunity)}
            icon={CheckCircle}
            description="Sent + accepted deals"
            accent
          />
        </div>

        {/* Recent Proposals */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-text-primary">Recent Proposals</h2>
            <Link
              href="/proposals"
              className="text-xs text-text-muted hover:text-text-secondary transition-colors"
            >
              View all
            </Link>
          </div>

          {recent.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12 gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-surface">
                  <FileText className="h-5 w-5 text-text-muted" />
                </div>
                <div className="text-center">
                  <p className="text-sm font-medium text-text-secondary">No proposals yet</p>
                  <p className="text-xs text-text-muted mt-1">
                    Create your first proposal and start closing deals
                  </p>
                </div>
                <Link href="/proposals/new">
                  <Button size="sm" className="mt-1">
                    <Plus className="h-3.5 w-3.5" />
                    Create proposal
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            <div className="flex flex-col gap-2">
              {recent.map((proposal: Proposal) => (
                <Link key={proposal.id} href={`/proposals/${proposal.id}`}>
                  <Card hover>
                    <CardContent className="flex items-center justify-between p-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-surface flex-shrink-0">
                          <FileText className="h-4 w-4 text-text-muted" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-text-primary">
                            {proposal.client_name}
                          </p>
                          <p className="text-xs text-text-muted">
                            {proposal.price && `${proposal.price} · `}
                            {formatDate(proposal.created_at)}
                          </p>
                        </div>
                      </div>
                      <Badge variant={statusVariant[proposal.status] || 'default'}>
                        {proposal.status}
                      </Badge>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Value tip */}
        {total > 0 && closeRate < 40 && (
          <Card>
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent/10 flex-shrink-0">
                  <TrendingUp className="h-4 w-4 text-accent" />
                </div>
                <div>
                  <p className="text-sm font-medium text-text-primary">Improve your close rate</p>
                  <p className="text-xs text-text-muted mt-0.5 leading-relaxed">
                    Proposals with a specific timeline and clear next steps close 3× faster.
                    Make sure every proposal has a firm call to action.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
