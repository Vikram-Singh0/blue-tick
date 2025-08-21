import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const SESSION_COOKIE = 'session_token'

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl
  // Public routes
  if (
    pathname.startsWith('/api/auth') ||
    pathname.startsWith('/signin') ||
    pathname.startsWith('/signup') ||
    pathname.startsWith('/favicon.ico') ||
    pathname.startsWith('/_next') ||
    pathname.match(/\.(jpg|png|svg|gif)$/)
  ) {
    return NextResponse.next()
  }

  const session = req.cookies.get(SESSION_COOKIE)?.value
  if (!session) {
    const url = req.nextUrl.clone()
    url.pathname = '/signin'
    url.searchParams.set('next', pathname)
    return NextResponse.redirect(url)
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!_next|favicon.ico|sitemap.xml|robots.txt|.*\\.jpg|.*\\.png|.*\\.svg|.*\\.gif).*)',
  ],
}
