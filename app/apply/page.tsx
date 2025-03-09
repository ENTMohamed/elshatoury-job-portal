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
    requirements: 'يتطلب شهادة صيدلة وترخيص مزاولة المهنة وعضوية نقابة الصيادلة',
  },
  {
    id: 'assistant',
    title: 'مساعد صيدلي',
    requirements: 'خبرة في العمل كمساعد صيدلي لا تقل عن سنتين',
  },
  {
    id: 'accountant',
    title: 'مدير حسابات ورقابة مالية',
    requirements: 'بكالوريوس تجارة وخبرة 5 سنوات في إدارة الحسابات والرقابة المالية',
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
    // Store selected job in localStorage
    localStorage.setItem('selectedJob', JSON.stringify(selectedJob));
    
    // If pharmacist, redirect to pharmacist requirements page
    if (selectedJob.id === 'pharmacist') {
      router.push('/apply/pharmacist-requirements');
    } else {
      // For other jobs, go directly to personal info
      router.push('/apply/personal-info');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-3xl mx-auto">
        <ProgressBar currentStep={0} totalSteps={5} steps={steps} />

        <div className="mt-10 bg-white shadow-sm rounded-lg p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">اختر الوظيفة المناسبة</h2>

          <div className="relative mt-2">
            <Listbox value={selectedJob} onChange={handleJobSelect}>
              <Listbox.Button className="relative w-full cursor-pointer rounded-lg bg-white py-3 pl-10 pr-4 text-right border focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
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
                          active ? 'bg-blue-100 text-blue-900' : 'text-gray-900'
                        }`
                      }
                    >
                      {({ selected }) => (
                        <>
                          <span className={`block truncate ${selected ? 'font-medium' : 'font-normal'}`}>
                            {job.title}
                          </span>
                          {selected && (
                            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-blue-600">
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
            <div className="mt-4 p-4 bg-blue-50 rounded-lg">
              <h3 className="text-lg font-medium text-blue-900 mb-2">متطلبات الوظيفة</h3>
              <p className="text-blue-700">{selectedJob.requirements}</p>
            </div>
          )}

          <div className="mt-6">
            <button
              onClick={handleContinue}
              className="w-full bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              متابعة
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 