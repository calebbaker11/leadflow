import { createClient } from '@/lib/supabase/server'
import { createCheckoutSession } from '@/lib/stripe'
import { NextResponse } from 'next/server'

export async function POST() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('stripe_customer_id, subscription_status')
    .eq('id', user.id)
    .single()

  if (profile?.subscription_status === 'active') {
    return NextResponse.json({ error: 'Already subscribed' }, { status: 400 })
  }

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

  try {
    const session = await createCheckoutSession({
      customerId: profile?.stripe_customer_id ?? undefined,
      customerEmail: user.email!,
      userId: user.id,
      successUrl: `${appUrl}/dashboard?subscription=success`,
      cancelUrl: `${appUrl}/subscribe?canceled=true`,
    })

    return NextResponse.json({ url: session.url })
  } catch (err) {
    console.error('Stripe checkout error:', err)
    return NextResponse.json({ error: 'Failed to create checkout session' }, { status: 500 })
  }
}
