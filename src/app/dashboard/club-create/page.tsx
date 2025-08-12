"use client";

import { useState, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { createClub } from '../../../../lib/actions/club.action';
import { Upload, X, AlertCircle, Maximize2, Minimize2 } from 'lucide-react';

interface FormData {
  name: string;
  description: string;
  image: File | null;
}

interface FormErrors {
  name?: string;
  description?: string;
  image?: string;
  general?: string;
}

export default function ClubCreatePage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [formData, setFormData] = useState<FormData>({
    name: '',
    description: '',
    image: null
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [isDragOver, setIsDragOver] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageSize, setImageSize] = useState<number>(100); // Default size percentage
  const [isExpanded, setIsExpanded] = useState(false);

  // Convert file to base64 for preview and storage
  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
  };

  // Validate image file
  const validateImage = (file: File): string | null => {
    const maxSize = 5 * 1024 * 1024; // 5MB
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];

    if (!allowedTypes.includes(file.type)) {
      return 'Please upload a valid image file (JPEG, PNG, GIF, or WebP)';
    }

    if (file.size > maxSize) {
      return 'Image size must be less than 5MB';
    }

    return null;
  };

  // Handle file selection
  const handleFileSelect = useCallback(async (file: File) => {
    const error = validateImage(file);
    if (error) {
      setErrors(prev => ({ ...prev, image: error }));
      return;
    }

    try {
      const base64 = await fileToBase64(file);
      setFormData(prev => ({ ...prev, image: file }));
      setImagePreview(base64);
      setErrors(prev => ({ ...prev, image: undefined }));
      // Reset size when new image is uploaded
      setImageSize(100);
      setIsExpanded(false);
    } catch (error) {
      setErrors(prev => ({ ...prev, image: 'Failed to process image' }));
      console.error('Image processing error:', error);
    }
  }, []);

  // Handle drag and drop
  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);

    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  }, [handleFileSelect]);

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  // Handle file input change
  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  // Remove image
  const removeImage = () => {
    setFormData(prev => ({ ...prev, image: null }));
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Handle image size change
  const handleSizeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setImageSize(Number(e.target.value));
  };

  // Toggle expanded view
  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
    if (!isExpanded) {
      setImageSize(100); // Reset to full size when expanding
    }
  };

  // Validation function
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // Name validation
    if (!formData.name.trim()) {
      newErrors.name = 'Club name is required';
    } else if (formData.name.length < 3) {
      newErrors.name = 'Club name must be at least 3 characters long';
    } else if (formData.name.length > 50) {
      newErrors.name = 'Club name must be less than 50 characters';
    }

    // Description validation
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    } else if (formData.description.length < 10) {
      newErrors.description = 'Description must be at least 10 characters long';
    } else if (formData.description.length > 500) {
      newErrors.description = 'Description must be less than 500 characters';
    }

    // Image validation
    if (!formData.image) {
      newErrors.image = 'Club image is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error for this field when user starts typing
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSuccessMessage('');
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    
    try {
      // Convert image to base64 for storage
      const imageBase64 = formData.image ? await fileToBase64(formData.image) : '';
      
      const result = await createClub(formData.name, formData.description, imageBase64);
      
      if (result.success) {
        setSuccessMessage('Club created successfully!');
        // Reset form
        setFormData({ name: '', description: '', image: null });
        setImagePreview(null);
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
        // Reset image controls
        setImageSize(100);
        setIsExpanded(false);
        // Redirect after a short delay
        setTimeout(() => {
          router.push('/dashboard/clubs');
        }, 2000);
      } else {
        setErrors({ general: result.error?.message || 'Failed to create club. Please try again.' });
      }
    } catch (error) {
      setErrors({ general: 'An unexpected error occurred. Please try again.' });
      console.error('Error creating club:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Clear all messages
  const clearMessages = () => {
    setSuccessMessage('');
    setErrors({});
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
        <div className="px-6 py-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">Create a New Club</h1>
            <p className="text-gray-600 dark:text-gray-400">Fill in the details below to create your club</p>
          </div>

          {/* Success Message */}
          {successMessage && (
            <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-md">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-green-800 dark:text-green-200">{successMessage}</p>
                </div>
              </div>
            </div>
          )}

          {/* General Error Message */}
          {errors.general && (
            <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md">
              <div className="flex">
                <div className="flex-shrink-0">
                  <AlertCircle className="h-5 w-5 text-red-400" />
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-red-800 dark:text-red-200">{errors.general}</p>
                </div>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Club Name Field */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Club Name *
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500 transition duration-200 dark:bg-gray-700 dark:text-gray-100 ${
                  errors.name 
                    ? 'border-red-300 focus:border-red-500 dark:border-red-600' 
                    : 'border-gray-300 focus:border-teal-500 dark:border-gray-600'
                }`}
                placeholder="Enter club name"
                disabled={isLoading}
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.name}</p>
              )}
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">{formData.name.length}/50 characters</p>
            </div>

            {/* Description Field */}
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Description *
              </label>
              <textarea
                id="description"
                name="description"
                rows={4}
                value={formData.description}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500 transition duration-200 resize-vertical dark:bg-gray-700 dark:text-gray-100 ${
                  errors.description 
                    ? 'border-red-300 focus:border-red-500 dark:border-red-600' 
                    : 'border-gray-300 focus:border-teal-500 dark:border-gray-600'
                }`}
                placeholder="Describe your club's purpose and activities"
                disabled={isLoading}
              />
              {errors.description && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.description}</p>
              )}
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">{formData.description.length}/500 characters</p>
            </div>

            {/* Image Upload Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Club Image *
              </label>
              
              {!imagePreview ? (
                <div
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onClick={() => fileInputRef.current?.click()}
                  className={`relative border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-all duration-200 hover:border-teal-400 dark:hover:border-teal-500 ${
                    isDragOver
                      ? 'border-teal-400 bg-teal-50 dark:border-teal-500 dark:bg-teal-900/20'
                      : errors.image
                      ? 'border-red-300 dark:border-red-600'
                      : 'border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'
                  }`}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileInputChange}
                    className="hidden"
                    disabled={isLoading}
                  />
                  
                  <Upload className={`mx-auto h-12 w-12 mb-4 ${
                    isDragOver ? 'text-teal-500' : 'text-gray-400 dark:text-gray-500'
                  }`} />
                  
                  <div className="text-gray-600 dark:text-gray-400">
                    <p className="text-lg font-medium mb-2">
                      {isDragOver ? 'Drop your image here' : 'Click to upload or drag and drop'}
                    </p>
                    <p className="text-sm">
                      Supports: JPEG, PNG, GIF, WebP (Max 5MB)
                    </p>
                  </div>
                </div>
              ) : (
                <div className="relative">
                  <div className={`relative ${isExpanded ? 'fixed inset-0 z-50 bg-black bg-opacity-90 flex items-center justify-center p-4' : 'w-full bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden'}`}
                    style={isExpanded ? {} : { height: '400px' }}>
                    <Image
                      src={imagePreview}
                      alt="Club preview"
                      className={`${isExpanded ? 'max-w-full max-h-full' : 'w-full h-full object-contain'}`}
                      style={{ transform: `scale(${imageSize / 100})` }}
                      fill={!isExpanded}
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-20 transition-all duration-200 flex items-center justify-center">
                      <button
                        type="button"
                        onClick={removeImage}
                        className="absolute top-2 right-2 opacity-0 hover:opacity-100 transition-opacity duration-200 bg-red-500 text-white p-2 rounded-full hover:bg-red-600"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                  </div>

                  {/* Image Controls */}
                  <div className="mt-4 flex flex-col space-y-3">
                    <div className="flex items-center justify-between">
                      <button
                        type="button"
                        onClick={toggleExpand}
                        className="flex items-center text-sm text-teal-600 dark:text-teal-400 hover:text-teal-500 dark:hover:text-teal-300 font-medium"
                        disabled={isLoading}
                      >
                        {isExpanded ? (
                          <>
                            <Minimize2 className="w-4 h-4 mr-1" />
                            Minimize
                          </>
                        ) : (
                          <>
                            <Maximize2 className="w-4 h-4 mr-1" />
                            Expand
                          </>
                        )}
                      </button>
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="text-sm text-teal-600 dark:text-teal-400 hover:text-teal-500 dark:hover:text-teal-300 font-medium"
                        disabled={isLoading}
                      >
                        Change Image
                      </button>
                    </div>

                    {!isExpanded && (
                      <div className="space-y-2">
                        <label htmlFor="imageSize" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                          Image Size: {imageSize}%
                        </label>
                        <input
                          type="range"
                          id="imageSize"
                          min="10"
                          max="100"
                          step="5"
                          value={imageSize}
                          onChange={handleSizeChange}
                          className="w-full h-2 bg-gray-200 dark:bg-gray-600 rounded-lg appearance-none cursor-pointer"
                          disabled={isLoading}
                        />
                      </div>
                    )}
                  </div>
                </div>
              )}
              
              {errors.image && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.image}</p>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <button
                type="button"
                onClick={clearMessages}
                className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isLoading}
              >
                Clear
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="flex-1 px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-teal-600 hover:bg-teal-700 dark:bg-teal-600 dark:hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Creating...
                  </>
                ) : (
                  'Create Club'
                )}
              </button>
            </div>
          </form>

          {/* Back Link */}
          <div className="mt-6 text-center">
            <button
              onClick={() => router.back()}
              className="text-sm text-teal-600 dark:text-teal-400 hover:text-teal-500 dark:hover:text-teal-300 transition duration-200"
              disabled={isLoading}
            >
              ← Back to Clubs
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}