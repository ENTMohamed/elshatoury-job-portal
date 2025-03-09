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

  useEffect(() => {
    const job = localStorage.getItem('selectedJob');
    const personalInfo = localStorage.getItem('personalInfo');
    const experiences = localStorage.getItem('experiences');

    if (!job || !personalInfo || !experiences) {
      router.push('/apply');
      return;
    }

    setFormData({
      job: JSON.parse(job),
      personalInfo: JSON.parse(personalInfo),
      experiences: JSON.parse(experiences),
    });
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
    try {
      setSubmitting(true);

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
      Object.entries(storedFiles).forEach(([key, fileData]: [string, any]) => {
        if (fileData && fileData.data) {
          // Reconstruct the file from stored data
          const uint8Array = new Uint8Array(fileData.data);
          const blob = new Blob([uint8Array], { type: fileData.type });
          const file = new File([blob], fileData.name, {
            type: fileData.type,
            lastModified: fileData.lastModified
          });
          submitFormData.append(key, file);
        }
      });

      // Add experiences
      if (formData.experiences && formData.experiences.length > 0) {
        submitFormData.append('experiences', JSON.stringify(formData.experiences));
      }

      // Submit to backend
      const response = await fetch('/api/applications', {
        method: 'POST',
        body: submitFormData,
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.message || 'حدث خطأ أثناء تقديم الطلب');
      }

      // Show success message
      toast.success('تم تقديم طلبك بنجاح! سنتواصل معك قريباً');
      
      // Clear the form data from storage
      localStorage.removeItem('selectedJob');
      localStorage.removeItem('personalInfo');
      localStorage.removeItem('experiences');
      localStorage.removeItem('pharmacistFiles');
      sessionStorage.removeItem('applicationFiles');

      // Redirect to home page
      router.push('/');
    } catch (error: any) {
      console.error('Application submission error:', error);
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
        <ProgressBar currentStep={3} totalSteps={4} steps={steps} />

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
              className="bg-gray-100 text-gray-800 px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
            >
              رجوع
            </button>
            <button
              onClick={handleSubmit}
              className="bg-blue-600 text-white px-6 py-2 rounded-md text-sm font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              تقديم الطلب
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 