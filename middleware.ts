import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet: { name: string; value: string; options?: object }[]) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // Required: refreshes the session and writes updated auth cookies back to the response.
  // Without this, getUser() in API routes and Server Components will always return null.
  await supabase.auth.getUser()

  return supabaseResponse
}

export const config = {
  matcher: [
    // Skip static files, images, and Stripe webhooks (which need raw body)
    '/((?!_next/static|_next/image|favicon.ico|api/stripe/webhook|p/).*)',
  ],
}
