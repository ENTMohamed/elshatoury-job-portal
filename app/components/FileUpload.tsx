import React, { useRef, useState } from 'react';
import { DocumentIcon, XCircleIcon } from '@heroicons/react/24/outline';

interface FileUploadProps {
  label: string;
  accept: string;
  maxSize: number; // in MB
  required?: boolean;
  onChange: (file: File | null) => void;
  error?: string;
}

export default function FileUpload({
  label,
  accept,
  maxSize,
  required = false,
  onChange,
  error,
}: FileUploadProps) {
  const [preview, setPreview] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      setPreview(null);
      setFileName('');
      onChange(null);
      return;
    }

    // Check file size
    if (file.size > maxSize * 1024 * 1024) {
      alert(`حجم الملف يجب أن يكون أقل من ${maxSize} ميجابايت`);
      return;
    }

    setFileName(file.name);
    onChange(file);

    // Create preview for images
    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setPreview(null);
    }
  };

  const handleRemove = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    setPreview(null);
    setFileName('');
    onChange(null);
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">
        {label}
        {required && <span className="text-red-500">*</span>}
      </label>
      <div
        className={`mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed rounded-md ${
          error ? 'border-red-300' : 'border-gray-300'
        }`}
      >
        <div className="space-y-1 text-center">
          {preview ? (
            <div className="relative">
              <img src={preview} alt="Preview" className="mx-auto h-32 w-auto" />
              <button
                type="button"
                onClick={handleRemove}
                className="absolute top-0 right-0 text-gray-500 hover:text-red-500"
              >
                <XCircleIcon className="h-6 w-6" />
              </button>
            </div>
          ) : fileName ? (
            <div className="relative flex items-center justify-center">
              <DocumentIcon className="mx-auto h-12 w-12 text-gray-400" />
              <button
                type="button"
                onClick={handleRemove}
                className="absolute -top-2 -right-2 text-gray-500 hover:text-red-500"
              >
                <XCircleIcon className="h-6 w-6" />
              </button>
            </div>
          ) : (
            <DocumentIcon className="mx-auto h-12 w-12 text-gray-400" />
          )}
          <div className="flex text-sm text-gray-600">
            <label
              htmlFor={`file-upload-${label}`}
              className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500"
            >
              <span>تحميل ملف</span>
              <input
                id={`file-upload-${label}`}
                name={`file-upload-${label}`}
                type="file"
                ref={fileInputRef}
                className="sr-only"
                accept={accept}
                onChange={handleFileChange}
                required={required}
              />
            </label>
            <p className="pr-1">أو اسحب وأفلت</p>
          </div>
          <p className="text-xs text-gray-500">
            {fileName || `${accept} حتى ${maxSize} ميجابايت`}
          </p>
        </div>
      </div>
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
} 