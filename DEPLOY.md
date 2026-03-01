# LeadFlow Deployment Guide

## Prerequisites
- Node.js 18+
- A Supabase project
- A Stripe account
- An OpenAI account (GPT-4 access)
- A Vercel account (recommended for Next.js)

---

## Step 1 — Supabase Setup

1. Create a new Supabase project at https://supabase.com
2. In your Supabase dashboard → SQL Editor → run the full contents of `supabase/schema.sql`
3. Copy your project credentials:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **Anon key** → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **Service role key** → `SUPABASE_SERVICE_ROLE_KEY` (Settings → API)

### Enable Email Auth
- Supabase Dashboard → Authentication → Providers → Email → Enable

---

## Step 2 — Stripe Setup

1. Create a Stripe account at https://stripe.com
2. In Stripe Dashboard → Products → Create a product:
   - Name: `LeadFlow Pro`
   - Price: `$49.00` / month (recurring)
   - Copy the **Price ID** → `STRIPE_PRICE_ID` (looks like `price_xxx`)
3. Get your API keys (Developers → API Keys):
   - **Secret key** → `STRIPE_SECRET_KEY`
   - **Publishable key** → `STRIPE_PUBLISHABLE_KEY`
4. Set up the Customer Portal:
   - Stripe Dashboard → Settings → Billing → Customer portal → Activate
5. Set up webhook (after deploying — see Step 5):
   - Stripe Dashboard → Developers → Webhooks → Add endpoint
   - URL: `https://your-domain.com/api/stripe/webhook`
   - Events to listen for:
     - `checkout.session.completed`
     - `customer.subscription.updated`
     - `customer.subscription.deleted`
     - `invoice.payment_failed`
   - Copy the **Signing secret** → `STRIPE_WEBHOOK_SECRET`

---

## Step 3 — OpenAI Setup

1. Get an API key at https://platform.openai.com/api-keys
2. Ensure your account has access to `gpt-4o`
3. Set a usage limit to protect against runaway costs (recommended: $50/month cap)
4. Copy key → `OPENAI_API_KEY`

---

## Step 4 — Local Development

```bash
# Clone and install
cd leadflow
npm install

# Set up environment
cp .env.local.example .env.local
# Fill in all values in .env.local

# Run dev server
npm run dev
```

Open http://localhost:3000

**Test the full flow locally:**
1. Sign up with an email
2. Use Stripe test mode (test card: `4242 4242 4242 4242`)
3. For webhooks locally, use Stripe CLI:
   ```bash
   stripe listen --forward-to localhost:3000/api/stripe/webhook
   ```

---

## Step 5 — Deploy to Vercel

```bash
npm install -g vercel
vercel
```

Or connect your GitHub repo in the Vercel dashboard.

**Set all environment variables in Vercel:**
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `STRIPE_SECRET_KEY`
- `STRIPE_PUBLISHABLE_KEY`
- `STRIPE_WEBHOOK_SECRET`
- `STRIPE_PRICE_ID`
- `OPENAI_API_KEY`
- `NEXT_PUBLIC_APP_URL` → your production URL (e.g., `https://leadflow.app`)

After deploying, go back to Stripe and add the webhook endpoint with your production URL.

---

## Step 6 — Post-Deployment Checklist

- [ ] Run `supabase/schema.sql` in Supabase SQL editor
- [ ] Test signup → Stripe checkout → dashboard access flow
- [ ] Test proposal generation (OpenAI)
- [ ] Test PDF export (print dialog)
- [ ] Test share link (public proposal URL)
- [ ] Test subscription cancellation via Stripe portal
- [ ] Verify webhook events are received (Stripe Dashboard → Webhooks → your endpoint)
- [ ] Set spending limits in OpenAI dashboard

---

## Architecture Notes

```
User → Next.js (Vercel)
         │
         ├── Supabase Auth (sessions + JWT)
         ├── Supabase DB (proposals, profiles, subscriptions)
         ├── Stripe (checkout, webhooks, portal)
         └── OpenAI API (proposal generation — on user click only)
```

**Cost structure (estimated at 100 active users):**
- Vercel Hobby/Pro: $0–$20/month
- Supabase Free/Pro: $0–$25/month
- OpenAI: ~$0.01–$0.05 per proposal generation
- Stripe: 2.9% + $0.30 per transaction
- Revenue at 100 users: $4,900/month

**Security implemented:**
- Row Level Security on all Supabase tables
- Stripe webhook signature verification
- Subscription status checked server-side before dashboard access
- OpenAI only called on explicit user action
- Admin Supabase client only used in webhook handler (service role)
