'use client';

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

const badgeVariants = cva(
  'inline-flex items-center rounded-full px-3 py-1 text-xs font-medium transition-colors',
  {
    variants: {
      variant: {
        default: 'bg-primary/10 text-primary',
        secondary: 'bg-slate-100 text-text-secondary',
        outline: 'border border-border text-text-secondary',
        destructive: 'bg-danger/10 text-danger',
        success: 'bg-accent/10 text-green-700',
        info: 'bg-primary/10 text-primary-dark',
        warning: 'bg-warning/10 text-amber-700',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {
  /** 마운트 시 스케일 애니메이션 활성화 */
  animate?: boolean;
}

function Badge({ className, variant, animate = false, ...props }: BadgeProps) {
  const cls = cn(badgeVariants({ variant }), className);

  if (animate) {
    const { children, ...rest } = props;
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.2, ease: 'easeOut' }}
        className={cls}
      >
        <div {...rest}>{children}</div>
      </motion.div>
    );
  }

  return <div className={cls} {...props} />;
}

export { Badge, badgeVariants };
export type { BadgeProps };
