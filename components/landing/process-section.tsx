'use client';

import { Search, FileText, CheckCircle, type LucideIcon } from 'lucide-react';
import { FadeIn, StaggerContainer, StaggerItem } from '@/components/shared/motion-wrapper';

interface Step {
  number: string;
  icon: LucideIcon;
  title: string;
  description: string;
}

const steps: Step[] = [
  {
    number: '01',
    icon: Search,
    title: '딜 소싱',
    description: '미디어킷 자동생성으로 나를 어필하고, AI 매칭으로 딱 맞는 파트너를 발견하세요.',
  },
  {
    number: '02',
    icon: FileText,
    title: '딜 쿠킹',
    description: '시장 단가 비교로 합리적인 가격을 확인하고, 표준 계약서를 자동으로 생성합니다.',
  },
  {
    number: '03',
    icon: CheckCircle,
    title: '딜 클로징',
    description: '에스크로 결제로 안전하게 거래하고, 성과 리포트로 결과를 투명하게 확인합니다.',
  },
];

export function ProcessSection() {
  return (
    <section id="process" className="py-20 md:py-28 bg-slate-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <FadeIn className="text-center mb-12 md:mb-16">
          <p className="text-sm font-semibold uppercase tracking-wider text-primary mb-3">
            How It Works
          </p>
          <h2 className="text-3xl md:text-4xl font-bold text-text-primary leading-tight">
            3단계로 간단하게
          </h2>
          <p className="mt-4 mx-auto max-w-2xl text-text-secondary leading-relaxed">
            복잡한 절차 없이, 소싱부터 정산까지 한 곳에서 해결하세요.
          </p>
        </FadeIn>

        {/* Steps */}
        <StaggerContainer
          staggerDelay={0.2}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-6 lg:gap-10"
        >
          {steps.map((step, i) => (
            <StaggerItem key={step.number}>
              <div className="relative text-center md:text-left">
                {/* Connector line (desktop) */}
                {i < steps.length - 1 && (
                  <div
                    className="hidden md:block absolute top-8 left-[calc(50%+32px)] w-[calc(100%-64px)] h-px bg-border"
                    aria-hidden="true"
                  />
                )}

                {/* Number badge */}
                <div className="mx-auto md:mx-0 mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary text-white font-bold text-xl shadow-lg shadow-primary/20">
                  {step.number}
                </div>

                {/* Icon */}
                <div className="mb-3 inline-flex items-center gap-2">
                  <step.icon size={20} className="text-primary" />
                  <h3 className="text-xl font-semibold text-text-primary">
                    {step.title}
                  </h3>
                </div>

                {/* Description */}
                <p className="text-sm text-text-secondary leading-relaxed max-w-xs mx-auto md:mx-0">
                  {step.description}
                </p>
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}
