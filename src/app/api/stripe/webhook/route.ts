import { stripe } from '@/lib/stripe'
import { createAdminClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import type Stripe from 'stripe'

// Stripe requires the raw body for webhook signature verification
export const config = {
  api: {
    bodyParser: false,
  },
}

export async function POST(request: Request) {
  const body = await request.text()
  const signature = request.headers.get('stripe-signature')

  if (!signature) {
    return NextResponse.json({ error: 'Missing signature' }, { status: 400 })
  }

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch (err) {
    console.error('Webhook signature verification failed:', err)
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  const supabase = createAdminClient()

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session
        const userId = session.metadata?.userId

        if (!userId || !session.customer || !session.subscription) break

        // Get full subscription details (needed to check if it's a trial)
        const subscription = await stripe.subscriptions.retrieve(
          session.subscription as string
        )

        // Status is 'trialing' during free trial, 'active' after first charge
        const profileStatus = subscription.status === 'trialing' ? 'trialing' : 'active'

        await supabase
          .from('profiles')
          .update({
            stripe_customer_id: session.customer as string,
            subscription_status: profileStatus,
          })
          .eq('id', userId)

        await supabase.from('subscriptions').upsert({
          user_id: userId,
          stripe_subscription_id: subscription.id,
          stripe_price_id: subscription.items.data[0]?.price.id,
          status: subscription.status,
          current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
          current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
          cancel_at_period_end: subscription.cancel_at_period_end,
        }, {
          onConflict: 'stripe_subscription_id',
        })

        break
      }

      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription
        const userId = subscription.metadata?.userId

        if (!userId) break

        const status = subscription.status === 'active' || subscription.status === 'trialing'
          ? subscription.status
          : 'inactive'

        await supabase
          .from('profiles')
          .update({ subscription_status: status })
          .eq('id', userId)

        await supabase
          .from('subscriptions')
          .update({
            status: subscription.status,
            current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
            current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
            cancel_at_period_end: subscription.cancel_at_period_end,
          })
          .eq('stripe_subscription_id', subscription.id)

        break
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription
        const userId = subscription.metadata?.userId

        if (!userId) break

        await supabase
          .from('profiles')
          .update({ subscription_status: 'canceled' })
          .eq('id', userId)

        await supabase
          .from('subscriptions')
          .update({ status: 'canceled' })
          .eq('stripe_subscription_id', subscription.id)

        break
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object as Stripe.Invoice
        if (!invoice.customer) break

        await supabase
          .from('profiles')
          .update({ subscription_status: 'past_due' })
          .eq('stripe_customer_id', invoice.customer as string)

        break
      }
    }
  } catch (err) {
    console.error('Webhook handler error:', err)
    return NextResponse.json({ error: 'Webhook handler failed' }, { status: 500 })
  }

  return NextResponse.json({ received: true })
}
