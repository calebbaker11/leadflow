import { createClient } from '@/lib/supabase/server'
import { generateShareUrl } from '@/lib/utils'
import { NextResponse } from 'next/server'

// POST /api/proposals/[id]/share — enable public sharing and return share URL
export async function POST(
  _request: Request,
  { params }: { params: { id: string } }
) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { data, error } = await supabase
    .from('proposals')
    .update({ is_shared: true })
    .eq('id', params.id)
    .eq('user_id', user.id)
    .select('share_token')
    .single()

  if (error || !data) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }

  return NextResponse.json({ url: generateShareUrl(data.share_token) })
}

// DELETE /api/proposals/[id]/share — disable public sharing
export async function DELETE(
  _request: Request,
  { params }: { params: { id: string } }
) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { error } = await supabase
    .from('proposals')
    .update({ is_shared: false })
    .eq('id', params.id)
    .eq('user_id', user.id)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
