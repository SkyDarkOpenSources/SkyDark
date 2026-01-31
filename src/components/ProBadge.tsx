import Link from 'next/link';

export default function ProBadge({ initialIsPro }: { initialIsPro: boolean }) {
  return (
    <div className="flex items-center space-x-3">
      {initialIsPro ? (
        <span className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wider shadow-lg">
          Pro
        </span>
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
