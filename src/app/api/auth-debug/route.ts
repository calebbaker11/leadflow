import { createClient } from '@/lib/supabase/server'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function GET() {
  const cookieStore = cookies()
  const allCookies = cookieStore.getAll().map((c) => c.name)

  const supabase = createClient()
  const { data: { user }, error: userError } = await supabase.auth.getUser()
  const { data: { session }, error: sessionError } = await supabase.auth.getSession()

  return NextResponse.json({
    supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL ?? 'NOT SET',
    anonKeySet: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    skipSubscriptionCheck: process.env.SKIP_SUBSCRIPTION_CHECK,
    cookies: allCookies,
    user: user ? { id: user.id, email: user.email } : null,
    session: session ? { expires: session.expires_at } : null,
    userError: userError?.message ?? null,
    sessionError: sessionError?.message ?? null,
  })
}
