import { NextResponse } from 'next/server';
import { z } from 'zod';
import { sign } from 'jsonwebtoken';

const loginSchema = z.object({
  username: z.string(),
  password: z.string()
});

// In a real app, this would be in a secure environment variable
const JWT_SECRET = process.env.JWT_SECRET!;

// In a real app, these would be in a database with properly hashed passwords
const ADMIN_CREDENTIALS = {
  username: process.env.ADMIN_USERNAME || 'admin',
  password: process.env.ADMIN_PASSWORD || 'Elshatoury2024!@#'
};

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { username, password } = loginSchema.parse(body);

    if (
      username === ADMIN_CREDENTIALS.username && 
      password === ADMIN_CREDENTIALS.password
    ) {
      // Generate JWT token
      const token = sign(
        { username, role: 'admin' },
        JWT_SECRET,
        { expiresIn: '24h' }
      );

      // Create response with success message
      const response = NextResponse.json({ success: true });

      // Set HTTP-only cookie
      response.cookies.set({
        name: 'adminToken',
        value: token,
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 60 * 60 * 24 // 24 hours
      });

      return response;
    }

    return NextResponse.json({
      success: false,
      message: 'بيانات الدخول غير صحيحة'
    }, { status: 401 });

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({
        success: false,
        errors: error.errors
      }, { status: 400 });
    }

    return NextResponse.json({
      success: false,
      message: 'حدث خطأ في الخادم'
    }, { status: 500 });
  }
} 