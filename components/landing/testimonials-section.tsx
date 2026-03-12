'use client';

import { Star } from 'lucide-react';
import { Avatar } from '@/components/ui/avatar';
import { FadeIn, StaggerContainer, StaggerItem } from '@/components/shared/motion-wrapper';

interface Testimonial {
  name: string;
  role: string;
  content: string;
  rating: number;
}

const testimonials: Testimonial[] = [
  {
    name: '김서연',
    role: '뷰티 크리에이터 / 구독자 12만',
    content:
      'MCN 소속 없이도 브랜드 광고를 받을 수 있게 되었어요. AI 매칭 덕분에 제 채널 성격에 딱 맞는 광고주를 만났습니다. 계약서도 자동으로 만들어져서 정말 편해요.',
    rating: 5,
  },
  {
    name: '이준호',
    role: '마케팅 매니저 / 스킨케어 브랜드',
    content:
      '인플루언서 찾는 데 매번 시간을 쏟았는데, 인플링에서는 데이터 기반으로 추천해주니까 효율이 확 올랐습니다. 시장 단가 비교 기능이 특히 유용해요.',
    rating: 5,
  },
  {
    name: '박하은',
    role: '라이프스타일 크리에이터 / 구독자 8만',
    content:
      '이전에는 광고비를 늦게 받거나 계약 조건이 불리한 적이 많았는데, 에스크로 결제와 공정 계약서 덕분에 안심하고 작업할 수 있어요.',
    rating: 5,
  },
];

export function TestimonialsSection() {
  return (
    <section id="testimonials" className="py-20 md:py-28 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <FadeIn className="text-center mb-12 md:mb-16">
          <p className="text-sm font-semibold uppercase tracking-wider text-primary mb-3">
            Testimonials
          </p>
          <h2 className="text-3xl md:text-4xl font-bold text-text-primary leading-tight">
            실제 이용자의 이야기
          </h2>
        </FadeIn>

        {/* Cards */}
        <StaggerContainer
          staggerDelay={0.15}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8"
        >
          {testimonials.map((t) => (
            <StaggerItem key={t.name}>
              <div className="rounded-xl border border-border bg-white p-6 md:p-8 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 flex flex-col h-full">
                {/* Stars */}
                <div className="flex gap-0.5 mb-4" aria-label={`${t.rating}점 만점`}>
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <Star
                      key={i}
                      size={16}
                      className="fill-warning text-warning"
                    />
                  ))}
                </div>

                {/* Quote */}
                <p className="flex-1 text-sm text-text-secondary leading-relaxed mb-6">
                  &ldquo;{t.content}&rdquo;
                </p>

                {/* Author */}
                <div className="flex items-center gap-3 pt-4 border-t border-border">
                  <Avatar initials={t.name.slice(0, 1)} alt={t.name} size="md" />
                  <div>
                    <p className="text-sm font-semibold text-text-primary">
                      {t.name}
                    </p>
                    <p className="text-xs text-text-muted">{t.role}</p>
                  </div>
                </div>
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}
