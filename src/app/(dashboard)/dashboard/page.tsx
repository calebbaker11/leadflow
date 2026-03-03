import { createClient } from '@/lib/supabase/server'
import { Topbar } from '@/components/layout/topbar'
import { StatsCard } from '@/components/dashboard/stats-card'
import { ProposalChart } from '@/components/dashboard/proposal-chart'
import type { MonthlyDataPoint } from '@/components/dashboard/proposal-chart'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { formatDate, extractPriceValue, formatCurrency } from '@/lib/utils'
import type { Proposal } from '@/types'
import {
  FileText, TrendingUp, CheckCircle, Clock,
  Plus, DollarSign, XCircle, ArrowRight, Zap,
} from 'lucide-react'
import Link from 'next/link'

const statusVariant: Record<string, 'default' | 'success' | 'warning' | 'danger' | 'accent'> = {
  draft: 'default', sent: 'accent', accepted: 'success', declined: 'danger',
}
const statusLabel: Record<string, string> = {
  draft: 'Draft', sent: 'Sent', accepted: 'Accepted', declined: 'Declined',
}

function buildMonthlyChartData(proposals: Proposal[], months: number): MonthlyDataPoint[] {
  const now = new Date()
  return Array.from({ length: months }, (_, i) => {
    const d = new Date(now.getFullYear(), now.getMonth() - (months - 1 - i), 1)
    const nextMonth = new Date(d.getFullYear(), d.getMonth() + 1, 1)
    const label = d.toLocaleString('default', { month: 'short' })
    const inMonth = proposals.filter(p => {
      const t = new Date(p.created_at).getTime()
      return t >= d.getTime() && t < nextMonth.getTime()
    })
    return {
      month: label,
      draft:    inMonth.filter(p => p.status === 'draft').length,
      sent:     inMonth.filter(p => p.status === 'sent').length,
      accepted: inMonth.filter(p => p.status === 'accepted').length,
      declined: inMonth.filter(p => p.status === 'declined').length,
    }
  })
}

