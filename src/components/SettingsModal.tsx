"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useUser, useClerk } from "@clerk/nextjs";
import { Settings, User, Mail, Lock, LogOut, Trash2, Shield, Bell, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";

interface SettingsModalProps {
  userEmail: string;
  userName: string;
}

export function SettingsModal({ userEmail, userName }: SettingsModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const { user } = useUser();
  const { signOut } = useClerk();
  const router = useRouter();

  const handleSignOut = async () => {
    setIsLoading(true);
    try {
      await signOut();
      router.push("/sign-in");
    } catch (err) {
      toast.error("Failed to sign out. Please try again.");
      console.error("Sign out error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!showDeleteConfirm) {
      setShowDeleteConfirm(true);
      return;
    }

    setIsLoading(true);
    try {
      await user?.delete();
      toast.success("Account deleted successfully");
      router.push("/");
    } catch (err) {
      toast.error("Failed to delete account. Please try again.");
      console.error("Delete account error:", err);
    } finally {
      setIsLoading(false);
      setShowDeleteConfirm(false);
    }
  };

  const handleChangePassword = () => {
    window.open(user?.organizationMemberships?.[0]?.organization?.slug 
      ? `https://clerk.com/user/password` 
      : `${window.location.origin}/user/password`, '_blank');
  };

  const settingsItems = [
    {
      icon: User,
      title: "Profile Information",
      description: "Update your name and personal details",
      action: () => router.push("/user-profile"),
      variant: "default" as const,
    },
    {
      icon: Mail,
      title: "Email Settings",
      description: "Manage your email addresses",
      action: () => router.push("/user-profile#email"),
      variant: "default" as const,
    },
    {
      icon: Lock,
      title: "Change Password",
      description: "Update your account password",
      action: handleChangePassword,
      variant: "default" as const,
    },
    {
      icon: Shield,
      title: "Security Settings",
      description: "Two-factor authentication and security",
      action: () => router.push("/user-profile#security"),
      variant: "default" as const,
    },
    {
      icon: Bell,
      title: "Notifications",
      description: "Manage your notification preferences",
      action: () => toast.info("Notification settings coming soon!"),
      variant: "default" as const,
    },
    {
      icon: Eye,
      title: "Privacy Settings",
      description: "Control your privacy and data settings",
      action: () => toast.info("Privacy settings coming soon!"),
      variant: "default" as const,
    },
  ];

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Badge variant="secondary" className="text-md cursor-pointer hover:bg-secondary/80 transition-colors">
          <Settings className="w-4 h-4 mr-2" />
          Settings
        </Badge>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5" />
            Account Settings
          </DialogTitle>
          <DialogDescription>
            Manage your account preferences and settings
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* User Info Section */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Account Overview</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-sm font-medium">User Name</Label>
                  <p className="text-sm text-muted-foreground">{user?.username}</p>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-sm font-medium">Email</Label>
                  <p className="text-sm text-muted-foreground">{userEmail}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Settings Options */}
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-muted-foreground mb-3">Settings</h3>
            {settingsItems.map((item, index) => (
              <Button
                key={index}
                variant="ghost"
                className="w-full justify-start h-auto p-4 hover:bg-muted/50"
                onClick={item.action}
              >
                <item.icon className="w-5 h-5 mr-3 text-muted-foreground" />
                <div className="flex-1 text-left">
                  <p className="font-medium">{item.title}</p>
                  <p className="text-sm text-muted-foreground">{item.description}</p>
                </div>
              </Button>
            ))}
          </div>

          <Separator />

          {/* Danger Zone */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-red-600 dark:text-red-400">Danger Zone</h3>
            
            {/* Sign Out */}
            <Button
              variant="outline"
              className="w-full justify-start h-auto p-4 border-orange-200 hover:bg-orange-50 hover:border-orange-300 dark:border-orange-800 dark:hover:bg-orange-900/20"
              onClick={handleSignOut}
              disabled={isLoading}
            >
              <LogOut className="w-5 h-5 mr-3 text-orange-600" />
              <div className="flex-1 text-left">
                <p className="font-medium text-orange-600">Sign Out</p>
                <p className="text-sm text-orange-600/70">Sign out of your account</p>
              </div>
            </Button>

            {/* Delete Account */}
            <Button
              variant="outline"
              className="w-full justify-start h-auto p-4 border-red-200 hover:bg-red-50 hover:border-red-300 dark:border-red-800 dark:hover:bg-red-900/20"
              onClick={handleDeleteAccount}
              disabled={isLoading}
            >
              <Trash2 className="w-5 h-5 mr-3 text-red-600" />
              <div className="flex-1 text-left">
                <p className="font-medium text-red-600">
                  {showDeleteConfirm ? "Confirm Delete Account" : "Delete Account"}
                </p>
                <p className="text-sm text-red-600/70">
                  {showDeleteConfirm 
                    ? "Click again to permanently delete your account" 
                    : "Permanently delete your account and all data"}
                </p>
              </div>
            </Button>

            {showDeleteConfirm && (
              <Button
                variant="ghost"
                className="w-full text-sm text-muted-foreground hover:bg-muted/50"
                onClick={() => setShowDeleteConfirm(false)}
              >
                Cancel deletion
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}