import React from 'react';

interface ProgressBarProps {
  currentStep: number;
  totalSteps: number;
  steps: { title: string; description: string }[];
}

export default function ProgressBar({ currentStep, totalSteps, steps }: ProgressBarProps) {
  return (
    <div className="py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <nav aria-label="Progress">
          <ol role="list" className="flex items-center">
            {steps.map((step, index) => (
              <li
                key={step.title}
                className={`relative ${
                  index !== steps.length - 1 ? 'pr-8 sm:pr-20' : ''
                } ${index !== 0 ? 'pl-8 sm:pl-20' : ''}`}
              >
                <div className="absolute inset-0 flex items-center" aria-hidden="true">
                  <div
                    className={`h-0.5 w-full ${
                      index < currentStep ? 'bg-blue-600' : 'bg-gray-200'
                    }`}
                  />
                </div>
                <div
                  className={`relative flex h-8 w-8 items-center justify-center rounded-full ${
                    index < currentStep
                      ? 'bg-blue-600'
                      : index === currentStep
                      ? 'border-2 border-blue-600 bg-white'
                      : 'border-2 border-gray-300 bg-white'
                  }`}
                >
                  <span
                    className={`text-sm font-semibold ${
                      index < currentStep
                        ? 'text-white'
                        : index === currentStep
                        ? 'text-blue-600'
                        : 'text-gray-500'
                    }`}
                  >
                    {index + 1}
                  </span>
                </div>
                <div className="mt-4 min-w-max">
                  <h3
                    className={`text-sm font-semibold ${
                      index <= currentStep ? 'text-blue-600' : 'text-gray-500'
                    }`}
                  >
                    {step.title}
                  </h3>
                  <p className="mt-1 text-xs text-gray-500">{step.description}</p>
                </div>
              </li>
            ))}
          </ol>
        </nav>
      </div>
    </div>
  );
} 