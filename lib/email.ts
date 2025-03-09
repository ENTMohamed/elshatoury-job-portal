import sgMail from '@sendgrid/mail';

if (!process.env.SENDGRID_API_KEY) {
  throw new Error('SENDGRID_API_KEY is not defined');
}

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

type EmailTemplate = 'application_received' | 'application_accepted' | 'application_rejected' | 'revision_needed';

const templates: Record<EmailTemplate, { subject: string; text: string; html: string }> = {
  application_received: {
    subject: 'تم استلام طلبك - الشاطوري',
    text: `شكراً لتقديمك على وظيفة في الشاطوري.
    
تم استلام طلبك وسيتم مراجعته في أقرب وقت.
سنقوم بإخطارك بأي تحديثات عبر البريد الإلكتروني.

مع تحيات فريق التوظيف
الشاطوري`,
    html: `
    <div dir="rtl" style="font-family: Arial, sans-serif; line-height: 1.6;">
      <h2 style="color: #2563eb;">شكراً لتقديمك على وظيفة في الشاطوري</h2>
      <p>تم استلام طلبك وسيتم مراجعته في أقرب وقت.</p>
      <p>سنقوم بإخطارك بأي تحديثات عبر البريد الإلكتروني.</p>
      <br/>
      <p>مع تحيات فريق التوظيف</p>
      <p style="font-weight: bold; color: #2563eb;">الشاطوري</p>
    </div>`
  },
  application_accepted: {
    subject: 'تهانينا! تم قبول طلبك - الشاطوري',
    text: `تهانينا!

يسعدنا إخبارك بأنه تم قبول طلبك للوظيفة.
سيقوم فريقنا بالتواصل معك قريباً لإكمال الإجراءات.

مع تحيات فريق التوظيف
الشاطوري`,
    html: `
    <div dir="rtl" style="font-family: Arial, sans-serif; line-height: 1.6;">
      <h2 style="color: #16a34a;">تهانينا! 🎉</h2>
      <p>يسعدنا إخبارك بأنه تم قبول طلبك للوظيفة.</p>
      <p>سيقوم فريقنا بالتواصل معك قريباً لإكمال الإجراءات.</p>
      <br/>
      <p>مع تحيات فريق التوظيف</p>
      <p style="font-weight: bold; color: #2563eb;">الشاطوري</p>
    </div>`
  },
  application_rejected: {
    subject: 'تحديث بخصوص طلبك - الشاطوري',
    text: `عزيزي المتقدم،

نشكرك على اهتمامك بالانضمام إلى فريق الشاطوري.
نأسف لإخبارك بأنه تم رفض طلبك في هذه المرحلة.

نتمنى لك التوفيق في مساعيك المستقبلية.

مع تحيات فريق التوظيف
الشاطوري`,
    html: `
    <div dir="rtl" style="font-family: Arial, sans-serif; line-height: 1.6;">
      <h2>عزيزي المتقدم،</h2>
      <p>نشكرك على اهتمامك بالانضمام إلى فريق الشاطوري.</p>
      <p>نأسف لإخبارك بأنه تم رفض طلبك في هذه المرحلة.</p>
      <p>نتمنى لك التوفيق في مساعيك المستقبلية.</p>
      <br/>
      <p>مع تحيات فريق التوظيف</p>
      <p style="font-weight: bold; color: #2563eb;">الشاطوري</p>
    </div>`
  },
  revision_needed: {
    subject: 'مطلوب تعديلات على طلبك - الشاطوري',
    text: `عزيزي المتقدم،

بعد مراجعة طلبك، نحتاج إلى بعض التعديلات.
يرجى مراجعة التعليقات وتحديث طلبك.

NOTES_PLACEHOLDER

مع تحيات فريق التوظيف
الشاطوري`,
    html: `
    <div dir="rtl" style="font-family: Arial, sans-serif; line-height: 1.6;">
      <h2 style="color: #ea580c;">عزيزي المتقدم،</h2>
      <p>بعد مراجعة طلبك، نحتاج إلى بعض التعديلات.</p>
      <p>يرجى مراجعة التعليقات التالية وتحديث طلبك:</p>
      <div style="background-color: #fff7ed; border-right: 4px solid #ea580c; padding: 1rem; margin: 1rem 0;">
        NOTES_PLACEHOLDER
      </div>
      <br/>
      <p>مع تحيات فريق التوظيف</p>
      <p style="font-weight: bold; color: #2563eb;">الشاطوري</p>
    </div>`
  }
};

export async function sendEmail(to: string, template: EmailTemplate, customData?: { notes?: string }) {
  const emailData = templates[template];
  let text = emailData.text;
  let html = emailData.html;

  if (template === 'revision_needed' && customData?.notes) {
    text = text.replace('NOTES_PLACEHOLDER', customData.notes);
    html = html.replace('NOTES_PLACEHOLDER', customData.notes);
  }

  const msg = {
    to,
    from: {
      email: process.env.EMAIL_FROM!,
      name: process.env.EMAIL_FROM_NAME!
    },
    subject: emailData.subject,
    text,
    html,
  };

  try {
    await sgMail.send(msg);
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
} 