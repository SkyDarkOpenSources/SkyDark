
import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CalendarDays, Mail, Clock } from "lucide-react";
import { ToggleTheme } from "@/components/ui/ToggleTheme";
import { AvatarUpload } from "@/components/AvatarUpload";
import {
  SignOutButton,
} from '@clerk/nextjs'

export default async function DashboardPage() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  const user = await currentUser();

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="flex-1 space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Profile</h1>
          <p className="text-muted-foreground">Manage your profile</p>
        </div>
        <Badge variant="secondary" className="text-md">
          <SignOutButton />
        </Badge>
      </div>

      {/* User Profile Card */}
      <Card className="w-full">
        <CardHeader>
          <div className="flex items-center space-x-4">
            <AvatarUpload />
            <div className="space-y-1">
              <CardTitle className="text-2xl">{user?.fullName || "User"}</CardTitle>
              <CardDescription className="flex items-center">
                <Mail className="mr-1 h-4 w-4" />
                {user?.emailAddresses.find(e => e.id === user.primaryEmailAddressId)?.emailAddress}
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <div className="flex items-center space-x-2">
              <div>
                <ToggleTheme />
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100 dark:bg-green-900">
                <CalendarDays className="h-4 w-4 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="text-sm font-medium">Member Since</p>
                <p className="text-xs text-muted-foreground">
                  {user?.createdAt ? formatDate(user.createdAt) : "Unknown"}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-purple-100 dark:bg-purple-900">
                <Clock className="h-4 w-4 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <p className="text-sm font-medium">Last Updated</p>
                <p className="text-xs text-muted-foreground">
                  {user?.updatedAt ? formatDate(user.updatedAt) : "Unknown"}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Account Information</CardTitle>
          <CardDescription>Manage your account details</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Email Address</p>
                <p className="text-sm text-muted-foreground">
                  {user?.emailAddresses.find(e => e.id === user.primaryEmailAddressId)?.emailAddress}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}