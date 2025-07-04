'use client'

import { useState } from 'react'
import { useSignUp } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Eye, EyeOff, User, Mail, Lock } from 'lucide-react'

interface ClerkError {
  errors?: Array<{
    message: string
  }>
}

export default function SignUpPage() {
  const { isLoaded, signUp, setActive } = useSignUp()
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [pendingVerification, setPendingVerification] = useState(false)
  const [code, setCode] = useState('')
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!isLoaded) return

    setIsLoading(true)
    setError('')

    try {
      // Create the user in Clerk
      await signUp.create({
        username,
        emailAddress: email,
        password,
      })

      // Prepare email verification
      await signUp.prepareEmailAddressVerification({ strategy: 'email_code' })
      setPendingVerification(true)
    } catch (err: unknown) {
      const clerkError = err as ClerkError
      setError(clerkError.errors?.[0]?.message || 'An error occurred during sign up.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!isLoaded) return

    setIsLoading(true)
    setError('')

    try {
      // Verify email address
      const completeSignUp = await signUp.attemptEmailAddressVerification({
        code,
      })

      if (completeSignUp.status === 'complete') {
        // Set active session and redirect
        await setActive({ session: completeSignUp.createdSessionId })
        router.push('/dashboard')
      }
    } catch (err: unknown) {
      const clerkError = err as ClerkError
      setError(clerkError.errors?.[0]?.message || 'An error occurred during verification.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleOAuthSignUp = async (strategy: 'oauth_google' | 'oauth_microsoft') => {
    if (!isLoaded) return

    setIsLoading(true)
    setError('')

    try {
      // OAuth authentication will trigger the Clerk webhook
      await signUp.authenticateWithRedirect({
        strategy,
        redirectUrl: '/sso-callback',
        redirectUrlComplete: '/dashboard',
      })
    } catch (err: unknown) {
      const clerkError = err as ClerkError
      setError(clerkError.errors?.[0]?.message || 'An error occurred during sign up.')
      setIsLoading(false)
    }
  }

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-background">
      {/* Left side with form */}
      <div className="w-full lg:w-[45%] flex items-center justify-center p-4 sm:p-8">
        <div className="w-full max-w-md space-y-6 p-6 sm:p-8 rounded-lg bg-card mt-[20vh] lg:mt-0">
          <div className="text-center">
            <h1 className="text-3xl font-bold mb-2 text-card-foreground">Create Account</h1>
            <p className="text-muted-foreground">
              Get started with your free account today
            </p>
          </div>

          {/* Clerk CAPTCHA element - required for bot protection */}
          <div id="clerk-captcha"></div>

          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {!pendingVerification ? (
            <>
              {/* OAuth Buttons */}
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  className="w-1/2 bg-background hover:bg-muted"
                  onClick={() => handleOAuthSignUp('oauth_google')}
                  disabled={isLoading}
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
                  className="w-1/2 bg-background hover:bg-muted"
                  onClick={() => handleOAuthSignUp('oauth_microsoft')}
                  disabled={isLoading}
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
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="px-2 text-muted-foreground">
                    Or sign up with email
                  </span>
                </div>
              </div>

              {/* Sign Up Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-3">
                  <Label htmlFor="username" className="text-card-foreground">Username</Label>
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

                <div className="space-y-3">
                  <Label htmlFor="email" className="text-card-foreground">Email</Label>
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

                <div className="space-y-3">
                  <Label htmlFor="password" className="text-card-foreground">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="password"
                      placeholder="Enter your password"
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      minLength={8}
                      className="pl-10 pr-10 bg-muted/50 hover:bg-muted/70 focus:bg-muted/70 transition-colors border-0 shadow-none"
                      disabled={isLoading}
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-3 h-4 w-4 text-muted-foreground hover:text-card-foreground"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full mt-6"
                  disabled={isLoading || !username || !email || !password}
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Creating account...
                    </>
                  ) : (
                    'Create Account'
                  )}
                </Button>
              </form>
            </>
          ) : (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-center text-card-foreground">
                Verify your email
              </h2>
              <p className="text-muted-foreground text-center">
                We've sent a verification code to <span className="font-medium">{email}</span>
              </p>
              
              <form onSubmit={handleVerify} className="space-y-4">
                <div className="space-y-3">
                  <Label htmlFor="code" className="text-card-foreground">Verification Code</Label>
                  <Input
                    id="code"
                    placeholder="Enter 6-digit code"
                    type="text"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    required
                    className="bg-muted/50 hover:bg-muted/70 focus:bg-muted/70 transition-colors border-0 shadow-none"
                    disabled={isLoading}
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full mt-6"
                  disabled={isLoading || !code}
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Verifying...
                    </>
                  ) : (
                    'Verify Email'
                  )}
                </Button>
              </form>

              <p className="text-sm text-muted-foreground text-center">
                Didn't receive a code?{' '}
                <button
                  type="button"
                  className="text-primary hover:text-primary/80 font-medium"
                  onClick={async () => {
                    try {
                      await signUp?.prepareEmailAddressVerification({ strategy: 'email_code' })
                    } catch (err) {
                      console.error('Error resending code:', err)
                    }
                  }}
                >
                  Resend
                </button>
              </p>
            </div>
          )}

          {/* Mobile sign in link */}
          <div className="text-center text-sm lg:hidden">
            <p className="text-muted-foreground mb-1">Already have an account?</p>
            <Link
              href="/sign-in"
              className="text-primary hover:text-primary/80 font-medium"
            >
              Sign In
            </Link>
          </div>
        </div>
      </div>

      {/* Right side with gradient background */}
      <div className="hidden lg:block relative w-full lg:w-[55%] h-[30vh] lg:h-auto">
        <div 
          className="absolute inset-0 bg-gradient-to-br from-blue-600 via-purple-500 to-cyan-500"
          style={{
            clipPath: 'polygon(15% 0, 100% 0, 100% 100%, 0% 100%)'
          }}
        >
          <div className="p-8 h-full flex flex-col justify-between items-end">
            <div className="text-right">
              <h1 className="text-4xl font-bold text-white">Join SkyDark</h1>
              <p className="text-white/80 mt-2">Create your account to get started</p>
            </div>
            <div className="text-right mb-8">
              <p className="text-white/90 text-lg mb-1">Already have an account?</p>
              <Link href="/sign-in">
                <span className="text-cyan-200 hover:text-cyan-100 font-semibold text-lg cursor-pointer transition-colors">
                  Sign In
                </span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}