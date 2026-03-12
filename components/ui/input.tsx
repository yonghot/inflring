import * as React from 'react';
import { cn } from '@/lib/utils';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, error, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          'flex w-full rounded-lg border border-border bg-white px-4 py-3 text-base text-text-primary',
          'placeholder:text-text-muted',
          'focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary',
          'disabled:cursor-not-allowed disabled:opacity-50',
          'transition-colors duration-200',
          error && 'border-danger focus:ring-danger/20 focus:border-danger',
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = 'Input';

export { Input };
export type { InputProps };
