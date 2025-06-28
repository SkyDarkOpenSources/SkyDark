"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Upload } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useUser } from "@clerk/nextjs";

export function AvatarUpload() {
  const { user } = useUser();
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file (JPEG, PNG, etc.)");
      return;
    }

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("File size must be less than 5MB");
      return;
    }

    setIsUploading(true);

    try {
      // Using Clerk's API to update profile picture
      await user?.setProfileImage({ file });
      toast.success("Profile picture updated successfully!");
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("Failed to upload profile picture");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <label htmlFor="profile-picture" className="relative cursor-pointer group">
      <div className="relative">
        <Avatar className="h-32 w-32 group-hover:opacity-70 transition-opacity duration-300">
          <AvatarImage src={user?.imageUrl} alt={user?.fullName || "User"} />
          <AvatarFallback className="text-lg">
            {user?.fullName?.split(" ").map(n => n[0]).join("").toUpperCase()}
          </AvatarFallback>
        </Avatar>
        {isUploading && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
          </div>
        )}
      </div>
      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <div className="text-center p-2 rounded-[62px] bg-black/70 text-white">
          <Upload className="mx-auto h-16 w-16 mb-1" />
          <span className="text-xs">Change profile photo</span>
        </div>
      </div>
      <input
        id="profile-picture"
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
        disabled={isUploading}
      />
    </label>
  );
}