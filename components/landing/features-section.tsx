'use client';

import { Zap, Shield, TrendingUp, type LucideIcon } from 'lucide-react';
import { FadeIn, StaggerContainer, StaggerItem } from '@/components/shared/motion-wrapper';

interface Feature {
  icon: LucideIcon;
  title: string;
  description: string;
}

const features: Feature[] = [
  {
    icon: Zap,
    title: 'AI 매칭',
    description:
      '채널 데이터 기반 AI가 최적의 파트너를 추천합니다. 카테고리, 구독자 특성, 참여율까지 분석합니다.',
  },
  {
    icon: Shield,
    title: '공정한 계약',
    description:
      '공정위 표준약관 기반 계약서 자동생성. 독소조항 경고로 양측 모두 안전한 거래를 보장합니다.',
  },
  {
    icon: TrendingUp,
    title: '투명한 성과',
    description:
      '실시간 성과 추적, 시장 단가 비교로 투명한 거래. 데이터 기반의 합리적인 의사결정을 지원합니다.',
  },
];

export function FeaturesSection() {
  return (
    <section id="features" className="py-20 md:py-28 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <FadeIn className="text-center mb-12 md:mb-16">
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
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8"
        >
          {features.map((feature) => (
            <StaggerItem key={feature.title}>
              <div className="group rounded-xl border border-border bg-white p-8 transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
                {/* Icon */}
                <div className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-white">
                  <feature.icon size={24} />
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
