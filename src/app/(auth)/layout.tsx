import Link from 'next/link'
import { Zap } from 'lucide-react'

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="flex h-16 items-center px-6 border-b border-border">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-accent/10">
            <Zap className="h-3.5 w-3.5 text-accent" />
          </div>
          <span className="text-sm font-semibold text-text-primary">LeadFlow</span>
        </Link>
      </header>
      <main className="flex flex-1 items-center justify-center px-6 py-12">
        {children}
      </main>
    </div>
  )
}
