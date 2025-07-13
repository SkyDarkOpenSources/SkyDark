"use client"

import type React from "react"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { useState, useRef } from "react"
import { toast } from "sonner"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { ToggleTheme } from "@/components/ui/ToggleTheme"
import { LogOut, ImageIcon } from "lucide-react"
import { Mountain } from "lucide-react"
import { UserButton, SignInButton, SignUpButton, useUser, useClerk } from "@clerk/nextjs"

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/20 dark:border-gray-800/20 bg-white/80 dark:bg-gray-950/80 backdrop-blur-md supports-[backdrop-filter]:bg-white/60 supports-[backdrop-filter]:dark:bg-gray-950/60">
      <div className="container mx-auto flex h-16 max-w-6xl items-center justify-between px-4 md:px-6">
        <Link href="#" className="flex items-center gap-2" prefetch={false}>
          <Mountain className="h-6 w-6" />
          <span className="sr-only">Acme Inc</span>
        </Link>

        <nav className="hidden items-center gap-6 text-sm font-medium md:flex">
          <Link
            href="/"
            className="text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50 transition-colors"
            prefetch={false}
          >
            Home
          </Link>
          <Link
            href="/about"
            className="text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50 transition-colors"
            prefetch={false}
          >
            About
          </Link>
          <Link
            href="/events"
            className="text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50 transition-colors"
            prefetch={false}
          >
            Events
          </Link>
          <Link
            href="https://buy.stripe.com/test_8x28wO1Kp2CI4sP48j0Ba00"
            target="_blank"
            className="text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50 transition-colors"
            prefetch={false}
          >
            Give/Donate
          </Link>
        </nav>

        <div className="flex items-center gap-2">
          <ToggleTheme />
          <div className="ml-2">
            <UserProfileDropdown />
          </div>
        </div>
      </div>
    </header>
  )
}

function UserProfileDropdown() {
  const { user } = useUser()
  const { signOut } = useClerk()
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isUploading, setIsUploading] = useState(false)

  const handleSignOut = async () => {
    await signOut()
    router.push("/")
  }

  const handleProfilePictureChange = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !user) return

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file (JPEG, PNG, etc.)")
      return
    }

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("File size too large (max 5MB)")
      return
    }

    setIsUploading(true)
    try {
      // Use Clerk's built-in method to update profile picture
      await user.setProfileImage({ file })
      toast.success("Profile picture updated successfully!")
    } catch (error) {
      console.error("Error updating profile picture:", error)
      toast.error("Failed to update profile picture")
    } finally {
      setIsUploading(false)
      // Reset the file input
      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }
    }
  }

  if (!user) {
    return (
      <div className="flex items-center gap-2">
        <SignInButton mode="modal">
          <Button variant="ghost" size="sm">
            Sign In
          </Button>
        </SignInButton>
        <SignUpButton mode="modal">
          <Button size="sm">Sign Up</Button>
        </SignUpButton>
      </div>
    )
  }

  return (
    <>
      {/* Hidden file input for profile picture upload */}
      <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full hover:bg-gray-100/80 dark:hover:bg-gray-800/80 focus:ring-2 focus:ring-sky-500 backdrop-blur-sm"
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
          className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-md border-gray-200/50 dark:border-gray-700/50 text-gray-900 dark:text-white w-48"
        >
          <DropdownMenuItem
            className="hover:bg-gray-100/80 dark:hover:bg-gray-700/80 focus:bg-gray-100/80 dark:focus:bg-gray-700/80 cursor-pointer"
            onClick={handleProfilePictureChange}
            disabled={isUploading}
          >
            <ImageIcon className="mr-2 h-4 w-4" />
            <span>{isUploading ? "Uploading..." : "Upload Picture"}</span>
          </DropdownMenuItem>
          <DropdownMenuItem
            className="hover:bg-gray-100/80 dark:hover:bg-gray-700/80 focus:bg-gray-100/80 dark:focus:bg-gray-700/80 cursor-pointer"
            onClick={handleSignOut}
          >
            <LogOut className="mr-2 h-4 w-4" />
            <span>Logout</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  )
}
