'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import ProgressBar from '../components/ProgressBar';
import { Listbox, Transition } from '@headlessui/react';
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/24/solid';
import { InformationCircleIcon } from '@heroicons/react/24/outline';

const jobs = [
  {
    id: 'pharmacist',
    title: 'صيدلي',
    requirements: [
      'بكالوريوس صيدلة',
      'ترخيص مزاولة المهنة',
      'عضوية نقابة الصيادلة',
      'خبرة لا تقل عن سنة',
    ],
    description: 'نبحث عن صيادلة متميزين للعمل في فروعنا المختلفة',
  },
  {
    id: 'pharmacy-technician',
    title: 'فني صيدلي',
    requirements: [
      'دبلوم فني صيدلة',
      'خبرة في مجال الصيدليات',
      'مهارات خدمة عملاء جيدة',
    ],
    description: 'مطلوب فنيين صيدلة للعمل في فروعنا',
  },
  {
    id: 'sales-representative',
    title: 'مندوب مبيعات',
    requirements: [
      'مؤهل عالي',
      'خبرة في المبيعات',
      'رخصة قيادة سارية',
    ],
    description: 'نبحث عن مندوبين مبيعات نشيطين',
  },
];

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

export default function JobSelectionPage() {
  const [selectedJob, setSelectedJob] = useState(jobs[0]);
  const router = useRouter();

  const handleJobSelect = (job: typeof jobs[0]) => {
    setSelectedJob(job);
  };

  const handleContinue = () => {
    localStorage.setItem('selectedJob', JSON.stringify(selectedJob));
    
    if (selectedJob.id === 'pharmacist') {
      router.push('/apply/pharmacist-requirements');
    } else {
      router.push('/apply/personal-info');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 py-12">
      <div className="max-w-3xl mx-auto">
        <ProgressBar currentStep={0} totalSteps={5} steps={steps} />

        <div className="mt-10 bg-white shadow-sm rounded-lg p-8">
          <h2 className="text-2xl font-bold text-emerald-900 mb-6">اختر الوظيفة المناسبة</h2>

          <div className="relative mt-2">
            <Listbox value={selectedJob} onChange={handleJobSelect}>
              <Listbox.Button className="relative w-full cursor-pointer rounded-lg bg-white py-3 pl-10 pr-4 text-right border border-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500">
                <span className="block truncate">{selectedJob.title}</span>
                <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-2">
                  <ChevronUpDownIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                </span>
              </Listbox.Button>
              <Transition
                enter="transition duration-100 ease-out"
                enterFrom="transform scale-95 opacity-0"
                enterTo="transform scale-100 opacity-100"
                leave="transition duration-75 ease-out"
                leaveFrom="transform scale-100 opacity-100"
                leaveTo="transform scale-95 opacity-0"
              >
                <Listbox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                  {jobs.map((job) => (
                    <Listbox.Option
                      key={job.id}
                      value={job}
                      className={({ active }) =>
                        `relative cursor-pointer select-none py-2 pl-10 pr-4 ${
                          active ? 'bg-emerald-50 text-emerald-900' : 'text-gray-900'
                        }`
                      }
                    >
                      {({ selected }) => (
                        <>
                          <span className={`block truncate ${selected ? 'font-medium' : 'font-normal'}`}>
                            {job.title}
                          </span>
                          {selected && (
                            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-emerald-600">
                              <CheckIcon className="h-5 w-5" aria-hidden="true" />
                            </span>
                          )}
                        </>
                      )}
                    </Listbox.Option>
                  ))}
                </Listbox.Options>
              </Transition>
            </Listbox>
          </div>

          {selectedJob && (
            <div className="mt-6 p-6 bg-emerald-50 rounded-lg border border-emerald-100">
              <div className="flex items-start space-x-4 space-x-reverse">
                <div className="flex-shrink-0 mt-0.5">
                  <InformationCircleIcon className="h-6 w-6 text-emerald-500" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-emerald-900 mb-2">متطلبات الوظيفة</h3>
                  <p className="text-emerald-800 mb-4">{selectedJob.description}</p>
                  <ul className="list-disc list-inside space-y-1 text-emerald-700">
                    {selectedJob.requirements.map((req, index) => (
                      <li key={index}>{req}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}

          <div className="mt-8">
            <button
              onClick={handleContinue}
              className="btn-primary w-full flex justify-center items-center space-x-2 space-x-reverse"
            >
              <span>متابعة</span>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 