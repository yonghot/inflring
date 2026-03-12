'use client';

import { Zap, Shield, TrendingUp, type LucideIcon } from 'lucide-react';
import { FadeIn, StaggerContainer, StaggerItem } from '@/components/shared/motion-wrapper';

interface Feature {
  icon: LucideIcon;
  title: string;
  description: string;
  gradient: string;
}

const features: Feature[] = [
  {
    icon: Zap,
    title: 'AI 매칭',
    description:
      '채널 데이터 기반 AI가 최적의 파트너를 추천합니다. 카테고리, 구독자 특성, 참여율까지 분석합니다.',
    gradient: 'from-[#4A90D9] to-[#2E75B6]',
  },
  {
    icon: Shield,
    title: '공정한 계약',
    description:
      '공정위 표준약관 기반 계약서 자동생성. 독소조항 경고로 양측 모두 안전한 거래를 보장합니다.',
    gradient: 'from-[#51CF66] to-[#37b24d]',
  },
  {
    icon: TrendingUp,
    title: '투명한 성과',
    description:
      '실시간 성과 추적, 시장 단가 비교로 투명한 거래. 데이터 기반의 합리적인 의사결정을 지원합니다.',
    gradient: 'from-[#F59F00] to-[#e67700]',
  },
];

export function FeaturesSection() {
  return (
    <section id="features" className="relative py-20 md:py-28 overflow-hidden">
      {/* Subtle dot pattern background */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            'radial-gradient(circle at 1px 1px, #2E75B6 1px, transparent 0)',
          backgroundSize: '32px 32px',
        }}
        aria-hidden="true"
      />
      {/* Subtle gradient wash */}
      <div
        className="absolute inset-0 bg-gradient-to-b from-white via-surface/50 to-white"
        aria-hidden="true"
      />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <FadeIn className="text-center mb-14 md:mb-20">
          <p className="text-sm font-semibold uppercase tracking-wider text-primary mb-3">
            Core Values
          </p>
          <h2 className="text-3xl md:text-4xl font-bold text-text-primary leading-tight">
            왜 인플링인가요?
          </h2>
          <p className="mt-4 mx-auto max-w-2xl text-text-secondary leading-relaxed">
            인플루언서와 브랜드 모두에게 공정하고 투명한 광고 생태계를 만듭니다.
          </p>
        </FadeIn>

        {/* Feature Cards */}
        <StaggerContainer
          staggerDelay={0.15}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {features.map((feature) => (
            <StaggerItem key={feature.title}>
              <div className="group rounded-2xl border border-border bg-white p-8 transition-all duration-300 hover:shadow-xl hover:-translate-y-2 hover:border-primary/20">
                {/* Icon with gradient background */}
                <div className={`mb-6 inline-flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br ${feature.gradient} text-white shadow-lg shadow-primary/10 transition-transform duration-300 group-hover:scale-110`}>
                  <feature.icon size={26} />
                </div>

                {/* Text */}
                <h3 className="text-xl font-semibold text-text-primary mb-3">
                  {feature.title}
                </h3>
                <p className="text-text-secondary leading-relaxed text-sm">
                  {feature.description}
                </p>
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}
