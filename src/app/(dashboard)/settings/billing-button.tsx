'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { ExternalLink } from 'lucide-react'

export function BillingButton({ hasCustomer }: { hasCustomer: boolean }) {
  const [loading, setLoading] = useState(false)

  async function handleBilling() {
    setLoading(true)

    try {
      const res = await fetch('/api/stripe/portal', { method: 'POST' })
      const data = await res.json()

      if (!res.ok) throw new Error(data.error)

      window.location.href = data.url
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to open billing portal')
      setLoading(false)
    }
  }

  if (!hasCustomer) return null

  return (
    <Button variant="secondary" onClick={handleBilling} loading={loading}>
      <ExternalLink className="h-4 w-4" />
      Manage billing &amp; subscription
    </Button>
  )
}
