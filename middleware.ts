import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'
import { ROLE_DASHBOARDS, getDashboardForRole, isAuthorized, UserRole } from './lib/roles'

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseKey) {
    return response
  }

  const supabase = createServerClient(
    supabaseUrl,
    supabaseKey,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          request.cookies.set({ name, value, ...options })
          response = NextResponse.next({
            request: { headers: request.headers },
          })
          response.cookies.set({ name, value, ...options })
        },
        remove(name: string, options: CookieOptions) {
          request.cookies.set({ name, value: '', ...options })
          response = NextResponse.next({
            request: { headers: request.headers },
          })
          response.cookies.set({ name, value: '', ...options })
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()

  const url = request.nextUrl.clone()
  const path = url.pathname

  // Public paths that don't need auth
  const publicPaths = ['/auth/login', '/auth/signup', '/auth/callback', '/(public)']
  if (publicPaths.some(p => path.startsWith(p)) && !user) {
    return response
  }

  // Redirect logged in users away from auth pages
  if (path.startsWith('/auth') && user) {
    const { data: userData } = await supabase
      .from('users')
      .select('role')
      .eq('id', user.id)
      .single()
    
    const role = (userData?.role || 'customer') as UserRole
    url.pathname = getDashboardForRole(role)
    return NextResponse.redirect(url)
  }

  // Protected dashboard routes
  const protectedPaths = ['/admin', '/business', '/agent', '/customer', '/reseller']
  if (protectedPaths.some(p => path.startsWith(p))) {
    if (!user) {
      url.pathname = '/auth/login'
      url.searchParams.set('returnTo', path)
      return NextResponse.redirect(url)
    }

    // Role-based authorization
    const { data: userData } = await supabase
      .from('users')
      .select('role')
      .eq('id', user.id)
      .single()

    const role = (userData?.role || 'customer') as UserRole

    // If accessing the base route (e.g. /admin), redirect to dashboard
    if (protectedPaths.includes(path)) {
      url.pathname = getDashboardForRole(role)
      return NextResponse.redirect(url)
    }

    // Check permissions
    if (!isAuthorized(role, path)) {
      // Redirect to their own dashboard if they try to access something else
      url.pathname = getDashboardForRole(role)
      return NextResponse.redirect(url)
    }
  }

  return response
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
