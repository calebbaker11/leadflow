'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import {
  LayoutDashboard,
  FileText,
  Settings,
  LogOut,
} from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import type { ProposalUsage } from '@/lib/proposal-limits'

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/proposals', label: 'Proposals', icon: FileText },
  { href: '/settings', label: 'Settings', icon: Settings },
]

interface SidebarProps {
  usage: ProposalUsage
}

export function Sidebar({ usage }: SidebarProps) {
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClient()

  async function handleSignOut() {
    await supabase.auth.signOut()
    router.push('/login')
  }

  const remaining = Math.max(usage.limit - usage.used, 0)
  const pct = usage.limit > 0 ? Math.min((usage.used / usage.limit) * 100, 100) : 0
  const isAtLimit = remaining === 0
  const isNearLimit = !isAtLimit && remaining <= Math.ceil(usage.limit * 0.2)

  return (
    <aside className="flex h-screen w-60 flex-col border-r border-border bg-surface">
      {/* Logo */}
      <div className="flex h-20 items-center px-5 border-b border-border">
        <img src="/logo.svg" alt="LeadFlow" style={{ height: '56px', width: 'auto' }} />
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto p-3">
        <ul className="flex flex-col gap-0.5">
          {navItems.map((item) => {
            const isActive =
              item.href === '/dashboard'
                ? pathname === '/dashboard'
                : pathname.startsWith(item.href)
            const Icon = item.icon
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    'flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-150',
                    isActive
                      ? 'bg-accent/10 text-accent'
                      : 'text-text-secondary hover:bg-card hover:text-text-primary'
                  )}
                >
                  <Icon
                    className={cn(
                      'h-4 w-4 flex-shrink-0',
                      isActive ? 'text-accent' : 'text-text-muted'
                    )}
                  />
                  {item.label}
                </Link>
              </li>
            )
          })}
        </ul>

        {/* Usage widget */}
        {usage.plan !== 'none' && (
          <div className="mt-4 rounded-lg border border-border bg-card p-3">
            <div className="flex items-center justify-between mb-2">
              <p className="text-[11px] font-medium text-text-muted uppercase tracking-wider">
                Proposals
              </p>
              <p className={cn(
                'text-xs font-semibold tabular-nums',
                isAtLimit ? 'text-danger' : isNearLimit ? 'text-warning' : 'text-text-secondary'
              )}>
                {remaining} left
              </p>
            </div>
            <div className="h-1.5 rounded-full bg-border overflow-hidden">
              <div
                className={cn(
                  'h-full rounded-full transition-all duration-300',
                  isAtLimit ? 'bg-danger' : isNearLimit ? 'bg-warning' : 'bg-accent'
                )}
                style={{ width: `${pct}%` }}
              />
            </div>
            <p className="text-[10px] text-text-muted mt-1.5">
              {usage.used}/{usage.limit}{' '}
              {usage.plan === 'trial' ? 'free trial' : 'this billing period'}
            </p>
          </div>
        )}
      </nav>

      {/* Footer */}
      <div className="border-t border-border p-3">
        <button
          onClick={handleSignOut}
          className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm font-medium text-text-secondary hover:bg-card hover:text-text-primary transition-all duration-150"
        >
          <LogOut className="h-4 w-4 text-text-muted" />
          Sign out
        </button>
      </div>
    </aside>
  )
}
