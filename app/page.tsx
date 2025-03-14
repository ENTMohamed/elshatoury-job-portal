'use client'

import { useState } from 'react'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import toast from 'react-hot-toast'

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

export default function JobApplication() {
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
    <div className="max-w-2xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          التقديم للوظائف
        </h1>
        <p className="mt-2 text-lg text-gray-600">
          انضم إلى فريقنا وكن جزءاً من نجاحنا
        </p>
        <div className="mt-4 text-sm text-gray-500">
          <p>العنوان: ٩ شارع واحد الجامعة القديمة الاسماعيلية</p>
          <p>رقم الهاتف: 01501504746</p>
        </div>
      </div>

      <div className="bg-white shadow sm:rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <form onSubmit={formik.handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700"
              >
                Full Name
              </label>
              <div className="mt-1">
                <input
                  id="name"
                  type="text"
                  className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  {...formik.getFieldProps('name')}
                />
              </div>
              {formik.touched.name && formik.errors.name && (
                <p className="mt-2 text-sm text-red-600">
                  {formik.errors.name}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  type="email"
                  className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  {...formik.getFieldProps('email')}
                />
              </div>
              {formik.touched.email && formik.errors.email && (
                <p className="mt-2 text-sm text-red-600">
                  {formik.errors.email}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="phone"
                className="block text-sm font-medium text-gray-700"
              >
                Phone Number
              </label>
              <div className="mt-1">
                <input
                  id="phone"
                  type="tel"
                  className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  {...formik.getFieldProps('phone')}
                />
              </div>
              {formik.touched.phone && formik.errors.phone && (
                <p className="mt-2 text-sm text-red-600">
                  {formik.errors.phone}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="position"
                className="block text-sm font-medium text-gray-700"
              >
                Position
              </label>
              <div className="mt-1">
                <select
                  id="position"
                  className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  {...formik.getFieldProps('position')}
                >
                  <option value="">Select a position</option>
                  <option value="pharmacist">Pharmacist</option>
                  <option value="pharmacy-technician">
                    Pharmacy Technician
                  </option>
                  <option value="sales-representative">
                    Sales Representative
                  </option>
                  <option value="store-manager">Store Manager</option>
                </select>
              </div>
              {formik.touched.position && formik.errors.position && (
                <p className="mt-2 text-sm text-red-600">
                  {formik.errors.position}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="resume"
                className="block text-sm font-medium text-gray-700"
              >
                Resume
              </label>
              <div className="mt-1">
                <input
                  id="resume"
                  type="file"
                  accept=".pdf,.doc,.docx"
                  className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  onChange={(event) => {
                    const file = event.currentTarget.files?.[0]
                    formik.setFieldValue('resume', file || null)
                  }}
                />
              </div>
              {formik.touched.resume && formik.errors.resume && (
                <p className="mt-2 text-sm text-red-600">
                  {formik.errors.resume}
                </p>
              )}
              <p className="mt-2 text-sm text-gray-500">
                Accepted formats: PDF, DOC, DOCX (max 5MB)
              </p>
            </div>

            <div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Submitting...' : 'Submit Application'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
} 