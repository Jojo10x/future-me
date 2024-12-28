import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
  const token = request.cookies.get('access_token')?.value
  const isAuthPage = request.nextUrl.pathname.startsWith('/login') || 
                     request.nextUrl.pathname.startsWith('/register')

  // Protect all routes except public ones
  const publicRoutes = ['/', '/login', '/register']
  const isPublicRoute = publicRoutes.includes(request.nextUrl.pathname)

  if (!token && !isPublicRoute) {
    // Redirect to login if trying to access protected route without token
    return NextResponse.redirect(new URL('/login', request.url))
  }

  if (token && isAuthPage) {
    // Redirect to dashboard if trying to access auth pages while logged in
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  return NextResponse.next()
}
export const config = {
  matcher: ['/dashboard/:path*', '/profile/:path*', '/login', '/register','/profile']
};