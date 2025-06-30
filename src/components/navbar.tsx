"use client";

import { UserButton, useUser, useClerk } from "@clerk/nextjs";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { LogOut, ImageIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useRef } from "react";
import { toast } from "sonner";

export function Navbar() {
  return (
    <nav className="fixed top-0 w-full z-50 bg-gradient-to-r from-sky-900 to-gray-900 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left - Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link href="/" className="text-2xl font-bold tracking-tight">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-sky-400 to-blue-200">
                SkyDark
              </span>
            </Link>
          </div>

          {/* Center - Navigation Links */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-center space-x-8">
              <Link
                href="/"
                className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
              >
                Home
              </Link>
              <Link
                href="/about"
                className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
              >
                About
              </Link>
              <Link
                href="/events"
                className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
              >
                Events
              </Link>
              <Link
                href="/learn-more"
                className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
              >
                Learn More
              </Link>
            </div>
          </div>

          {/* Right - User Profile Dropdown */}
          <div className="ml-4 flex items-center md:ml-6">
            <UserProfileDropdown />
          </div>
        </div>
      </div>
    </nav>
  );
}

function UserProfileDropdown() {
  const { user } = useUser();
  const { signOut } = useClerk();
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    router.push("/");
  };

  const handleProfilePictureChange = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file (JPEG, PNG, etc.)");
      return;
    }

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("File size too large (max 5MB)");
      return;
    }

    setIsUploading(true);

    try {
      // Use Clerk's built-in method to update profile picture
      await user.setProfileImage({ file });
      toast.success("Profile picture updated successfully!");
    } catch (error) {
      console.error("Error updating profile picture:", error);
      toast.error("Failed to update profile picture");
    } finally {
      setIsUploading(false);
      // Reset the file input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  if (!user) return null;

  return (
    <>
      {/* Hidden file input for profile picture upload */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
      />
      
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full hover:bg-sky-800/50 focus:ring-2 focus:ring-sky-500"
          >
            <UserButton
              afterSignOutUrl="/"
              appearance={{
                elements: {
                  userButtonAvatarBox: "h-10 w-10",
                  userButtonPopoverActionButtonIcon: "hidden",
                  userButtonPopoverActionButtonText: "text-xs",
                  userButtonPopoverFooter: "hidden",
                },
              }}
            />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="end"
          className="bg-gray-800 border-gray-700 text-white w-48"
        >
          <DropdownMenuItem 
            className="hover:bg-gray-700 focus:bg-gray-700 cursor-pointer"
            onClick={handleProfilePictureChange}
            disabled={isUploading}
          >
            <ImageIcon className="mr-2 h-4 w-4" />
            <span>
              {isUploading ? "Uploading..." : "Change Profile Picture"}
            </span>
          </DropdownMenuItem>
          <DropdownMenuItem 
            className="hover:bg-gray-700 focus:bg-gray-700 cursor-pointer"
            onClick={handleSignOut}
          >
            <LogOut className="mr-2 h-4 w-4" />
            <span>Logout</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}