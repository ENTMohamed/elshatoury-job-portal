'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import ProgressBar from '../../components/ProgressBar';
import { CldUploadWidget } from 'next-cloudinary';
import { DocumentIcon, XMarkIcon } from '@heroicons/react/24/solid';

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

const schema = yup.object().shape({
  licenseNumber: yup.string().required('رقم الترخيص مطلوب'),
  syndicateNumber: yup.string().required('رقم النقابة مطلوب'),
  licenseFile: yup.string().required('صورة الترخيص مطلوبة'),
  syndicateFile: yup.string().required('صورة كارنيه النقابة مطلوبة'),
  graduationCertificate: yup.string().required('صورة شهادة التخرج مطلوبة'),
});

type FileFields = 'licenseFile' | 'syndicateFile' | 'graduationCertificate';

export default function PharmacistRequirementsPage() {
  const [selectedJob, setSelectedJob] = useState<any>(null);
  const [files, setFiles] = useState<Record<FileFields, string>>({
    licenseFile: '',
    syndicateFile: '',
    graduationCertificate: '',
  });
  const router = useRouter();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  useEffect(() => {
    const job = localStorage.getItem('selectedJob');
    if (!job) {
      router.push('/apply');
    } else {
      setSelectedJob(JSON.parse(job));
    }
  }, [router]);

  const onSubmit = async (data: any) => {
    localStorage.setItem('pharmacistFiles', JSON.stringify(data));
    router.push('/apply/personal-info');
  };

  const handleFileUpload = (field: FileFields, result: any) => {
    const url = result.info.secure_url;
    setFiles((prev) => ({ ...prev, [field]: url }));
    setValue(field, url);
  };

  const handleFileRemove = (field: FileFields) => {
    setFiles((prev) => ({ ...prev, [field]: '' }));
    setValue(field, '');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 py-12">
      <div className="max-w-3xl mx-auto">
        <ProgressBar currentStep={1} totalSteps={5} steps={steps} />

        <div className="mt-10 bg-white shadow-sm rounded-lg p-8">
          <h2 className="text-2xl font-bold text-emerald-900 mb-6">متطلبات الصيدلي</h2>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  رقم الترخيص
                </label>
                <input
                  type="text"
                  {...register('licenseNumber')}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-emerald-500"
                  dir="rtl"
                />
                {errors.licenseNumber && (
                  <p className="mt-1 text-sm text-red-600">{errors.licenseNumber.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  رقم النقابة
                </label>
                <input
                  type="text"
                  {...register('syndicateNumber')}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-emerald-500"
                  dir="rtl"
                />
                {errors.syndicateNumber && (
                  <p className="mt-1 text-sm text-red-600">{errors.syndicateNumber.message}</p>
                )}
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  صورة الترخيص
                </label>
                <CldUploadWidget
                  uploadPreset="job_applications"
                  onSuccess={(result: any) => handleFileUpload('licenseFile', result)}
                >
                  {({ open }) => (
                    <div className="space-y-2">
                      <button
                        type="button"
                        onClick={() => open()}
                        className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
                      >
                        <DocumentIcon className="h-5 w-5 ml-2 text-gray-500" />
                        رفع صورة الترخيص
                      </button>
                      {files.licenseFile && (
                        <div className="flex items-center space-x-2 space-x-reverse bg-emerald-50 p-2 rounded-md">
                          <DocumentIcon className="h-5 w-5 text-emerald-500" />
                          <span className="text-sm text-emerald-700">تم رفع صورة الترخيص</span>
                          <button
                            type="button"
                            onClick={() => handleFileRemove('licenseFile')}
                            className="text-emerald-600 hover:text-emerald-800"
                          >
                            <XMarkIcon className="h-5 w-5" />
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </CldUploadWidget>
                {errors.licenseFile && (
                  <p className="mt-1 text-sm text-red-600">{errors.licenseFile.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  صورة كارنيه النقابة
                </label>
                <CldUploadWidget
                  uploadPreset="job_applications"
                  onSuccess={(result: any) => handleFileUpload('syndicateFile', result)}
                >
                  {({ open }) => (
                    <div className="space-y-2">
                      <button
                        type="button"
                        onClick={() => open()}
                        className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
                      >
                        <DocumentIcon className="h-5 w-5 ml-2 text-gray-500" />
                        رفع صورة كارنيه النقابة
                      </button>
                      {files.syndicateFile && (
                        <div className="flex items-center space-x-2 space-x-reverse bg-emerald-50 p-2 rounded-md">
                          <DocumentIcon className="h-5 w-5 text-emerald-500" />
                          <span className="text-sm text-emerald-700">تم رفع صورة كارنيه النقابة</span>
                          <button
                            type="button"
                            onClick={() => handleFileRemove('syndicateFile')}
                            className="text-emerald-600 hover:text-emerald-800"
                          >
                            <XMarkIcon className="h-5 w-5" />
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </CldUploadWidget>
                {errors.syndicateFile && (
                  <p className="mt-1 text-sm text-red-600">{errors.syndicateFile.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  صورة شهادة التخرج
                </label>
                <CldUploadWidget
                  uploadPreset="job_applications"
                  onSuccess={(result: any) => handleFileUpload('graduationCertificate', result)}
                >
                  {({ open }) => (
                    <div className="space-y-2">
                      <button
                        type="button"
                        onClick={() => open()}
                        className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
                      >
                        <DocumentIcon className="h-5 w-5 ml-2 text-gray-500" />
                        رفع صورة شهادة التخرج
                      </button>
                      {files.graduationCertificate && (
                        <div className="flex items-center space-x-2 space-x-reverse bg-emerald-50 p-2 rounded-md">
                          <DocumentIcon className="h-5 w-5 text-emerald-500" />
                          <span className="text-sm text-emerald-700">تم رفع صورة شهادة التخرج</span>
                          <button
                            type="button"
                            onClick={() => handleFileRemove('graduationCertificate')}
                            className="text-emerald-600 hover:text-emerald-800"
                          >
                            <XMarkIcon className="h-5 w-5" />
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </CldUploadWidget>
                {errors.graduationCertificate && (
                  <p className="mt-1 text-sm text-red-600">{errors.graduationCertificate.message}</p>
                )}
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
                type="submit"
                className="btn-primary"
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