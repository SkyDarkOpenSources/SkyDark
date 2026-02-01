'use client';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

const StripePaymentPage = () => {
  const handleCheckout = async () => {
    try {
      const response = await fetch('/api/stripe/checkout-session', {
        method: 'POST',
      });
      const data = await response.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        console.error('Failed to create checkout session:', data.error);
        alert('Failed to start checkout. Please try again.');
      }
    } catch (error) {
      console.error('Checkout error:', error);
      alert('An error occurred. Please try again.');
    }
  };

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

            <div className="md:col-span-2">
              <Card className="p-6">
                <div className="text-center">
                  <h3 className="text-2xl font-bold mb-2">SkyDark Pro</h3>
                  <p className="text-3xl font-bold mb-6">$9.99<span className="text-lg text-muted-foreground">/month</span></p>
                  <Button 
                    onClick={handleCheckout}
                    size="lg"
                    className="w-full"
                  >
                    Start Your Subscription
                  </Button>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default StripePaymentPage;