import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import OpenAI from 'openai'

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

// POST /api/proposals/[id]/suggestions  (Pro only)
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
    .select('generated_proposal_text, client_name, business_type, scope, price, timeline')
    .eq('id', params.id)
    .eq('user_id', user.id)
    .single()

  if (!proposal?.generated_proposal_text) {
    return NextResponse.json({ error: 'Generate a proposal first' }, { status: 400 })
  }

  const systemPrompt = `You are a senior sales coach specializing in freelance and agency proposals. You give specific, actionable suggestions to improve win rates. Always respond with valid JSON only.`

  const userPrompt = `Review this proposal for ${proposal.client_name}${proposal.business_type ? ` (${proposal.business_type})` : ''} and give 4 specific improvement suggestions.

PROPOSAL:
${proposal.generated_proposal_text}

Return a JSON object with exactly this shape:
{
  "suggestions": [
    {
      "category": <"urgency"|"personalization"|"clarity"|"social_proof"|"closing"|"pricing">,
      "title": <short label, 3-5 words>,
      "suggestion": <one specific, actionable thing to change or add, 1-2 sentences max>
    }
  ]
}

Be direct and specific — "add a client testimonial about similar work" is good, "improve your social proof" is too vague. Focus on the changes most likely to get this specific proposal accepted.`

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      temperature: 0.4,
      max_tokens: 500,
      response_format: { type: 'json_object' },
    })

    const raw = response.choices[0].message.content
    if (!raw) throw new Error('Empty response')
    const result = JSON.parse(raw)
    return NextResponse.json(result)
  } catch {
    return NextResponse.json({ error: 'Failed to generate suggestions' }, { status: 500 })
  }
}
