import { createClient } from '@/lib/supabase/server'
import { getProposalUsage } from '@/lib/proposal-limits'
import { NewProposalClient } from '@/components/proposals/new-proposal-client'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Lock, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { formatDate } from '@/lib/utils'

export default async function NewProposalPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const usage = await getProposalUsage(user.id, supabase)

  if (!usage.canCreate && usage.plan !== 'none') {
    const isTrial = usage.plan === 'trial'
    return (
      <div className="flex h-full flex-col items-center justify-center p-8">
        <Card className="w-full max-w-md">
          <CardContent className="p-8 flex flex-col items-center text-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-danger/10">
              <Lock className="h-6 w-6 text-danger" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-text-primary">
                {isTrial ? 'Free trial limit reached' : 'Monthly limit reached'}
              </h2>
              <p className="text-sm text-text-muted mt-1.5 leading-relaxed">
                {isTrial
                  ? `You've used all ${usage.limit} proposals included in your free trial.`
                  : `You've used all ${usage.limit} proposals for this billing period.`}
                {!isTrial && usage.periodEnd && (
                  <> Your limit resets on{' '}
                    <span className="text-text-secondary">{formatDate(usage.periodEnd)}</span>.
                  </>
                )}
              </p>
            </div>
            {isTrial ? (
              <Link href="/settings" className="w-full">
                <Button className="w-full">
                  Upgrade to continue
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            ) : (
              <Link href="/proposals">
                <Button variant="outline" size="sm">
                  Back to proposals
                </Button>
              </Link>
            )}
          </CardContent>
        </Card>
      </div>
    )
  }

  return <NewProposalClient usage={usage} />
}
