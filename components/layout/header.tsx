'use client';

import * as React from 'react';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

const navLinks = [
  { href: '#features', label: '기능 소개' },
  { href: '#process', label: '이용 방법' },
  { href: '#testimonials', label: '후기' },
] as const;

export function Header() {
  const [scrolled, setScrolled] = React.useState(false);
  const [mobileOpen, setMobileOpen] = React.useState(false);

  React.useEffect(() => {
    function handleScroll() {
      setScrolled(window.scrollY > 20);
    }
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  React.useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileOpen]);

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-40 transition-all duration-300',
        'h-16 md:h-20',
        scrolled
          ? 'bg-white/80 backdrop-blur-md shadow-sm border-b border-border'
          : 'bg-transparent'
      )}
    >
      <div className="mx-auto flex h-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2"
          aria-label="인플링 홈"
        >
          <span className="text-xl font-extrabold tracking-tight">
            <span className={cn(scrolled ? 'text-primary' : 'text-white')}>
              인플링
            </span>
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8" aria-label="메인 메뉴">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className={cn(
                'text-sm font-medium transition-colors duration-200',
                scrolled
                  ? 'text-text-secondary hover:text-text-primary'
                  : 'text-white/80 hover:text-white'
              )}
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Desktop CTA */}
        <div className="hidden md:flex items-center gap-3">
          <Link href="/login">
            <Button
              variant="ghost"
              size="sm"
              className={cn(
                scrolled
                  ? 'text-text-secondary hover:text-text-primary'
                  : 'text-white/80 hover:text-white hover:bg-white/10'
              )}
            >
              로그인
            </Button>
          </Link>
          <Link href="/signup">
            <Button size="sm">회원가입</Button>
          </Link>
        </div>

        {/* Mobile Hamburger */}
        <button
          className={cn(
            'md:hidden p-2 rounded-lg transition-colors',
            scrolled
              ? 'text-text-primary hover:bg-slate-100'
              : 'text-white hover:bg-white/10'
          )}
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label={mobileOpen ? '메뉴 닫기' : '메뉴 열기'}
          aria-expanded={mobileOpen}
        >
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2, ease: 'easeInOut' }}
            className="md:hidden overflow-hidden bg-white border-b border-border shadow-lg"
          >
            <nav className="flex flex-col px-4 py-4 space-y-1" aria-label="모바일 메뉴">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="rounded-lg px-4 py-3 text-sm font-medium text-text-secondary hover:bg-surface hover:text-text-primary transition-colors"
                  onClick={() => setMobileOpen(false)}
                >
                  {link.label}
                </a>
              ))}
              <div className="pt-3 border-t border-border flex flex-col gap-2">
                <Link href="/login" onClick={() => setMobileOpen(false)}>
                  <Button variant="ghost" className="w-full justify-center">
                    로그인
                  </Button>
                </Link>
                <Link href="/signup" onClick={() => setMobileOpen(false)}>
                  <Button className="w-full justify-center">회원가입</Button>
                </Link>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
