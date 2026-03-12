import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: '인플링 (Inflring) — 광고가 울리는 순간',
  description: '인플루언서와 브랜드를 잇는 고리. MCN 전속 없이 광고 건별로 직접 계약하는 양면 마켓플레이스.',
  openGraph: {
    title: '인플링 (Inflring)',
    description: '인플루언서와 브랜드를 잇는 광고 매칭 플랫폼',
    siteName: '인플링',
    locale: 'ko_KR',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <head>
        <link
          rel="stylesheet"
          as="style"
          crossOrigin="anonymous"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.min.css"
        />
      </head>
      <body className="min-h-screen font-sans">
        {children}
      </body>
    </html>
  );
}
