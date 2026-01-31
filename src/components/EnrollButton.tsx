'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';

interface EnrollButtonProps {
  planId: string;
  userIsPro: boolean;
  cta: string;
}

export default function EnrollButton({ planId, userIsPro, cta }: EnrollButtonProps) {
  const router = useRouter();

  async function handleUpgrade() {
    router.push('/premium-payment');
  }

  // Show button only if not on current plan
  const isCurrentPlan = (planId === 'free' && !userIsPro) || (planId === 'pro' && userIsPro);

  return (
    <Button
      className="w-full mb-6"
      variant={planId === 'pro' ? 'default' : 'outline'}
      size="lg"
      onClick={planId === 'pro' ? handleUpgrade : undefined}
      disabled={isCurrentPlan}
    >
      {isCurrentPlan ? 'Current Plan' : cta}
    </Button>
  );
}
