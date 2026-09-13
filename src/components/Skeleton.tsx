export function Skeleton({ className = '' }: { className?: string }) {
  return <div className={`animate-pulse rounded-lg bg-ink/[0.06] ${className}`} />;
}

export function FundCardSkeleton() {
  return (
    <div className="bg-white border border-ink/10 border-t-4 border-t-ink/10 rounded-2xl p-6">
      <Skeleton className="h-5 w-24 mb-5" />
      <Skeleton className="h-9 w-36 mb-2" />
      <Skeleton className="h-4 w-28 mb-6" />
      <Skeleton className="h-11 w-full rounded-lg" />
    </div>
  );
}
