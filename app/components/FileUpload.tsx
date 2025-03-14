'use client';

import React, { useCallback, useState } from 'react';
import { DocumentIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { fileValidation } from '@/utils/validation';
import { storeFile, formatFileSize } from '@/utils/fileUpload';
import LoadingSpinner from './LoadingSpinner';

interface FileUploadProps {
  label: string;
  name: string;
  required?: boolean;
  accept?: string;
  maxSize?: number;
  onChange: (file: File | null) => void;
  initialFile?: File | null;
  error?: string;
}

export default function FileUpload({
  label,
  name,
  required = false,
  accept = '.pdf,.jpg,.jpeg,.png',
  maxSize = fileValidation.maxSize,
  onChange,
  initialFile = null,
  error,
}: FileUploadProps) {
  const [file, setFile] = useState<File | null>(initialFile);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const handleFile = useCallback(async (selectedFile: File) => {
    setIsUploading(true);
    setUploadError(null);

    try {
      const validationError = fileValidation.validateFile(selectedFile);
      if (validationError) {
        setUploadError(validationError);
        return;
      }

      // Store file in sessionStorage
      const stored = await storeFile(name, selectedFile);
      if (!stored) {
        throw new Error('فشل في تخزين الملف');
      }

      setFile(selectedFile);
      onChange(selectedFile);
    } catch (error) {
      console.error('File upload error:', error);
      setUploadError('حدث خطأ أثناء رفع الملف');
    } finally {
      setIsUploading(false);
    }
  }, [name, onChange]);

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);

    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      handleFile(droppedFile);
    }
  }, [handleFile]);

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      handleFile(selectedFile);
    }
  }, [handleFile]);

  const removeFile = useCallback(() => {
    setFile(null);
    onChange(null);
    sessionStorage.removeItem(name);
  }, [name, onChange]);

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700">
        {label}
        {required && <span className="text-red-500">*</span>}
      </label>

      {!file && (
        <div
          className={`mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed rounded-md ${
            isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
          } ${error || uploadError ? 'border-red-500' : ''}`}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
        >
          <div className="space-y-1 text-center">
            <DocumentIcon className="mx-auto h-12 w-12 text-gray-400" />
            <div className="flex text-sm text-gray-600">
              <label
                htmlFor={name}
                className="relative cursor-pointer rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500"
              >
                <span>اختر ملف</span>
                <input
                  id={name}
                  name={name}
                  type="file"
                  className="sr-only"
                  accept={accept}
                  onChange={handleChange}
                  disabled={isUploading}
                />
              </label>
              <p className="pr-1">أو اسحب وأفلت</p>
            </div>
            <p className="text-xs text-gray-500">
              PDF, PNG, JPG حتى {formatFileSize(maxSize)}
            </p>
          </div>
        </div>
      )}

      {file && (
        <div className="mt-1 flex items-center justify-between p-4 border rounded-md">
          <div className="flex items-center">
            <DocumentIcon className="h-8 w-8 text-gray-400 ml-3" />
            <div>
              <p className="text-sm font-medium text-gray-900">{file.name}</p>
              <p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={removeFile}
            className="text-gray-400 hover:text-gray-500"
          >
            <XMarkIcon className="h-5 w-5" />
          </button>
        </div>
      )}

      {isUploading && (
        <div className="mt-2 flex items-center text-sm text-gray-500">
          <LoadingSpinner size="sm" color="text-blue-500" />
          <span className="mr-2">جاري رفع الملف...</span>
        </div>
      )}

      {(error || uploadError) && (
        <p className="mt-2 text-sm text-red-600">{error || uploadError}</p>
      )}
    </div>
  );
} 