import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseKey) {
    console.warn("Middleware: Skipping Supabase session handling - missing environment variables.")
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
          request.cookies.set({
            name,
            value,
            ...options,
          })
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
          response.cookies.set({
            name,
            value,
            ...options,
          })
        },
        remove(name: string, options: CookieOptions) {
          request.cookies.set({
            name,
            value: '',
            ...options,
          })
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
          response.cookies.set({
            name,
            value: '',
            ...options,
          })
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()

  const url = request.nextUrl.clone()

  // Protect dashboard routes
  if (url.pathname.startsWith('/admin') || url.pathname.startsWith('/business') || url.pathname.startsWith('/agent')) {
    if (!user) {
      url.pathname = '/auth/login'
      return NextResponse.redirect(url)
    }

    // Role-based protection
    const { data: userData } = await supabase
      .from('users')
      .select('role')
      .eq('id', user.id)
      .single()

    const role = userData?.role

    if (!role) {
      console.error(`Middleware: Role not found for user ${user.id}`)
      url.pathname = '/auth/login'
      return NextResponse.redirect(url)
    }

    if (url.pathname.startsWith('/admin') && role !== 'admin') {
      url.pathname = `/${role}`
      return NextResponse.redirect(url)
    }
    if (url.pathname.startsWith('/business') && role !== 'business') {
      url.pathname = role === 'admin' ? '/admin' : '/agent'
      return NextResponse.redirect(url)
    }
    if (url.pathname.startsWith('/agent') && role !== 'agent') {
      url.pathname = role === 'admin' ? '/admin' : '/business'
      return NextResponse.redirect(url)
    }
  }

  // Redirect if already logged in and hitting auth pages
  if (url.pathname.startsWith('/auth') && user) {
    const { data: userData } = await supabase
      .from('users')
      .select('role')
      .eq('id', user.id)
      .single()
    
    if (userData?.role) {
      url.pathname = `/${userData.role}`
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
