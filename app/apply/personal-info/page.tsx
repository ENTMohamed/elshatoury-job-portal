'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import ProgressBar from '../../components/ProgressBar';
import { CldUploadWidget } from 'next-cloudinary';
import { DocumentIcon, XMarkIcon } from '@heroicons/react/24/solid';
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

const schema = yup.object().shape({
  fullName: yup.string().required('الاسم مطلوب'),
  email: yup.string().email('البريد الإلكتروني غير صحيح').required('البريد الإلكتروني مطلوب'),
  password: yup.string()
    .min(8, 'كلمة المرور يجب أن تكون 8 أحرف على الأقل')
    .required('كلمة المرور مطلوبة'),
  phone: yup.string()
    .matches(/^(01)[0-2,5]{1}[0-9]{8}$/, 'رقم الهاتف غير صحيح')
    .required('رقم الهاتف مطلوب'),
  address: yup.string().required('العنوان مطلوب'),
  birthDate: yup.date()
    .max(new Date(), 'تاريخ الميلاد يجب أن يكون في الماضي')
    .required('تاريخ الميلاد مطلوب'),
  resume: yup.string().required('السيرة الذاتية مطلوبة'),
});

export default function PersonalInfoPage() {
  const [selectedJob, setSelectedJob] = useState<any>(null);
  const [resumeUrl, setResumeUrl] = useState('');
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
    try {
      // Register user
      const registerResponse = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: data.email,
          password: data.password,
          fullName: data.fullName,
          phone: data.phone,
        }),
      });

      if (!registerResponse.ok) {
        const error = await registerResponse.json();
        toast.error(error.error || 'حدث خطأ أثناء إنشاء الحساب');
        return;
      }

      // Login user
      const loginResponse = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: data.email,
          password: data.password,
        }),
      });

      if (!loginResponse.ok) {
        toast.error('حدث خطأ أثناء تسجيل الدخول');
        return;
      }

      const { token } = await loginResponse.json();
      localStorage.setItem('token', token);
      localStorage.setItem('personalInfo', JSON.stringify(data));
      router.push('/apply/experience');
    } catch (error) {
      console.error('Form submission error:', error);
      toast.error('حدث خطأ أثناء إرسال البيانات');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 py-12">
      <div className="max-w-3xl mx-auto">
        <ProgressBar currentStep={2} totalSteps={5} steps={steps} />

        <div className="mt-10 bg-white shadow-sm rounded-lg p-8">
          <h2 className="text-2xl font-bold text-emerald-900 mb-6">البيانات الشخصية</h2>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">
                  الاسم بالكامل
                </label>
                <input
                  type="text"
                  id="fullName"
                  {...register('fullName')}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-emerald-500"
                  dir="rtl"
                />
                {errors.fullName && (
                  <p className="mt-1 text-sm text-red-600">{errors.fullName.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  البريد الإلكتروني
                </label>
                <input
                  type="email"
                  id="email"
                  {...register('email')}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-emerald-500"
                  dir="ltr"
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  كلمة المرور
                </label>
                <input
                  type="password"
                  id="password"
                  {...register('password')}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-emerald-500"
                  dir="ltr"
                />
                {errors.password && (
                  <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                  رقم الهاتف
                </label>
                <input
                  type="tel"
                  id="phone"
                  {...register('phone')}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-emerald-500"
                  dir="ltr"
                />
                {errors.phone && (
                  <p className="mt-1 text-sm text-red-600">{errors.phone.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="birthDate" className="block text-sm font-medium text-gray-700">
                  تاريخ الميلاد
                </label>
                <input
                  type="date"
                  id="birthDate"
                  {...register('birthDate')}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-emerald-500"
                />
                {errors.birthDate && (
                  <p className="mt-1 text-sm text-red-600">{errors.birthDate.message}</p>
                )}
              </div>
            </div>

            <div>
              <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                العنوان
              </label>
              <textarea
                id="address"
                {...register('address')}
                rows={3}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-emerald-500"
                dir="rtl"
              />
              {errors.address && (
                <p className="mt-1 text-sm text-red-600">{errors.address.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                السيرة الذاتية
              </label>
              <CldUploadWidget
                uploadPreset="job_applications"
                onSuccess={(result: any) => {
                  setResumeUrl(result.info.secure_url);
                  setValue('resume', result.info.secure_url);
                }}
              >
                {({ open }) => (
                  <div className="space-y-2">
                    <button
                      type="button"
                      onClick={() => open()}
                      className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
                    >
                      <DocumentIcon className="h-5 w-5 ml-2 text-gray-500" />
                      رفع السيرة الذاتية
                    </button>
                    {resumeUrl && (
                      <div className="flex items-center space-x-2 space-x-reverse bg-emerald-50 p-2 rounded-md">
                        <DocumentIcon className="h-5 w-5 text-emerald-500" />
                        <span className="text-sm text-emerald-700">تم رفع السيرة الذاتية</span>
                        <button
                          type="button"
                          onClick={() => {
                            setResumeUrl('');
                            setValue('resume', '');
                          }}
                          className="text-emerald-600 hover:text-emerald-800"
                        >
                          <XMarkIcon className="h-5 w-5" />
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </CldUploadWidget>
              {errors.resume && (
                <p className="mt-1 text-sm text-red-600">{errors.resume.message}</p>
              )}
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