'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import ProgressBar from '../../components/ProgressBar';
import { DocumentIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

const steps = [
  {
    title: 'اختيار الوظيفة',
    description: 'حدد الوظيفة التي تريد التقدم لها',
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

export default function ReviewPage() {
  const router = useRouter();
  const [formData, setFormData] = useState<any>({
    job: null,
    personalInfo: null,
    experiences: null,
  });
  const [submitting, setSubmitting] = useState(false);
  const [currentStep, setCurrentStep] = useState(4);

  useEffect(() => {
    const job = localStorage.getItem('selectedJob');
    const personalInfo = localStorage.getItem('personalInfo');
    const experiences = localStorage.getItem('experiences');

    if (!job || !personalInfo || !experiences) {
      router.push('/apply');
      return;
    }

    const jobData = JSON.parse(job);
    setFormData({
      job: jobData,
      personalInfo: JSON.parse(personalInfo),
      experiences: JSON.parse(experiences),
    });

    // Set correct step based on job type
    if (jobData.id === 'pharmacist') {
      setCurrentStep(4);
    } else {
      setCurrentStep(3);
    }
  }, [router]);

  const handleEdit = (section: string) => {
    switch (section) {
      case 'job':
        router.push('/apply');
        break;
      case 'personal':
        router.push('/apply/personal-info');
        break;
      case 'experience':
        router.push('/apply/experience');
        break;
    }
  };

  const handleSubmit = async () => {
    if (submitting) return;

    try {
      setSubmitting(true);
      const loadingToast = toast.loading('جاري تقديم الطلب...');

      // Create FormData object
      const submitFormData = new FormData();

      // Add basic form data
      submitFormData.append('fullName', formData.personalInfo.fullName);
      submitFormData.append('nationalId', formData.personalInfo.nationalId);
      submitFormData.append('educationLevel', formData.personalInfo.educationLevel);
      submitFormData.append('address', formData.personalInfo.address);
      submitFormData.append('transportation', formData.personalInfo.transportation);
      submitFormData.append('selectedJob', formData.job.id);
      
      // Get files from sessionStorage
      const storedFiles = JSON.parse(sessionStorage.getItem('applicationFiles') || '{}');
      
      // Add files
      for (const [key, fileData] of Object.entries(storedFiles)) {
        const typedFileData = fileData as { data: number[]; type: string; name: string; lastModified?: number };
        if (typedFileData && Array.isArray(typedFileData.data)) {
          try {
            // Reconstruct the file from stored data
            const uint8Array = new Uint8Array(typedFileData.data);
            const blob = new Blob([uint8Array], { type: typedFileData.type });
            const file = new File([blob], typedFileData.name, {
              type: typedFileData.type,
              lastModified: typedFileData.lastModified || Date.now()
            });
            submitFormData.append(key, file);
          } catch (error) {
            console.error(`Error processing file ${key}:`, error);
            toast.dismiss(loadingToast);
            toast.error('حدث خطأ في معالجة الملفات');
            return;
          }
        }
      }

      // Add experiences
      if (formData.experiences && formData.experiences.experiences.length > 0) {
        submitFormData.append('experiences', JSON.stringify(formData.experiences.experiences));
      }

      // Submit to backend
      const response = await fetch('/api/applications', {
        method: 'POST',
        body: submitFormData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'حدث خطأ أثناء تقديم الطلب');
      }

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.message || 'حدث خطأ أثناء تقديم الطلب');
      }

      // Show success message
      toast.dismiss(loadingToast);
      toast.success('تم تقديم طلبك بنجاح! سنتواصل معك قريباً');
      
      // Clear the form data from storage
      localStorage.removeItem('selectedJob');
      localStorage.removeItem('personalInfo');
      localStorage.removeItem('experiences');
      localStorage.removeItem('pharmacistFiles');
      sessionStorage.removeItem('applicationFiles');

      // Redirect to home page after a short delay
      setTimeout(() => {
        router.push('/');
      }, 2000);
    } catch (error: any) {
      console.error('Application submission error:', error);
      toast.dismiss();
      toast.error(error.message || 'حدث خطأ أثناء تقديم الطلب. يرجى المحاولة مرة أخرى.');
    } finally {
      setSubmitting(false);
    }
  };

  if (!formData.job || !formData.personalInfo || !formData.experiences) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-3xl mx-auto">
        <ProgressBar currentStep={currentStep} totalSteps={5} steps={steps} />

        <div className="mt-10 bg-white shadow-sm rounded-lg p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">مراجعة البيانات</h2>

          {/* Job Information */}
          <div className="border-b border-gray-200 pb-6 mb-6">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-lg font-medium text-gray-900">الوظيفة المختارة</h3>
              <button
                onClick={() => handleEdit('job')}
                className="text-blue-600 hover:text-blue-700 text-sm font-medium"
              >
                تعديل
              </button>
            </div>
            <p className="text-gray-600">{formData.job.title}</p>
          </div>

          {/* Personal Information */}
          <div className="border-b border-gray-200 pb-6 mb-6">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-lg font-medium text-gray-900">البيانات الشخصية</h3>
              <button
                onClick={() => handleEdit('personal')}
                className="text-blue-600 hover:text-blue-700 text-sm font-medium"
              >
                تعديل
              </button>
            </div>
            <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
              <div>
                <dt className="text-sm font-medium text-gray-500">الاسم الكامل</dt>
                <dd className="mt-1 text-gray-900">{formData.personalInfo.fullName}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">الرقم القومي</dt>
                <dd className="mt-1 text-gray-900">{formData.personalInfo.nationalId}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">المؤهل التعليمي</dt>
                <dd className="mt-1 text-gray-900">{formData.personalInfo.educationLevel}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">وسيلة الحركة</dt>
                <dd className="mt-1 text-gray-900">{formData.personalInfo.transportation}</dd>
              </div>
              <div className="sm:col-span-2">
                <dt className="text-sm font-medium text-gray-500">العنوان</dt>
                <dd className="mt-1 text-gray-900">{formData.personalInfo.address}</dd>
              </div>
              <div className="sm:col-span-2">
                <dt className="text-sm font-medium text-gray-500">المستندات المرفقة</dt>
                <dd className="mt-2 space-y-2">
                  {Object.entries(formData.personalInfo.files).map(([key, value]: [string, any]) => (
                    value && (
                      <div key={key} className="flex items-center text-gray-600">
                        <DocumentIcon className="h-5 w-5 ml-2" />
                        <span>{value.name}</span>
                      </div>
                    )
                  ))}
                </dd>
              </div>
            </dl>
          </div>

          {/* Experience Information */}
          <div className="border-b border-gray-200 pb-6 mb-6">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-lg font-medium text-gray-900">الخبرات السابقة</h3>
              <button
                onClick={() => handleEdit('experience')}
                className="text-blue-600 hover:text-blue-700 text-sm font-medium"
              >
                تعديل
              </button>
            </div>
            <div className="space-y-6">
              {formData.experiences.experiences.map((exp: any, index: number) => (
                <div key={index} className="border rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 mb-2">خبرة {index + 1}</h4>
                  <dl className="grid grid-cols-1 gap-x-4 gap-y-4 sm:grid-cols-2">
                    <div>
                      <dt className="text-sm font-medium text-gray-500">اسم الصيدلية</dt>
                      <dd className="mt-1 text-gray-900">{exp.pharmacyName}</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-500">رقم هاتف المدير</dt>
                      <dd className="mt-1 text-gray-900">{exp.managerPhone}</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-500">تاريخ بدء العمل</dt>
                      <dd className="mt-1 text-gray-900">{exp.startDate}</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-500">تاريخ ترك العمل</dt>
                      <dd className="mt-1 text-gray-900">{exp.endDate}</dd>
                    </div>
                    <div className="sm:col-span-2">
                      <dt className="text-sm font-medium text-gray-500">سبب ترك العمل</dt>
                      <dd className="mt-1 text-gray-900">{exp.leavingReason}</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-500">متوسط المبيعات</dt>
                      <dd className="mt-1 text-gray-900">{exp.averageSales} جنيه</dd>
                    </div>
                  </dl>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-between">
            <button
              type="button"
              onClick={() => router.back()}
              disabled={submitting}
              className="bg-gray-100 text-gray-800 px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 disabled:opacity-50"
            >
              رجوع
            </button>
            <button
              onClick={handleSubmit}
              disabled={submitting}
              className="bg-blue-600 text-white px-6 py-2 rounded-md text-sm font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 flex items-center"
            >
              {submitting ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  جاري التقديم...
                </>
              ) : (
                'تقديم الطلب'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 