import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap rounded-lg font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:shadow-md hover:scale-[1.02] active:scale-[0.98]',
  {
    variants: {
      variant: {
        default:
          'bg-primary text-white hover:bg-primary-light',
        secondary:
          'border border-border bg-white text-text-primary hover:bg-surface',
        outline:
          'border border-primary text-primary bg-transparent hover:bg-primary/5',
        ghost:
          'text-text-primary hover:bg-slate-100 hover:shadow-none',
        destructive:
          'bg-danger text-white hover:bg-red-600',
      },
      size: {
        default: 'px-6 py-3 text-base',
        sm: 'px-4 py-2 text-sm rounded-md',
        lg: 'px-8 py-4 text-lg',
        icon: 'h-10 w-10 p-0',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = 'Button';

export { Button, buttonVariants };
export type { ButtonProps };
