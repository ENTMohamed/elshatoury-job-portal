import { NextResponse } from 'next/server';
import { sendEmail } from '@/lib/email';

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    await sendEmail(email, 'application_received');

    return NextResponse.json({
      success: true,
      message: 'Test email sent successfully'
    });
  } catch (error: any) {
    console.error('Test email error:', error);
    return NextResponse.json({
      success: false,
      message: error.message || 'Error sending test email'
    }, { status: 500 });
  }
} 