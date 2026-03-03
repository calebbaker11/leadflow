import { createClient } from '@/lib/supabase/server'
import { generateProposal } from '@/lib/openai'
import { getProposalUsage } from '@/lib/proposal-limits'
import { NextResponse } from 'next/server'

// POST /api/proposals/generate
// Generates a proposal using OpenAI and saves it to the database
export async function POST(request: Request) {
  const supabase = createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Verify active subscription before consuming OpenAI credits
  const { data: profile } = await supabase
    .from('profiles')
    .select('subscription_status')
    .eq('id', user.id)
    .single()

  if (!profile || !['active', 'trialing'].includes(profile.subscription_status)) {
    return NextResponse.json({ error: 'Active subscription required' }, { status: 403 })
  }

  const body = await request.json()
  const {
    proposalId,
    client_name,
    business_type,
    template_type,
    scope,
    price,
    timeline,
    additional_notes,
  } = body

  if (!client_name || !scope || !price || !timeline) {
    return NextResponse.json(
      { error: 'client_name, scope, price, and timeline are required' },
      { status: 400 }
    )
  }

  // Enforce proposal limits only when creating a new proposal (not regenerating)
  if (!proposalId) {
    const usage = await getProposalUsage(user.id, supabase)
    if (!usage.canCreate) {
      const message = usage.plan === 'trial'
        ? `You've used all ${usage.limit} proposals in your free trial. Upgrade to keep going.`
        : `You've reached your ${usage.limit} proposal limit for this billing period. Your limit resets on the next billing date.`
      return NextResponse.json({ error: message, limitReached: true }, { status: 403 })
    }
  }

  try {
    const generatedText = await generateProposal({
      clientName: client_name,
      businessType: business_type || 'business',
      templateType: template_type || 'freelancer',
      scope,
      price,
      timeline,
      additionalNotes: additional_notes,
    })

    // Update existing proposal
    if (proposalId) {
      const { data, error } = await supabase
        .from('proposals')
        .update({
          client_name,
          business_type,
          template_type,
          scope,
          price,
          timeline,
          additional_notes,
          generated_proposal_text: generatedText,
        })
        .eq('id', proposalId)
        .eq('user_id', user.id)
        .select()
        .single()

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 })
      }

      return NextResponse.json({ proposal: data })
    }

    // Create a new proposal
    const { data, error } = await supabase
      .from('proposals')
      .insert({
        user_id: user.id,
        client_name,
        business_type,
        template_type: template_type || 'freelancer',
        scope,
        price,
        timeline,
        additional_notes,
        generated_proposal_text: generatedText,
      })
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ proposal: data }, { status: 201 })
  } catch (err) {
    console.error('OpenAI generation error:', err)
    return NextResponse.json({ error: 'Failed to generate proposal' }, { status: 500 })
  }
}
