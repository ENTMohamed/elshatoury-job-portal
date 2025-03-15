import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verify } from 'jsonwebtoken';

export async function middleware(request: NextRequest) {
  const token = request.headers.get('Authorization')?.replace('Bearer ', '');

  // Public paths that don't require authentication
  const publicPaths = [
    '/api/auth/login',
    '/api/auth/register',
    '/',
    '/apply',
    '/apply/success',
  ];

  const isPublicPath = publicPaths.some(path => 
    request.nextUrl.pathname.startsWith(path)
  );

  if (isPublicPath) {
    return NextResponse.next();
  }

  if (!token) {
    return NextResponse.json(
      { error: 'غير مصرح لك بالوصول' },
      { status: 401 }
    );
  }

  try {
    const decoded = verify(token, process.env.JWT_SECRET!);
    const response = NextResponse.next();
    response.headers.set('X-User-ID', (decoded as any).userId);
    return response;
  } catch (error) {
    return NextResponse.json(
      { error: 'غير مصرح لك بالوصول' },
      { status: 401 }
    );
  }
}

export const config = {
  matcher: [
    '/api/applications/:path*',
    '/apply/personal-info/:path*',
    '/apply/experience/:path*',
    '/apply/review/:path*',
    '/apply/pharmacist-requirements/:path*',
  ],
}; 