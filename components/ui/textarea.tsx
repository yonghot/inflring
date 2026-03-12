import * as React from 'react';
import { cn } from '@/lib/utils';

interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: boolean;
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, error, ...props }, ref) => {
    return (
      <textarea
        className={cn(
          'flex min-h-[120px] w-full rounded-lg border border-border bg-white px-4 py-3 text-base text-text-primary',
          'placeholder:text-text-muted',
          'focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary',
          'disabled:cursor-not-allowed disabled:opacity-50',
          'transition-colors duration-200 resize-y',
          error && 'border-danger focus:ring-danger/20 focus:border-danger',
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Textarea.displayName = 'Textarea';

export { Textarea };
export type { TextareaProps };
