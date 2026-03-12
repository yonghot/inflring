import * as React from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  error?: boolean;
}

const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, children, error, ...props }, ref) => {
    return (
      <div className="relative">
        <select
          className={cn(
            'flex w-full appearance-none rounded-lg border border-border bg-white px-4 py-3 pr-10 text-base text-text-primary',
            'focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary',
            'disabled:cursor-not-allowed disabled:opacity-50',
            'transition-colors duration-200',
            error && 'border-danger focus:ring-danger/20 focus:border-danger',
            className
          )}
          ref={ref}
          {...props}
        >
          {children}
        </select>
        <ChevronDown
          className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-text-muted"
          size={18}
        />
      </div>
    );
  }
);
Select.displayName = 'Select';

export { Select };
export type { SelectProps };
