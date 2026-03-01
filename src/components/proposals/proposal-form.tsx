'use client'

import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { TemplateSelector } from './template-selector'
import { Sparkles, ChevronDown, ChevronUp } from 'lucide-react'
import type { ProposalFormData, TemplateType } from '@/types'

interface ProposalFormProps {
  initialData?: Partial<ProposalFormData>
  onGenerate: (data: ProposalFormData) => Promise<void>
  loading: boolean
}

export function ProposalForm({ initialData, onGenerate, loading }: ProposalFormProps) {
  const [showNotes, setShowNotes] = useState(false)
  const [formData, setFormData] = useState<ProposalFormData>({
    client_name: initialData?.client_name ?? '',
    business_type: initialData?.business_type ?? '',
    template_type: initialData?.template_type ?? 'freelancer',
    scope: initialData?.scope ?? '',
    price: initialData?.price ?? '',
    timeline: initialData?.timeline ?? '',
    additional_notes: initialData?.additional_notes ?? '',
  })

  function update(field: keyof ProposalFormData, value: string) {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    await onGenerate(formData)
  }

  const isValid =
    formData.client_name.trim() &&
    formData.scope.trim() &&
    formData.price.trim() &&
    formData.timeline.trim()

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      {/* Template Selection */}
      <div className="flex flex-col gap-3">
        <div>
          <p className="text-sm font-medium text-text-secondary">Proposal Type</p>
          <p className="text-xs text-text-muted mt-0.5">
            Choose the template that best fits your business
          </p>
        </div>
        <TemplateSelector
          selected={formData.template_type}
          onSelect={(type: TemplateType) => update('template_type', type)}
        />
      </div>

      <div className="h-px bg-border" />

      {/* Client Info */}
      <div className="flex flex-col gap-4">
        <p className="text-sm font-medium text-text-secondary">Client Information</p>
        <Input
          label="Client Name"
          placeholder="e.g. Acme Corp"
          value={formData.client_name}
          onChange={(e) => update('client_name', e.target.value)}
          required
        />
        <Input
          label="Client's Business Type"
          placeholder="e.g. E-commerce startup, Healthcare clinic"
          value={formData.business_type}
          onChange={(e) => update('business_type', e.target.value)}
          hint="This helps the AI tailor language to their industry"
        />
      </div>

      <div className="h-px bg-border" />

      {/* Project Details */}
      <div className="flex flex-col gap-4">
        <p className="text-sm font-medium text-text-secondary">Project Details</p>
        <Textarea
          label="Scope of Work"
          placeholder="Describe what you'll be delivering. Be specific — the AI uses this to write your proposal."
          value={formData.scope}
          onChange={(e) => update('scope', e.target.value)}
          rows={4}
          required
        />
        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Investment / Price"
            placeholder="e.g. $5,000 or $2,500–$4,000"
            value={formData.price}
            onChange={(e) => update('price', e.target.value)}
            required
          />
          <Input
            label="Timeline"
            placeholder="e.g. 3–4 weeks"
            value={formData.timeline}
            onChange={(e) => update('timeline', e.target.value)}
            required
          />
        </div>
      </div>

      {/* Optional Notes */}
      <div>
        <button
          type="button"
          onClick={() => setShowNotes(!showNotes)}
          className="flex items-center gap-1.5 text-xs text-text-muted hover:text-text-secondary transition-colors"
        >
          {showNotes ? (
            <ChevronUp className="h-3.5 w-3.5" />
          ) : (
            <ChevronDown className="h-3.5 w-3.5" />
          )}
          Additional notes (optional)
        </button>

        {showNotes && (
          <div className="mt-3">
            <Textarea
              placeholder="Any extra context for the AI — special requirements, tone preferences, upsell ideas, etc."
              value={formData.additional_notes}
              onChange={(e) => update('additional_notes', e.target.value)}
              rows={3}
            />
          </div>
        )}
      </div>

      {/* Generate Button */}
      <Button
        type="submit"
        size="lg"
        loading={loading}
        disabled={!isValid}
        className="w-full"
      >
        <Sparkles className="h-4 w-4" />
        {loading ? 'Generating...' : 'Generate Proposal'}
      </Button>

      {!isValid && (
        <p className="text-center text-xs text-text-muted -mt-2">
          Fill in client name, scope, price, and timeline to generate
        </p>
      )}
    </form>
  )
}
