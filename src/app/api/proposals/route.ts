import { createClient } from '@/lib/supabase/server'
import { getProposalUsage } from '@/lib/proposal-limits'
import { NextResponse } from 'next/server'

export async function GET() {
  const supabase = createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { data, error } = await supabase
    .from('proposals')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ proposals: data })
}

export async function POST(request: Request) {
  const supabase = createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await request.json()
  const { client_name, business_type, template_type, scope, price, timeline, additional_notes } =
    body

  if (!client_name) {
    return NextResponse.json({ error: 'client_name is required' }, { status: 400 })
  }

  const skipSubscriptionCheck = process.env.SKIP_SUBSCRIPTION_CHECK === 'true'
  if (!skipSubscriptionCheck) {
    const usage = await getProposalUsage(user.id, supabase)
    if (!usage.canCreate) {
      const message = usage.plan === 'trial'
        ? `You've used all ${usage.limit} proposals in your free trial. Upgrade to keep going.`
        : `You've reached your ${usage.limit} proposal limit for this billing period.`
      return NextResponse.json({ error: message, limitReached: true }, { status: 403 })
    }
  }

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
    })
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ proposal: data }, { status: 201 })
}
