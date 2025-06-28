"use client";

import { useSignIn } from "@clerk/nextjs";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

export default function SignInPage() {
  const { isLoaded, signIn, setActive } = useSignIn();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [isMicrosoftLoading, setIsMicrosoftLoading] = useState(false);

  // Custom loading spinner component
  const Spinner = () => (
    <div className="inline-block mr-2 h-4 w-4 animate-spin rounded-full border-2 border-solid border-current border-r-transparent">
      <span className="sr-only">Loading...</span>
    </div>
  );

  // Email/password sign in
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLoaded) return;

    setIsLoading(true);

    try {
      const result = await signIn.create({
        identifier: email,
        password,
      });

      if (result.status === "complete") {
        await setActive({ session: result.createdSessionId });
        // Immediate redirect without using router
        window.location.href = "/dashboard";
      }
    } catch (err) {
      const error = err as { errors: { message: string }[] };
      toast.error(error.errors?.[0]?.message || "Sign in failed");
    } finally {
      setIsLoading(false);
    }
  };

  // OAuth sign in
  const handleOAuthSignIn = async (provider: "google" | "microsoft") => {
    if (!isLoaded) return;

    try {
      if (provider === "google") {
        setIsGoogleLoading(true);
      } else {
        setIsMicrosoftLoading(true);
      }

      await signIn.authenticateWithRedirect({
        strategy: `oauth_${provider}`,
        redirectUrl: "/sso-callback",
        redirectUrlComplete: "/dashboard",
      });
    } catch (err) {
      const error = err as { errors: { message: string }[] };
      toast.error(error.errors?.[0]?.message || `Sign in with ${provider} failed`);
    } finally {
      if (provider === "google") {
        setIsGoogleLoading(false);
      } else {
        setIsMicrosoftLoading(false);
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">Welcome back</CardTitle>
          <CardDescription>
            Enter your credentials to access your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* OAuth Buttons */}
          <div className="grid grid-cols-2 gap-2 mb-6">
            <Button
              variant="outline"
              onClick={() => handleOAuthSignIn("google")}
              disabled={isGoogleLoading || isLoading}
            >
              {isGoogleLoading ? (
                <Spinner />
              ) : (
                <span className="mr-2">G</span>
              )}
              Google
            </Button>
            <Button
              variant="outline"
              onClick={() => handleOAuthSignIn("microsoft")}
              disabled={isMicrosoftLoading || isLoading}
            >
              {isMicrosoftLoading ? (
                <Spinner />
              ) : (
                <span className="mr-2">M</span>
              )}
              Microsoft
            </Button>
          </div>

          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                Or continue with
              </span>
            </div>
          </div>

          {/* Email/Password Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? <Spinner /> : null}
              Sign In
            </Button>
          </form>
          <div className="mt-4 text-center text-sm">
            Don&apos;t have an account?{" "}
            <Link href="/sign-up" className="underline">
              Sign up
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}