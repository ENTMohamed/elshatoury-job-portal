'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import ProgressBar from '../../components/ProgressBar';
import FileUpload from '../../components/FileUpload';
import { toast } from 'react-hot-toast';

const steps = [
  {
    title: 'اختيار الوظيفة',
    description: 'حدد الوظيفة التي تريد التقدم لها',
  },
  {
    title: 'متطلبات إضافية',
    description: 'أدخل المتطلبات الإضافية للوظيفة',
  },
  {
    title: 'البيانات الشخصية',
    description: 'أدخل معلوماتك الشخصية',
  },
  {
    title: 'الخبرات',
    description: 'أضف خبراتك السابقة',
  },
  {
    title: 'المراجعة',
    description: 'راجع بياناتك قبل الإرسال',
  },
];

const educationLevels = [
  { id: 'none', title: 'لا يوجد' },
  { id: 'diploma', title: 'دبلوم' },
  { id: 'bachelor', title: 'بكالوريوس' },
  { id: 'master', title: 'ماجستير' },
  { id: 'phd', title: 'دكتوراه' },
];

const transportationMeans = [
  { id: 'car', title: 'سيارة' },
  { id: 'motorcycle', title: 'دراجة نارية' },
  { id: 'bicycle', title: 'دراجة هوائية' },
  { id: 'public', title: 'مواصلات عامة' },
  { id: 'none', title: 'لا توجد' },
];

const validationSchema = Yup.object({
  fullName: Yup.string()
    .required('الاسم الكامل مطلوب')
    .max(100, 'الاسم يجب أن لا يتجاوز 100 حرف'),
  nationalId: Yup.string()
    .required('الرقم القومي مطلوب')
    .matches(/^[0-9]{14}$/, 'الرقم القومي يجب أن يتكون من 14 رقم'),
  educationLevel: Yup.string().required('المؤهل التعليمي مطلوب'),
  address: Yup.string().required('عنوان السكن مطلوب'),
  transportation: Yup.string().required('وسيلة الحركة مطلوبة'),
});

interface FileState {
  nationalIdFront: File | null;
  nationalIdBack: File | null;
  educationCertificate: File | null;
  cv: File | null;
  criminalRecord: File | null;
}

