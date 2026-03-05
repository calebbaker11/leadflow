'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { toast } from 'sonner'

interface Props {
  initialValue: string | null
}

export function BrandVoiceForm({ initialValue }: Props) {
  const [value, setValue] = useState(initialValue ?? '')
  const [saving, setSaving] = useState(false)

  async function handleSave() {
    setSaving(true)
    try {
      const res = await fetch('/api/profile/brand-voice', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ brand_voice: value }),
      })
      if (!res.ok) throw new Error('Failed to save')
      toast.success('Brand voice saved')
    } catch {
      toast.error('Failed to save brand voice')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="flex flex-col gap-3">
      <Textarea
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="e.g. Direct, confident, and results-focused. We avoid jargon and speak plainly. Our tone is warm but professional — like talking to a trusted advisor."
        className="min-h-[100px] resize-none"
      />
      <p className="text-xs text-text-muted">
        This will be injected into every proposal you generate to keep your voice consistent across clients.
      </p>
      <Button
        variant="secondary"
        onClick={handleSave}
        loading={saving}
        className="self-start"
      >
        Save brand voice
      </Button>
    </div>
  )
}
