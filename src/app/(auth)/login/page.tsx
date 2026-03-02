'use client'

import { useState, Suspense } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

export default function LoginPage() {
  return (
    <Suspense>
      <LoginContent />
    </Suspense>
  )
}

function LoginContent() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setErrorMsg('')

    const supabase = createClient()
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) {
      setErrorMsg(error.message)
      setLoading(false)
    } else {
      window.location.href = '/dashboard'
    }
  }

  return (
    <div className="w-full max-w-sm">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-text-primary mb-1">Welcome back</h1>
        <p className="text-sm text-text-secondary">Sign in to your LeadFlow account</p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Input
          label="Email"
          type="email"
          placeholder="you@company.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          autoComplete="email"
        />
        <Input
          label="Password"
          type="password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          autoComplete="current-password"
        />

        <div className="flex justify-end">
          <Link
            href="/reset-password"
            className="text-xs text-text-muted hover:text-text-secondary transition-colors"
          >
            Forgot password?
          </Link>
        </div>

        {errorMsg && (
          <div className="rounded-lg bg-red-500/10 border border-red-500/20 px-4 py-3 text-sm text-red-400">
            {errorMsg}
          </div>
        )}

        <Button type="submit" loading={loading} className="w-full mt-1">
          Sign in
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-text-muted">
        Don&apos;t have an account?{' '}
        <Link href="/signup" className="text-accent hover:text-accent-hover transition-colors">
          Get started
        </Link>
      </p>
    </div>
  )
}