export default function PersonalInfoPage() {
  const router = useRouter();
  const [selectedJob, setSelectedJob] = useState<any>(null);
  const [files, setFiles] = useState<FileState>({
    nationalIdFront: null,
    nationalIdBack: null,
    educationCertificate: null,
    cv: null,
    criminalRecord: null,
  });
  const [fileErrors, setFileErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    const jobData = localStorage.getItem('selectedJob');
    if (!jobData) {
      router.push('/apply');
      return;
    }

    const job = JSON.parse(jobData);
    setSelectedJob(job);

    // If pharmacist, check for required files
    if (job.id === 'pharmacist') {
      const pharmacistFiles = localStorage.getItem('pharmacistFiles');
      if (!pharmacistFiles) {
        router.push('/apply/pharmacist-requirements');
        return;
      }
    }
  }, [router]);

  const validateFiles = () => {
    const errors: Record<string, string> = {};
    
    // Always required files
    if (!files.nationalIdFront) {
      errors.nationalIdFront = 'صورة وجه البطاقة مطلوبة';
    }
    if (!files.nationalIdBack) {
      errors.nationalIdBack = 'صورة ظهر البطاقة مطلوبة';
    }
    if (!files.cv) {
      errors.cv = 'السيرة الذاتية مطلوبة';
    }
    
    // Education certificate is required if education level is not 'none'
    if (formik.values.educationLevel !== 'none' && !files.educationCertificate) {
      errors.educationCertificate = 'شهادة المؤهل مطلوبة';
    }

    setFileErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const formik = useFormik({
    initialValues: {
      fullName: '',
      nationalId: '',
      educationLevel: '',
      address: '',
      transportation: '',
    },
    validationSchema,
    onSubmit: async (values) => {
      // Validate files first
      if (!validateFiles()) {
        // Show error toast
        toast.error('يرجى رفع جميع المستندات المطلوبة');
        return;
      }

      // Get pharmacist files if applicable
      let allFiles = { ...files };
      if (selectedJob?.id === 'pharmacist') {
        const pharmacistFiles = JSON.parse(localStorage.getItem('pharmacistFiles') || '{}');
        allFiles = { ...allFiles, ...pharmacistFiles };
      }

      // Store form data and file metadata
      const fileMetadata = Object.entries(allFiles).reduce((acc, [key, file]) => {
        if (file instanceof File) {
          acc[key] = {
            name: file.name,
            type: file.type,
            size: file.size,
            lastModified: file.lastModified
          };
        }
        return acc;
      }, {} as Record<string, { name: string; type: string; size: number; lastModified: number }>);

      localStorage.setItem('personalInfo', JSON.stringify({
        ...values,
        files: fileMetadata
      }));

      // Store file data in sessionStorage
      try {
        const fileData = await Promise.all(
          Object.entries(allFiles).map(async ([key, file]) => {
            if (file instanceof File) {
              const arrayBuffer = await file.arrayBuffer();
              return [key, {
                name: file.name,
                type: file.type,
                lastModified: file.lastModified,
                data: Array.from(new Uint8Array(arrayBuffer))
              }];
            }
            return [key, null];
          })
        );

        const existingFiles = JSON.parse(sessionStorage.getItem('applicationFiles') || '{}');
        sessionStorage.setItem('applicationFiles', JSON.stringify({
          ...existingFiles,
          ...Object.fromEntries(fileData)
        }));

        router.push('/apply/experience');
      } catch (error) {
        console.error('Error storing files:', error);
        toast.error('حدث خطأ أثناء حفظ الملفات');
      }
    },
  });

  const handleFileChange = (field: string) => (file: File | null) => {
    setFiles((prev) => ({ ...prev, [field]: file }));
    // Clear error when file is uploaded
    if (file) {
      setFileErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

  if (!selectedJob) return null;

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-3xl mx-auto">
        <ProgressBar currentStep={2} totalSteps={5} steps={steps} />

        <div className="mt-10 bg-white shadow-sm rounded-lg p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">البيانات الشخصية</h2>

          <form onSubmit={formik.handleSubmit} className="space-y-6">
            {/* Full Name */}
            <div>
              <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">
                الاسم الكامل
              </label>
              <input
                type="text"
                id="fullName"
                {...formik.getFieldProps('fullName')}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
              {formik.touched.fullName && formik.errors.fullName && (
                <p className="mt-1 text-sm text-red-600">{formik.errors.fullName}</p>
              )}
            </div>

            {/* National ID */}
            <div>
              <label htmlFor="nationalId" className="block text-sm font-medium text-gray-700">
                الرقم القومي
              </label>
              <input
                type="text"
                id="nationalId"
                {...formik.getFieldProps('nationalId')}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
              {formik.touched.nationalId && formik.errors.nationalId && (
                <p className="mt-1 text-sm text-red-600">{formik.errors.nationalId}</p>
              )}
            </div>

            {/* National ID Files */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <FileUpload
                  label="صورة وجه البطاقة"
                  name="nationalIdFront"
                  accept=".jpg,.jpeg,.png"
                  maxSize={2}
                  onChange={handleFileChange('nationalIdFront')}
                  required
                  error={fileErrors.nationalIdFront}
                />
              </div>
              <div>
                <FileUpload
                  label="صورة ظهر البطاقة"
                  name="nationalIdBack"
                  accept=".jpg,.jpeg,.png"
                  maxSize={2}
                  onChange={handleFileChange('nationalIdBack')}
                  required
                  error={fileErrors.nationalIdBack}
                />
              </div>
            </div>

            {/* Education Level */}
            <div>
              <label htmlFor="educationLevel" className="block text-sm font-medium text-gray-700">
                المؤهل التعليمي
              </label>
              <select
                id="educationLevel"
                {...formik.getFieldProps('educationLevel')}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="">اختر المؤهل</option>
                {educationLevels.map((level) => (
                  <option key={level.id} value={level.id}>
                    {level.title}
                  </option>
                ))}
              </select>
              {formik.touched.educationLevel && formik.errors.educationLevel && (
                <p className="mt-1 text-sm text-red-600">{formik.errors.educationLevel}</p>
              )}
            </div>

            {/* Education Certificate */}
            {formik.values.educationLevel !== 'none' && (
              <div>
                <FileUpload
                  label="شهادة المؤهل"
                  name="educationCertificate"
                  accept=".pdf,.jpg,.jpeg,.png"
                  maxSize={2}
                  onChange={handleFileChange('educationCertificate')}
                  required
                  error={fileErrors.educationCertificate}
                />
              </div>
            )}

            {/* CV */}
            <div>
              <FileUpload
                label="السيرة الذاتية"
                name="cv"
                accept=".pdf,.doc,.docx"
                maxSize={5}
                onChange={handleFileChange('cv')}
                required
                error={fileErrors.cv}
              />
            </div>

            {/* Criminal Record */}
            <div>
              <FileUpload
                label="صحيفة الحالة الجنائية"
                name="criminalRecord"
                accept=".jpg,.jpeg,.png,.pdf"
                maxSize={5}
                onChange={handleFileChange('criminalRecord')}
                required
                error={fileErrors.criminalRecord}
              />
            </div>

            {/* Address */}
            <div>
              <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                عنوان السكن
              </label>
              <input
                type="text"
                id="address"
                {...formik.getFieldProps('address')}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
              {formik.touched.address && formik.errors.address && (
                <p className="mt-1 text-sm text-red-600">{formik.errors.address}</p>
              )}
            </div>

            {/* Transportation */}
            <div>
              <label htmlFor="transportation" className="block text-sm font-medium text-gray-700">
                وسيلة الحركة
              </label>
              <select
                id="transportation"
                {...formik.getFieldProps('transportation')}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="">اختر وسيلة الحركة</option>
                {transportationMeans.map((means) => (
                  <option key={means.id} value={means.id}>
                    {means.title}
                  </option>
                ))}
              </select>
              {formik.touched.transportation && formik.errors.transportation && (
                <p className="mt-1 text-sm text-red-600">{formik.errors.transportation}</p>
              )}
            </div>

            {/* Submit Button */}
            <div>
              <button
                type="submit"
                className="w-full bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                متابعة
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
} 