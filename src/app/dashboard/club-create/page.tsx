"use client";

import { useState, useRef, useCallback } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { createClub } from '../../../../lib/actions/club.action';
import { 
  Upload, 
  X, 
  AlertCircle, 
  Maximize2, 
  Minimize2, 
  RotateCw, 
  Crop, 
  ZoomIn, 
  ZoomOut,
  Palette,
  Sparkles,
  Users,
  FileText,
  Image as ImageIcon
} from 'lucide-react';

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

    const img = new window.Image();
    img.crossOrigin = 'anonymous';
    
    return new Promise<HTMLCanvasElement>((resolve, reject) => {
      img.onload = () => {
        canvas.width = cropData.width;
        canvas.height = cropData.height;
        
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        const imgAspectRatio = img.width / img.height;
        const containerWidth = 600;
        const containerHeight = 400;
        
        let drawWidth, drawHeight, offsetX, offsetY;
        
        if (imgAspectRatio > containerWidth / containerHeight) {
          drawHeight = containerHeight;
          drawWidth = drawHeight * imgAspectRatio;
          offsetX = (containerWidth - drawWidth) / 2;
          offsetY = 0;
        } else {
          drawWidth = containerWidth;
          drawHeight = drawWidth / imgAspectRatio;
          offsetX = 0;
          offsetY = (containerHeight - drawHeight) / 2;
        }
        
        drawWidth *= cropData.scale;
        drawHeight *= cropData.scale;
        
        const scaleFactorX = img.width / drawWidth;
        const scaleFactorY = img.height / drawHeight;
        
        const sourceX = (cropData.x - offsetX) * scaleFactorX;
        const sourceY = (cropData.y - offsetY) * scaleFactorY;
        const sourceWidth = cropData.width * scaleFactorX;
        const sourceHeight = cropData.height * scaleFactorY;
        
        ctx.save();
        ctx.translate(canvas.width / 2, canvas.height / 2);
        ctx.rotate((cropData.rotation * Math.PI) / 180);
        
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

    if (!formData.name.trim()) {
      newErrors.name = 'Club name is required';
    } else if (formData.name.length < 3) {
      newErrors.name = 'Club name must be at least 3 characters long';
    } else if (formData.name.length > 50) {
      newErrors.name = 'Club name must be less than 50 characters';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    } else if (formData.description.length < 10) {
      newErrors.description = 'Description must be at least 10 characters long';
    } else if (formData.description.length > 500) {
      newErrors.description = 'Description must be less than 500 characters';
    }

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
      const imageBase64 = formData.image ? await fileToBase64(formData.image) : '';
      
      const result = await createClub(formData.name, formData.description, imageBase64);
      
      if (result.success) {
        setSuccessMessage('Club created successfully!');
        clearForm();
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-teal-50/30 dark:from-gray-900 dark:via-blue-950/20 dark:to-teal-950/20 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-teal-500 to-blue-500 rounded-full mb-4 shadow-lg">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-teal-700 dark:from-gray-100 dark:to-teal-300 bg-clip-text text-transparent mb-3">
            Create New Club
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-md mx-auto">
            Bring your community together with a stunning club presence
          </p>
        </div>

        {/* Main Form Card */}
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200/50 dark:border-gray-700/50 overflow-hidden">
          <div className="px-6 py-8">
            {/* Progress Steps */}
            <div className="flex items-center justify-center mb-8">
              <div className="flex items-center space-x-4">
                <div className="flex items-center">
                  <div className="w-8 h-8 rounded-full bg-teal-500 text-white flex items-center justify-center text-sm font-semibold">
                    1
                  </div>
                  <span className="ml-2 text-sm font-medium text-gray-700 dark:text-gray-300">Details</span>
                </div>
                <div className="w-12 h-0.5 bg-gray-300 dark:bg-gray-600"></div>
                <div className="flex items-center">
                  <div className="w-8 h-8 rounded-full bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 flex items-center justify-center text-sm font-semibold">
                    2
                  </div>
                  <span className="ml-2 text-sm font-medium text-gray-500 dark:text-gray-400">Image</span>
                </div>
                <div className="w-12 h-0.5 bg-gray-300 dark:bg-gray-600"></div>
                <div className="flex items-center">
                  <div className="w-8 h-8 rounded-full bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 flex items-center justify-center text-sm font-semibold">
                    3
                  </div>
                  <span className="ml-2 text-sm font-medium text-gray-500 dark:text-gray-400">Review</span>
                </div>
              </div>
            </div>

            {/* Success Message */}
            {successMessage && (
              <div className="mb-6 p-4 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border border-green-200 dark:border-green-800 rounded-xl">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                      <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-green-800 dark:text-green-200">{successMessage}</p>
                  </div>
                </div>
              </div>
            )}

            {/* General Error Message */}
            {errors.general && (
              <div className="mb-6 p-4 bg-gradient-to-r from-red-50 to-pink-50 dark:from-red-900/20 dark:to-pink-900/20 border border-red-200 dark:border-red-800 rounded-xl">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <AlertCircle className="w-5 h-5 text-red-500" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-red-800 dark:text-red-200">{errors.general}</p>
                  </div>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Club Name Field */}
              <div className="group">
                <label htmlFor="name" className="flex items-center text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                  <Users className="w-4 h-4 mr-2 text-teal-500" />
                  Club Name *
                </label>
                <div className="relative">
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 bg-white dark:bg-gray-700 border-2 rounded-xl shadow-sm focus:outline-none transition-all duration-300 dark:text-gray-100 group-hover:shadow-md ${
                      errors.name 
                        ? 'border-red-300 focus:border-red-500 dark:border-red-600' 
                        : 'border-gray-200 dark:border-gray-600 focus:border-teal-500 dark:focus:border-teal-400'
                    }`}
                    placeholder="Enter an inspiring club name..."
                    disabled={isLoading}
                  />
                </div>
                {errors.name && (
                  <p className="mt-2 text-sm text-red-600 dark:text-red-400 flex items-center">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    {errors.name}
                  </p>
                )}
                <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                  {formData.name.length}/50 characters • Be creative and descriptive
                </p>
              </div>

              {/* Description Field */}
              <div className="group">
                <label htmlFor="description" className="flex items-center text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                  <FileText className="w-4 h-4 mr-2 text-teal-500" />
                  Description *
                </label>
                <div className="relative">
                  <textarea
                    id="description"
                    name="description"
                    rows={4}
                    value={formData.description}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 bg-white dark:bg-gray-700 border-2 rounded-xl shadow-sm focus:outline-none transition-all duration-300 resize-vertical dark:text-gray-100 group-hover:shadow-md ${
                      errors.description 
                        ? 'border-red-300 focus:border-red-500 dark:border-red-600' 
                        : 'border-gray-200 dark:border-gray-600 focus:border-teal-500 dark:focus:border-teal-400'
                    }`}
                    placeholder="What makes your club special? Describe your mission, activities, and community..."
                    disabled={isLoading}
                  />
                </div>
                {errors.description && (
                  <p className="mt-2 text-sm text-red-600 dark:text-red-400 flex items-center">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    {errors.description}
                  </p>
                )}
                <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                  {formData.description.length}/500 characters • Share your club&spos;s story and vision
                </p>
              </div>

              {/* Image Upload Field */}
              <div className="group">
                <label className="flex items-center text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                  <ImageIcon className="w-4 h-4 mr-2 text-teal-500" />
                  Club Image *
                </label>
                
                {!imagePreview ? (
                  <div
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onClick={() => fileInputRef.current?.click()}
                    className={`relative border-3 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all duration-300 group-hover:shadow-lg ${
                      isDragOver
                        ? 'border-teal-400 bg-teal-50 dark:border-teal-500 dark:bg-teal-900/20 scale-105'
                        : errors.image
                        ? 'border-red-300 bg-red-50 dark:border-red-600 dark:bg-red-900/20'
                        : 'border-gray-300 dark:border-gray-600 bg-gray-50/50 dark:bg-gray-700/50 group-hover:border-teal-400 dark:group-hover:border-teal-500 group-hover:bg-teal-50/30 dark:group-hover:bg-teal-900/10'
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
                    
                    <div className="flex flex-col items-center">
                      <div className="w-16 h-16 bg-gradient-to-r from-teal-400 to-blue-400 rounded-full flex items-center justify-center mb-4 shadow-lg">
                        <Upload className={`w-8 h-8 ${
                          isDragOver ? 'text-white scale-110' : 'text-white'
                        } transition-transform duration-300`} />
                      </div>
                      
                      <div className="text-gray-600 dark:text-gray-400">
                        <p className="text-lg font-semibold mb-2 transition-colors">
                          {isDragOver ? '🎉 Drop to upload!' : 'Upload club image'}
                        </p>
                        <p className="text-sm mb-1">
                          Drag & drop or click to browse
                        </p>
                        <p className="text-xs opacity-75">
                          Supports: JPEG, PNG, GIF, WebP • Max 5MB
                        </p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="relative">
                    {/* Image Preview Container */}
                    {isExpanded ? (
                      <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-sm flex items-center justify-center p-4">
                        <div className="relative max-w-full max-h-full">
                          <Image
                            src={imagePreview}
                            alt="Club preview"
                            width={800}
                            height={600}
                            className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
                          />
                          <button
                            onClick={toggleExpand}
                            className="absolute top-4 right-4 bg-black/50 text-white p-3 rounded-full hover:bg-black/75 transition-all backdrop-blur-sm"
                          >
                            <X className="w-6 h-6" />
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="relative w-full bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 rounded-2xl overflow-hidden shadow-lg group/image-preview" style={{ height: '320px' }}>
                        <Image
                          src={imagePreview}
                          alt="Club preview"
                          fill
                          className="object-cover transition-transform duration-300 group-hover/image-preview:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover/image-preview:opacity-100 transition-opacity duration-300" />
                        
                        <button
                          type="button"
                          onClick={removeImage}
                          className="absolute top-3 right-3 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-all transform hover:scale-110 shadow-lg"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    )}

                    {/* Image Controls */}
                    <div className="mt-4 flex flex-wrap gap-3 justify-between items-center">
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={openImageEditor}
                          className="flex items-center px-4 py-2 text-sm bg-gradient-to-r from-teal-500 to-blue-500 text-white rounded-xl hover:from-teal-600 hover:to-blue-600 transition-all transform hover:scale-105 shadow-md"
                          disabled={isLoading}
                        >
                          <Palette className="w-4 h-4 mr-2" />
                          Edit Image
                        </button>
                        <button
                          type="button"
                          onClick={toggleExpand}
                          className="flex items-center px-4 py-2 text-sm bg-gray-500 text-white rounded-xl hover:bg-gray-600 transition-all transform hover:scale-105 shadow-md"
                          disabled={isLoading}
                        >
                          {isExpanded ? <Minimize2 className="w-4 h-4 mr-2" /> : <Maximize2 className="w-4 h-4 mr-2" />}
                          {isExpanded ? 'Minimize' : 'Expand'}
                        </button>
                      </div>
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="text-sm font-medium text-teal-600 dark:text-teal-400 hover:text-teal-500 dark:hover:text-teal-300 transition-colors"
                        disabled={isLoading}
                      >
                        Change Image
                      </button>
                    </div>
                  </div>
                )}
                
                {errors.image && (
                  <p className="mt-2 text-sm text-red-600 dark:text-red-400 flex items-center">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    {errors.image}
                  </p>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4 pt-4">
                <button
                  type="button"
                  onClick={clearForm}
                  className="flex-1 px-6 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-xl text-sm font-semibold text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all duration-300 hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={isLoading}
                >
                  Clear All
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 px-6 py-3 border border-transparent rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-teal-500 to-blue-500 hover:from-teal-600 hover:to-blue-600 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 transition-all duration-300 transform hover:scale-105 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center"
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Creating Club...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 mr-2" />
                      Create Club
                    </>
                  )}
                </button>
              </div>
            </form>

            {/* Back Link */}
            <div className="mt-8 text-center">
              <button
                onClick={() => router.back()}
                className="inline-flex items-center text-sm font-medium text-teal-600 dark:text-teal-400 hover:text-teal-500 dark:hover:text-teal-300 transition-all duration-300 hover:underline"
                disabled={isLoading}
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Back to Clubs
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Image Editor Modal */}
      {showImageEditor && originalImagePreview && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-auto shadow-2xl border border-gray-200/50 dark:border-gray-700/50">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 flex items-center">
                  <Crop className="w-5 h-5 mr-2 text-teal-500" />
                  Edit & Crop Image
                </h3>
                <button
                  onClick={() => setShowImageEditor(false)}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Image Preview Area */}
              <div className="relative bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 rounded-xl overflow-hidden mb-6 mx-auto border-2 border-gray-300 dark:border-gray-600" style={{ width: '600px', height: '400px' }}>
                <Image
                  ref={imageRef}
                  src={originalImagePreview}
                  alt="Original"
                  fill
                  className="object-contain"
                  style={{
                    transform: `scale(${cropData.scale}) rotate(${cropData.rotation}deg)`,
                    transformOrigin: 'center'
                  }}
                />
                
                {/* Crop Overlay */}
                <div
                  className="absolute border-3 border-teal-400 bg-teal-400/20 cursor-move shadow-lg"
                  style={{
                    left: `${cropData.x}px`,
                    top: `${cropData.y}px`,
                    width: `${cropData.width}px`,
                    height: `${cropData.height}px`,
                    minWidth: '100px',
                    minHeight: '100px'
                  }}
                >
                  <div className="absolute inset-0 border border-white/50"></div>
                  {/* Corner indicators */}
                  {[['-top-1', '-left-1'], ['-top-1', '-right-1'], ['-bottom-1', '-left-1'], ['-bottom-1', '-right-1']].map(([vertical, horizontal], index) => (
                    <div
                      key={index}
                      className={`absolute ${vertical} ${horizontal} w-3 h-3 bg-teal-400 border-2 border-white rounded-sm shadow-sm`}
                    />
                  ))}
                </div>
              </div>

              {/* Enhanced Controls */}
              <div className="space-y-6">
                {/* Scale Control */}
                <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-xl">
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 flex items-center justify-between">
                    <span>Zoom: {Math.round(cropData.scale * 100)}%</span>
                    <ZoomIn className="w-4 h-4 text-gray-500" />
                  </label>
                  <div className="flex items-center gap-3">
                    <ZoomOut className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                    <input
                      type="range"
                      min="0.1"
                      max="3"
                      step="0.1"
                      value={cropData.scale}
                      onChange={handleScaleChange}
                      className="flex-1 h-2 bg-gray-200 dark:bg-gray-600 rounded-lg appearance-none cursor-pointer slider"
                    />
                    <ZoomIn className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                  </div>
                </div>

                {/* Rotation Controls */}
                <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-xl">
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                    Rotation: {((cropData.rotation % 360) + 360) % 360}°
                  </label>
                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => handleRotationChange('left')}
                      className="flex-1 flex items-center justify-center px-4 py-2 bg-white dark:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg border border-gray-300 dark:border-gray-500 hover:bg-gray-50 dark:hover:bg-gray-500 transition-all transform hover:scale-105"
                    >
                      <RotateCw className="w-4 h-4 mr-2 transform scale-x-[-1]" />
                      90° Left
                    </button>
                    <button
                      type="button"
                      onClick={() => handleRotationChange('right')}
                      className="flex-1 flex items-center justify-center px-4 py-2 bg-white dark:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg border border-gray-300 dark:border-gray-500 hover:bg-gray-50 dark:hover:bg-gray-500 transition-all transform hover:scale-105"
                    >
                      <RotateCw className="w-4 h-4 mr-2" />
                      90° Right
                    </button>
                  </div>
                </div>

                {/* Crop Position & Size Controls */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-xl">
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      X Position: {cropData.x}px
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="400"
                      step="5"
                      value={cropData.x}
                      onChange={(e) => setCropData(prev => ({ ...prev, x: Number(e.target.value) }))}
                      className="w-full h-2 bg-gray-200 dark:bg-gray-600 rounded-lg appearance-none cursor-pointer slider"
                    />
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-xl">
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Y Position: {cropData.y}px
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="300"
                      step="5"
                      value={cropData.y}
                      onChange={(e) => setCropData(prev => ({ ...prev, y: Number(e.target.value) }))}
                      className="w-full h-2 bg-gray-200 dark:bg-gray-600 rounded-lg appearance-none cursor-pointer slider"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-xl">
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Width: {cropData.width}px
                    </label>
                    <input
                      type="range"
                      min="100"
                      max="600"
                      step="10"
                      value={cropData.width}
                      onChange={(e) => handleCropSizeChange('width', Number(e.target.value))}
                      className="w-full h-2 bg-gray-200 dark:bg-gray-600 rounded-lg appearance-none cursor-pointer slider"
                    />
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-xl">
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Height: {cropData.height}px
                    </label>
                    <input
                      type="range"
                      min="100"
                      max="400"
                      step="10"
                      value={cropData.height}
                      onChange={(e) => handleCropSizeChange('height', Number(e.target.value))}
                      className="w-full h-2 bg-gray-200 dark:bg-gray-600 rounded-lg appearance-none cursor-pointer slider"
                    />
                  </div>
                </div>

                {/* Preset Crop Ratios */}
                <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-xl">
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                    Quick Aspect Ratios
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {[
                      { label: '1:1 Square', width: 300, height: 300 },
                      { label: '4:3 Standard', width: 400, height: 300 },
                      { label: '16:9 Wide', width: 480, height: 270 },
                      { label: '3:4 Portrait', width: 300, height: 400 }
                    ].map((ratio, index) => (
                      <button
                        key={index}
                        type="button"
                        onClick={() => setCropData(prev => ({ ...prev, width: ratio.width, height: ratio.height }))}
                        className="px-3 py-2 text-sm bg-white dark:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg border border-gray-300 dark:border-gray-500 hover:bg-teal-50 dark:hover:bg-teal-900/30 hover:border-teal-300 dark:hover:border-teal-500 transition-all"
                      >
                        {ratio.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-4 border-t border-gray-200 dark:border-gray-600">
                  <button
                    type="button"
                    onClick={resetCrop}
                    className="flex-1 px-4 py-3 text-sm font-semibold bg-gray-500 text-white rounded-xl hover:bg-gray-600 transition-all transform hover:scale-105"
                  >
                    Reset All
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowImageEditor(false)}
                    className="flex-1 px-4 py-3 text-sm font-semibold bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-400 dark:hover:bg-gray-500 transition-all transform hover:scale-105"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={applyCrop}
                    className="flex-1 px-4 py-3 text-sm font-semibold bg-gradient-to-r from-teal-500 to-blue-500 text-white rounded-xl hover:from-teal-600 hover:to-blue-600 transition-all transform hover:scale-105 shadow-md"
                  >
                    Apply Changes
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Hidden Canvas for Image Processing */}
      <canvas ref={canvasRef} className="hidden" />

      {/* Custom Slider Styles */}
      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: linear-gradient(to right, #0d9488, #3b82f6);
          cursor: pointer;
          border: 2px solid #ffffff;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
        }
        
        .slider::-moz-range-thumb {
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: linear-gradient(to right, #0d9488, #3b82f6);
          cursor: pointer;
          border: 2px solid #ffffff;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
        }
        
        .dark .slider::-webkit-slider-thumb {
          border: 2px solid #1f2937;
        }
        
        .dark .slider::-moz-range-thumb {
          border: 2px solid #1f2937;
        }
      `}</style>
    </div>
  );
}