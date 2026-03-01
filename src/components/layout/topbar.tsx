import { type ReactNode } from 'react'

interface TopbarProps {
  title: string
  description?: string
  action?: ReactNode
}

export function Topbar({ title, description, action }: TopbarProps) {
  return (
    <div className="flex h-16 items-center justify-between border-b border-border px-6">
      <div>
        <h1 className="text-base font-semibold text-text-primary">{title}</h1>
        {description && (
          <p className="text-xs text-text-muted">{description}</p>
        )}
      </div>
      {action && <div>{action}</div>}
    </div>
  )
}
