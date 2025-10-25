"use client";

import { useState, useRef, useCallback } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { createClub } from '../../../../lib/actions/club.action';
import { Upload, X, AlertCircle, Maximize2, Minimize2, RotateCw, Crop, ZoomIn, ZoomOut } from 'lucide-react';

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

interface CropData {
  x: number;
  y: number;
  width: number;
  height: number;
  scale: number;
  rotation: number;
}

export default function ClubCreatePage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  
  const [formData, setFormData] = useState<FormData>({
    name: '',
    description: '',
    image: null
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [isDragOver, setIsDragOver] = useState(false);
  const [originalImagePreview, setOriginalImagePreview] = useState<string | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [showImageEditor, setShowImageEditor] = useState(false);
  
  // Crop and transform states
  const [cropData, setCropData] = useState<CropData>({
    x: 50,
    y: 50,
    width: 300,
    height: 300,
    scale: 1,
    rotation: 0
  });
  
  // Convert file to base64 for preview and storage
  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
  };

  // Convert blob to file
  const blobToFile = (blob: Blob, fileName: string): File => {
    return new File([blob], fileName, { type: blob.type });
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
      setOriginalImagePreview(base64);
      setImagePreview(base64);
      setErrors(prev => ({ ...prev, image: undefined }));
      
      // Reset crop data for new image
      setCropData({
        x: 50,
        y: 50,
        width: 300,
        height: 300,
        scale: 1,
        rotation: 0
      });
      
      setShowImageEditor(false);
      setIsExpanded(false);
    } catch (error) {
      setErrors(prev => ({ ...prev, image: 'Failed to process image' }));
      console.error('Image processing error:', error);
    }
  }, []);

  // Create cropped canvas with proper scaling and rotation
  const getCroppedCanvas = (): Promise<HTMLCanvasElement | null> => {
    if (!originalImagePreview) return Promise.resolve(null);
    
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    if (!ctx) return Promise.resolve(null);

    // Create image element
    const img = new window.Image();
    img.crossOrigin = 'anonymous';
    
    return new Promise<HTMLCanvasElement>((resolve, reject) => {
      img.onload = () => {
        // Set canvas size to crop dimensions
        canvas.width = cropData.width;
        canvas.height = cropData.height;
        
        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Calculate image dimensions and positioning
        const imgAspectRatio = img.width / img.height;
        const containerWidth = 600; // Approximate container width
        const containerHeight = 400; // Approximate container height
        
        let drawWidth, drawHeight, offsetX, offsetY;
        
        if (imgAspectRatio > containerWidth / containerHeight) {
          // Image is wider - fit by height
          drawHeight = containerHeight;
          drawWidth = drawHeight * imgAspectRatio;
          offsetX = (containerWidth - drawWidth) / 2;
          offsetY = 0;
        } else {
          // Image is taller - fit by width
          drawWidth = containerWidth;
          drawHeight = drawWidth / imgAspectRatio;
          offsetX = 0;
          offsetY = (containerHeight - drawHeight) / 2;
        }
        
        // Apply scale
        drawWidth *= cropData.scale;
        drawHeight *= cropData.scale;
        
        // Calculate source crop area relative to scaled image
        const scaleFactorX = img.width / drawWidth;
        const scaleFactorY = img.height / drawHeight;
        
        const sourceX = (cropData.x - offsetX) * scaleFactorX;
        const sourceY = (cropData.y - offsetY) * scaleFactorY;
        const sourceWidth = cropData.width * scaleFactorX;
        const sourceHeight = cropData.height * scaleFactorY;
        
        // Save context for rotation
        ctx.save();
        
        // Move to center of canvas for rotation
        ctx.translate(canvas.width / 2, canvas.height / 2);
        
        // Apply rotation
        ctx.rotate((cropData.rotation * Math.PI) / 180);
        
        // Draw the cropped portion
        ctx.drawImage(
          img,
          Math.max(0, sourceX),
          Math.max(0, sourceY),
          Math.min(sourceWidth, img.width - sourceX),
          Math.min(sourceHeight, img.height - sourceY),
          -canvas.width / 2,
          -canvas.height / 2,
          canvas.width,
          canvas.height
        );
        
        ctx.restore();
        resolve(canvas);
      };
      
      img.onerror = () => reject(new Error('Failed to load image'));
      img.src = originalImagePreview;
    });
  };

  // Convert canvas to blob
  const canvasToBlob = (canvas: HTMLCanvasElement): Promise<Blob> => {
    return new Promise((resolve, reject) => {
      canvas.toBlob((blob) => {
        if (blob) {
          resolve(blob);
        } else {
          reject(new Error('Failed to create blob from canvas'));
        }
      }, 'image/jpeg', 0.9);
    });
  };

  // Apply crop and close editor
  const applyCrop = async () => {
    if (!originalImagePreview) return;
    
    try {
      const canvas = await getCroppedCanvas();
      if (!canvas) {
        throw new Error('Failed to create canvas');
      }
      
      const blob = await canvasToBlob(canvas);
      const croppedFile = blobToFile(blob, 'cropped-image.jpg');
      const croppedBase64 = await fileToBase64(croppedFile);
      
      setFormData(prev => ({ ...prev, image: croppedFile }));
      setImagePreview(croppedBase64);
      setShowImageEditor(false);
    } catch (error) {
      console.error('Error applying crop:', error);
      setErrors(prev => ({ ...prev, image: 'Failed to process cropped image' }));
    }
  };

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
    setOriginalImagePreview(null);
    setShowImageEditor(false);
    setIsExpanded(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Clear the entire form
  const clearForm = () => {
    setFormData({
      name: '',
      description: '',
      image: null
    });
    setImagePreview(null);
    setOriginalImagePreview(null);
    setErrors({});
    setSuccessMessage('');
    setShowImageEditor(false);
    setIsExpanded(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Toggle expanded view
  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  // Open image editor
  const openImageEditor = () => {
    if (originalImagePreview) {
      setShowImageEditor(true);
    }
  };

  // Crop control handlers
  const handleScaleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCropData(prev => ({ ...prev, scale: Number(e.target.value) }));
  };

  const handleRotationChange = (direction: 'left' | 'right') => {
    setCropData(prev => ({
      ...prev,
      rotation: prev.rotation + (direction === 'right' ? 90 : -90)
    }));
  };

  const handleCropSizeChange = (dimension: 'width' | 'height', value: number) => {
    setCropData(prev => ({ ...prev, [dimension]: Math.max(100, Math.min(800, value)) }));
  };

  const resetCrop = () => {
    setCropData({
      x: 50,
      y: 50,
      width: 300,
      height: 300,
      scale: 1,
      rotation: 0
    });
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
        clearForm();
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
                  {/* Image Preview Container */}
                  {isExpanded ? (
                    <div className="fixed inset-0 z-50 bg-black bg-opacity-90 flex items-center justify-center p-4">
                      <div className="relative max-w-full max-h-full">
                        <Image
                          src={imagePreview}
                          alt="Club preview"
                          className="max-w-full max-h-full object-contain"
                        />
                        <button
                          onClick={toggleExpand}
                          className="absolute top-4 right-4 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75 transition-all"
                        >
                          <X className="w-6 h-6" />
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="relative w-full bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden" style={{ height: '300px' }}>
                      <Image
                        src={imagePreview}
                        alt="Club preview"
                        className="w-full h-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={removeImage}
                        className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  )}

                  {/* Image Controls */}
                  <div className="mt-4 flex flex-wrap gap-2 justify-between items-center">
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={openImageEditor}
                        className="flex items-center px-3 py-1 text-sm bg-teal-500 text-white rounded-md hover:bg-teal-600 transition-colors"
                        disabled={isLoading}
                      >
                        <Crop className="w-4 h-4 mr-1" />
                        Edit & Crop
                      </button>
                      <button
                        type="button"
                        onClick={toggleExpand}
                        className="flex items-center px-3 py-1 text-sm bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors"
                        disabled={isLoading}
                      >
                        {isExpanded ? <Minimize2 className="w-4 h-4 mr-1" /> : <Maximize2 className="w-4 h-4 mr-1" />}
                        {isExpanded ? 'Minimize' : 'Expand'}
                      </button>
                    </div>
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="text-sm text-teal-600 dark:text-teal-400 hover:text-teal-500 dark:hover:text-teal-300 font-medium"
                      disabled={isLoading}
                    >
                      Change Image
                    </button>
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
                onClick={clearForm}
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

      {/* Image Editor Modal */}
      {showImageEditor && originalImagePreview && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-75 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg max-w-4xl w-full max-h-full overflow-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Edit Image</h3>
                <button
                  onClick={() => setShowImageEditor(false)}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Image Preview Area */}
              <div className="relative bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden mb-4 mx-auto" style={{ width: '600px', height: '400px' }}>
                <Image
                  ref={imageRef}
                  src={originalImagePreview}
                  alt="Original"
                  className="absolute inset-0 w-full h-full object-contain"
                  style={{
                    transform: `scale(${cropData.scale}) rotate(${cropData.rotation}deg)`,
                    transformOrigin: 'center'
                  }}
                />
                
                {/* Crop Overlay */}
                <div
                  className="absolute border-2 border-teal-500 bg-teal-500 bg-opacity-20 cursor-move"
                  style={{
                    left: `${cropData.x}px`,
                    top: `${cropData.y}px`,
                    width: `${cropData.width}px`,
                    height: `${cropData.height}px`,
                    minWidth: '100px',
                    minHeight: '100px'
                  }}
                >
                  <div className="absolute inset-0 border border-white opacity-50"></div>
                  {/* Corner indicators */}
                  <div className="absolute -top-1 -left-1 w-3 h-3 bg-teal-500 border border-white"></div>
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-teal-500 border border-white"></div>
                  <div className="absolute -bottom-1 -left-1 w-3 h-3 bg-teal-500 border border-white"></div>
                  <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-teal-500 border border-white"></div>
                </div>
              </div>

              {/* Controls */}
              <div className="space-y-4">
                {/* Scale Control */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Scale: {Math.round(cropData.scale * 100)}%
                  </label>
                  <div className="flex items-center gap-2">
                    <ZoomOut className="w-4 h-4 text-gray-500" />
                    <input
                      type="range"
                      min="0.1"
                      max="3"
                      step="0.1"
                      value={cropData.scale}
                      onChange={handleScaleChange}
                      className="flex-1"
                    />
                    <ZoomIn className="w-4 h-4 text-gray-500" />
                  </div>
                </div>

                {/* Rotation Controls */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Rotation: {cropData.rotation}°
                  </label>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => handleRotationChange('left')}
                      className="flex items-center px-3 py-1 bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 rounded hover:bg-gray-300 dark:hover:bg-gray-500"
                    >
                      <RotateCw className="w-4 h-4 mr-1 transform scale-x-[-1]" />
                      90° Left
                    </button>
                    <button
                      type="button"
                      onClick={() => handleRotationChange('right')}
                      className="flex items-center px-3 py-1 bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 rounded hover:bg-gray-300 dark:hover:bg-gray-500"
                    >
                      <RotateCw className="w-4 h-4 mr-1" />
                      90° Right
                    </button>
                  </div>
                </div>

                {/* Crop Position Controls */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      X Position: {cropData.x}px
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="400"
                      step="5"
                      value={cropData.x}
                      onChange={(e) => setCropData(prev => ({ ...prev, x: Number(e.target.value) }))}
                      className="w-full"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Y Position: {cropData.y}px
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="300"
                      step="5"
                      value={cropData.y}
                      onChange={(e) => setCropData(prev => ({ ...prev, y: Number(e.target.value) }))}
                      className="w-full"
                    />
                  </div>
                </div>

                {/* Crop Size Controls */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Width: {cropData.width}px
                    </label>
                    <input
                      type="range"
                      min="100"
                      max="600"
                      step="10"
                      value={cropData.width}
                      onChange={(e) => handleCropSizeChange('width', Number(e.target.value))}
                      className="w-full"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Height: {cropData.height}px
                    </label>
                    <input
                      type="range"
                      min="100"
                      max="400"
                      step="10"
                      value={cropData.height}
                      onChange={(e) => handleCropSizeChange('height', Number(e.target.value))}
                      className="w-full"
                    />
                  </div>
                </div>

                {/* Preset Crop Ratios */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Quick Ratios
                  </label>
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => setCropData(prev => ({ ...prev, width: 300, height: 300 }))}
                      className="px-3 py-1 text-sm bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 rounded hover:bg-gray-300 dark:hover:bg-gray-500"
                    >
                      1:1 Square
                    </button>
                    <button
                      type="button"
                      onClick={() => setCropData(prev => ({ ...prev, width: 400, height: 300 }))}
                      className="px-3 py-1 text-sm bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 rounded hover:bg-gray-300 dark:hover:bg-gray-500"
                    >
                      4:3 Standard
                    </button>
                    <button
                      type="button"
                      onClick={() => setCropData(prev => ({ ...prev, width: 480, height: 270 }))}
                      className="px-3 py-1 text-sm bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 rounded hover:bg-gray-300 dark:hover:bg-gray-500"
                    >
                      16:9 Wide
                    </button>
                    <button
                      type="button"
                      onClick={() => setCropData(prev => ({ ...prev, width: 300, height: 400 }))}
                      className="px-3 py-1 text-sm bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 rounded hover:bg-gray-300 dark:hover:bg-gray-500"
                    >
                      3:4 Portrait
                    </button>
                  </div>
                </div>

                {/* Preview of Cropped Result */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Crop Preview
                  </label>
                  <div className="flex justify-center">
                    <div 
                      className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden bg-gray-50 dark:bg-gray-700"
                      style={{ width: `${Math.min(cropData.width, 200)}px`, height: `${Math.min(cropData.height, 150)}px` }}
                    >
                      <div 
                        className="w-full h-full bg-center bg-no-repeat"
                        style={{
                          backgroundImage: `url(${originalImagePreview})`,
                          backgroundSize: `${600 * cropData.scale}px ${400 * cropData.scale}px`,
                          backgroundPosition: `-${cropData.x * (Math.min(cropData.width, 200) / cropData.width)}px -${cropData.y * (Math.min(cropData.height, 150) / cropData.height)}px`,
                          transform: `rotate(${cropData.rotation}deg)`
                        }}
                      />
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={resetCrop}
                    className="px-4 py-2 text-sm bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 rounded hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors"
                  >
                    Reset
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowImageEditor(false)}
                    className="px-4 py-2 text-sm bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={applyCrop}
                    className="px-4 py-2 text-sm bg-teal-600 text-white rounded hover:bg-teal-700 transition-colors"
                  >
                    Apply Crop
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Hidden Canvas for Image Processing */}
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
}