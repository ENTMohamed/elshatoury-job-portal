'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm, useFieldArray } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import ProgressBar from '../../components/ProgressBar';
import { PlusIcon, TrashIcon } from '@heroicons/react/24/solid';

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
  experiences: yup.array().of(
    yup.object().shape({
      company: yup.string().required('اسم الشركة مطلوب'),
      position: yup.string().required('المسمى الوظيفي مطلوب'),
      startDate: yup.string().required('تاريخ البدء مطلوب'),
      endDate: yup.string()
        .required('تاريخ الانتهاء مطلوب')
        .test('is-after-start', 'تاريخ الانتهاء يجب أن يكون بعد تاريخ البدء', function(value) {
          const { startDate } = this.parent;
          if (!startDate || !value) return true;
          return new Date(value) > new Date(startDate);
        }),
      responsibilities: yup.string().required('المسؤوليات مطلوبة'),
    })
  ).min(1, 'يجب إضافة خبرة واحدة على الأقل'),
});

export default function ExperiencePage() {
  const [selectedJob, setSelectedJob] = useState<any>(null);
  const router = useRouter();

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      experiences: [{ company: '', position: '', startDate: '', endDate: '', responsibilities: '' }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'experiences',
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
    localStorage.setItem('experiences', JSON.stringify(data));
    router.push('/apply/review');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 py-12">
      <div className="max-w-3xl mx-auto">
        <ProgressBar currentStep={3} totalSteps={5} steps={steps} />

        <div className="mt-10 bg-white shadow-sm rounded-lg p-8">
          <h2 className="text-2xl font-bold text-emerald-900 mb-6">الخبرات السابقة</h2>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            {fields.map((field, index) => (
              <div key={field.id} className="space-y-6 p-6 bg-gray-50 rounded-lg relative">
                {index > 0 && (
                  <button
                    type="button"
                    onClick={() => remove(index)}
                    className="absolute top-4 left-4 text-red-600 hover:text-red-800"
                  >
                    <TrashIcon className="h-5 w-5" />
                  </button>
                )}

                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      اسم الشركة
                    </label>
                    <input
                      type="text"
                      {...register(`experiences.${index}.company`)}
                      className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-emerald-500"
                      dir="rtl"
                    />
                    {errors.experiences?.[index]?.company && (
                      <p className="mt-1 text-sm text-red-600">{errors.experiences[index]?.company?.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      المسمى الوظيفي
                    </label>
                    <input
                      type="text"
                      {...register(`experiences.${index}.position`)}
                      className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-emerald-500"
                      dir="rtl"
                    />
                    {errors.experiences?.[index]?.position && (
                      <p className="mt-1 text-sm text-red-600">{errors.experiences[index]?.position?.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      تاريخ البدء
                    </label>
                    <input
                      type="date"
                      {...register(`experiences.${index}.startDate`)}
                      className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-emerald-500"
                    />
                    {errors.experiences?.[index]?.startDate && (
                      <p className="mt-1 text-sm text-red-600">{errors.experiences[index]?.startDate?.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      تاريخ الانتهاء
                    </label>
                    <input
                      type="date"
                      {...register(`experiences.${index}.endDate`)}
                      className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-emerald-500"
                    />
                    {errors.experiences?.[index]?.endDate && (
                      <p className="mt-1 text-sm text-red-600">{errors.experiences[index]?.endDate?.message}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    المسؤوليات والإنجازات
                  </label>
                  <textarea
                    {...register(`experiences.${index}.responsibilities`)}
                    rows={3}
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-emerald-500"
                    dir="rtl"
                  />
                  {errors.experiences?.[index]?.responsibilities && (
                    <p className="mt-1 text-sm text-red-600">{errors.experiences[index]?.responsibilities?.message}</p>
                  )}
                </div>
              </div>
            ))}

            <button
              type="button"
              onClick={() => append({ company: '', position: '', startDate: '', endDate: '', responsibilities: '' })}
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
            >
              <PlusIcon className="h-5 w-5 ml-2 text-gray-500" />
              إضافة خبرة جديدة
            </button>

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