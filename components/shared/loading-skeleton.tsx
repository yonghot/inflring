import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

/* ─── Card Skeleton ──────────────────────────────────────────────────── */

interface CardSkeletonProps {
  className?: string;
  lines?: number;
}

function CardSkeleton({ className, lines = 3 }: CardSkeletonProps) {
  return (
    <div
      className={cn(
        'rounded-xl border border-border bg-white p-6 md:p-8 space-y-4',
        className
      )}
    >
      <Skeleton className="h-12 w-12 rounded-lg" />
      <Skeleton className="h-5 w-2/3" />
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          className={cn('h-4', i === lines - 1 ? 'w-4/5' : 'w-full')}
        />
      ))}
    </div>
  );
}

/* ─── Table Skeleton ─────────────────────────────────────────────────── */

interface TableSkeletonProps {
  className?: string;
  rows?: number;
  cols?: number;
}

function TableSkeleton({ className, rows = 5, cols = 4 }: TableSkeletonProps) {
  return (
    <div
      className={cn(
        'rounded-xl border border-border bg-white overflow-hidden',
        className
      )}
    >
      {/* Header */}
      <div className="flex gap-4 bg-slate-50 px-6 py-4">
        {Array.from({ length: cols }).map((_, i) => (
          <Skeleton key={i} className="h-3 flex-1" />
        ))}
      </div>
      {/* Rows */}
      {Array.from({ length: rows }).map((_, rowIdx) => (
        <div
          key={rowIdx}
          className="flex gap-4 border-b border-border px-6 py-4 last:border-b-0"
        >
          {Array.from({ length: cols }).map((_, colIdx) => (
            <Skeleton key={colIdx} className="h-4 flex-1" />
          ))}
        </div>
      ))}
    </div>
  );
}

/* ─── Profile Skeleton ───────────────────────────────────────────────── */

interface ProfileSkeletonProps {
  className?: string;
}

function ProfileSkeleton({ className }: ProfileSkeletonProps) {
  return (
    <div className={cn('flex items-center gap-4', className)}>
      <Skeleton className="h-12 w-12 rounded-full" />
      <div className="space-y-2 flex-1">
        <Skeleton className="h-4 w-1/3" />
        <Skeleton className="h-3 w-1/2" />
      </div>
    </div>
  );
}

export { CardSkeleton, TableSkeleton, ProfileSkeleton };
