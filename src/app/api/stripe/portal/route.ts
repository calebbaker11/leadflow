import { createClient } from '@/lib/supabase/server'
import { createPortalSession } from '@/lib/stripe'
import { NextResponse } from 'next/server'

export async function POST() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('stripe_customer_id')
    .eq('id', user.id)
    .single()

  if (!profile?.stripe_customer_id) {
    return NextResponse.json({ error: 'No billing account found' }, { status: 404 })
  }

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

  try {
    const session = await createPortalSession({
      customerId: profile.stripe_customer_id,
      returnUrl: `${appUrl}/settings`,
    })

    return NextResponse.json({ url: session.url })
  } catch (err) {
    console.error('Stripe portal error:', err)
    return NextResponse.json({ error: 'Failed to open billing portal' }, { status: 500 })
  }
}
