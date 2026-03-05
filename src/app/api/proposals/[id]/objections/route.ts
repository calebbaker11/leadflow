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
    .select('generated_proposal_text, client_name, scope, price')
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
        content: 'You are a sales coach helping service businesses anticipate and handle client objections.',
      },
      {
        role: 'user',
        content: `Based on this business proposal, identify the 4 most likely objections a client named "${proposal.client_name}" might raise, and provide a confident, concise response to each.

PROPOSAL:
${proposal.generated_proposal_text}

Respond with a JSON array of exactly 4 objects, each with "objection" and "response" string fields. No markdown, no extra text — raw JSON only.`,
      },
    ],
    temperature: 0.6,
    max_tokens: 1000,
    response_format: { type: 'json_object' },
  })

  const raw = response.choices[0].message.content || '{}'
  let objections: { objection: string; response: string }[] = []

  try {
    const parsed = JSON.parse(raw)
    objections = Array.isArray(parsed) ? parsed : parsed.objections ?? []
  } catch {
    return NextResponse.json({ error: 'Failed to parse objections' }, { status: 500 })
  }

  return NextResponse.json({ objections })
}
