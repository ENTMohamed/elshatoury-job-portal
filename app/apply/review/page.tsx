'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import ProgressBar from '../../components/ProgressBar';
import { DocumentIcon } from '@heroicons/react/24/solid';
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

export default function ReviewPage() {
  const [selectedJob, setSelectedJob] = useState<any>(null);
  const [personalInfo, setPersonalInfo] = useState<any>(null);
  const [experiences, setExperiences] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const job = localStorage.getItem('selectedJob');
    const info = localStorage.getItem('personalInfo');
    const exp = localStorage.getItem('experiences');

    if (!job || !info || !exp) {
      router.push('/apply');
      return;
    }

    setSelectedJob(JSON.parse(job));
    setPersonalInfo(JSON.parse(info));
    setExperiences(JSON.parse(exp));
  }, [router]);

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);

      const response = await fetch('/api/applications', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          job: selectedJob,
          personalInfo,
          experiences: experiences.experiences,
        }),
      });

      if (!response.ok) {
        throw new Error('حدث خطأ أثناء إرسال الطلب');
      }

      // Clear application data from localStorage
      localStorage.removeItem('selectedJob');
      localStorage.removeItem('personalInfo');
      localStorage.removeItem('experiences');

      toast.success('تم إرسال طلبك بنجاح');
      router.push('/apply/success');
    } catch (error) {
      console.error('Error submitting application:', error);
      toast.error('حدث خطأ أثناء إرسال الطلب');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!selectedJob || !personalInfo || !experiences) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 py-12">
      <div className="max-w-3xl mx-auto">
        <ProgressBar currentStep={4} totalSteps={5} steps={steps} />

        <div className="mt-10 bg-white shadow-sm rounded-lg p-8">
          <h2 className="text-2xl font-bold text-emerald-900 mb-6">مراجعة الطلب</h2>

          <div className="space-y-8">
            {/* Job Information */}
            <div>
              <h3 className="text-lg font-semibold text-emerald-900 mb-4">الوظيفة المطلوبة</h3>
              <div className="bg-emerald-50 rounded-lg p-4">
                <p className="text-emerald-800 font-medium">{selectedJob.title}</p>
                <p className="text-emerald-600 mt-2">{selectedJob.description}</p>
              </div>
            </div>

            {/* Personal Information */}
            <div>
              <h3 className="text-lg font-semibold text-emerald-900 mb-4">البيانات الشخصية</h3>
              <div className="bg-gray-50 rounded-lg p-6 space-y-4">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <p className="text-sm text-gray-500">الاسم بالكامل</p>
                    <p className="mt-1 text-gray-900">{personalInfo.fullName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">البريد الإلكتروني</p>
                    <p className="mt-1 text-gray-900">{personalInfo.email}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">رقم الهاتف</p>
                    <p className="mt-1 text-gray-900">{personalInfo.phone}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">تاريخ الميلاد</p>
                    <p className="mt-1 text-gray-900">{new Date(personalInfo.birthDate).toLocaleDateString('ar-EG')}</p>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-gray-500">العنوان</p>
                  <p className="mt-1 text-gray-900">{personalInfo.address}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">السيرة الذاتية</p>
                  <div className="mt-1 flex items-center space-x-2 space-x-reverse">
                    <DocumentIcon className="h-5 w-5 text-emerald-500" />
                    <a
                      href={personalInfo.resume}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-emerald-600 hover:text-emerald-800"
                    >
                      عرض السيرة الذاتية
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Experience Information */}
            <div>
              <h3 className="text-lg font-semibold text-emerald-900 mb-4">الخبرات السابقة</h3>
              <div className="space-y-4">
                {experiences.experiences.map((experience: any, index: number) => (
                  <div key={index} className="bg-gray-50 rounded-lg p-6 space-y-4">
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <div>
                        <p className="text-sm text-gray-500">اسم الشركة</p>
                        <p className="mt-1 text-gray-900">{experience.company}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">المسمى الوظيفي</p>
                        <p className="mt-1 text-gray-900">{experience.position}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">تاريخ البدء</p>
                        <p className="mt-1 text-gray-900">{new Date(experience.startDate).toLocaleDateString('ar-EG')}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">تاريخ الانتهاء</p>
                        <p className="mt-1 text-gray-900">{new Date(experience.endDate).toLocaleDateString('ar-EG')}</p>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">المسؤوليات والإنجازات</p>
                      <p className="mt-1 text-gray-900 whitespace-pre-wrap">{experience.responsibilities}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-between items-center pt-4">
              <button
                type="button"
                onClick={() => router.back()}
                className="btn-secondary"
              >
                رجوع
              </button>
              <button
                type="button"
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="btn-primary"
              >
                {isSubmitting ? 'جاري الإرسال...' : 'إرسال الطلب'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 