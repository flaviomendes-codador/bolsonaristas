import { NextRequest, NextResponse } from 'next/server'

// Rotas que exigem autenticação premium
const PROTECTED_ROUTES = ['/dashboard']

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  const isProtected = PROTECTED_ROUTES.some(route => pathname.startsWith(route))

  if (isProtected) {
    // Verifica cookie de sessão do Supabase
    const cookieStore = request.cookies
    const hasSession = cookieStore.has('sb-access-token') ||
      cookieStore.has('sb-refresh-token') ||
      cookieStore.getAll().some(c => c.name.startsWith('sb-'))

    if (!hasSession) {
      return NextResponse.redirect(new URL('/login', request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/dashboard/:path*'],
}
