import * as React from 'react';
import { cn } from '@/lib/utils';

interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  src?: string | null;
  alt?: string;
  initials?: string;
  size?: 'sm' | 'md' | 'lg';
}

const sizeMap = {
  sm: 'h-8 w-8 text-xs',
  md: 'h-10 w-10 text-sm',
  lg: 'h-14 w-14 text-base',
} as const;

function Avatar({
  src,
  alt,
  initials,
  size = 'md',
  className,
  ...props
}: AvatarProps) {
  const [imgError, setImgError] = React.useState(false);

  const showImage = src && !imgError;

  return (
    <div
      className={cn(
        'relative inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-primary text-white font-medium',
        sizeMap[size],
        className
      )}
      {...props}
    >
      {showImage ? (
        <img
          src={src}
          alt={alt ?? ''}
          className="h-full w-full object-cover"
          onError={() => setImgError(true)}
        />
      ) : (
        <span aria-hidden="true">
          {initials ?? alt?.charAt(0)?.toUpperCase() ?? '?'}
        </span>
      )}
    </div>
  );
}

export { Avatar };
export type { AvatarProps };
