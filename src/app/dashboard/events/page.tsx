// src/app/dashboard/events/page.tsx
"use client";

import Image from "next/image";
import { useState, useEffect, useCallback } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Plus, Calendar, Users, Upload, X } from "lucide-react";
import { getAllEvents, createEvent } from "../../../../lib/actions/event.action";
import { Event } from "../../../../database/schema";

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [isEventModalOpen, setIsEventModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    image: "",
  });
  const [formErrors, setFormErrors] = useState({
    name: "",
    description: "",
    image: "",
  });
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploadedImage, setUploadedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    try {
      setIsLoading(true);
      const eventsData = await getAllEvents();
      setEvents(eventsData);
    } catch (error) {
      console.error('Error loading events:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLearnMore = (event: Event) => {
    setSelectedEvent(event);
    setIsEventModalOpen(true);
  };

  const closeEventModal = () => {
    setIsEventModalOpen(false);
    setTimeout(() => setSelectedEvent(null), 300);
  };

  const handleCreateEvent = () => {
    setIsCreateModalOpen(true);
  };

  const closeCreateModal = () => {
    setIsCreateModalOpen(false);
    setFormData({ name: "", description: "", image: "" });
    setFormErrors({ name: "", description: "", image: "" });
    setUploadedImage(null);
    setImagePreview("");
    setIsDragOver(false);
  };

  // Drag and drop handlers
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = e.dataTransfer.files;
    if (files && files[0]) {
      handleFileSelect(files[0]);
    }
  }, []);

  const handleFileSelect = (file: File) => {
    // Validate file type
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
    if (!validTypes.includes(file.type)) {
      alert('Please select a valid image file (JPEG, PNG, WebP, or GIF)');
      return;
    }

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      alert('Image size should be less than 5MB');
      return;
    }

    setUploadedImage(file);
    
    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setImagePreview(e.target?.result as string);
      setFormData(prev => ({ ...prev, image: e.target?.result as string }));
    };
    reader.readAsDataURL(file);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const removeImage = () => {
    setUploadedImage(null);
    setImagePreview("");
    setFormData(prev => ({ ...prev, image: "" }));
  };

  const validateForm = () => {
    const errors = {
      name: "",
      description: "",
      image: "",
    };

    if (!formData.name.trim()) {
      errors.name = "Event name is required";
    } else if (formData.name.trim().length < 3) {
      errors.name = "Event name must be at least 3 characters";
    }

    if (!formData.description.trim()) {
      errors.description = "Event description is required";
    } else if (formData.description.trim().length < 10) {
      errors.description = "Description must be at least 10 characters";
    }

    if (!formData.image.trim()) {
      errors.image = "Event image is required";
    }

    setFormErrors(errors);
    return !errors.name && !errors.description && !errors.image;
  };

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (formErrors[field]) {
      setFormErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsCreating(true);
    try {
      // For now, we'll use the base64 image directly
      // In a real application, you'd want to upload this to a CDN or your server
      const result = await createEvent(
        formData.name.trim(),
        formData.description.trim(),
        formData.image.trim() // This is now the base64 data URL
      );

      if (result.success) {
        closeCreateModal();
        await loadEvents(); // Refresh the events list
      } else {
        alert("Failed to create event. Please try again.");
      }
    } catch (error) {
      console.error('Error creating event:', error);
      alert("An error occurred while creating the event.");
    } finally {
      setIsCreating(false);
    }
  };

  // Fixed: Accept Date objects instead of strings
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="container mx-auto py-8 px-4 max-w-7xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            Space-Tech Events
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Discover and join amazing space technology events
          </p>
        </div>
        <Button 
          onClick={handleCreateEvent}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg flex items-center gap-2 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Create Event
        </Button>
      </div>

      {/* Events Grid */}
      {isLoading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      ) : events.length === 0 ? (
        <div className="text-center py-12">
          <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-8 max-w-md mx-auto">
            <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              No Events Yet
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Be the first to create an amazing space-tech event!
            </p>
            <Button onClick={handleCreateEvent} className="bg-blue-600 hover:bg-blue-700">
              <Plus className="w-4 h-4 mr-2" />
              Create Your First Event
            </Button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event) => (
            <EventCard 
              key={event.id} 
              event={event} 
              onLearnMore={() => handleLearnMore(event)} 
            />
          ))}
        </div>
      )}

      {/* Event Details Modal */}
      <Dialog open={isEventModalOpen} onOpenChange={closeEventModal}>
        <DialogContent className="sm:max-w-[625px] max-h-[90vh] overflow-y-auto">
          <DialogHeader className="flex flex-row items-center justify-between">
            <DialogTitle className="text-2xl">Event Details</DialogTitle>
            <Button
              variant="ghost"
              size="icon"
              onClick={closeEventModal}
              className="h-6 w-6 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </DialogHeader>
          
          {selectedEvent && (
            <div className="mt-4">
              <div className="relative h-48 w-full mb-6 rounded-lg overflow-hidden">
                <Image
                  src={selectedEvent.image}
                  alt={selectedEvent.name}
                  width={600}
                  height={300}
                  className="w-full h-full object-cover"
                />
              </div>
              
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                {selectedEvent.name}
              </h2>
              
              <div className="flex items-center gap-4 mb-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  {formatDate(selectedEvent.createdAt)}
                </span>
                <span className="flex items-center gap-1">
                  <Users className="w-4 h-4" />
                  {selectedEvent.members} members
                </span>
              </div>
              
              <div className="py-4">
                <h3 className="font-semibold mb-2">Description:</h3>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  {selectedEvent.description}
                </p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Create Event Modal */}
      <Dialog open={isCreateModalOpen} onOpenChange={closeCreateModal}>
        <DialogContent className="sm:max-w-[550px]">
          <DialogHeader className="flex flex-row items-center justify-between">
            <div>
              <DialogTitle className="text-2xl">Create Space-Tech Event</DialogTitle>
              <DialogDescription>
                Fill in the details below to create an amazing space technology event.
              </DialogDescription>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={closeCreateModal}
              className="h-6 w-6 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-6 py-4">
            {/* Event Name */}
            <div className="space-y-2">
              <Label htmlFor="name" className="text-sm font-medium">
                Event Name *
              </Label>
              <Input
                id="name"
                placeholder="Enter event name (e.g., SpaceX Launch Viewing)"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                className={formErrors.name ? "border-red-500 focus-visible:ring-red-500" : ""}
              />
              {formErrors.name && (
                <p className="text-sm text-red-500">{formErrors.name}</p>
              )}
            </div>

            {/* Event Description */}
            <div className="space-y-2">
              <Label htmlFor="description" className="text-sm font-medium">
                Event Description *
              </Label>
              <Textarea
                id="description"
                placeholder="Describe your event in detail... (What, when, where, why)"
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                rows={4}
                className={formErrors.description ? "border-red-500 focus-visible:ring-red-500" : ""}
              />
              {formErrors.description && (
                <p className="text-sm text-red-500">{formErrors.description}</p>
              )}
              <p className="text-xs text-gray-500">
                Tell attendees about the event purpose, agenda, and what they can expect
              </p>
            </div>

            {/* Image Upload */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">
                Event Image *
              </Label>
              
              {!imagePreview ? (
                <div
                  className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
                    isDragOver 
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' 
                      : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
                  }`}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onClick={() => document.getElementById('file-upload')?.click()}
                >
                  <div className="flex flex-col items-center justify-center gap-3">
                    <Upload className="w-8 h-8 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        Drop your image here, or{" "}
                        <span className="text-blue-600 hover:text-blue-500">browse</span>
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        Supports: JPEG, PNG, WebP, GIF • Max: 5MB
                      </p>
                    </div>
                  </div>
                  <input
                    id="file-upload"
                    type="file"
                    accept="image/jpeg,image/jpg,image/png,image/webp,image/gif"
                    className="hidden"
                    onChange={handleFileInput}
                  />
                </div>
              ) : (
                <div className="relative">
                  <div className="relative h-48 w-full rounded-lg border overflow-hidden">
                    <Image
                      src={imagePreview}
                      alt="Preview"
                      width={400}
                      height={192}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    className="absolute top-2 right-2 h-8 w-8"
                    onClick={removeImage}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                  <div className="mt-2 text-xs text-gray-500">
                    {uploadedImage?.name} • {(uploadedImage?.size || 0) / 1024 / 1024 > 1 
                      ? `${(uploadedImage?.size || 0) / 1024 / 1024} MB` 
                      : `${Math.round((uploadedImage?.size || 0) / 1024)} KB`}
                  </div>
                </div>
              )}
              
              {formErrors.image && (
                <p className="text-sm text-red-500">{formErrors.image}</p>
              )}
            </div>

            <DialogFooter className="gap-2 sm:gap-0">
              <Button
                type="button"
                variant="outline"
                onClick={closeCreateModal}
                disabled={isCreating}
                className="w-full sm:w-auto"
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                className="bg-blue-600 hover:bg-blue-700 w-full sm:w-auto"
                disabled={isCreating}
              >
                {isCreating ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Creating...
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4 mr-2" />
                    Create Event
                  </>
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function EventCard({ event, onLearnMore }: { event: Event; onLearnMore: () => void }) {
  // Fixed: Accept Date object
  const formatEventDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <Card className="h-full flex flex-col hover:shadow-lg transition-all duration-300 hover:scale-[1.02] group cursor-pointer border border-gray-200 dark:border-gray-700">
      <div className="relative h-48 w-full overflow-hidden rounded-t-lg">
        <Image
          src={event.image}
          alt={event.name}
          width={400}
          height={200}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            // Fallback if image fails to load
            target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgdmlld0JveD0iMCAwIDQwMCAzMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iMzAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0yMDAgMTUwTDE1MCAyMDBIMjUwTDIwMCAxNTBaIiBmaWxsPSIjOEU5MEEwIi8+CjxjaXJjbGUgY3g9IjIwMCIgY3k9IjExMCIgcj0iMzAiIGZpbGw9IiM4RTkwQTAiLz4KPHRleHQgeD0iMjAwIiB5PSIyNTAiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzRFNTU2QyI+RXZlbnQgSW1hZ2U8L3RleHQ+Cjwvc3ZnPgo=';
          }}
        />
        <div className="absolute inset-0 bg-black/10 group-hover:bg-black/5 transition-colors" />
      </div>
      
      <CardHeader className="pb-3 flex-grow">
        <CardTitle className="text-xl line-clamp-2 group-hover:text-blue-600 transition-colors mb-2">
          {event.name}
        </CardTitle>
        <CardDescription className="flex items-center gap-2 text-sm mb-3">
          <Calendar className="w-4 h-4" />
          {formatEventDate(event.createdAt)}
        </CardDescription>
        <p className="line-clamp-3 text-gray-600 dark:text-gray-400 leading-relaxed text-sm">
          {event.description}
        </p>
      </CardHeader>
      
      <CardFooter className="pt-3 border-t border-gray-100 dark:border-gray-800">
        <div className="flex justify-between items-center w-full">
          <div className="flex items-center gap-1 text-sm text-gray-500">
            <Users className="w-4 h-4" />
            <span>{event.members} members</span>
          </div>
          <Button 
            onClick={onLearnMore} 
            variant="outline"
            className="border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white transition-colors text-sm"
          >
            Learn More
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}