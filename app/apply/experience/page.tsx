'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useFormik, FieldArray, FormikProvider } from 'formik';
import * as Yup from 'yup';
import ProgressBar from '../../components/ProgressBar';
import { PlusIcon, TrashIcon } from '@heroicons/react/24/outline';
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

interface Experience {
  pharmacyName: string;
  managerPhone: string;
  startDate: string;
  endDate: string;
  leavingReason: string;
  averageSales: string;
}

interface FormValues {
  experiences: Experience[];
}

const experienceValidationSchema = Yup.object({
  experiences: Yup.array().of(
    Yup.object({
      pharmacyName: Yup.string().required('اسم الصيدلية مطلوب'),
      managerPhone: Yup.string()
        .required('رقم هاتف المدير مطلوب')
        .matches(/^01[0-9]{9}$/, 'رقم الهاتف يجب أن يبدأ بـ 01 ويتكون من 11 رقم'),
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

export default function ExperiencePage() {
  const router = useRouter();
  const [selectedJob, setSelectedJob] = useState<any>(null);
  const [currentStep, setCurrentStep] = useState(3);

  useEffect(() => {
    const jobData = localStorage.getItem('selectedJob');
    const personalInfo = localStorage.getItem('personalInfo');

    if (!jobData || !personalInfo) {
      router.push('/apply');
      return;
    }

    const job = JSON.parse(jobData);
    setSelectedJob(job);

    // Set correct step based on job type
    if (job.id === 'pharmacist') {
      setCurrentStep(3);
    } else {
      setCurrentStep(2);
    }
  }, [router]);

  const formik = useFormik<FormValues>({
    initialValues: {
      experiences: [
        {
          pharmacyName: '',
          managerPhone: '',
          startDate: '',
          endDate: '',
          leavingReason: '',
          averageSales: '',
        },
      ],
    },
    validationSchema: experienceValidationSchema,
    onSubmit: async (values) => {
      try {
        // Store experiences in localStorage
        localStorage.setItem('experiences', JSON.stringify(values));
        
        // Show success message
        toast.success('تم حفظ الخبرات بنجاح');
        
        // Navigate to review page
        router.push('/apply/review');
      } catch (error) {
        console.error('Error saving experiences:', error);
        toast.error('حدث خطأ أثناء حفظ الخبرات');
      }
    },
  });

  const getFieldError = (index: number, field: keyof Experience) => {
    const errors = formik.errors.experiences?.[index];
    if (typeof errors === 'object' && errors !== null) {
      return errors[field];
    }
    return '';
  };

  const getFieldTouched = (index: number, field: keyof Experience) => {
    return formik.touched.experiences?.[index]?.[field] || false;
  };

  const calculateDuration = (startDate: string, endDate: string) => {
    if (!startDate || !endDate) return '';
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return `${diffDays} يوم`;
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-3xl mx-auto">
        <ProgressBar currentStep={currentStep} totalSteps={5} steps={steps} />

        <div className="mt-10 bg-white shadow-sm rounded-lg p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">الخبرات السابقة</h2>

          <FormikProvider value={formik}>
            <form onSubmit={formik.handleSubmit} className="space-y-6">
              <FieldArray
                name="experiences"
                render={(arrayHelpers) => (
                  <div className="space-y-6">
                    {formik.values.experiences.map((experience, index) => (
                      <div key={index} className="border rounded-lg p-4 space-y-4">
                        <div className="flex justify-between items-center">
                          <h3 className="text-lg font-medium text-gray-900">
                            خبرة {index + 1}
                          </h3>
                          {index > 0 && (
                            <button
                              type="button"
                              onClick={() => arrayHelpers.remove(index)}
                              className="text-red-600 hover:text-red-700"
                            >
                              <TrashIcon className="h-5 w-5" />
                            </button>
                          )}
                        </div>

                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                          {/* Pharmacy Name */}
                          <div>
                            <label className="block text-sm font-medium text-gray-700">
                              اسم الصيدلية
                            </label>
                            <input
                              type="text"
                              id={`experiences.${index}.pharmacyName`}
                              name={`experiences.${index}.pharmacyName`}
                              onChange={formik.handleChange}
                              onBlur={formik.handleBlur}
                              value={experience.pharmacyName}
                              className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 ${
                                getFieldError(index, 'pharmacyName') && getFieldTouched(index, 'pharmacyName')
                                  ? 'border-red-500'
                                  : ''
                              }`}
                            />
                            {getFieldError(index, 'pharmacyName') && getFieldTouched(index, 'pharmacyName') && (
                              <p className="mt-1 text-sm text-red-600">
                                {getFieldError(index, 'pharmacyName')}
                              </p>
                            )}
                          </div>

                          {/* Manager Phone */}
                          <div>
                            <label className="block text-sm font-medium text-gray-700">
                              رقم هاتف المدير
                            </label>
                            <input
                              type="text"
                              id={`experiences.${index}.managerPhone`}
                              name={`experiences.${index}.managerPhone`}
                              onChange={formik.handleChange}
                              onBlur={formik.handleBlur}
                              value={experience.managerPhone}
                              className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 ${
                                getFieldError(index, 'managerPhone') && getFieldTouched(index, 'managerPhone')
                                  ? 'border-red-500'
                                  : ''
                              }`}
                            />
                            {getFieldError(index, 'managerPhone') && getFieldTouched(index, 'managerPhone') && (
                              <p className="mt-1 text-sm text-red-600">
                                {getFieldError(index, 'managerPhone')}
                              </p>
                            )}
                          </div>

                          {/* Start Date */}
                          <div>
                            <label className="block text-sm font-medium text-gray-700">
                              تاريخ بدء العمل
                            </label>
                            <input
                              type="date"
                              id={`experiences.${index}.startDate`}
                              name={`experiences.${index}.startDate`}
                              onChange={formik.handleChange}
                              onBlur={formik.handleBlur}
                              value={experience.startDate}
                              className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 ${
                                getFieldError(index, 'startDate') && getFieldTouched(index, 'startDate')
                                  ? 'border-red-500'
                                  : ''
                              }`}
                            />
                            {getFieldError(index, 'startDate') && getFieldTouched(index, 'startDate') && (
                              <p className="mt-1 text-sm text-red-600">
                                {getFieldError(index, 'startDate')}
                              </p>
                            )}
                          </div>

                          {/* End Date */}
                          <div>
                            <label className="block text-sm font-medium text-gray-700">
                              تاريخ ترك العمل
                            </label>
                            <input
                              type="date"
                              id={`experiences.${index}.endDate`}
                              name={`experiences.${index}.endDate`}
                              onChange={formik.handleChange}
                              onBlur={formik.handleBlur}
                              value={experience.endDate}
                              className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 ${
                                getFieldError(index, 'endDate') && getFieldTouched(index, 'endDate')
                                  ? 'border-red-500'
                                  : ''
                              }`}
                            />
                            {getFieldError(index, 'endDate') && getFieldTouched(index, 'endDate') && (
                              <p className="mt-1 text-sm text-red-600">
                                {getFieldError(index, 'endDate')}
                              </p>
                            )}
                          </div>

                          {/* Duration */}
                          {experience.startDate && experience.endDate && (
                            <div className="col-span-2">
                              <p className="text-sm text-gray-500">
                                مدة العمل:{' '}
                                {calculateDuration(experience.startDate, experience.endDate)}
                              </p>
                            </div>
                          )}

                          {/* Leaving Reason */}
                          <div className="col-span-2">
                            <label className="block text-sm font-medium text-gray-700">
                              سبب ترك العمل
                            </label>
                            <textarea
                              id={`experiences.${index}.leavingReason`}
                              name={`experiences.${index}.leavingReason`}
                              onChange={formik.handleChange}
                              onBlur={formik.handleBlur}
                              value={experience.leavingReason}
                              rows={3}
                              className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 ${
                                getFieldError(index, 'leavingReason') && getFieldTouched(index, 'leavingReason')
                                  ? 'border-red-500'
                                  : ''
                              }`}
                            />
                            {getFieldError(index, 'leavingReason') && getFieldTouched(index, 'leavingReason') && (
                              <p className="mt-1 text-sm text-red-600">
                                {getFieldError(index, 'leavingReason')}
                              </p>
                            )}
                          </div>

                          {/* Average Sales */}
                          <div className="col-span-2">
                            <label className="block text-sm font-medium text-gray-700">
                              متوسط مبيعات الوردية
                            </label>
                            <input
                              type="number"
                              id={`experiences.${index}.averageSales`}
                              name={`experiences.${index}.averageSales`}
                              onChange={formik.handleChange}
                              onBlur={formik.handleBlur}
                              value={experience.averageSales}
                              className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 ${
                                getFieldError(index, 'averageSales') && getFieldTouched(index, 'averageSales')
                                  ? 'border-red-500'
                                  : ''
                              }`}
                            />
                            {getFieldError(index, 'averageSales') && getFieldTouched(index, 'averageSales') && (
                              <p className="mt-1 text-sm text-red-600">
                                {getFieldError(index, 'averageSales')}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}

                    {formik.values.experiences.length < 10 && (
                      <button
                        type="button"
                        onClick={() =>
                          arrayHelpers.push({
                            pharmacyName: '',
                            managerPhone: '',
                            startDate: '',
                            endDate: '',
                            leavingReason: '',
                            averageSales: '',
                          })
                        }
                        className="flex items-center justify-center w-full py-2 px-4 border-2 border-dashed border-gray-300 rounded-md text-sm font-medium text-gray-600 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      >
                        <PlusIcon className="h-5 w-5 ml-2" />
                        إضافة خبرة جديدة
                      </button>
                    )}
                  </div>
                )}
              />

              <div className="flex justify-between">
                <button
                  type="button"
                  onClick={() => router.back()}
                  className="bg-gray-100 text-gray-800 px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                >
                  رجوع
                </button>
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  متابعة
                </button>
              </div>
            </form>
          </FormikProvider>
        </div>
      </div>
    </div>
  );
} 