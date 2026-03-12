'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { type LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
  /** 아이콘 배경 색상 변형 */
  iconVariant?: 'default' | 'primary' | 'warning' | 'danger';
}

const iconVariantMap = {
  default: 'bg-slate-100 text-text-muted',
  primary: 'bg-primary/10 text-primary',
  warning: 'bg-warning/10 text-amber-600',
  danger: 'bg-danger/10 text-danger',
} as const;

function EmptyState({
  icon: Icon,
  title,
  description,
  actionLabel,
  onAction,
  className,
  iconVariant = 'default',
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center py-16 px-6 text-center',
        className
      )}
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        className={cn(
          'mb-6 flex h-20 w-20 items-center justify-center rounded-full',
          iconVariantMap[iconVariant]
        )}
      >
        <motion.div
          animate={{ y: [0, -4, 0] }}
          transition={{
            duration: 2,
            repeat: Infinity,
            repeatType: 'loop',
            ease: 'easeInOut',
          }}
        >
          <Icon className="h-10 w-10" />
        </motion.div>
      </motion.div>
      <h3 className="text-xl font-bold text-text-primary">{title}</h3>
      {description && (
        <p className="mt-2 max-w-sm text-sm text-text-secondary leading-relaxed">
          {description}
        </p>
      )}
      {actionLabel && onAction && (
        <Button onClick={onAction} className="mt-6">
          {actionLabel}
        </Button>
      )}
    </div>
  );
}

export { EmptyState };
export type { EmptyStateProps };
