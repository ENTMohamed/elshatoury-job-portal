'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';

interface UseFormStepProps {
  totalSteps: number;
  initialStep?: number;
  onStepComplete?: (step: number) => void;
  onFormComplete?: () => void;
}

export function useFormStep({
  totalSteps,
  initialStep = 1,
  onStepComplete,
  onFormComplete,
}: UseFormStepProps) {
  const [currentStep, setCurrentStep] = useState(initialStep);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const nextStep = useCallback(async () => {
    if (currentStep < totalSteps) {
      if (onStepComplete) {
        await onStepComplete(currentStep);
      }
      setCurrentStep((prev) => prev + 1);
      return true;
    } else if (currentStep === totalSteps) {
      if (onFormComplete) {
        setIsSubmitting(true);
        try {
          await onFormComplete();
          return true;
        } catch (error) {
          console.error('Form completion error:', error);
          return false;
        } finally {
          setIsSubmitting(false);
        }
      }
    }
    return false;
  }, [currentStep, totalSteps, onStepComplete, onFormComplete]);

  const previousStep = useCallback(() => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
      return true;
    }
    return false;
  }, [currentStep]);

  const goToStep = useCallback((step: number) => {
    if (step >= 1 && step <= totalSteps) {
      setCurrentStep(step);
      return true;
    }
    return false;
  }, [totalSteps]);

  return {
    currentStep,
    isSubmitting,
    nextStep,
    previousStep,
    goToStep,
    isFirstStep: currentStep === 1,
    isLastStep: currentStep === totalSteps,
    progress: (currentStep / totalSteps) * 100,
  };
} 