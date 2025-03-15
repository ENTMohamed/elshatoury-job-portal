'use client'

import { useState } from 'react'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import toast from 'react-hot-toast'
import { useRouter } from 'next/navigation'
import Image from 'next/image'

const validationSchema = Yup.object({
  name: Yup.string().required('Name is required'),
  email: Yup.string()
    .email('Invalid email address')
    .required('Email is required'),
  phone: Yup.string()
    .matches(/^[0-9]+$/, 'Phone number must contain only digits')
    .min(10, 'Phone number must be at least 10 digits')
    .required('Phone number is required'),
  position: Yup.string().required('Position is required'),
  resume: Yup.mixed()
    .required('Resume is required')
    .test('fileSize', 'File size is too large', (value) => {
      if (!value) return true
      const file = value as File
      return file.size <= 5000000 // 5MB
    })
    .test('fileType', 'Unsupported file type', (value) => {
      if (!value) return true
      const file = value as File
      return ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'].includes(file.type)
    }),
})

const jobs = [
  {
    id: 'pharmacist',
    title: 'صيدلي',
    description: 'نبحث عن صيادلة ذوي خبرة للعمل في فروعنا المختلفة',
    requirements: [
      'بكالوريوس صيدلة',
      'خبرة لا تقل عن سنة',
      'مهارات تواصل ممتازة',
      'القدرة على العمل بنظام الورديات',
    ],
  },
  {
    id: 'pharmacy-technician',
    title: 'فني صيدلي',
    description: 'مطلوب فنيين صيدلة للعمل في فروعنا',
    requirements: [
      'دبلوم فني صيدلة',
      'خبرة في مجال الصيدليات',
      'مهارات خدمة عملاء جيدة',
    ],
  },
  {
    id: 'sales-representative',
    title: 'مندوب مبيعات',
    description: 'نبحث عن مندوبين مبيعات نشيطين',
    requirements: [
      'مؤهل عالي',
      'خبرة في المبيعات',
      'رخصة قيادة سارية',
    ],
  },
]

export default function HomePage() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const formik = useFormik({
    initialValues: {
      name: '',
      email: '',
      phone: '',
      position: '',
      resume: null as File | null,
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        setIsSubmitting(true)
        const formData = new FormData()
        Object.entries(values).forEach(([key, value]) => {
          if (value !== null) {
            formData.append(key, value)
          }
        })

        const response = await fetch('/api/applications', {
          method: 'POST',
          body: formData,
        })

        if (!response.ok) {
          throw new Error('Failed to submit application')
        }

        toast.success('Application submitted successfully!')
        formik.resetForm()
      } catch (error) {
        toast.error('Failed to submit application')
      } finally {
        setIsSubmitting(false)
      }
    },
  })

  return (
    <div className="py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-emerald-900 mb-4">
            انضم إلى فريق صيدليات الشاطوري
          </h1>
          <p className="text-xl text-emerald-700 mb-8">
            نحن نبحث عن مواهب متميزة للانضمام إلى فريقنا المتنامي
          </p>
        </div>

        <div className="mt-16">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {jobs.map((job) => (
              <div
                key={job.id}
                className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow"
              >
                <h3 className="text-2xl font-bold text-emerald-800 mb-4">
                  {job.title}
                </h3>
                <p className="text-gray-600 mb-4">{job.description}</p>
                <div className="mb-6">
                  <h4 className="font-semibold text-emerald-700 mb-2">المتطلبات:</h4>
                  <ul className="list-disc list-inside text-gray-600 space-y-1">
                    {job.requirements.map((req, index) => (
                      <li key={index}>{req}</li>
                    ))}
                  </ul>
                </div>
                <button
                  onClick={() => {
                    localStorage.setItem('selectedJob', JSON.stringify(job))
                    router.push('/apply')
                  }}
                  className="btn-primary w-full"
                >
                  تقدم الآن
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-16 bg-emerald-50 rounded-lg p-8">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-2xl font-bold text-emerald-900 mb-4">
              لماذا تنضم إلى صيدليات الشاطوري؟
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
              <div className="p-4">
                <div className="text-emerald-700 text-xl font-bold mb-2">
                  بيئة عمل محفزة
                </div>
                <p className="text-gray-600">
                  نوفر بيئة عمل إيجابية تدعم التطور المهني
                </p>
              </div>
              <div className="p-4">
                <div className="text-emerald-700 text-xl font-bold mb-2">
                  فرص للتطور
                </div>
                <p className="text-gray-600">
                  نقدم برامج تدريبية وفرص للترقي الوظيفي
                </p>
              </div>
              <div className="p-4">
                <div className="text-emerald-700 text-xl font-bold mb-2">
                  مزايا تنافسية
                </div>
                <p className="text-gray-600">
                  نقدم حزمة مزايا متكاملة لموظفينا
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-16 text-center">
          <h2 className="text-2xl font-bold text-emerald-900 mb-4">
            تواصل معنا
          </h2>
          <div className="text-gray-600">
            <p>العنوان: ٩ شارع واحد الجامعة القديمة الاسماعيلية</p>
            <p>رقم الهاتف: 01501504746</p>
            <p>البريد الإلكتروني: careers@elshatoury.com</p>
          </div>
        </div>
      </div>
    </div>
  )
} 