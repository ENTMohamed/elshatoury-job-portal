import * as Yup from 'yup';

export const phoneRegExp = /^01[0-9]{9}$/;
export const nationalIdRegExp = /^[0-9]{14}$/;

export const personalInfoSchema = Yup.object({
  fullName: Yup.string()
    .required('الاسم الكامل مطلوب')
    .min(6, 'الاسم يجب أن يكون على الأقل 6 أحرف')
    .max(50, 'الاسم يجب أن لا يتجاوز 50 حرف'),
  nationalId: Yup.string()
    .required('الرقم القومي مطلوب')
    .matches(nationalIdRegExp, 'الرقم القومي يجب أن يتكون من 14 رقم'),
  phone: Yup.string()
    .required('رقم الهاتف مطلوب')
    .matches(phoneRegExp, 'رقم الهاتف يجب أن يبدأ بـ 01 ويتكون من 11 رقم'),
  address: Yup.string()
    .required('العنوان مطلوب')
    .min(10, 'العنوان يجب أن يكون على الأقل 10 أحرف'),
  educationLevel: Yup.string().required('المؤهل التعليمي مطلوب'),
  transportation: Yup.string().required('وسيلة الحركة مطلوبة'),
});

export const experienceSchema = Yup.object({
  experiences: Yup.array().of(
    Yup.object({
      pharmacyName: Yup.string().required('اسم الصيدلية مطلوب'),
      managerPhone: Yup.string()
        .required('رقم هاتف المدير مطلوب')
        .matches(phoneRegExp, 'رقم الهاتف يجب أن يبدأ بـ 01 ويتكون من 11 رقم'),
      startDate: Yup.date().required('تاريخ بدء العمل مطلوب'),
      endDate: Yup.date()
        .required('تاريخ ترك العمل مطلوب')
        .min(Yup.ref('startDate'), 'تاريخ ترك العمل يجب أن يكون بعد تاريخ البدء'),
      leavingReason: Yup.string().required('سبب ترك العمل مطلوب'),
      averageSales: Yup.number()
        .required('متوسط المبيعات مطلوب')
        .positive('يجب أن يكون رقم موجب')
        .max(1000000, 'يجب أن لا يتجاوز مليون جنيه'),
    })
  ),
});

export const fileValidation = {
  maxSize: 5 * 1024 * 1024, // 5MB

  validateFile(file: File): string | null {
    if (file.size > this.maxSize) {
      return `حجم الملف كبير جداً. الحد الأقصى المسموح به هو ${this.maxSize / (1024 * 1024)}MB`;
    }

    const allowedTypes = [
      'application/pdf',
      'image/jpeg',
      'image/jpg',
      'image/png'
    ];

    if (!allowedTypes.includes(file.type)) {
      return 'نوع الملف غير مسموح به. يرجى اختيار ملف PDF أو JPG أو PNG';
    }

    return null;
  }
}; 