import { stripe } from '@/lib/stripe'
import { createAdminClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import type Stripe from 'stripe'

export const runtime = 'nodejs'

function toProfileStatus(stripeStatus: Stripe.Subscription.Status): string {
  switch (stripeStatus) {
    case 'active':
      return 'active'
    case 'trialing':
      return 'trialing'
    case 'past_due':
      return 'past_due'
    case 'unpaid':
    case 'incomplete':
    case 'incomplete_expired':
    case 'canceled':
    case 'paused':
      return 'inactive'
    default:
      return 'inactive'
  }
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
    console.error('[stripe/webhook] Signature verification failed:', err)
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  console.log(`[stripe/webhook] Received event: ${event.type} (${event.id})`)

  const supabase = createAdminClient()

  // Idempotency: skip already-processed events
  const { data: existing } = await supabase
    .from('processed_webhook_events')
    .select('id')
    .eq('id', event.id)
    .maybeSingle()

  if (existing) {
    console.log(`[stripe/webhook] Duplicate event skipped: ${event.id}`)
    return NextResponse.json({ received: true })
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session
        const userId = session.metadata?.userId

        if (!userId || !session.customer || !session.subscription) break

        const subscription = await stripe.subscriptions.retrieve(
          session.subscription as string
        )

        const profileStatus = toProfileStatus(subscription.status)

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

        console.log(`[stripe/webhook] Checkout completed for user ${userId}, status: ${profileStatus}`)
        break
      }

      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription
        const userId = subscription.metadata?.userId

        if (!userId) break

        const profileStatus = toProfileStatus(subscription.status)

        await supabase
          .from('profiles')
          .update({ subscription_status: profileStatus })
          .eq('id', userId)

        await supabase
          .from('subscriptions')
          .update({
            status: subscription.status,
            stripe_price_id: subscription.items.data[0]?.price.id,
            current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
            current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
            cancel_at_period_end: subscription.cancel_at_period_end,
          })
          .eq('stripe_subscription_id', subscription.id)

        console.log(`[stripe/webhook] Subscription updated for user ${userId}, status: ${profileStatus}`)
        break
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription
        const userId = subscription.metadata?.userId

        if (!userId) break

        await supabase
          .from('profiles')
          .update({ subscription_status: 'inactive' })
          .eq('id', userId)

        await supabase
          .from('subscriptions')
          .update({ status: 'canceled' })
          .eq('stripe_subscription_id', subscription.id)

        console.log(`[stripe/webhook] Subscription deleted for user ${userId}`)
        break
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object as Stripe.Invoice
        if (!invoice.customer) break

        await supabase
          .from('profiles')
          .update({ subscription_status: 'past_due' })
          .eq('stripe_customer_id', invoice.customer as string)

        console.log(`[stripe/webhook] Payment failed for customer ${invoice.customer}`)
        break
      }
    }

    // Record event as processed
    await supabase
      .from('processed_webhook_events')
      .insert({ id: event.id, type: event.type, processed_at: new Date().toISOString() })

  } catch (err) {
    console.error(`[stripe/webhook] Handler error for ${event.type} (${event.id}):`, err)
    return NextResponse.json({ error: 'Webhook handler failed' }, { status: 500 })
  }

  return NextResponse.json({ received: true })
}
