import { NextRequest, NextResponse } from 'next/server'

const PROTECTED = ['/dashboard']

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  if (PROTECTED.some(r => pathname.startsWith(r))) {
    const hasSession = request.cookies.getAll().some(c => c.name.startsWith('sb-'))
    if (!hasSession) return NextResponse.redirect(new URL('/login', request.url))
  }
  return NextResponse.next()
}

export const config = { matcher: ['/dashboard/:path*'] }
