import Link from 'next/link';
import { Badge } from './ui/badge';

export default function ProBadge({ initialIsPro }: { initialIsPro: boolean }) {
  return (
    <div className="flex items-center space-x-3">
      {initialIsPro ? (
        <Badge className="text-xs border-purple-600 bg-transparent rounded-full bg-opacity-20 px-2 py-0.5 font-semibold text-purple-600" variant="outline">
          PRO
        </Badge>
      ) : (
        <>
          <span className="px-3 py-1 rounded-lg text-xs font-semibold uppercase tracking-wide bg-muted text-muted-foreground">
            Free
          </span>
          <Link
            href="/premium"
            className="text-sm text-primary hover:text-primary/80 hover:underline font-medium"
          >
            View Other Plans
          </Link>
        </>
      )}
    </div>
  );
}