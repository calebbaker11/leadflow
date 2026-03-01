'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import {
  LayoutDashboard,
  FileText,
  Settings,
  Zap,
  LogOut,
} from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/proposals', label: 'Proposals', icon: FileText },
  { href: '/settings', label: 'Settings', icon: Settings },
]

export function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClient()

  async function handleSignOut() {
    await supabase.auth.signOut()
    router.push('/login')
  }

  return (
    <aside className="flex h-screen w-60 flex-col border-r border-border bg-surface">
      {/* Logo */}
      <div className="flex h-16 items-center gap-2.5 px-5 border-b border-border">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent/10">
          <Zap className="h-4 w-4 text-accent" />
        </div>
        <span className="text-sm font-semibold text-text-primary tracking-tight">LeadFlow</span>
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
