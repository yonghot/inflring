'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

const stats = [
  { value: '1,200+', label: '크리에이터' },
  { value: '500+', label: '브랜드' },
  { value: '3,000+', label: '매칭 성사' },
] as const;

export function HeroSection() {
  return (
    <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden bg-gradient-to-br from-[#0F1B2D] via-[#1E3A5F] to-[#2E75B6]">
      {/* Subtle grid overlay */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            'radial-gradient(circle at 1px 1px, white 1px, transparent 0)',
          backgroundSize: '40px 40px',
        }}
        aria-hidden="true"
      />

      {/* Radial glow */}
      <div
        className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full opacity-20 blur-3xl"
        style={{
          background:
            'radial-gradient(circle, rgba(74,144,217,0.6) 0%, transparent 70%)',
        }}
        aria-hidden="true"
      />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 text-center">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Badge className="bg-white/10 text-white/90 border border-white/20 backdrop-blur-sm px-4 py-1.5 text-sm">
            인플루언서 x 브랜드 매칭 플랫폼
          </Badge>
        </motion.div>

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="mt-8 text-5xl md:text-6xl lg:text-7xl font-extrabold leading-tight text-white"
        >
          광고가 울리는 순간,
          <br />
          <span className="bg-gradient-to-r from-white to-white/70 bg-clip-text text-transparent">
            인플링이 연결합니다
          </span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mx-auto mt-6 max-w-2xl text-lg md:text-xl leading-relaxed text-white/80"
        >
          MCN 전속 없이 광고 건별 직접 계약.
          <br className="hidden sm:inline" />
          AI 매칭으로 딱 맞는 파트너를 찾으세요.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.45 }}
          className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Link href="/signup?role=creator">
            <Button
              size="lg"
              className="bg-white text-primary hover:bg-white/90 hover:text-primary-dark shadow-lg shadow-black/20 min-w-[200px]"
            >
              크리에이터 시작하기
            </Button>
          </Link>
          <Link href="/signup?role=advertiser">
            <Button
              size="lg"
              variant="ghost"
              className="text-white border border-white/30 hover:bg-white/10 hover:text-white min-w-[200px]"
            >
              광고주로 시작하기
            </Button>
          </Link>
        </motion.div>

        {/* Social Proof */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.7 }}
          className="mt-16 flex items-center justify-center gap-8 md:gap-12"
        >
          {stats.map((stat, i) => (
            <div key={stat.label} className="flex items-center gap-2 md:gap-3">
              {i > 0 && (
                <div className="h-8 w-px bg-white/20 -ml-4 md:-ml-6 mr-2 md:mr-0" aria-hidden="true" />
              )}
              <div className="text-center">
                <p className="text-2xl md:text-3xl font-bold text-white">
                  {stat.value}
                </p>
                <p className="text-xs md:text-sm text-white/60 mt-0.5">
                  {stat.label}
                </p>
              </div>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Bottom fade */}
      <div
        className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white to-transparent"
        aria-hidden="true"
      />
    </section>
  );
}
