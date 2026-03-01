import Stripe from 'stripe'

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-06-20',
})

export const STRIPE_PRICE_ID = process.env.STRIPE_PRICE_ID!

export async function createCheckoutSession({
  customerId,
  customerEmail,
  userId,
  successUrl,
  cancelUrl,
}: {
  customerId?: string
  customerEmail: string
  userId: string
  successUrl: string
  cancelUrl: string
}) {
  const params: Stripe.Checkout.SessionCreateParams = {
    mode: 'subscription',
    payment_method_types: ['card'],
    line_items: [
      {
        price: STRIPE_PRICE_ID,
        quantity: 1,
      },
    ],
    success_url: successUrl,
    cancel_url: cancelUrl,
    metadata: { userId },
    subscription_data: {
      metadata: { userId },
      trial_period_days: 7,
    },
    billing_address_collection: 'required',
    allow_promotion_codes: true,
  }

  if (customerId) {
    params.customer = customerId
  } else {
    params.customer_email = customerEmail
  }

  return stripe.checkout.sessions.create(params)
}

export async function createPortalSession({
  customerId,
  returnUrl,
}: {
  customerId: string
  returnUrl: string
}) {
  return stripe.billingPortal.sessions.create({
    customer: customerId,
    return_url: returnUrl,
  })
}
