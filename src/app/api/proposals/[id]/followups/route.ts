import { createClient } from '@/lib/supabase/server'
import OpenAI from 'openai'
import { NextResponse } from 'next/server'

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

export async function POST(
  _request: Request,
  { params }: { params: { id: string } }
) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Verify Pro plan
  const { data: sub } = await supabase
    .from('subscriptions')
    .select('stripe_price_id')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle()

  if (sub?.stripe_price_id !== process.env.STRIPE_PRO_PRICE_ID) {
    return NextResponse.json({ error: 'LeadFlow Pro required' }, { status: 403 })
  }

  const { data: proposal } = await supabase
    .from('proposals')
    .select('generated_proposal_text, client_name, scope, price, timeline')
    .eq('id', params.id)
    .eq('user_id', user.id)
    .single()

  if (!proposal?.generated_proposal_text) {
    return NextResponse.json({ error: 'Generate a proposal first' }, { status: 400 })
  }

  const response = await openai.chat.completions.create({
    model: 'gpt-4o',
    messages: [
      {
        role: 'system',
        content: 'You are a sales expert who writes concise, high-converting follow-up emails for service businesses.',
      },
      {
        role: 'user',
        content: `Write a 4-email follow-up sequence for a proposal sent to "${proposal.client_name}". The proposal covers: ${proposal.scope ?? 'the described scope'} at ${proposal.price ?? 'the discussed price'}.

Email cadence:
- Email 1: Day 2 after sending — check-in, reaffirm value
- Email 2: Day 5 — address a common hesitation, add urgency
- Email 3: Day 10 — social proof / results angle, clear CTA
- Email 4: Day 14 — final check-in, "closing the loop"

Return a JSON object with a "emails" array. Each email must have: "day" (number), "subject" (string), and "body" (string, 3-5 sentences, plain text). No markdown, raw JSON only.`,
      },
    ],
    temperature: 0.65,
    max_tokens: 1200,
    response_format: { type: 'json_object' },
  })

  const raw = response.choices[0].message.content || '{}'
  let emails: { day: number; subject: string; body: string }[] = []

  try {
    const parsed = JSON.parse(raw)
    emails = Array.isArray(parsed) ? parsed : parsed.emails ?? []
  } catch {
    return NextResponse.json({ error: 'Failed to parse follow-ups' }, { status: 500 })
  }

  return NextResponse.json({ emails })
}
