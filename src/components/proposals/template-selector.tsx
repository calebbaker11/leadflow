'use client'

import { cn } from '@/lib/utils'
import type { Template, TemplateType } from '@/types'
import { Briefcase, Building2, HardHat, LineChart } from 'lucide-react'

const templates: Template[] = [
  {
    id: 'freelancer',
    name: 'Freelancer',
    description: 'Ideal for independent professionals offering specialized services',
    icon: 'Briefcase',
    example_scope: 'Brand identity design including logo, color palette, and style guide',
    example_timeline: '3–4 weeks',
  },
  {
    id: 'agency',
    name: 'Agency',
    description: 'Full-service agency proposals with team and multi-phase delivery',
    icon: 'Building2',
    example_scope: 'Full website redesign: strategy, design, development, and launch',
    example_timeline: '8–12 weeks',
  },
  {
    id: 'contractor',
    name: 'Contractor',
    description: 'Trade and construction projects with materials and labor breakdown',
    icon: 'HardHat',
    example_scope: 'Kitchen renovation: demolition, framing, plumbing, and finishes',
    example_timeline: '6–8 weeks',
  },
  {
    id: 'consultant',
    name: 'Consultant',
    description: 'Strategic advisory and business consulting engagements',
    icon: 'LineChart',
    example_scope: 'Go-to-market strategy, competitive analysis, and growth roadmap',
    example_timeline: '4–6 weeks',
  },
]

const iconMap = {
  Briefcase,
  Building2,
  HardHat,
  LineChart,
}

interface TemplateSelectorProps {
  selected: TemplateType
  onSelect: (type: TemplateType) => void
}

export function TemplateSelector({ selected, onSelect }: TemplateSelectorProps) {
  return (
    <div className="grid grid-cols-2 gap-3">
      {templates.map((template) => {
        const Icon = iconMap[template.icon as keyof typeof iconMap]
        const isSelected = selected === template.id

        return (
          <button
            key={template.id}
            type="button"
            onClick={() => onSelect(template.id)}
            className={cn(
              'flex flex-col gap-2 rounded-xl border p-4 text-left transition-all duration-150',
              isSelected
                ? 'border-accent bg-accent/5 shadow-glow'
                : 'border-border bg-card hover:border-border/60 hover:bg-card-hover'
            )}
          >
            <div
              className={cn(
                'flex h-8 w-8 items-center justify-center rounded-lg',
                isSelected ? 'bg-accent/20' : 'bg-surface'
              )}
            >
              <Icon
                className={cn('h-4 w-4', isSelected ? 'text-accent' : 'text-text-muted')}
              />
            </div>
            <div>
              <p
                className={cn(
                  'text-sm font-semibold',
                  isSelected ? 'text-text-primary' : 'text-text-secondary'
                )}
              >
                {template.name}
              </p>
              <p className="mt-0.5 text-xs text-text-muted leading-snug">
                {template.description}
              </p>
            </div>
          </button>
        )
      })}
    </div>
  )
}
