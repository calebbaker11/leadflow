'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { loginAction } from '@/app/actions/auth'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'

export default function SignupPage() {
  const router = useRouter()
  const supabase = createClient()

  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    if (password.length < 8) {
      toast.error('Password must be at least 8 characters')
      return
    }

    setLoading(true)

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName },
      },
    })

    if (error) {
      toast.error(error.message)
      setLoading(false)
      return
    }

    // Sign in via server action so the session is written as proper server-side
    // cookies that getUser() in API route handlers can reliably verify
    const signInError = await loginAction(email, password)

    if (signInError) {
      toast.error('Account created! Please sign in to continue.')
      router.push('/login')
      return
    }

    // Hard redirect so middleware runs fresh and picks up the new session cookies
    window.location.href = '/subscribe'
  }

  return (
    <div className="w-full max-w-sm">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-text-primary mb-1">Create your account</h1>
        <p className="text-sm text-text-secondary">
          Start closing more deals with professional proposals
        </p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Input
          label="Full name"
          type="text"
          placeholder="Jane Smith"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          required
          autoComplete="name"
        />
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
          placeholder="Minimum 8 characters"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          autoComplete="new-password"
          hint="Must be at least 8 characters"
        />

        <Button type="submit" loading={loading} className="w-full mt-1">
          Create account
        </Button>
      </form>

      <p className="mt-4 text-center text-xs text-text-muted leading-relaxed">
        By creating an account you agree to our Terms of Service. You&apos;ll be asked to subscribe
        after signup.
      </p>

      <p className="mt-6 text-center text-sm text-text-muted">
        Already have an account?{' '}
        <Link href="/login" className="text-accent hover:text-accent-hover transition-colors">
          Sign in
        </Link>
      </p>
    </div>
  )
}
