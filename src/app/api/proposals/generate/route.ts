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

  if (!profile || profile.subscription_status !== 'active') {
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
    const generatedText = await generateProposal({
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
