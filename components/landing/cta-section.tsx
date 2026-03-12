'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { FadeIn } from '@/components/shared/motion-wrapper';

export function CtaSection() {
  return (
    <section className="relative py-20 md:py-28 overflow-hidden bg-gradient-to-br from-[#1E5A8F] via-[#2E75B6] to-[#4A90D9]">
      {/* Decorative circles */}
      <div
        className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-white/5"
        aria-hidden="true"
      />
      <div
        className="absolute -bottom-24 -left-24 w-72 h-72 rounded-full bg-white/5"
        aria-hidden="true"
      />

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
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/signup">
              <Button
                size="lg"
                className="bg-white text-primary hover:bg-white/90 hover:text-primary-dark shadow-lg shadow-black/20 min-w-[200px] gap-2"
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
