import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  // Only run middleware on admin routes
  if (!request.nextUrl.pathname.startsWith('/admin')) {
    return NextResponse.next();
  }

  // Skip middleware for login page and API routes
  if (request.nextUrl.pathname === '/admin/login' || request.nextUrl.pathname.startsWith('/api/')) {
    return NextResponse.next();
  }

  const token = request.cookies.get('adminToken');

  if (!token) {
    return NextResponse.redirect(new URL('/admin/login', request.url));
  }

  // Let the API handle token verification
  const verifyResponse = await fetch(new URL('/api/auth/verify', request.url), {
    headers: {
      Cookie: `adminToken=${token.value}`
    }
  });

  if (!verifyResponse.ok) {
    return NextResponse.redirect(new URL('/admin/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*']
}; 