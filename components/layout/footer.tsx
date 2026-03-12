import Link from 'next/link';

const productLinks = [
  { href: '#features', label: 'AI 매칭' },
  { href: '#process', label: '이용 방법' },
  { href: '#', label: '요금제' },
  { href: '#', label: 'API' },
] as const;

const supportLinks = [
  { href: '#', label: '자주 묻는 질문' },
  { href: '#', label: '문의하기' },
  { href: '#', label: '크리에이터 가이드' },
  { href: '#', label: '광고주 가이드' },
] as const;

const legalLinks = [
  { href: '#', label: '이용약관' },
  { href: '#', label: '개인정보처리방침' },
  { href: '#', label: '서비스 수준 약정' },
] as const;

export function Footer() {
  return (
    <footer className="bg-slate-50 border-t border-border">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Main footer grid */}
        <div className="grid grid-cols-1 gap-10 py-12 md:py-16 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand column */}
          <div className="space-y-4">
            <Link href="/" className="inline-block">
              <span className="text-xl font-extrabold text-primary tracking-tight">
                인플링
              </span>
            </Link>
            <p className="text-sm text-text-secondary leading-relaxed max-w-xs">
              인플루언서와 브랜드를 잇는 고리.
              <br />
              MCN 전속 없이 광고 건별로 직접 계약하는 양면 마켓플레이스.
            </p>
          </div>

          {/* Product column */}
          <div>
            <h3 className="text-sm font-semibold text-text-primary mb-4">
              제품
            </h3>
            <ul className="space-y-3">
              {productLinks.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-sm text-text-secondary hover:text-text-primary transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Support column */}
          <div>
            <h3 className="text-sm font-semibold text-text-primary mb-4">
              지원
            </h3>
            <ul className="space-y-3">
              {supportLinks.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-sm text-text-secondary hover:text-text-primary transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal column */}
          <div>
            <h3 className="text-sm font-semibold text-text-primary mb-4">
              법적 고지
            </h3>
            <ul className="space-y-3">
              {legalLinks.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-sm text-text-secondary hover:text-text-primary transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-border py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-text-muted">
            &copy; 2026 인플링 (Inflring). All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <a
              href="mailto:support@inflring.com"
              className="text-xs text-text-muted hover:text-text-secondary transition-colors"
            >
              support@inflring.com
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
