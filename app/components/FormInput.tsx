'use client';

import React from 'react';
import { useField } from 'formik';

interface FormInputProps {
  label: string;
  name: string;
  type?: string;
  placeholder?: string;
  className?: string;
  required?: boolean;
  disabled?: boolean;
  dir?: 'rtl' | 'ltr';
  as?: 'input' | 'textarea' | 'select';
  children?: React.ReactNode;
}

export default function FormInput({
  label,
  type = 'text',
  className = '',
  required = false,
  disabled = false,
  dir = 'rtl',
  as = 'input',
  children,
  ...props
}: FormInputProps) {
  const [field, meta] = useField(props);
  const hasError = meta.touched && meta.error;

  const baseClasses = `mt-1 block w-full rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 ${
    hasError ? 'border-red-500' : 'border-gray-300'
  } ${disabled ? 'bg-gray-100 cursor-not-allowed' : ''} ${className}`;

  const renderInput = () => {
    const commonProps = {
      ...field,
      ...props,
      type,
      dir,
      disabled,
      className: baseClasses,
      'aria-describedby': hasError ? `${props.name}-error` : undefined,
    };

    switch (as) {
      case 'textarea':
        return <textarea {...commonProps} rows={4} />;
      case 'select':
        return (
          <select {...commonProps}>
            {children}
          </select>
        );
      default:
        return <input {...commonProps} />;
    }
  };

  return (
    <div>
      <label htmlFor={props.name} className="block text-sm font-medium text-gray-700">
        {label}
        {required && <span className="text-red-500">*</span>}
      </label>
      {renderInput()}
      {hasError && (
        <p className="mt-1 text-sm text-red-600" id={`${props.name}-error`}>
          {meta.error}
        </p>
      )}
    </div>
  );
} 