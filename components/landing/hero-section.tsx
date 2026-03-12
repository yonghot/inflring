'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Users, Handshake, BarChart3, TrendingUp } from 'lucide-react';

const stats = [
  { value: '1,200+', label: '크리에이터' },
  { value: '500+', label: '브랜드' },
  { value: '3,000+', label: '매칭 성사' },
  { value: '98%', label: '만족도' },
] as const;

const floatingCards = [
  {
    icon: Users,
    label: '신규 크리에이터 가입',
    value: '+24 오늘',
    position: 'top-[18%] left-[6%] lg:left-[8%]',
    delay: 1.2,
  },
  {
    icon: Handshake,
    label: '매칭 완료',
    value: '뷰티 x 스킨케어',
    position: 'top-[30%] right-[4%] lg:right-[6%]',
    delay: 1.5,
  },
  {
    icon: BarChart3,
    label: '평균 ROI',
    value: '340%',
    position: 'bottom-[22%] left-[4%] lg:left-[10%]',
    delay: 1.8,
  },
  {
    icon: TrendingUp,
    label: '이번 주 거래액',
    value: '₩2.4억',
    position: 'bottom-[28%] right-[6%] lg:right-[8%]',
    delay: 2.0,
  },
];

export function HeroSection() {
  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
      {/* Background image overlay */}
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage:
            'url(https://images.unsplash.com/photo-1552664730-d307ca884978?w=1920&q=80&auto=format&fit=crop)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
        aria-hidden="true"
      />
      {/* Dark gradient overlay on top of image */}
      <div
        className="absolute inset-0 z-[1] bg-gradient-to-br from-[#0F1B2D]/92 via-[#1E3A5F]/88 to-[#2E75B6]/85"
        aria-hidden="true"
      />

      {/* Subtle grid overlay */}
      <div
        className="absolute inset-0 z-[2] opacity-[0.04]"
        style={{
          backgroundImage:
            'radial-gradient(circle at 1px 1px, white 1px, transparent 0)',
          backgroundSize: '40px 40px',
        }}
        aria-hidden="true"
      />

      {/* Radial glow */}
      <div
        className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[700px] rounded-full opacity-25 blur-3xl z-[2]"
        style={{
          background:
            'radial-gradient(circle, rgba(74,144,217,0.6) 0%, transparent 70%)',
        }}
        aria-hidden="true"
      />

      {/* Floating stat cards */}
      {floatingCards.map((card) => (
        <motion.div
          key={card.label}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: card.delay, ease: 'easeOut' }}
          className={`absolute z-[5] hidden lg:flex items-center gap-3 rounded-xl bg-white/10 backdrop-blur-md border border-white/15 px-4 py-3 shadow-lg ${card.position}`}
        >
          <motion.div
            animate={{ y: [0, -6, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut', delay: card.delay * 0.5 }}
            className="flex items-center gap-3"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/30">
              <card.icon size={18} className="text-white" />
            </div>
            <div>
              <p className="text-[11px] text-white/60">{card.label}</p>
              <p className="text-sm font-semibold text-white">{card.value}</p>
            </div>
          </motion.div>
        </motion.div>
      ))}

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
          className="mt-8 text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight leading-tight text-white"
        >
          광고가 울리는 순간,
          <br />
          <span className="bg-gradient-to-r from-[#4A90D9] via-[#51CF66] to-[#4A90D9] bg-clip-text text-transparent">
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
              className="bg-white text-primary hover:bg-white/90 hover:text-primary-dark shadow-lg shadow-primary/30 min-w-[220px] px-8 py-4 text-lg relative overflow-hidden group"
            >
              <span className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{ boxShadow: '0 0 30px rgba(46,117,182,0.4), 0 0 60px rgba(46,117,182,0.2)' }} />
              <span className="relative">크리에이터 시작하기</span>
            </Button>
          </Link>
          <Link href="/signup?role=advertiser">
            <Button
              size="lg"
              variant="ghost"
              className="text-white border border-white/30 hover:bg-white/10 hover:text-white min-w-[220px] px-8 py-4 text-lg"
            >
              광고주로 시작하기
            </Button>
          </Link>
        </motion.div>

        {/* Trusted by line */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="mt-6 text-sm text-white/50"
        >
          이미 500개 이상의 브랜드가 인플링을 신뢰합니다
        </motion.p>

        {/* Social Proof Stats */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.7 }}
          className="mt-12 inline-flex items-center justify-center gap-6 md:gap-10 rounded-2xl bg-white/[0.07] backdrop-blur-sm border border-white/10 px-8 py-5"
        >
          {stats.map((stat, i) => (
            <div key={stat.label} className="flex items-center gap-2 md:gap-3">
              {i > 0 && (
                <div className="h-10 w-px bg-white/15 -ml-3 md:-ml-5 mr-1 md:mr-0" aria-hidden="true" />
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
        className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white to-transparent z-[5]"
        aria-hidden="true"
      />
    </section>
  );
}