export default async function DashboardPage() {
  const supabase = createClient()
  const { data: { session } } = await supabase.auth.getSession()
  const user = session!.user

  const { data } = await supabase
    .from('proposals')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  const proposals: Proposal[] = data ?? []

  const total    = proposals.length
  const drafts   = proposals.filter(p => p.status === 'draft').length
  const sent     = proposals.filter(p => p.status === 'sent').length
  const accepted = proposals.filter(p => p.status === 'accepted').length
  const declined = proposals.filter(p => p.status === 'declined').length

  const everSent  = sent + accepted + declined
  const closeRate = everSent > 0 ? Math.round((accepted / everSent) * 100) : 0

  const wonRevenue = proposals
    .filter(p => p.status === 'accepted')
    .reduce((sum, p) => sum + extractPriceValue(p.price || '0'), 0)

  const pipelineValue = proposals
    .filter(p => p.status === 'sent')
    .reduce((sum, p) => sum + extractPriceValue(p.price || '0'), 0)

  const avgDealSize = accepted > 0
    ? Math.round(wonRevenue / accepted)
    : everSent > 0
      ? Math.round(
          proposals
            .filter(p => p.status !== 'draft')
            .reduce((sum, p) => sum + extractPriceValue(p.price || '0'), 0) / everSent
        )
      : 0

  const thirtyDaysAgo = new Date()
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
  const recentlySent = proposals.filter(
    p => p.status === 'sent' && new Date(p.created_at) >= thirtyDaysAgo
  ).length

  const recent = proposals.slice(0, 6)
  const chartData = buildMonthlyChartData(proposals, 6)

  const pipelineItems = [
    { status: 'draft',    count: drafts,   icon: FileText,    value: null         },
    { status: 'sent',     count: sent,     icon: Clock,       value: pipelineValue },
    { status: 'accepted', count: accepted, icon: CheckCircle, value: wonRevenue    },
    { status: 'declined', count: declined, icon: XCircle,     value: null         },
  ] as const

  return (
    <div className="flex flex-col">
      <Topbar
        title="Dashboard"
        description="Your proposal pipeline at a glance"
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

        {/* KPI row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatsCard
            title="Total Proposals"
            value={total}
            icon={FileText}
            description={drafts > 0 ? `${drafts} draft${drafts !== 1 ? 's' : ''}` : 'All time'}
          />
          <StatsCard
            title="Close Rate"
            value={`${closeRate}%`}
            icon={TrendingUp}
            description={everSent > 0 ? `${accepted} of ${everSent} sent` : 'No proposals sent yet'}
            accent={closeRate >= 30}
          />
          <StatsCard
            title="Won Revenue"
            value={formatCurrency(wonRevenue)}
            icon={CheckCircle}
            description={accepted > 0 ? `${accepted} deal${accepted !== 1 ? 's' : ''} closed` : 'No deals closed yet'}
            accent={wonRevenue > 0}
          />
          <StatsCard
            title="Pipeline Value"
            value={formatCurrency(pipelineValue)}
            icon={DollarSign}
            description={sent > 0 ? `${sent} awaiting response` : 'No open proposals'}
          />
        </div>

        {/* Proposal activity chart */}
        <Card>
          <CardContent className="p-5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-sm font-semibold text-text-primary">Proposal Activity</h2>
                <p className="text-xs text-text-muted mt-0.5">Proposals created per month</p>
              </div>
              <div className="flex items-center gap-3 text-[11px] text-text-muted">
                <span className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-accent inline-block" />Sent
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-success inline-block" />Accepted
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-danger inline-block" />Declined
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-border inline-block" />Draft
                </span>
              </div>
            </div>
            <ProposalChart data={chartData} />
          </CardContent>
        </Card>

        {/* Pipeline breakdown */}
        {total > 0 && (
          <div>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-semibold text-text-primary">Pipeline Breakdown</h2>
              {avgDealSize > 0 && (
                <span className="text-xs text-text-muted">
                  Avg deal size:{' '}
                  <span className="text-text-secondary font-medium">{formatCurrency(avgDealSize)}</span>
                </span>
              )}
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              {pipelineItems.map(({ status, count, icon: Icon, value }) => (
                <Card key={status}>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <Badge variant={statusVariant[status]}>{statusLabel[status]}</Badge>
                      <Icon className="h-4 w-4 text-text-muted" />
                    </div>
                    <p className="text-2xl font-bold text-text-primary">{count}</p>
                    <p className="text-xs text-text-muted mt-1">
                      {value !== null && value > 0
                        ? formatCurrency(value)
                        : `${count} proposal${count !== 1 ? 's' : ''}`}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent proposals */}
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-semibold text-text-primary">Recent Proposals</h2>
              <Link
                href="/proposals"
                className="flex items-center gap-1 text-xs text-text-muted hover:text-text-secondary transition-colors"
              >
                View all <ArrowRight className="h-3 w-3" />
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
              <Card>
                <div className="divide-y divide-border">
                  {recent.map((proposal: Proposal) => (
                    <Link key={proposal.id} href={`/proposals/${proposal.id}`}>
                      <div className="flex items-center justify-between px-4 py-3 hover:bg-surface/50 transition-colors">
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-surface flex-shrink-0">
                            <FileText className="h-3.5 w-3.5 text-text-muted" />
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-medium text-text-primary truncate">
                              {proposal.client_name}
                            </p>
                            <p className="text-xs text-text-muted">
                              {proposal.price ? `${proposal.price} · ` : ''}
                              {formatDate(proposal.created_at)}
                            </p>
                          </div>
                        </div>
                        <Badge
                          variant={statusVariant[proposal.status] || 'default'}
                          className="flex-shrink-0 ml-3"
                        >
                          {statusLabel[proposal.status]}
                        </Badge>
                      </div>
                    </Link>
                  ))}
                </div>
              </Card>
            )}
          </div>

          {/* Insights sidebar */}
          <div className="flex flex-col gap-3">
            <h2 className="text-sm font-semibold text-text-primary">Insights</h2>

            {total === 0 && (
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent/10 flex-shrink-0">
                      <Zap className="h-4 w-4 text-accent" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-text-primary">Get started</p>
                      <p className="text-xs text-text-muted mt-0.5 leading-relaxed">
                        Create your first proposal to start tracking your pipeline.
                      </p>
                      <Link href="/proposals/new">
                        <Button size="sm" className="mt-3 w-full">
                          <Plus className="h-3.5 w-3.5" />
                          New proposal
                        </Button>
                      </Link>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {wonRevenue > 0 && (
              <Card>
                <CardContent className="p-4">
                  <div className="flex flex-col gap-1">
                    <p className="text-xs font-medium uppercase tracking-wider text-text-muted">
                      Total won
                    </p>
                    <p className="text-2xl font-bold text-accent">{formatCurrency(wonRevenue)}</p>
                    <p className="text-xs text-text-muted">
                      Across {accepted} closed deal{accepted !== 1 ? 's' : ''}
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}

            {sent > 0 && recentlySent > 0 && (
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent/10 flex-shrink-0">
                      <Clock className="h-4 w-4 text-accent" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-text-primary">Follow up</p>
                      <p className="text-xs text-text-muted mt-0.5 leading-relaxed">
                        {sent} proposal{sent !== 1 ? 's are' : ' is'} awaiting a response.
                        Following up within 48 hrs doubles acceptance rates.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {closeRate > 0 && closeRate < 30 && everSent >= 3 && (
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent/10 flex-shrink-0">
                      <TrendingUp className="h-4 w-4 text-accent" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-text-primary">Improve close rate</p>
                      <p className="text-xs text-text-muted mt-0.5 leading-relaxed">
                        At {closeRate}%, there&apos;s room to grow. Add a clear timeline and
                        specific next steps to each proposal.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {closeRate >= 50 && accepted >= 2 && (
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-success/10 flex-shrink-0">
                      <CheckCircle className="h-4 w-4 text-success" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-text-primary">Strong performance</p>
                      <p className="text-xs text-text-muted mt-0.5 leading-relaxed">
                        {closeRate}% close rate — well above the industry average of 20–30%.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
