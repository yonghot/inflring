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

/* ─── SlideIn ───────────────────────────────────────────────────────── */

interface SlideInProps extends HTMLMotionProps<'div'> {
  /** 슬라이드 방향 */
  from?: 'left' | 'right' | 'top' | 'bottom';
  /** 슬라이드 거리 (px) */
  distance?: number;
  delay?: number;
  duration?: number;
}

function SlideIn({
  children,
  from = 'left',
  distance = 48,
  delay = 0,
  duration = 0.5,
  className,
  ...props
}: SlideInProps) {
  const initialMap = {
    left: { x: -distance, opacity: 0 },
    right: { x: distance, opacity: 0 },
    top: { y: -distance, opacity: 0 },
    bottom: { y: distance, opacity: 0 },
  } as const;

  return (
    <motion.div
      initial={initialMap[from]}
      whileInView={{ x: 0, y: 0, opacity: 1 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration, delay, ease: [0.25, 0.46, 0.45, 0.94] }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
}

/* ─── ScaleIn ───────────────────────────────────────────────────────── */

interface ScaleInProps extends HTMLMotionProps<'div'> {
  /** 시작 스케일 */
  initialScale?: number;
  delay?: number;
  duration?: number;
}

function ScaleIn({
  children,
  initialScale = 0.85,
  delay = 0,
  duration = 0.4,
  className,
  ...props
}: ScaleInProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: initialScale }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration, delay, ease: 'easeOut' }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
}

/* ─── BlurIn ────────────────────────────────────────────────────────── */

interface BlurInProps extends HTMLMotionProps<'div'> {
  /** 시작 블러 정도 (px) */
  blurAmount?: number;
  delay?: number;
  duration?: number;
}

function BlurIn({
  children,
  blurAmount = 10,
  delay = 0,
  duration = 0.5,
  className,
  ...props
}: BlurInProps) {
  return (
    <motion.div
      initial={{ opacity: 0, filter: `blur(${blurAmount}px)` }}
      whileInView={{ opacity: 1, filter: 'blur(0px)' }}
      viewport={{ once: true, margin: '-60px' }}
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

export {
  FadeIn,
  SlideIn,
  ScaleIn,
  BlurIn,
  StaggerContainer,
  StaggerItem,
  HoverLift,
};
