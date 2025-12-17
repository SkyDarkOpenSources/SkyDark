"use client";

import { useState, useEffect } from "react";
import { useSignUp, useAuth } from "@clerk/nextjs";
import { redirect, useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Eye, EyeOff, Mail, Lock, User, Shield } from "lucide-react";

interface ClerkError {
  errors?: Array<{
    message: string;
    code?: string;
  }>;
}

type SignUpStep = "initial" | "verification" | "oauth-username";

export default function SignUpPage() {
  const { isLoaded, signUp, setActive } = useSignUp();
  const [step, setStep] = useState<SignUpStep>("initial");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const {isSignedIn} = useAuth()
  const [error, setError] = useState("");
  const [oauthUserInfo, setOauthUserInfo] = useState<{
    email: string;
    firstName: string;
    lastName: string;
  }>({ email: "", firstName: "", lastName: "" });
  const router = useRouter();

  // Check OAuth status on component mount and when signUp changes
  useEffect(() => {
    if (!isLoaded || !signUp) return;

    const checkSignUpStatus = async () => {
      try {
        // Check if we have a pending sign up that needs completion
        if (signUp.status === "missing_requirements") {
          const missingFields = signUp.missingFields || [];

          // If username is missing, user came from OAuth and needs to set username
          if (missingFields.includes("username")) {
            // Try to get user information from the sign up object
            try {
              const emailAddresses =
                (
                  signUp as unknown as {
                    emailAddresses?: Array<{ emailAddress: string }>;
                  }
                ).emailAddresses || [];
              const firstName =
                (signUp as unknown as { firstName?: string }).firstName || "";
              const lastName =
                (signUp as unknown as { lastName?: string }).lastName || "";

              setOauthUserInfo({
                email: emailAddresses[0]?.emailAddress || "",
                firstName: firstName || "",
                lastName: lastName || "",
              });

              setStep("oauth-username");
            } catch (infoError) {
              console.log("Could not extract user info:", infoError);
              setStep("oauth-username");
            }
          }
          // If email verification is needed
          else if ((signUp.unverifiedFields || []).includes("email_address")) {
            setStep("verification");
          }
        }
        // If sign up is already complete, redirect to dashboard
        else if (signUp.status === "complete") {
          await setActive({ session: signUp.createdSessionId });
          router.push("/dashboard");
        }
      } catch (statusError) {
        console.log("Error checking sign up status:", statusError);
      }
    };

    // Small delay to ensure Clerk has loaded properly
    const timeoutId = setTimeout(checkSignUpStatus, 100);
    return () => clearTimeout(timeoutId);
  }, [isLoaded, signUp, setActive, router]);

  const handleInitialSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLoaded || !signUp) return;

    setIsLoading(true);
    setError("");

    try {
      // Create the sign up attempt
      const result = await signUp.create({
        username: username.trim(),
        emailAddress: email.trim(),
        password,
      });

      // Check if email verification is needed
      if (result.unverifiedFields?.includes("email_address")) {
        await signUp.prepareEmailAddressVerification({
          strategy: "email_code",
        });
        setStep("verification");
      } else if (result.status === "complete") {
        await setActive({ session: result.createdSessionId });
        router.push("/dashboard");
      } else {
        // Fallback - try to prepare verification anyway
        try {
          await signUp.prepareEmailAddressVerification({
            strategy: "email_code",
          });
          setStep("verification");
        } catch (verifyErr) {
          console.error("Verification setup error:", verifyErr);
          setError(
            "Account created but verification setup failed. Please try signing in."
          );
        }
      }
    } catch (err: unknown) {
      const clerkError = err as ClerkError;
      let errorMessage = "An error occurred during sign up.";

      if (clerkError.errors?.[0]?.message) {
        errorMessage = clerkError.errors[0].message;
      }

      // Handle specific error types
      if (errorMessage.toLowerCase().includes("captcha")) {
        errorMessage =
          "Please complete the security verification and try again.";
      } else if (errorMessage.toLowerCase().includes("username")) {
        errorMessage = "This username is already taken. Please choose another.";
      } else if (errorMessage.toLowerCase().includes("email")) {
        errorMessage =
          "This email is already registered. Please use a different email or sign in.";
      }

      setError(errorMessage);
      console.error("Sign up error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerificationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLoaded || !signUp) return;

    setIsLoading(true);
    setError("");

    try {
      const result = await signUp.attemptEmailAddressVerification({
        code: verificationCode.trim(),
      });

      if (result.status === "complete") {
        await setActive({ session: result.createdSessionId });
        router.push("/dashboard");
      } else {
        setError(
          "Verification incomplete. Please check your code and try again."
        );
      }
    } catch (err: unknown) {
      const clerkError = err as ClerkError;
      let errorMessage = "Invalid verification code. Please try again.";

      if (clerkError.errors?.[0]?.message) {
        errorMessage = clerkError.errors[0].message;
      }

      if (errorMessage.toLowerCase().includes("expired")) {
        errorMessage =
          "Verification code has expired. Please request a new one.";
      }

      setError(errorMessage);
      console.error("Verification error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOAuthSignUp = async (
    strategy: "oauth_google" | "oauth_microsoft"
  ) => {
    if (!isLoaded || !signUp) return;

    setIsLoading(true);
    setError("");

    try {
      // Start OAuth flow with proper redirect URLs
      await signUp.authenticateWithRedirect({
        strategy,
        redirectUrl: `${window.location.origin}/sign-up`,
        redirectUrlComplete: `${window.location.origin}/sign-up`,
      });
    } catch (err: unknown) {
      const clerkError = err as ClerkError;
      let errorMessage = "Social sign up failed. Please try again.";

      if (clerkError.errors?.[0]?.message) {
        errorMessage = clerkError.errors[0].message;
      }

      if (errorMessage.toLowerCase().includes("popup")) {
        errorMessage = "Please allow popups for this site and try again.";
      } else if (errorMessage.toLowerCase().includes("captcha")) {
        errorMessage =
          "Please complete the security verification and try again.";
      }

      setError(errorMessage);
      console.error("OAuth error:", err);
      setIsLoading(false);
    }
  };

  const handleOAuthUsernameSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLoaded || !signUp) return;

    setIsLoading(true);
    setError("");

    try {
      // Update the sign up with the chosen username
      const result = await signUp.update({
        username: username.trim(),
      });

      if (result.status === "complete") {
        await setActive({ session: result.createdSessionId });
        router.push("/dashboard");
      } else {
        // If still not complete, try one more time
        try {
          const finalResult = await signUp.reload();
          if (finalResult.status === "complete") {
            await setActive({ session: finalResult.createdSessionId });
            router.push("/dashboard");
          } else {
            setError(
              "Failed to complete account setup. Please try refreshing the page."
            );
          }
        } catch (reloadErr) {
          console.error("Account setup reload error:", reloadErr);
          setError(
            "Account setup incomplete. Please try refreshing the page or contact support."
          );
        }
      }
    } catch (err: unknown) {
      const clerkError = err as ClerkError;
      let errorMessage = "Failed to set username. Please try again.";

      if (clerkError.errors?.[0]?.message) {
        errorMessage = clerkError.errors[0].message;
      }

      if (errorMessage.toLowerCase().includes("username")) {
        errorMessage = "This username is already taken. Please choose another.";
      }

      setError(errorMessage);
      console.error("OAuth username error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const resendVerificationCode = async () => {
    if (!isLoaded || !signUp) return;

    setIsLoading(true);
    setError("");

    try {
      await signUp.prepareEmailAddressVerification({
        strategy: "email_code",
      });
      setError(""); // Clear any previous errors on successful resend
    } catch (err: unknown) {
      const clerkError = err as ClerkError;
      const errorMessage =
        clerkError.errors?.[0]?.message ||
        "Failed to resend verification code.";
      setError(errorMessage);
      console.error("Resend error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackToInitial = () => {
    setStep("initial");
    setVerificationCode("");
    setError("");
  };

  if (isSignedIn) {
    return (
      redirect("/dashboard")
    );
  }

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md space-y-6 p-6 sm:p-8 rounded-lg bg-card">
        {step === "initial" && (
          <>
            <div className="text-center">
              <h1 className="text-3xl font-bold mb-2 text-card-foreground">
                Join SkyDark
              </h1>
              <p className="text-muted-foreground">
                Create your account to get started
              </p>
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {/* OAuth Buttons */}
            <div className="flex gap-2">
              <Button
                variant="outline"
                className="w-1/2 bg-background hover:bg-muted transition-colors"
                onClick={() => handleOAuthSignUp("oauth_google")}
                disabled={isLoading}
                type="button"
              >
                <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                Google
              </Button>
              <Button
                variant="outline"
                className="w-1/2 bg-background hover:bg-muted transition-colors"
                onClick={() => handleOAuthSignUp("oauth_microsoft")}
                disabled={isLoading}
                type="button"
              >
                <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24">
                  <path fill="#F25022" d="M1 1h10v10H1z" />
                  <path fill="#00A4EF" d="M13 1h10v10H13z" />
                  <path fill="#7FBA00" d="M1 13h10v10H1z" />
                  <path fill="#FFB900" d="M13 13h10v10H13z" />
                </svg>
                Microsoft
              </Button>
            </div>

            {/* Separator */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground">
                  Or continue with
                </span>
              </div>
            </div>

            {/* Sign Up Form */}
            <form onSubmit={handleInitialSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label
                  htmlFor="username"
                  className="text-sm font-medium text-card-foreground"
                >
                  Username
                </Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="username"
                    placeholder="Enter your username"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                    className="pl-10 bg-muted/50 hover:bg-muted/70 focus:bg-muted/70 transition-colors border-0 shadow-none"
                    disabled={isLoading}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="email"
                  className="text-sm font-medium text-card-foreground"
                >
                  Email
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    placeholder="Enter your email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="pl-10 bg-muted/50 hover:bg-muted/70 focus:bg-muted/70 transition-colors border-0 shadow-none"
                    disabled={isLoading}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="password"
                  className="text-sm font-medium text-card-foreground"
                >
                  Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="password"
                    placeholder="Enter your password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={8}
                    className="pl-10 pr-10 bg-muted/50 hover:bg-muted/70 focus:bg-muted/70 transition-colors border-0 shadow-none"
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-3 h-4 w-4 text-muted-foreground hover:text-card-foreground transition-colors"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={isLoading}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* CAPTCHA Container - Required by Clerk */}
              <div
                id="clerk-captcha"
                className="flex justify-center my-4"
              ></div>

              <Button
                type="submit"
                className="w-full mt-6"
                disabled={
                  isLoading || !username.trim() || !email.trim() || !password
                }
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Sending verification code...
                  </>
                ) : (
                  "Get Verification Code"
                )}
              </Button>
            </form>

            {/* Sign in link at bottom */}
            <div className="text-center text-sm pt-4 border-t">
              <p className="text-muted-foreground mb-1">
                Already have an account?
              </p>
              <Link
                href="/sign-in"
                className="text-primary hover:text-primary/80 font-medium transition-colors"
              >
                Sign In
              </Link>
            </div>
          </>
        )}

        {step === "verification" && (
          <>
            <div className="text-center">
              <h1 className="text-3xl font-bold mb-2 text-card-foreground">
                Verify Your Email
              </h1>
              <p className="text-muted-foreground">
                We sent a verification code to{" "}
                <span className="font-medium">{email}</span>
              </p>
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleVerificationSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label
                  htmlFor="verificationCode"
                  className="text-sm font-medium text-card-foreground"
                >
                  Verification Code
                </Label>
                <div className="relative">
                  <Shield className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="verificationCode"
                    placeholder="Enter 6-digit code"
                    type="text"
                    value={verificationCode}
                    onChange={(e) =>
                      setVerificationCode(
                        e.target.value.replace(/\D/g, "").slice(0, 6)
                      )
                    }
                    required
                    maxLength={6}
                    className="pl-10 bg-muted/50 hover:bg-muted/70 focus:bg-muted/70 transition-colors border-0 shadow-none text-center text-lg tracking-wider"
                    disabled={isLoading}
                  />
                </div>
              </div>

              <Button
                type="submit"
                className="w-full mt-6"
                disabled={isLoading || verificationCode.length !== 6}
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Verifying...
                  </>
                ) : (
                  "Verify & Create Account"
                )}
              </Button>

              <div className="flex justify-between text-sm">
                <button
                  type="button"
                  onClick={handleBackToInitial}
                  className="text-muted-foreground hover:text-card-foreground transition-colors"
                  disabled={isLoading}
                >
                  ← Back to sign up
                </button>

                <button
                  type="button"
                  onClick={resendVerificationCode}
                  className="text-primary hover:text-primary/80 transition-colors"
                  disabled={isLoading}
                >
                  Resend code
                </button>
              </div>
            </form>

            {/* Sign in link at bottom */}
            <div className="text-center text-sm pt-4 border-t">
              <p className="text-muted-foreground mb-1">
                Already have an account?
              </p>
              <Link
                href="/sign-in"
                className="text-primary hover:text-primary/80 font-medium transition-colors"
              >
                Sign In
              </Link>
            </div>
          </>
        )}

        {step === "oauth-username" && (
          <>
            <div className="text-center">
              <h1 className="text-3xl font-bold mb-2 text-card-foreground">
                Choose Your Username
              </h1>
              <p className="text-muted-foreground">
                {oauthUserInfo.firstName
                  ? `Welcome ${oauthUserInfo.firstName}! Please choose a username to complete your account.`
                  : "Please choose a username to complete your account setup."}
              </p>
              {oauthUserInfo.email && (
                <p className="text-sm text-muted-foreground mt-1">
                  Account: {oauthUserInfo.email}
                </p>
              )}
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleOAuthUsernameSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label
                  htmlFor="oauthUsername"
                  className="text-sm font-medium text-card-foreground"
                >
                  Username
                </Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="oauthUsername"
                    placeholder="Enter your preferred username"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                    className="pl-10 bg-muted/50 hover:bg-muted/70 focus:bg-muted/70 transition-colors border-0 shadow-none"
                    disabled={isLoading}
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  This will be your unique identifier on SkyDark
                </p>
              </div>

              <Button
                type="submit"
                className="w-full mt-6"
                disabled={isLoading || !username.trim()}
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Completing setup...
                  </>
                ) : (
                  "Complete Account Setup"
                )}
              </Button>
            </form>

            {/* Sign in link at bottom */}
            <div className="text-center text-sm pt-4 border-t">
              <p className="text-muted-foreground mb-1">
                Already have an account?
              </p>
              <Link
                href="/sign-in"
                className="text-primary hover:text-primary/80 font-medium transition-colors"
              >
                Sign In
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
