'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import ProgressBar from '../../components/ProgressBar';
import FileUpload from '../../components/FileUpload';

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
  graduationCert: File | null;
  practiceLicense: File | null;
  unionCard: File | null;
}

export default function PharmacistRequirementsPage() {
  const router = useRouter();
  const [selectedJob, setSelectedJob] = useState<any>(null);
  const [files, setFiles] = useState<FileState>({
    graduationCert: null,
    practiceLicense: null,
    unionCard: null,
  });
  const [isValid, setIsValid] = useState(false);

  useEffect(() => {
    const jobData = localStorage.getItem('selectedJob');
    if (!jobData) {
      router.push('/apply');
      return;
    }
    const job = JSON.parse(jobData);
    if (job.id !== 'pharmacist') {
      router.push('/apply/personal-info');
      return;
    }
    setSelectedJob(job);
  }, [router]);

  useEffect(() => {
    // Check if all required files are uploaded
    setIsValid(
      files.graduationCert !== null &&
      files.practiceLicense !== null &&
      files.unionCard !== null
    );
  }, [files]);

  const handleFileChange = (field: string) => (file: File | null) => {
    setFiles((prev) => ({ ...prev, [field]: file }));
  };

  const handleContinue = async () => {
    if (!isValid) return;

    // Store file metadata in localStorage
    const fileMetadata = Object.entries(files).reduce((acc, [key, file]) => {
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

    localStorage.setItem('pharmacistFiles', JSON.stringify({
      ph_graduation_cert: fileMetadata.graduationCert,
      ph_practice_license: fileMetadata.practiceLicense,
      ph_union_card: fileMetadata.unionCard,
    }));

    // Store file data in sessionStorage
    const fileData = await Promise.all(
      Object.entries(files).map(async ([key, file]) => {
        if (file instanceof File) {
          const arrayBuffer = await file.arrayBuffer();
          const mappedKey = {
            graduationCert: 'ph_graduation_cert',
            practiceLicense: 'ph_practice_license',
            unionCard: 'ph_union_card'
          }[key];
          return [mappedKey, {
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
      ...Object.fromEntries(fileData.filter(([key]) => key))
    }));

    // Continue to personal info page
    router.push('/apply/personal-info');
  };

  if (!selectedJob) return null;

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-3xl mx-auto">
        <ProgressBar currentStep={1} totalSteps={5} steps={steps} />

        <div className="mt-10 bg-white shadow-sm rounded-lg p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">متطلبات وظيفة الصيدلي</h2>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                شهادة التخرج
              </label>
              <FileUpload
                label="شهادة التخرج"
                accept=".pdf,.jpg,.jpeg,.png"
                maxSize={2 * 1024 * 1024} // 2MB
                onChange={handleFileChange('graduationCert')}
                required
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
                accept=".pdf,.jpg,.jpeg,.png"
                maxSize={2 * 1024 * 1024}
                onChange={handleFileChange('practiceLicense')}
                required
              />
              <p className="mt-1 text-sm text-gray-500">
                يرجى رفع صورة واضحة من شهادة مزاولة المهنة (PDF أو صورة)
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                كارنيه النقابة
              </label>
              <FileUpload
                label="كارنيه النقابة"
                accept=".pdf,.jpg,.jpeg,.png"
                maxSize={2 * 1024 * 1024}
                onChange={handleFileChange('unionCard')}
                required
              />
              <p className="mt-1 text-sm text-gray-500">
                يرجى رفع صورة واضحة من كارنيه النقابة (PDF أو صورة)
              </p>
            </div>
          </div>

          <div className="mt-6">
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
  );
} 