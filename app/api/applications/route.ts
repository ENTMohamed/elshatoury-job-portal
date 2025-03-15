import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { verify } from 'jsonwebtoken';

export async function POST(req: Request) {
  try {
    const token = req.headers.get('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return NextResponse.json(
        { error: 'غير مصرح لك بالوصول' },
        { status: 401 }
      );
    }

    // Verify token and get user ID
    const decoded = verify(token, process.env.JWT_SECRET!) as { userId: string };
    const userId = decoded.userId;

    const { job, personalInfo, experiences } = await req.json();

    // Create application
    const application = await prisma.application.create({
      data: {
        userId,
        position: job.title,
        status: 'pending',
        licenseNumber: personalInfo.licenseNumber,
        syndicateNumber: personalInfo.syndicateNumber,
        licenseFile: personalInfo.licenseFile,
        syndicateFile: personalInfo.syndicateFile,
        graduationCertificate: personalInfo.graduationCertificate,
        resume: personalInfo.resume,
        birthDate: new Date(personalInfo.birthDate),
        address: personalInfo.address,
        experiences,
      },
    });

    return NextResponse.json(application);
  } catch (error) {
    console.error('Application submission error:', error);
    return NextResponse.json(
      { error: 'حدث خطأ أثناء إرسال الطلب' },
      { status: 500 }
    );
  }
}

export async function GET(req: Request) {
  try {
    const token = req.headers.get('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return NextResponse.json(
        { error: 'غير مصرح لك بالوصول' },
        { status: 401 }
      );
    }

    // Verify token and get user ID
    const decoded = verify(token, process.env.JWT_SECRET!) as { userId: string };
    const userId = decoded.userId;

    // Get user's applications
    const applications = await prisma.application.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(applications);
  } catch (error) {
    console.error('Get applications error:', error);
    return NextResponse.json(
      { error: 'حدث خطأ أثناء جلب الطلبات' },
      { status: 500 }
    );
  }
} 