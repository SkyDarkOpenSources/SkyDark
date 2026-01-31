import { currentUser } from '@clerk/nextjs/server';
import { Check, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { isProMember } from '../../../lib/actions/pro.action';
import { redirect } from 'next/navigation';
import EnrollButton from '@/components/EnrollButton';

async function PricingPage() {
  const user = await currentUser();
  
  if (!user) {
    redirect('/sign-in');
  }

  const userEmail = user?.emailAddresses?.[0]?.emailAddress || '';
  const userIsPro = await isProMember(userEmail);

  const features = [
    { name: 'Create Clubs', free: true, pro: true },
    { name: 'Create Events', free: true, pro: true },
    { name: 'Basic Event Management', free: true, pro: true },
    { name: 'Member Management', free: false, pro: true },
    { name: 'Advanced Analytics', free: false, pro: true },
    { name: 'Custom Branding', free: false, pro: true },
    { name: 'Priority Support', free: false, pro: true },
    { name: 'Event Promotion Tools', free: false, pro: true },
    { name: 'Bulk Member Import', free: false, pro: true },
    { name: 'API Access', free: false, pro: true },
    { name: 'White Label Options', free: false, pro: true },
  ];

  const pricingPlans = [
    {
      id: 'free',
      name: 'Free Plan',
      price: '$0',
      description: 'Perfect for getting started',
      cta: 'Get Started',
    },
    {
      id: 'pro',
      name: 'Pro Plan',
      price: '$9.99',
      period: '/month',
      description: 'Unlock full potential of your clubs',
      cta: 'Start Free Trial',
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl font-bold mb-4">
            SkyDark Plans
          </h1>
          <p className="text-xl text-muted-foreground mb-8">
            Powerful cloud storage, advanced tech features, and scalable solutions for your clubs. Choose the perfect plan for your needs.
          </p>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8 mb-16">
            {pricingPlans.map((plan) => {
              const isCurrentPlan = (plan.id === 'free' && !userIsPro) || (plan.id === 'pro' && userIsPro);
              return (
              <Card
                key={plan.id}
                className={`relative p-8 transition-all duration-300 ${
                  isCurrentPlan
                    ? 'border-2 border-black dark:border-white'
                    : ''
                }`}
              >
                <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                <p className="text-muted-foreground mb-6">{plan.description}</p>
                <div className="mb-6">
                  <span className="text-4xl font-bold">{plan.price}</span>
                  {plan.period && (
                    <span className="text-muted-foreground ml-2">{plan.period}</span>
                  )}
                </div>
                <EnrollButton planId={plan.id} userIsPro={userIsPro} cta={plan.cta} />
                <div className="space-y-3">
                  {features.slice(0, 3).map((feature, idx) => (
                    <div key={idx} className="flex items-center gap-3">
                      <Check className="w-5 h-5 text-green-500" />
                      <span className="text-sm">{feature.name}</span>
                    </div>
                  ))}
                  <p className="text-xs text-muted-foreground pt-3">
                    + {plan.id === 'free' ? 'More features available' : 'Much more...'}
                  </p>
                </div>
              </Card>
              );
            })}
          </div>

          {/* Features Comparison Table */}
          <div className="mt-20">
            <h2 className="text-3xl font-bold mb-12 text-center">
              Feature Comparison
            </h2>
            <Card className="overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b bg-muted/50">
                      <th className="px-6 py-4 text-left font-semibold">Features</th>
                      <th className="px-6 py-4 text-center font-semibold">Free Plan</th>
                      <th className="px-6 py-4 text-center font-semibold">Pro Plan</th>
                    </tr>
                  </thead>
                  <tbody>
                    {features.map((feature, idx) => (
                      <tr
                        key={idx}
                        className={`border-b ${idx % 2 === 0 ? 'bg-muted/30' : ''}`}
                      >
                        <td className="px-6 py-4 font-medium">{feature.name}</td>
                        <td className="px-6 py-4 text-center">
                          {feature.free ? (
                            <Check className="w-5 h-5 text-green-500 mx-auto" />
                          ) : (
                            <X className="w-5 h-5 text-red-500 mx-auto" />
                          )}
                        </td>
                        <td className="px-6 py-4 text-center">
                          {feature.pro ? (
                            <Check className="w-5 h-5 text-green-500 mx-auto" />
                          ) : (
                            <X className="w-5 h-5 text-red-500 mx-auto" />
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </div>

          {/* CTA Section */}
          <section className="mt-20 py-12 px-8 bg-gradient-to-r from-primary/10 to-primary/5 rounded-lg border border-primary/20 text-center">
            <h3 className="text-2xl font-bold mb-4">Ready to grow your clubs?</h3>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              Start with our free plan and upgrade to Pro anytime. No credit card required to get started.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="outline">
                Learn More
              </Button>
              <Button size="lg">
                Upgrade to Pro
              </Button>
            </div>
          </section>

          {/* FAQ Section */}
          <section className="mt-20">
            <h3 className="text-2xl font-bold mb-8 text-center">
              Frequently Asked Questions
            </h3>
            <div className="grid md:grid-cols-2 gap-8">
              {[
                {
                  q: 'Can I switch plans anytime?',
                  a: 'Yes! You can upgrade or downgrade your plan at any time. Changes take effect immediately.',
                },
                {
                  q: 'Is there a free trial for Pro?',
                  a: 'Yes, we offer a 14-day free trial for our Pro plan. No credit card required.',
                },
                {
                  q: 'What happens if I downgrade?',
                  a: 'Your data remains safe. You may lose access to Pro features, but all your club data is preserved.',
                },
                {
                  q: 'Do you offer refunds?',
                  a: 'We offer a 30-day money-back guarantee if you\'re not satisfied with Pro.',
                },
              ].map((item, idx) => (
                <Card key={idx} className="p-6">
                  <h4 className="font-semibold mb-3">{item.q}</h4>
                  <p className="text-sm text-muted-foreground">{item.a}</p>
                </Card>
              ))}
            </div>
          </section>
        </div>
      </section>
    </div>
  );
}

export default PricingPage;
