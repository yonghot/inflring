'use client';

import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { HeroSection } from '@/components/landing/hero-section';
import { FeaturesSection } from '@/components/landing/features-section';
import { ProcessSection } from '@/components/landing/process-section';
import { TestimonialsSection } from '@/components/landing/testimonials-section';
import { CtaSection } from '@/components/landing/cta-section';

export default function LandingPage() {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <HeroSection />
        <FeaturesSection />
        <ProcessSection />
        <TestimonialsSection />
        <CtaSection />
      </main>
      <Footer />
    </div>
  );
}
