import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ plan: 'none' })
  }

  const { data: sub } = await supabase
    .from('subscriptions')
    .select('stripe_price_id')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle()

  const isPro = sub?.stripe_price_id === process.env.STRIPE_PRO_PRICE_ID

  const { data: profile } = await supabase
    .from('profiles')
    .select('subscription_status')
    .eq('id', user.id)
    .single()

  const status = profile?.subscription_status ?? 'inactive'
  const isActive = status === 'active' || status === 'trialing'

  return NextResponse.json({
    plan: !isActive ? 'none' : isPro ? 'pro' : 'paid',
  })
}
