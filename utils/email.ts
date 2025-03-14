import nodemailer from 'nodemailer';

// In a real app, these would be in environment variables
const SMTP_CONFIG = {
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: 'your-email@gmail.com',
    pass: 'your-app-password',
  },
};

const transporter = nodemailer.createTransport(SMTP_CONFIG);

interface EmailTemplate {
  subject: string;
  text: string;
  html: string;
}

const templates = {
  applicationSubmitted: (data: {
    applicationId: string;
    fullName: string;
    selectedJob: string;
    pharmacyName: string;
  }): EmailTemplate => ({
    subject: `[صيدلية ${data.pharmacyName}] تأكيد استلام طلبك - رقم ${data.applicationId}`,
    text: `
    عزيزي/عزيزتي ${data.fullName}،

    شكرًا على تقديم طلب التوظيف لوظيفة ${data.selectedJob} لدى صيدلية ${data.pharmacyName}.
    لقد استلمنا بياناتك بنجاح برقم طلب (${data.applicationId}).

    سنقوم بمراجعة طلبك في أقرب فرصة. 
    إذا احتجنا أي معلومات إضافية، سنقوم بالتواصل معك عبر هذا البريد أو الهاتف.

    مع خالص التحية،
    فريق التوظيف
    صيدلية ${data.pharmacyName}
    `,
    html: `
    <div dir="rtl" style="font-family: Arial, sans-serif;">
      <p>عزيزي/عزيزتي ${data.fullName}،</p>
      
      <p>شكرًا على تقديم طلب التوظيف لوظيفة ${data.selectedJob} لدى صيدلية ${data.pharmacyName}.</p>
      <p>لقد استلمنا بياناتك بنجاح برقم طلب (${data.applicationId}).</p>
      
      <p>سنقوم بمراجعة طلبك في أقرب فرصة.<br>
      إذا احتجنا أي معلومات إضافية، سنقوم بالتواصل معك عبر هذا البريد أو الهاتف.</p>
      
      <p>مع خالص التحية،<br>
      فريق التوظيف<br>
      صيدلية ${data.pharmacyName}</p>
    </div>
    `,
  }),

  needsRevision: (data: {
    applicationId: string;
    fullName: string;
    selectedJob: string;
    pharmacyName: string;
    revisionNotes: string;
    revisionLink: string;
  }): EmailTemplate => ({
    subject: `[صيدلية ${data.pharmacyName}] مطلوب تعديل على طلب التوظيف - رقم ${data.applicationId}`,
    text: `
    عزيزي/عزيزتي ${data.fullName}،

    بعد مراجعة طلبك لوظيفة ${data.selectedJob} في صيدلية ${data.pharmacyName}،
    نحتاج إلى بعض التعديلات على بياناتك أو ملفاتك.

    السبب: 
    ${data.revisionNotes}

    برجاء زيارة الرابط التالي لإجراء التعديل وإعادة إرسال الطلب:
    ${data.revisionLink}

    شكراً لتفهمك.

    إدارة الموارد البشرية
    صيدلية ${data.pharmacyName}
    `,
    html: `
    <div dir="rtl" style="font-family: Arial, sans-serif;">
      <p>عزيزي/عزيزتي ${data.fullName}،</p>
      
      <p>بعد مراجعة طلبك لوظيفة ${data.selectedJob} في صيدلية ${data.pharmacyName}،<br>
      نحتاج إلى بعض التعديلات على بياناتك أو ملفاتك.</p>
      
      <p><strong>السبب:</strong><br>
      ${data.revisionNotes}</p>
      
      <p>برجاء زيارة الرابط التالي لإجراء التعديل وإعادة إرسال الطلب:<br>
      <a href="${data.revisionLink}">${data.revisionLink}</a></p>
      
      <p>شكراً لتفهمك.</p>
      
      <p>إدارة الموارد البشرية<br>
      صيدلية ${data.pharmacyName}</p>
    </div>
    `,
  }),

  rejected: (data: {
    applicationId: string;
    fullName: string;
    selectedJob: string;
    pharmacyName: string;
  }): EmailTemplate => ({
    subject: `[صيدلية ${data.pharmacyName}] إشعار رفض طلب التوظيف - رقم ${data.applicationId}`,
    text: `
    عزيزي/عزيزتي ${data.fullName}،

    نشكر لك اهتمامك بالتقدم لوظيفة ${data.selectedJob} لدى صيدلية ${data.pharmacyName}.
    بعد مراجعة بياناتك، نأسف لإبلاغك بأنه لم يتم قبول طلبك في الوقت الحالي.

    نُقدِّر وقتك ونأمل أن تظل متابعاً لفرص مستقبلية.
    مع تمنياتنا لك بالتوفيق.

    إدارة الموارد البشرية
    صيدلية ${data.pharmacyName}
    `,
    html: `
    <div dir="rtl" style="font-family: Arial, sans-serif;">
      <p>عزيزي/عزيزتي ${data.fullName}،</p>
      
      <p>نشكر لك اهتمامك بالتقدم لوظيفة ${data.selectedJob} لدى صيدلية ${data.pharmacyName}.</p>
      <p>بعد مراجعة بياناتك، نأسف لإبلاغك بأنه لم يتم قبول طلبك في الوقت الحالي.</p>
      
      <p>نُقدِّر وقتك ونأمل أن تظل متابعاً لفرص مستقبلية.<br>
      مع تمنياتنا لك بالتوفيق.</p>
      
      <p>إدارة الموارد البشرية<br>
      صيدلية ${data.pharmacyName}</p>
    </div>
    `,
  }),

  accepted: (data: {
    applicationId: string;
    fullName: string;
    selectedJob: string;
    pharmacyName: string;
    pharmacyPhone: string;
  }): EmailTemplate => ({
    subject: `[صيدلية ${data.pharmacyName}] تهانينا! قبول طلب التوظيف - رقم ${data.applicationId}`,
    text: `
    عزيزي/عزيزتي ${data.fullName}،

    يسرنا إبلاغك بأنه تم قبول طلبك لوظيفة ${data.selectedJob} لدى صيدلية ${data.pharmacyName} مبدئيًا!
    سنتواصل معك قريبًا عبر الهاتف أو البريد لتنسيق الخطوات النهائية.

    تهانينا، ونتطلع للعمل معك قريبًا!

    إدارة الموارد البشرية
    صيدلية ${data.pharmacyName}
    هاتف: ${data.pharmacyPhone}
    `,
    html: `
    <div dir="rtl" style="font-family: Arial, sans-serif;">
      <p>عزيزي/عزيزتي ${data.fullName}،</p>
      
      <p>يسرنا إبلاغك بأنه تم قبول طلبك لوظيفة ${data.selectedJob} لدى صيدلية ${data.pharmacyName} مبدئيًا!</p>
      <p>سنتواصل معك قريبًا عبر الهاتف أو البريد لتنسيق الخطوات النهائية.</p>
      
      <p>تهانينا، ونتطلع للعمل معك قريبًا!</p>
      
      <p>إدارة الموارد البشرية<br>
      صيدلية ${data.pharmacyName}<br>
      هاتف: ${data.pharmacyPhone}</p>
    </div>
    `,
  }),
};

export async function sendEmail(
  to: string,
  template: keyof typeof templates,
  data: Parameters<typeof templates[typeof template]>[0]
) {
  const emailTemplate = templates[template](data as any);

  try {
    await transporter.sendMail({
      from: SMTP_CONFIG.auth.user,
      to,
      subject: emailTemplate.subject,
      text: emailTemplate.text,
      html: emailTemplate.html,
    });
    return true;
  } catch (error) {
    console.error('Error sending email:', error);
    return false;
  }
} 