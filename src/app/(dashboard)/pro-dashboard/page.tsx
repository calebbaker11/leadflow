import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Topbar } from '@/components/layout/topbar'
import { StatsCard } from '@/components/dashboard/stats-card'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { formatCurrency, formatDate, extractPriceValue } from '@/lib/utils'
import type { Proposal } from '@/types'
import {
  TrendingUp, DollarSign, Target, Zap, CheckCircle,
  ArrowRight, BarChart2, Plus, Trophy, Clock,
} from 'lucide-react'
import Link from 'next/link'

const statusVariant: Record<string, 'default' | 'success' | 'warning' | 'danger' | 'accent'> = {
  draft: 'default', sent: 'accent', accepted: 'success', declined: 'danger',
}

const templateLabel: Record<string, string> = {
  freelancer: 'Freelancer',
  agency: 'Agency',
  contractor: 'Contractor',
  consultant: 'Consultant',
}

function getMonthlyRevenue(proposals: Proposal[], monthsBack: number): number {
  const now = new Date()
  const start = new Date(now.getFullYear(), now.getMonth() - monthsBack, 1)
  const end = new Date(now.getFullYear(), now.getMonth() - monthsBack + 1, 1)
  return proposals
    .filter(p => p.status === 'accepted' && new Date(p.created_at) >= start && new Date(p.created_at) < end)
    .reduce((sum, p) => sum + extractPriceValue(p.price || '0'), 0)
}

