import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import { Application } from '@/lib/models/application';
import { uploadFile } from '@/lib/upload';
import { sendEmail } from '@/lib/email';

export async function POST(request: Request) {
  try {
    await dbConnect();

    const formData = await request.formData();
    const files: Record<string, File> = {};
    const data: any = {};

    // Extract files and form data
    for (const [key, value] of formData.entries()) {
      if (value instanceof File) {
        files[key] = value;
      } else {
        data[key] = value;
      }
    }

    // Upload files to Cloudinary
    const uploadPromises = Object.entries(files).map(async ([key, file]) => {
      const url = await uploadFile(file, key);
      data[key] = url;
    });

    await Promise.all(uploadPromises);

    // Parse experiences if present
    if (data.experiences) {
      try {
        data.experiences = JSON.parse(data.experiences);
      } catch (e) {
        data.experiences = [];
      }
    }

    // Create application
    const application = new Application(data);
    
    // Calculate initial auto score
    application.calculateAutoScore();
    
    await application.save();

    // Send confirmation email
    await sendEmail(data.email, 'application_received');

    return NextResponse.json({ success: true, applicationId: application._id });
  } catch (error: any) {
    console.error('Application submission error:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: error.message || 'حدث خطأ أثناء تقديم الطلب'
      },
      { status: 400 }
    );
  }
}

export async function GET(request: Request) {
  try {
    await dbConnect();

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const job = searchParams.get('job');
    const search = searchParams.get('search');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');

    const query: any = {};
    if (status) query.status = status;
    if (job) query.selectedJob = job;
    if (search) {
      query.$or = [
        { fullName: { $regex: search, $options: 'i' } },
        { nationalId: { $regex: search, $options: 'i' } },
      ];
    }

    const total = await Application.countDocuments(query);
    const applications = await Application.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    return NextResponse.json({
      success: true,
      applications,
      pagination: {
        total,
        pages: Math.ceil(total / limit),
        page,
        limit,
      },
    });
  } catch (error: any) {
    console.error('Application fetch error:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: error.message || 'حدث خطأ أثناء جلب الطلبات'
      },
      { status: 500 }
    );
  }
} 