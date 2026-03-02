import { createClient } from '@/lib/supabase/server'
import { generateProposal } from '@/lib/openai'
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

  const skipSubscriptionCheck = process.env.SKIP_SUBSCRIPTION_CHECK === 'true'
  if (!skipSubscriptionCheck && (!profile || !['active', 'trialing'].includes(profile.subscription_status))) {
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

  try {
    const generatedText = skipSubscriptionCheck
      ? `## Executive Summary\n\nThis is a test proposal for ${client_name}. OpenAI generation is disabled in test mode.\n\n## Understanding Your Needs\n\nTest content — add your OpenAI API key and billing to enable real generation.\n\n## Proposed Scope of Work\n\n- ${scope}\n\n## Project Timeline\n\n${timeline}\n\n## Investment\n\n${price}\n\n## Next Steps\n\nContact us to get started.`
      : await generateProposal({
        clientName: client_name,
        businessType: business_type || 'business',
        templateType: template_type || 'freelancer',
        scope,
        price,
        timeline,
        additionalNotes: additional_notes,
      })

    // Save or update the proposal with generated text
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
