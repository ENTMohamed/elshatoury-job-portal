'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { DocumentIcon } from '@heroicons/react/24/outline';

interface Application {
  id: string;
  fullName: string;
  selectedJob: string;
  status: string;
  submittedAt: string;
  personalInfo: {
    nationalId: string;
    educationLevel: string;
    address: string;
    transportation: string;
    files: {
      nationalIdFront: string;
      nationalIdBack: string;
      educationCertificate?: string;
      cv: string;
      ph_graduation_cert?: string;
      ph_practice_license?: string;
      ph_union_card?: string;
    };
  };
  experiences: Array<{
    pharmacyName: string;
    managerPhone: string;
    startDate: string;
    endDate: string;
    leavingReason: string;
    averageSales: number;
  }>;
  scores: {
    auto_score: number;
    manual_score: number;
    total_score: number;
  };
}

export default function ApplicationDetails({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [application, setApplication] = useState<Application | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [manualScore, setManualScore] = useState(0);
  const [notes, setNotes] = useState('');
  const [revisionNotes, setRevisionNotes] = useState('');
  const [showRevisionModal, setShowRevisionModal] = useState(false);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    // Check if admin is logged in
    const token = localStorage.getItem('adminToken');
    if (!token) {
      router.push('/admin/login');
      return;
    }

    // Fetch application data
    const fetchApplicationData = async () => {
      try {
        // TODO: Replace with actual API call
        // For now, using mock data
        setApplication({
          id: params.id,
          fullName: 'أحمد محمد',
          selectedJob: 'صيدلي',
          status: 'under_review',
          submittedAt: '2024-03-15',
          personalInfo: {
            nationalId: '12345678901234',
            educationLevel: 'بكالوريوس صيدلة',
            address: 'القاهرة، مصر',
            transportation: 'سيارة خاصة',
            files: {
              nationalIdFront: '/uploads/id_front.jpg',
              nationalIdBack: '/uploads/id_back.jpg',
              educationCertificate: '/uploads/cert.pdf',
              cv: '/uploads/cv.pdf',
              ph_graduation_cert: '/uploads/grad_cert.pdf',
              ph_practice_license: '/uploads/license.pdf',
              ph_union_card: '/uploads/union_card.pdf',
            },
          },
          experiences: [
            {
              pharmacyName: 'صيدلية النور',
              managerPhone: '01012345678',
              startDate: '2022-01-01',
              endDate: '2023-12-31',
              leavingReason: 'البحث عن فرصة أفضل',
              averageSales: 50000,
            },
          ],
          scores: {
            auto_score: 75,
            manual_score: 0,
            total_score: 75,
          },
        });
      } catch (error) {
        setError('حدث خطأ في تحميل البيانات');
      } finally {
        setLoading(false);
      }
    };

    fetchApplicationData();
  }, [params.id, router]);

  const handleStatusChange = async (newStatus: string) => {
    if (newStatus === 'needs_revision' && !revisionNotes) {
      setShowRevisionModal(true);
      return;
    }

    setUpdating(true);
    try {
      // TODO: Replace with actual API call
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate API call
      
      // Update application status
      if (application) {
        setApplication({
          ...application,
          status: newStatus,
        });
      }
      
      // Show success message
      alert('تم تحديث حالة الطلب بنجاح');
    } catch (error) {
      alert('حدث خطأ في تحديث حالة الطلب');
    } finally {
      setUpdating(false);
      setShowRevisionModal(false);
      setRevisionNotes('');
    }
  };

  const handleScoreUpdate = async () => {
    setUpdating(true);
    try {
      // TODO: Replace with actual API call
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate API call
      
      if (application) {
        setApplication({
          ...application,
          scores: {
            ...application.scores,
            manual_score: manualScore,
            total_score: application.scores.auto_score + manualScore,
          },
        });
      }
      
      alert('تم تحديث التقييم بنجاح');
    } catch (error) {
      alert('حدث خطأ في تحديث التقييم');
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-gray-600">جاري التحميل...</div>
      </div>
    );
  }

  if (error || !application) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-red-600">{error || 'لم يتم العثور على الطلب'}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900">
            تفاصيل الطلب #{application.id}
          </h1>
          <button
            onClick={() => router.back()}
            className="bg-gray-100 text-gray-800 px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-200"
          >
            رجوع
          </button>
        </div>

        <div className="bg-white shadow rounded-lg overflow-hidden">
          {/* Basic Information */}
          <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">المعلومات الأساسية</h3>
            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <dt className="text-sm font-medium text-gray-500">الاسم</dt>
                <dd className="mt-1 text-sm text-gray-900">{application.fullName}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">الوظيفة</dt>
                <dd className="mt-1 text-sm text-gray-900">{application.selectedJob}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">الرقم القومي</dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {application.personalInfo.nationalId}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">المؤهل</dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {application.personalInfo.educationLevel}
                </dd>
              </div>
            </div>
          </div>

          {/* Files */}
          <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900 mb-4">المستندات</h3>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {Object.entries(application.personalInfo.files).map(([key, value]) => (
                <div key={key} className="flex items-center space-x-3">
                  <DocumentIcon className="h-6 w-6 text-gray-400" />
                  <a
                    href={value}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-700"
                  >
                    {key}
                  </a>
                </div>
              ))}
            </div>
          </div>

          {/* Experience */}
          <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900 mb-4">الخبرات السابقة</h3>
            <div className="space-y-6">
              {application.experiences.map((exp, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <dt className="text-sm font-medium text-gray-500">اسم الصيدلية</dt>
                      <dd className="mt-1 text-sm text-gray-900">{exp.pharmacyName}</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-500">رقم المدير</dt>
                      <dd className="mt-1 text-sm text-gray-900">{exp.managerPhone}</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-500">تاريخ البدء</dt>
                      <dd className="mt-1 text-sm text-gray-900">{exp.startDate}</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-500">تاريخ الترك</dt>
                      <dd className="mt-1 text-sm text-gray-900">{exp.endDate}</dd>
                    </div>
                    <div className="sm:col-span-2">
                      <dt className="text-sm font-medium text-gray-500">سبب الترك</dt>
                      <dd className="mt-1 text-sm text-gray-900">{exp.leavingReason}</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-500">متوسط المبيعات</dt>
                      <dd className="mt-1 text-sm text-gray-900">
                        {exp.averageSales.toLocaleString()} جنيه
                      </dd>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Scoring */}
          <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900 mb-4">التقييم</h3>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
              <div>
                <dt className="text-sm font-medium text-gray-500">التقييم الآلي</dt>
                <dd className="mt-1 text-2xl font-semibold text-gray-900">
                  {application.scores.auto_score}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">التقييم اليدوي</dt>
                <div className="mt-1 flex items-center space-x-4">
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={manualScore}
                    onChange={(e) => setManualScore(Number(e.target.value))}
                    className="block w-20 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  />
                  <button
                    onClick={handleScoreUpdate}
                    disabled={updating}
                    className="bg-blue-600 text-white px-3 py-1 rounded-md text-sm font-medium hover:bg-blue-700 disabled:opacity-50"
                  >
                    تحديث
                  </button>
                </div>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">المجموع</dt>
                <dd className="mt-1 text-2xl font-semibold text-gray-900">
                  {application.scores.total_score}
                </dd>
              </div>
            </div>
          </div>

          {/* Status and Actions */}
          <div className="px-4 py-5 sm:px-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">الحالة والإجراءات</h3>
            <div className="flex flex-wrap gap-4">
              <button
                onClick={() => handleStatusChange('accepted')}
                disabled={updating}
                className="bg-green-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-green-700 disabled:opacity-50"
              >
                قبول
              </button>
              <button
                onClick={() => handleStatusChange('rejected')}
                disabled={updating}
                className="bg-red-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-red-700 disabled:opacity-50"
              >
                رفض
              </button>
              <button
                onClick={() => handleStatusChange('needs_revision')}
                disabled={updating}
                className="bg-orange-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-orange-700 disabled:opacity-50"
              >
                طلب تعديل
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Revision Modal */}
      {showRevisionModal && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 max-w-lg w-full">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              ملاحظات التعديل
            </h3>
            <textarea
              value={revisionNotes}
              onChange={(e) => setRevisionNotes(e.target.value)}
              rows={4}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              placeholder="اكتب ملاحظات التعديل هنا..."
            />
            <div className="mt-4 flex justify-end space-x-3">
              <button
                onClick={() => setShowRevisionModal(false)}
                className="bg-gray-100 text-gray-800 px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-200"
              >
                إلغاء
              </button>
              <button
                onClick={() => handleStatusChange('needs_revision')}
                disabled={!revisionNotes.trim()}
                className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 disabled:opacity-50"
              >
                إرسال
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 