'use client';

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { XCircle } from 'lucide-react';

export default function CancelPage() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="max-w-md w-full p-8 text-center">
        <XCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
        <h1 className="text-2xl font-bold mb-2">Payment Cancelled</h1>
        <p className="text-muted-foreground mb-6">
          Your payment was cancelled. No charges have been made to your account.
        </p>
        <div className="space-y-3">
          <Link href="/premium-payment" className="block">
            <Button className="w-full" variant="default">
              Try Again
            </Button>
          </Link>
          <Link href="/premium" className="block">
            <Button className="w-full" variant="outline">
              Back to Plans
            </Button>
          </Link>
        </div>
      </Card>
    </div>
  );
}
