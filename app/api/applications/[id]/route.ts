import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import { Application } from '@/lib/models/application';
import { sendEmail } from '@/lib/email';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();
    const application = await Application.findById(params.id);

    if (!application) {
      return NextResponse.json(
        { success: false, message: 'Application not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, application });
  } catch (error: any) {
    console.error('Application fetch error:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Error fetching application' },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();
    const body = await request.json();
    const application = await Application.findById(params.id);

    if (!application) {
      return NextResponse.json(
        { success: false, message: 'Application not found' },
        { status: 404 }
      );
    }

    // Update status if provided
    if (body.status) {
      application.changeStatus(body.status, body.note);

      // Send email notification based on status
      switch (body.status) {
        case 'accepted':
          await sendEmail(application.email, 'application_accepted');
          break;
        case 'rejected':
          await sendEmail(application.email, 'application_rejected');
          break;
        case 'needs_revision':
          await sendEmail(application.email, 'revision_needed', { notes: body.note });
          break;
      }
    }

    // Update manual score if provided
    if (typeof body.manualScore === 'number') {
      application.manualScore = body.manualScore;
      application.calculateAutoScore(); // This will also update total score
    }

    // Update admin notes if provided
    if (body.adminNotes) {
      application.adminNotes = body.adminNotes;
    }

    await application.save();

    return NextResponse.json({ success: true, application });
  } catch (error: any) {
    console.error('Application update error:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Error updating application' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();
    const application = await Application.findByIdAndDelete(params.id);

    if (!application) {
      return NextResponse.json(
        { success: false, message: 'Application not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, message: 'Application deleted successfully' });
  } catch (error: any) {
    console.error('Application deletion error:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Error deleting application' },
      { status: 500 }
    );
  }
} 