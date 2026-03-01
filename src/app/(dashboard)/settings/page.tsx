import { createClient } from '@/lib/supabase/server'
import { Topbar } from '@/components/layout/topbar'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { BillingButton } from './billing-button'
import { formatDate } from '@/lib/utils'

export default async function SettingsPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user!.id)
    .single()

  const { data: subscription } = await supabase
    .from('subscriptions')
    .select('*')
    .eq('user_id', user!.id)
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle()

  return (
    <div className="flex flex-col">
      <Topbar title="Settings" description="Manage your account and billing" />

      <div className="p-6 flex flex-col gap-6 max-w-2xl">
        {/* Account */}
        <Card>
          <CardHeader>
            <CardTitle>Account</CardTitle>
            <CardDescription>Your account information</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <div className="flex justify-between items-center py-3 border-b border-border">
              <div>
                <p className="text-xs text-text-muted mb-0.5">Full name</p>
                <p className="text-sm text-text-primary">{profile?.full_name || '—'}</p>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <div>
                <p className="text-xs text-text-muted mb-0.5">Email address</p>
                <p className="text-sm text-text-primary">{user!.email}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Subscription */}
        <Card>
          <CardHeader>
            <CardTitle>Subscription</CardTitle>
            <CardDescription>Your LeadFlow plan and billing</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-5">
            <div className="flex items-center justify-between rounded-lg border border-border bg-surface p-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <p className="text-sm font-semibold text-text-primary">LeadFlow Pro</p>
                  <Badge
                    variant={
                      profile?.subscription_status === 'active'
                        ? 'success'
                        : profile?.subscription_status === 'trialing'
                        ? 'accent'
                        : 'warning'
                    }
                  >
                    {profile?.subscription_status === 'trialing'
                      ? 'free trial'
                      : profile?.subscription_status || 'inactive'}
                  </Badge>
                </div>
                <p className="text-xs text-text-muted">$49 / month</p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-text-primary">$49</p>
                <p className="text-xs text-text-muted">/month</p>
              </div>
            </div>

            {subscription && (
              <div className="flex flex-col gap-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-text-muted">Status</span>
                  <span className="text-text-secondary capitalize">{subscription.status}</span>
                </div>
                {subscription.current_period_end && (
                  <div className="flex justify-between">
                    <span className="text-text-muted">
                      {subscription.cancel_at_period_end
                        ? 'Cancels on'
                        : subscription.status === 'trialing'
                        ? 'Trial ends'
                        : 'Renews on'}
                    </span>
                    <span className="text-text-secondary">
                      {formatDate(subscription.current_period_end)}
                    </span>
                  </div>
                )}
              </div>
            )}

            <BillingButton hasCustomer={!!profile?.stripe_customer_id} />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
