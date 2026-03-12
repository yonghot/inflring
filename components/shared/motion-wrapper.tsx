'use client';

import * as React from 'react';
import { motion, type HTMLMotionProps } from 'framer-motion';
import { cn } from '@/lib/utils';

/* ─── FadeIn ────────────────────────────────────────────────────────── */

interface FadeInProps extends HTMLMotionProps<'div'> {
  delay?: number;
  direction?: 'up' | 'down' | 'left' | 'right' | 'none';
  distance?: number;
  duration?: number;
}

function FadeIn({
  children,
  delay = 0,
  direction = 'up',
  distance = 24,
  duration = 0.5,
  className,
  ...props
}: FadeInProps) {
  const directionMap = {
    up: { y: distance },
    down: { y: -distance },
    left: { x: distance },
    right: { x: -distance },
    none: {},
  } as const;

  return (
    <motion.div
      initial={{ opacity: 0, ...directionMap[direction] }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration, delay, ease: 'easeOut' }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
}

/* ─── StaggerContainer ──────────────────────────────────────────────── */

interface StaggerContainerProps extends HTMLMotionProps<'div'> {
  staggerDelay?: number;
}

function StaggerContainer({
  children,
  staggerDelay = 0.1,
  className,
  ...props
}: StaggerContainerProps) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-80px' }}
      variants={{
        hidden: {},
        visible: {
          transition: {
            staggerChildren: staggerDelay,
          },
        },
      }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
}

/* ─── StaggerItem (child for StaggerContainer) ──────────────────────── */

interface StaggerItemProps extends HTMLMotionProps<'div'> {
  direction?: 'up' | 'down' | 'left' | 'right';
  distance?: number;
}

function StaggerItem({
  children,
  direction = 'up',
  distance = 24,
  className,
  ...props
}: StaggerItemProps) {
  const directionMap = {
    up: { y: distance },
    down: { y: -distance },
    left: { x: distance },
    right: { x: -distance },
  } as const;

  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, ...directionMap[direction] },
        visible: { opacity: 1, x: 0, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
      }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
}

/* ─── HoverLift ──────────────────────────────────────────────────────── */

interface HoverLiftProps extends HTMLMotionProps<'div'> {
  lift?: number;
}

function HoverLift({
  children,
  lift = -4,
  className,
  ...props
}: HoverLiftProps) {
  return (
    <motion.div
      whileHover={{ y: lift, transition: { duration: 0.2 } }}
      className={cn('will-change-transform', className)}
      {...props}
    >
      {children}
    </motion.div>
  );
}

export { FadeIn, StaggerContainer, StaggerItem, HoverLift };
