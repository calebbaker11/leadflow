import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { Sidebar } from '@/components/layout/sidebar'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('subscription_status')
    .eq('id', user.id)
    .single()

  const skipSubscriptionCheck = process.env.SKIP_SUBSCRIPTION_CHECK === 'true'

  if (!skipSubscriptionCheck && (!profile || !['active', 'trialing'].includes(profile.subscription_status))) {
    redirect('/subscribe')
  }

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <Sidebar />
      <main className="flex-1 overflow-auto">{children}</main>
    </div>
  )
}