export default async function ProDashboardPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  // Verify Pro plan
  const { data: sub } = await supabase
    .from('subscriptions')
    .select('stripe_price_id, current_period_end')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle()

  if (sub?.stripe_price_id !== process.env.STRIPE_PRO_PRICE_ID) {
    redirect('/dashboard')
  }

  const { data } = await supabase
    .from('proposals')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  const proposals: Proposal[] = data ?? []

  const total = proposals.length
  const accepted = proposals.filter(p => p.status === 'accepted').length
  const sent = proposals.filter(p => p.status === 'sent').length
  const declined = proposals.filter(p => p.status === 'declined').length
  const everSent = sent + accepted + declined
  const closeRate = everSent > 0 ? Math.round((accepted / everSent) * 100) : 0

  const wonRevenue = proposals
    .filter(p => p.status === 'accepted')
    .reduce((sum, p) => sum + extractPriceValue(p.price || '0'), 0)

  const pipelineValue = proposals
    .filter(p => p.status === 'sent')
    .reduce((sum, p) => sum + extractPriceValue(p.price || '0'), 0)

  const avgDealSize = accepted > 0 ? Math.round(wonRevenue / accepted) : 0

  // Projected revenue: if current close rate holds against pipeline
  const projectedFromPipeline = Math.round(pipelineValue * (closeRate / 100))

  // Monthly revenue trend (last 3 months)
  const thisMonth = getMonthlyRevenue(proposals, 0)
  const lastMonth = getMonthlyRevenue(proposals, 1)
  const twoMonthsAgo = getMonthlyRevenue(proposals, 2)
  const monthlyTrend = lastMonth > 0
    ? Math.round(((thisMonth - lastMonth) / lastMonth) * 100)
    : 0

  // Win rate by template type
  const templateStats = (['freelancer', 'agency', 'contractor', 'consultant'] as const).map(type => {
    const typeProposals = proposals.filter(p => p.template_type === type)
    const typeAccepted = typeProposals.filter(p => p.status === 'accepted').length
    const typeSent = typeProposals.filter(p => ['sent', 'accepted', 'declined'].includes(p.status)).length
    const typeWinRate = typeSent > 0 ? Math.round((typeAccepted / typeSent) * 100) : null
    const typeRevenue = typeProposals
      .filter(p => p.status === 'accepted')
      .reduce((sum, p) => sum + extractPriceValue(p.price || '0'), 0)
    return { type, label: templateLabel[type], count: typeProposals.length, winRate: typeWinRate, revenue: typeRevenue }
  }).filter(t => t.count > 0)

  // Best performing template
  const bestTemplate = templateStats
    .filter(t => t.winRate !== null)
    .sort((a, b) => (b.winRate ?? 0) - (a.winRate ?? 0))[0]

  // Top won proposals
  const topWins = proposals
    .filter(p => p.status === 'accepted')
    .sort((a, b) => extractPriceValue(b.price || '0') - extractPriceValue(a.price || '0'))
    .slice(0, 5)

  // Opportunity score: simple 0–100 based on pipeline health
  const opportunityScore = Math.min(100, Math.round(
    (closeRate * 0.4) +
    (Math.min(sent, 10) / 10 * 30) +
    (avgDealSize > 0 ? Math.min(avgDealSize / 5000 * 30, 30) : 0)
  ))

  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  const now = new Date()
  const revenueByMonth = [twoMonthsAgo, lastMonth, thisMonth]
  const revenueMonthLabels = [
    monthNames[(now.getMonth() - 2 + 12) % 12],
    monthNames[(now.getMonth() - 1 + 12) % 12],
    monthNames[now.getMonth()],
  ]
  const maxRevenue = Math.max(...revenueByMonth, 1)

  return (
    <div className="flex flex-col">
      <Topbar
        title="Pro Dashboard"
        description="Advanced analytics and growth intelligence"
        action={
          <div className="flex items-center gap-2">
            <span className="rounded-md bg-accent px-2 py-1 text-xs font-bold uppercase tracking-wider text-white flex items-center gap-1">
              <Zap className="h-3 w-3" />
              Pro
            </span>
            <Link href="/proposals/new">
              <Button size="sm">
                <Plus className="h-3.5 w-3.5" />
                New proposal
              </Button>
            </Link>
          </div>
        }
      />

      <div className="p-6 flex flex-col gap-6">

        {/* Primary KPIs */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatsCard
            title="Won Revenue"
            value={formatCurrency(wonRevenue)}
            icon={DollarSign}
            description={accepted > 0 ? `${accepted} deal${accepted !== 1 ? 's' : ''} closed` : 'No deals closed yet'}
            accent={wonRevenue > 0}
          />
          <StatsCard
            title="Close Rate"
            value={`${closeRate}%`}
            icon={Target}
            description={everSent > 0 ? `${accepted} of ${everSent} sent` : 'Send your first proposal'}
            accent={closeRate >= 30}
          />
          <StatsCard
            title="Pipeline Value"
            value={formatCurrency(pipelineValue)}
            icon={TrendingUp}
            description={sent > 0 ? `${sent} awaiting response` : 'No open proposals'}
          />
          <StatsCard
            title="Avg Deal Size"
            value={avgDealSize > 0 ? formatCurrency(avgDealSize) : '—'}
            icon={BarChart2}
            description={accepted > 0 ? 'Per closed deal' : 'Close a deal to see this'}
            accent={avgDealSize > 0}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Revenue trend + opportunity score */}
          <div className="flex flex-col gap-4">

            {/* Opportunity Score */}
            <Card>
              <CardContent className="p-5">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <p className="text-xs font-medium uppercase tracking-wider text-text-muted">
                      Opportunity Score
                    </p>
                    <p className="text-xs text-text-muted mt-0.5">Pipeline health indicator</p>
                  </div>
                  <Zap className="h-4 w-4 text-accent" />
                </div>
                <div className="flex items-end gap-3 mb-3">
                  <p className="text-4xl font-bold text-accent tabular-nums">{opportunityScore}</p>
                  <p className="text-sm text-text-muted mb-1">/100</p>
                </div>
                <div className="h-2 rounded-full bg-border overflow-hidden">
                  <div
                    className="h-full rounded-full bg-accent transition-all duration-500"
                    style={{ width: `${opportunityScore}%` }}
                  />
                </div>
                <p className="text-xs text-text-muted mt-2">
                  {opportunityScore >= 70
                    ? 'Strong pipeline. Keep the momentum.'
                    : opportunityScore >= 40
                    ? 'Solid foundation. More proposals = more wins.'
                    : 'Early stage — every proposal builds your data.'}
                </p>
              </CardContent>
            </Card>

            {/* Revenue trend */}
            <Card>
              <CardContent className="p-5">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-xs font-medium uppercase tracking-wider text-text-muted">
                      Revenue Trend
                    </p>
                    <p className="text-xs text-text-muted mt-0.5">Won revenue, last 3 months</p>
                  </div>
                  {monthlyTrend !== 0 && (
                    <span className={`text-xs font-semibold ${monthlyTrend > 0 ? 'text-success' : 'text-danger'}`}>
                      {monthlyTrend > 0 ? '+' : ''}{monthlyTrend}%
                    </span>
                  )}
                </div>
                <div className="flex items-end gap-3 h-20">
                  {revenueByMonth.map((rev, i) => (
                    <div key={i} className="flex-1 flex flex-col items-center gap-1">
                      <div className="w-full rounded-t-md bg-accent/20 flex items-end justify-center" style={{ height: '64px' }}>
                        <div
                          className="w-full rounded-t-md bg-accent transition-all duration-500"
                          style={{ height: `${Math.round((rev / maxRevenue) * 64)}px`, minHeight: rev > 0 ? '4px' : '0' }}
                        />
                      </div>
                      <span className="text-[10px] text-text-muted">{revenueMonthLabels[i]}</span>
                    </div>
                  ))}
                </div>
                {projectedFromPipeline > 0 && (
                  <div className="mt-3 pt-3 border-t border-border">
                    <p className="text-xs text-text-muted">
                      Projected from pipeline:{' '}
                      <span className="font-semibold text-accent">{formatCurrency(projectedFromPipeline)}</span>
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Win rate by template */}
          <Card>
            <CardContent className="p-5">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-xs font-medium uppercase tracking-wider text-text-muted">
                    Win Rate by Template
                  </p>
                  <p className="text-xs text-text-muted mt-0.5">Which proposal style wins most</p>
                </div>
                {bestTemplate && (
                  <Trophy className="h-4 w-4 text-warning" />
                )}
              </div>
              {templateStats.length === 0 ? (
                <p className="text-xs text-text-muted">Generate proposals to see breakdown</p>
              ) : (
                <div className="flex flex-col gap-4">
                  {templateStats.map(t => (
                    <div key={t.type}>
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium text-text-primary">{t.label}</span>
                          {bestTemplate?.type === t.type && t.winRate !== null && (
                            <span className="text-[10px] text-warning font-semibold uppercase tracking-wide">Best</span>
                          )}
                        </div>
                        <div className="text-right">
                          <span className="text-sm font-bold text-text-primary tabular-nums">
                            {t.winRate !== null ? `${t.winRate}%` : '—'}
                          </span>
                          {t.revenue > 0 && (
                            <p className="text-[10px] text-text-muted">{formatCurrency(t.revenue)} won</p>
                          )}
                        </div>
                      </div>
                      <div className="h-1.5 rounded-full bg-border overflow-hidden">
                        <div
                          className="h-full rounded-full bg-accent transition-all duration-500"
                          style={{ width: t.winRate !== null ? `${t.winRate}%` : '0%' }}
                        />
                      </div>
                      <p className="text-[10px] text-text-muted mt-0.5">{t.count} proposal{t.count !== 1 ? 's' : ''}</p>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Top wins + insight */}
          <div className="flex flex-col gap-4">

            {/* Insights */}
            <Card>
              <CardContent className="p-5">
                <div className="flex items-center gap-2 mb-3">
                  <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-accent/10">
                    <Zap className="h-3.5 w-3.5 text-accent" />
                  </div>
                  <p className="text-sm font-semibold text-text-primary">Pro Intelligence</p>
                </div>
                <div className="flex flex-col gap-3">
                  {total === 0 && (
                    <p className="text-xs text-text-muted leading-relaxed">
                      Create your first Pro proposal to start building your intelligence data.
                    </p>
                  )}
                  {closeRate >= 50 && accepted >= 2 && (
                    <div className="flex items-start gap-2">
                      <CheckCircle className="h-3.5 w-3.5 text-success flex-shrink-0 mt-0.5" />
                      <p className="text-xs text-text-secondary leading-relaxed">
                        <strong className="text-text-primary">{closeRate}% close rate</strong> — top 10% of freelancers. Your proposals are converting.
                      </p>
                    </div>
                  )}
                  {closeRate > 0 && closeRate < 30 && everSent >= 3 && (
                    <div className="flex items-start gap-2">
                      <TrendingUp className="h-3.5 w-3.5 text-accent flex-shrink-0 mt-0.5" />
                      <p className="text-xs text-text-secondary leading-relaxed">
                        Use <strong className="text-text-primary">Proposal Score</strong> on your sent proposals to find what's holding back conversions.
                      </p>
                    </div>
                  )}
                  {pipelineValue > 0 && (
                    <div className="flex items-start gap-2">
                      <DollarSign className="h-3.5 w-3.5 text-accent flex-shrink-0 mt-0.5" />
                      <p className="text-xs text-text-secondary leading-relaxed">
                        <strong className="text-text-primary">{formatCurrency(pipelineValue)}</strong> in active pipeline. At your current close rate, expect{' '}
                        <strong className="text-text-primary">{formatCurrency(projectedFromPipeline)}</strong> to close.
                      </p>
                    </div>
                  )}
                  {sent > 0 && (
                    <div className="flex items-start gap-2">
                      <Clock className="h-3.5 w-3.5 text-warning flex-shrink-0 mt-0.5" />
                      <p className="text-xs text-text-secondary leading-relaxed">
                        <strong className="text-text-primary">{sent} proposal{sent !== 1 ? 's' : ''}</strong> awaiting response. Use your follow-up sequences to stay top of mind.
                      </p>
                    </div>
                  )}
                  {bestTemplate && bestTemplate.winRate !== null && (
                    <div className="flex items-start gap-2">
                      <Trophy className="h-3.5 w-3.5 text-warning flex-shrink-0 mt-0.5" />
                      <p className="text-xs text-text-secondary leading-relaxed">
                        Your <strong className="text-text-primary">{bestTemplate.label}</strong> template has the highest win rate at{' '}
                        <strong className="text-text-primary">{bestTemplate.winRate}%</strong>.
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Top wins */}
            {topWins.length > 0 && (
              <Card>
                <CardContent className="p-5">
                  <p className="text-xs font-medium uppercase tracking-wider text-text-muted mb-3">
                    Top Wins
                  </p>
                  <div className="flex flex-col gap-2.5">
                    {topWins.map((p, i) => (
                      <Link key={p.id} href={`/proposals/${p.id}`} className="flex items-center justify-between group">
                        <div className="flex items-center gap-2 min-w-0">
                          <span className="text-[11px] font-bold text-text-muted tabular-nums w-4">
                            #{i + 1}
                          </span>
                          <div className="min-w-0">
                            <p className="text-xs font-medium text-text-primary truncate group-hover:text-accent transition-colors">
                              {p.client_name}
                            </p>
                            <p className="text-[10px] text-text-muted">{formatDate(p.created_at)}</p>
                          </div>
                        </div>
                        <span className="text-xs font-semibold text-success flex-shrink-0 ml-2">
                          {p.price || '—'}
                        </span>
                      </Link>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* CTA to proposals */}
        <div className="flex items-center justify-between">
          <p className="text-xs text-text-muted">
            {total} total proposal{total !== 1 ? 's' : ''} · Pro-enhanced generation active
          </p>
          <Link href="/proposals" className="flex items-center gap-1 text-xs text-text-muted hover:text-text-secondary transition-colors">
            View all proposals <ArrowRight className="h-3 w-3" />
          </Link>
        </div>

      </div>
    </div>
  )
}
