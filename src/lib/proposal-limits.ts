import type { SupabaseClient } from '@supabase/supabase-js'

export interface ProposalUsage {
  used: number
  limit: number
  plan: 'trial' | 'paid' | 'pro' | 'none'
  canCreate: boolean
  /** ISO string of when the billing period resets (paid/pro plan only) */
  periodEnd: string | null
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function getProposalUsage(userId: string, supabase: SupabaseClient<any, any, any>): Promise<ProposalUsage> {
  const skipSubscriptionCheck = process.env.SKIP_SUBSCRIPTION_CHECK === 'true'

  if (skipSubscriptionCheck) {
    // Dev mode: show real proposal count against the paid plan limit so the widget is visible
    const periodStart = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()
    const { count } = await supabase
      .from('proposals')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId)
      .gte('created_at', periodStart)
    const used = count ?? 0
    return { used, limit: 30, plan: 'paid', canCreate: true, periodEnd: null }
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('subscription_status')
    .eq('id', userId)
    .single()

  if (!profile) return { used: 0, limit: 0, plan: 'none', canCreate: false, periodEnd: null }

  const status = profile.subscription_status

  if (status === 'trialing') {
    const { count } = await supabase
      .from('proposals')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId)
    const used = count ?? 0
    return { used, limit: 3, plan: 'trial', canCreate: used < 3, periodEnd: null }
  }

  if (status === 'active') {
    const { data: sub } = await supabase
      .from('subscriptions')
      .select('current_period_start, current_period_end, stripe_price_id')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle()

    const isProPlan = sub?.stripe_price_id === process.env.STRIPE_PRO_PRICE_ID

    const periodStart =
      sub?.current_period_start ??
      new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()

    const { count } = await supabase
      .from('proposals')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId)
      .gte('created_at', periodStart)

    const used = count ?? 0
    const limit = isProPlan ? 100 : 30

    return {
      used,
      limit,
      plan: isProPlan ? 'pro' : 'paid',
      canCreate: used < limit,
      periodEnd: sub?.current_period_end ?? null,
    }
  }

  return { used: 0, limit: 0, plan: 'none', canCreate: false, periodEnd: null }
}
