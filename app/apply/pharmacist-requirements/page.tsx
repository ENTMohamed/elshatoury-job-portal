'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import FileUpload from '../../components/FileUpload';
import ProgressBar from '../../components/ProgressBar';
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

interface FileState {
  graduationCertificate: File | null;
  licenseCertificate: File | null;
  medicalCertificate: File | null;
}

export default function PharmacistRequirementsPage() {
  const router = useRouter();
  const [files, setFiles] = useState<FileState>({
    graduationCertificate: null,
    licenseCertificate: null,
    medicalCertificate: null,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isValid, setIsValid] = useState(false);

  useEffect(() => {
    const jobData = localStorage.getItem('selectedJob');
    if (!jobData || JSON.parse(jobData).id !== 'pharmacist') {
      router.push('/apply');
      return;
    }
  }, [router]);

  useEffect(() => {
    setIsValid(
      files.graduationCertificate !== null &&
      files.licenseCertificate !== null &&
      files.medicalCertificate !== null
    );
  }, [files]);

  const handleFileChange = (field: keyof FileState) => (file: File | null) => {
    setFiles(prev => ({ ...prev, [field]: file }));
    if (file) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateFiles = () => {
    const newErrors: Record<string, string> = {};
    
    if (!files.graduationCertificate) {
      newErrors.graduationCertificate = 'شهادة التخرج مطلوبة';
    }
    if (!files.licenseCertificate) {
      newErrors.licenseCertificate = 'شهادة مزاولة المهنة مطلوبة';
    }
    if (!files.medicalCertificate) {
      newErrors.medicalCertificate = 'شهادة الكشف الطبي مطلوبة';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleContinue = async () => {
    if (!validateFiles()) {
      toast.error('يرجى رفع جميع المستندات المطلوبة');
      return;
    }

    try {
      // Store files in sessionStorage
      const fileData = await Promise.all(
        Object.entries(files).map(async ([key, file]) => {
          if (file instanceof File) {
            const arrayBuffer = await file.arrayBuffer();
            return [key, {
              name: file.name,
              type: file.type,
              lastModified: file.lastModified,
              data: Array.from(new Uint8Array(arrayBuffer))
            }] as const;
          }
          return [key, null] as const;
        })
      );

      localStorage.setItem('pharmacistFiles', JSON.stringify(
        Object.fromEntries(fileData.map(([key, value]) => [
          key,
          value ? {
            name: value.name,
            type: value.type,
            size: value.data.length,
            lastModified: value.lastModified
          } : null
        ]))
      ));

      const existingFiles = JSON.parse(sessionStorage.getItem('applicationFiles') || '{}');
      sessionStorage.setItem('applicationFiles', JSON.stringify({
        ...existingFiles,
        ...Object.fromEntries(fileData)
      }));

      router.push('/apply/personal-info');
    } catch (error) {
      console.error('Error storing files:', error);
      toast.error('حدث خطأ أثناء حفظ الملفات');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-3xl mx-auto">
        <ProgressBar currentStep={1} totalSteps={5} steps={steps} />

        <div className="mt-10 bg-white shadow-sm rounded-lg p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">متطلبات الصيدلي</h2>
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                شهادة التخرج
              </label>
              <FileUpload
                label="شهادة التخرج"
                name="graduationCertificate"
                accept=".pdf,.jpg,.jpeg,.png"
                maxSize={2 * 1024 * 1024} // 2MB
                onChange={handleFileChange('graduationCertificate')}
                required
                error={errors.graduationCertificate}
              />
              <p className="mt-1 text-sm text-gray-500">
                يرجى رفع صورة واضحة من شهادة التخرج (PDF أو صورة)
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                شهادة مزاولة المهنة
              </label>
              <FileUpload
                label="شهادة مزاولة المهنة"
                name="licenseCertificate"
                accept=".pdf,.jpg,.jpeg,.png"
                maxSize={2 * 1024 * 1024} // 2MB
                onChange={handleFileChange('licenseCertificate')}
                required
                error={errors.licenseCertificate}
              />
              <p className="mt-1 text-sm text-gray-500">
                يرجى رفع صورة واضحة من شهادة مزاولة المهنة (PDF أو صورة)
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                شهادة الكشف الطبي
              </label>
              <FileUpload
                label="شهادة الكشف الطبي"
                name="medicalCertificate"
                accept=".pdf,.jpg,.jpeg,.png"
                maxSize={2 * 1024 * 1024} // 2MB
                onChange={handleFileChange('medicalCertificate')}
                required
                error={errors.medicalCertificate}
              />
              <p className="mt-1 text-sm text-gray-500">
                يرجى رفع صورة واضحة من شهادة الكشف الطبي (PDF أو صورة)
              </p>
            </div>

            <div>
              <button
                onClick={handleContinue}
                disabled={!isValid}
                className={`w-full px-4 py-2 rounded-md text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                  isValid
                    ? 'bg-blue-600 text-white hover:bg-blue-700'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                متابعة
              </button>
              {!isValid && (
                <p className="mt-2 text-sm text-red-600">
                  يرجى رفع جميع المستندات المطلوبة للمتابعة
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}