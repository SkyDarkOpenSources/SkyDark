'use client';

import { useEffect, useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { EmbeddedCheckoutProvider, EmbeddedCheckout } from '@stripe/react-stripe-js';
import { Card } from '@/components/ui/card';

const StripePaymentPage = () => {
  const [clientSecret, setClientSecret] = useState<string | null>(null);

  useEffect(() => {
    const fetchSessionId = async () => {
      try {
        const response = await fetch('/api/stripe/checkout-session', {
          method: 'POST',
        });
        const data = await response.json();
        
        if (data.sessionId) {
          setClientSecret(data.sessionId);
        }
      } catch (error) {
        console.error('Error fetching session:', error);
      }
    };

    fetchSessionId();
  }, []);

  const stripePromise = loadStripe(
    process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
  );

  return (
    <div className="min-h-screen bg-background">
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-4xl sm:text-5xl font-bold mb-4">
              Upgrade to SkyDark Pro
            </h1>
            <p className="text-xl text-muted-foreground">
              Get unlimited access to all premium features. Only $9.99/month
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Features List */}
            <div className="md:col-span-1 space-y-4">
              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4">Pro Features</h3>
                <ul className="space-y-3">
                  <li className="flex items-center gap-2">
                    <span className="text-green-500">✓</span>
                    <span className="text-sm">Member Management</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-green-500">✓</span>
                    <span className="text-sm">Advanced Analytics</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-green-500">✓</span>
                    <span className="text-sm">Custom Branding</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-green-500">✓</span>
                    <span className="text-sm">Priority Support</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-green-500">✓</span>
                    <span className="text-sm">Event Promotion Tools</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-green-500">✓</span>
                    <span className="text-sm">API Access</span>
                  </li>
                </ul>
              </Card>
            </div>

            {/* Stripe Embedded Checkout */}
            <div className="md:col-span-2">
              <Card className="p-6">
                {clientSecret && stripePromise ? (
                  <EmbeddedCheckoutProvider
                    stripe={stripePromise}
                    options={{ clientSecret }}
                  >
                    <EmbeddedCheckout />
                  </EmbeddedCheckoutProvider>
                ) : (
                  <div className="flex items-center justify-center py-16">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                  </div>
                )}
              </Card>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default StripePaymentPage;
