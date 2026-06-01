import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { isSessionValid } from '@/lib/auth'

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl
  const isValid = isSessionValid(request.cookies.get('session')?.value)

  if (pathname === '/login') {
    if (isValid) return NextResponse.redirect(new URL('/', request.url))
    return NextResponse.next()
  }

  if (!isValid) {
    if (pathname === '/api/chat') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    return NextResponse.redirect(new URL('/login', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/', '/login', '/api/chat'],
}
