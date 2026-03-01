import { Card, CardContent } from '@/components/ui/card'
import { type LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

interface StatsCardProps {
  title: string
  value: string | number
  description?: string
  icon: LucideIcon
  trend?: {
    value: number
    label: string
  }
  accent?: boolean
}

export function StatsCard({
  title,
  value,
  description,
  icon: Icon,
  accent,
}: StatsCardProps) {
  return (
    <Card>
      <CardContent className="p-5">
        <div className="flex items-start justify-between gap-4">
          <div className="flex flex-col gap-3">
            <p className="text-xs font-medium uppercase tracking-wider text-text-muted">
              {title}
            </p>
            <p
              className={cn(
                'text-3xl font-bold tracking-tight',
                accent ? 'text-accent' : 'text-text-primary'
              )}
            >
              {value}
            </p>
            {description && (
              <p className="text-xs text-text-muted">{description}</p>
            )}
          </div>
          <div
            className={cn(
              'flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg',
              accent ? 'bg-accent/10' : 'bg-surface'
            )}
          >
            <Icon
              className={cn('h-5 w-5', accent ? 'text-accent' : 'text-text-muted')}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
