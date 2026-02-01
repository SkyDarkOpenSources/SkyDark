'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { CheckCircle } from 'lucide-react';

function SuccessContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const verifyAndUpgrade = async () => {
      if (!sessionId) {
        setError('No session ID found');
        setLoading(false);
        return;
      }

      try {
        const response = await fetch('/api/stripe/verify-payment', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ sessionId }),
        });

        const data = await response.json();
        if (!response.ok) {
          setError(data.error || 'Failed to verify payment');
        }
      } catch (err) {
        console.error('Verification error:', err);
        setError('An error occurred while verifying your payment');
      } finally {
        setLoading(false);
      }
    };

    verifyAndUpgrade();
  }, [sessionId]);

  return (
    <Card className="max-w-md w-full p-8 text-center">
      {loading ? (
        <>
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Processing your payment...</p>
        </>
      ) : error ? (
        <>
          <div className="text-red-500 text-4xl mb-4">✗</div>
          <h1 className="text-2xl font-bold mb-2">Payment Error</h1>
          <p className="text-muted-foreground mb-6">{error}</p>
          <Link href="/premium">
            <Button className="w-full">Back to Plans</Button>
          </Link>
        </>
      ) : (
        <>
          <span className="flex items-center justify-center">
             <CheckCircle className="h-16 w-16 text-green-500 mb-4" />
          </span>
          <h1 className="text-2xl font-bold mb-2">Payment Successful!</h1>
          <p className="text-muted-foreground mb-6">
            Welcome to SkyDark Pro! Your account has been upgraded with all premium features unlocked.
          </p>
          <Link href="/dashboard/profile">
            <Button className="w-full">Go to Dashboard</Button>
          </Link>
        </>
      )}
    </Card>
  );
}

export default function SuccessPage() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Suspense fallback={
        <Card className="max-w-md w-full p-8 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </Card>
      }>
        <SuccessContent />
      </Suspense>
    </div>
  );
}

