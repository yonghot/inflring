import { cn } from '@/lib/utils';

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  /** 시머(shimmer) 효과 활성화 */
  shimmer?: boolean;
}

function Skeleton({ className, shimmer = true, ...props }: SkeletonProps) {
  return (
    <div
      className={cn(
        'rounded-md bg-slate-200',
        shimmer
          ? 'relative isolate overflow-hidden before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_1.5s_infinite] before:bg-gradient-to-r before:from-transparent before:via-white/60 before:to-transparent'
          : 'animate-pulse',
        className
      )}
      {...props}
    />
  );
}

export { Skeleton };
export type { SkeletonProps };
