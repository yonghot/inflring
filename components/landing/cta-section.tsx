'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { FadeIn } from '@/components/shared/motion-wrapper';

export function CtaSection() {
  return (
    <section className="relative py-20 md:py-28 overflow-hidden bg-gradient-to-br from-[#0F1B2D] via-[#1E5A8F] to-[#2E75B6]">
      {/* Animated decorative circles */}
      <motion.div
        animate={{ scale: [1, 1.15, 1], opacity: [0.06, 0.1, 0.06] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-white/5 border border-white/5"
        aria-hidden="true"
      />
      <motion.div
        animate={{ scale: [1, 1.1, 1], opacity: [0.04, 0.08, 0.04] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
        className="absolute -bottom-24 -left-24 w-72 h-72 rounded-full bg-white/5 border border-white/5"
        aria-hidden="true"
      />
      <motion.div
        animate={{ scale: [1, 1.2, 1], opacity: [0.03, 0.06, 0.03] }}
        transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
        className="absolute top-1/2 left-1/3 w-64 h-64 rounded-full bg-accent/10"
        aria-hidden="true"
      />

      {/* Floating dots */}
      {[
        'top-[15%] left-[12%]',
        'top-[25%] right-[18%]',
        'bottom-[20%] left-[22%]',
        'bottom-[30%] right-[10%]',
        'top-[50%] left-[5%]',
        'top-[40%] right-[25%]',
      ].map((pos, i) => (
        <motion.div
          key={i}
          animate={{ y: [0, -10, 0], opacity: [0.2, 0.5, 0.2] }}
          transition={{ duration: 3 + i * 0.5, repeat: Infinity, ease: 'easeInOut', delay: i * 0.4 }}
          className={`absolute ${pos} w-1.5 h-1.5 rounded-full bg-white/30`}
          aria-hidden="true"
        />
      ))}

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
        <FadeIn>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight">
            지금 시작하세요
          </h2>
          <p className="mt-4 mx-auto max-w-xl text-lg text-white/80 leading-relaxed">
            인플링과 함께 더 나은 광고 경험을 만들어보세요.
            <br className="hidden sm:inline" />
            가입은 무료이며, 1분이면 충분합니다.
          </p>
          <p className="mt-2 text-sm text-white/50">
            신용카드 없이 시작 · 언제든 취소 가능
          </p>
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/signup">
              <Button
                size="lg"
                className="bg-white text-primary hover:bg-white/90 hover:text-primary-dark shadow-lg shadow-black/20 min-w-[220px] px-8 py-4 text-lg gap-2"
              >
                무료로 시작하기
                <ArrowRight size={18} />
              </Button>
            </Link>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
