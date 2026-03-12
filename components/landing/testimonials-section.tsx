'use client';

import { Star } from 'lucide-react';
import { FadeIn, StaggerContainer, StaggerItem } from '@/components/shared/motion-wrapper';

interface Testimonial {
  name: string;
  role: string;
  company: string;
  content: string;
  rating: number;
  avatar: string;
}

const testimonials: Testimonial[] = [
  {
    name: '김서연',
    role: '뷰티 크리에이터 / 구독자 12만',
    company: 'SeoYeon Beauty',
    content:
      'MCN 소속 없이도 브랜드 광고를 받을 수 있게 되었어요. AI 매칭 덕분에 제 채널 성격에 딱 맞는 광고주를 만났습니다. 계약서도 자동으로 만들어져서 정말 편해요.',
    rating: 5,
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face&auto=format&q=80',
  },
  {
    name: '이준호',
    role: '마케팅 매니저',
    company: 'GlowSkin Korea',
    content:
      '인플루언서 찾는 데 매번 시간을 쏟았는데, 인플링에서는 데이터 기반으로 추천해주니까 효율이 확 올랐습니다. 시장 단가 비교 기능이 특히 유용해요.',
    rating: 5,
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face&auto=format&q=80',
  },
  {
    name: '박하은',
    role: '라이프스타일 크리에이터 / 구독자 8만',
    company: 'Haeun Daily',
    content:
      '이전에는 광고비를 늦게 받거나 계약 조건이 불리한 적이 많았는데, 에스크로 결제와 공정 계약서 덕분에 안심하고 작업할 수 있어요.',
    rating: 5,
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face&auto=format&q=80',
  },
];

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5" aria-label={`${rating}점 만점`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          size={16}
          className={
            i < rating
              ? 'fill-warning text-warning'
              : 'fill-transparent text-gray-200'
          }
        />
      ))}
    </div>
  );
}

export function TestimonialsSection() {
  return (
    <section id="testimonials" className="py-20 md:py-28 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <FadeIn className="text-center mb-14 md:mb-20">
          <p className="text-sm font-semibold uppercase tracking-wider text-primary mb-3">
            Testimonials
          </p>
          <h2 className="text-3xl md:text-4xl font-bold text-text-primary leading-tight">
            실제 이용자의 이야기
          </h2>
          <p className="mt-4 mx-auto max-w-2xl text-text-secondary leading-relaxed">
            인플링과 함께 성장한 크리에이터와 브랜드의 경험을 확인하세요.
          </p>
        </FadeIn>

        {/* Cards */}
        <StaggerContainer
          staggerDelay={0.15}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {testimonials.map((t) => (
            <StaggerItem key={t.name}>
              <div className="relative rounded-2xl bg-white p-6 md:p-8 transition-all duration-300 hover:shadow-xl hover:-translate-y-2 flex flex-col h-full group">
                {/* Gradient border effect */}
                <div
                  className="absolute inset-0 rounded-2xl p-[1px] -z-10"
                  aria-hidden="true"
                >
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/20 via-border to-accent/20 opacity-60 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
                <div className="absolute inset-[1px] rounded-[calc(1rem-1px)] bg-white -z-[5]" aria-hidden="true" />

                {/* Stars */}
                <div className="mb-4">
                  <StarRating rating={t.rating} />
                </div>

                {/* Quote */}
                <p className="flex-1 text-sm text-text-secondary leading-relaxed mb-6">
                  &ldquo;{t.content}&rdquo;
                </p>

                {/* Author */}
                <div className="flex items-center gap-3 pt-4 border-t border-border">
                  <img
                    src={t.avatar}
                    alt={t.name}
                    className="h-11 w-11 rounded-full object-cover ring-2 ring-primary/10"
                    loading="lazy"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-text-primary">
                      {t.name}
                    </p>
                    <p className="text-xs text-text-muted truncate">{t.role}</p>
                  </div>
                  <span className="text-[10px] font-medium text-primary/70 bg-primary/5 rounded-full px-2.5 py-1 whitespace-nowrap">
                    {t.company}
                  </span>
                </div>
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}
