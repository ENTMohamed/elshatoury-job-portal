import { NextResponse } from 'next/server';
import { verify } from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET!;

export async function GET(request: Request) {
  try {
    const token = request.headers.get('Cookie')?.split(';')
      .find(c => c.trim().startsWith('adminToken='))
      ?.split('=')[1];

    if (!token) {
      return NextResponse.json({ isAuthenticated: false }, { status: 401 });
    }

    const decoded = verify(token, JWT_SECRET);
    return NextResponse.json({ isAuthenticated: true, user: decoded });
  } catch (error) {
    return NextResponse.json({ isAuthenticated: false }, { status: 401 });
  }
} 