import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import OpenAI from 'openai'

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

// POST /api/proposals/[id]/score  (Pro only)
export async function POST(_req: Request, { params }: { params: { id: string } }) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data: sub } = await supabase
    .from('subscriptions')
    .select('stripe_price_id')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle()

  if (sub?.stripe_price_id !== process.env.STRIPE_PRO_PRICE_ID) {
    return NextResponse.json({ error: 'Pro plan required' }, { status: 403 })
  }

  const { data: proposal } = await supabase
    .from('proposals')
    .select('generated_proposal_text, client_name, business_type, price')
    .eq('id', params.id)
    .eq('user_id', user.id)
    .single()

  if (!proposal?.generated_proposal_text) {
    return NextResponse.json({ error: 'Generate a proposal first' }, { status: 400 })
  }

  const systemPrompt = `You are a senior sales coach who reviews proposals for freelancers, agencies, and consultants. You score proposals on four dimensions and give honest, actionable feedback. Always respond with valid JSON only — no markdown, no prose outside the JSON.`

  const userPrompt = `Score this proposal written for ${proposal.client_name}${proposal.business_type ? ` (${proposal.business_type})` : ''} with a ${proposal.price} price point.

PROPOSAL:
${proposal.generated_proposal_text}

Return a JSON object with exactly this shape:
{
  "score": <overall 0-100>,
  "grade": <"A+"|"A"|"B+"|"B"|"C+"|"C"|"D">,
  "breakdown": {
    "clarity": <0-100, how clear and easy to understand>,
    "persuasion": <0-100, how compelling and sales-focused>,
    "personalization": <0-100, how tailored to this specific client>,
    "urgency": <0-100, how well it motivates action now>
  },
  "verdict": <one sentence summary, max 15 words, honest and direct>
}

Be honest — most proposals score 55–75. Reserve 85+ for genuinely strong work.`

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      temperature: 0.3,
      max_tokens: 300,
      response_format: { type: 'json_object' },
    })

    const raw = response.choices[0].message.content
    if (!raw) throw new Error('Empty response')
    const result = JSON.parse(raw)
    return NextResponse.json(result)
  } catch {
    return NextResponse.json({ error: 'Failed to score proposal' }, { status: 500 })
  }
}
