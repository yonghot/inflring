# 인플링 (Inflring) — 디자인 시스템

## 3-1. 디자인 철학

- **프리미엄 감성**: 프로토타입처럼 보이면 안 된다. 초안부터 상용 SaaS 수준.
- **여백 중심 레이아웃**: 콘텐츠 사이에 충분한 호흡 공간. 빽빽하게 채우지 않는다.
- **시선 흐름 설계**: 히어로 → 가치 제안 → 사회적 증거 → CTA 순서의 자연스러운 흐름.
- **신뢰와 전문성**: 블루 계열 Primary로 신뢰감, 깔끔한 타이포그래피로 전문성 표현.
- **일관성**: 모든 페이지에서 동일한 컴포넌트, 색상, 간격 시스템 사용.

## 3-2. 기술 스택

| 영역 | 기술 | 용도 |
|------|------|------|
| UI 프레임워크 | shadcn/ui | Radix 기반 접근성 보장 컴포넌트 |
| 스타일링 | Tailwind CSS | 유틸리티 퍼스트 |
| 아이콘 | Lucide React | 일관된 라인 아이콘 |
| 한글 폰트 | Pretendard | Variable 웹폰트 |
| 영문 폰트 | Inter (기본) | Next.js 내장 |
| 애니메이션 | Framer Motion | 마이크로 인터랙션 |
| 이미지 | next/image | 최적화 + placeholder blur |

## 3-3. 컬러 시스템

### 브랜드 컬러
| 토큰 | 값 | 용도 |
|------|-----|------|
| Primary | #2E75B6 | 신뢰 블루 — CTA, 링크, 주요 액션 |
| Primary Light | #4A90D9 | 호버 상태 |
| Primary Dark | #1E5A8F | 액티브/포커스 상태 |
| Accent | #51CF66 | 성장 그린 — 성공, 긍정 지표 |
| Warning | #F59F00 | 주의 — 독소조항, 주의사항 |
| Danger | #DC3545 | 위험 — 에러, 삭제, 경고 |

### 뉴트럴
| 토큰 | 라이트 | 다크 |
|------|--------|------|
| Background | #FFFFFF | #0A0A0B |
| Surface | #F8FAFC | #1A1A2E |
| Border | #E2E8F0 | #2D2D44 |
| Text Primary | #0F172A | #F1F5F9 |
| Text Secondary | #64748B | #94A3B8 |
| Text Muted | #94A3B8 | #64748B |

### 그라데이션
```css
/* 히어로 배경 */
--gradient-hero: linear-gradient(135deg, #2E75B6 0%, #1E3A5F 50%, #0F1B2D 100%);
/* CTA 버튼 */
--gradient-cta: linear-gradient(135deg, #2E75B6 0%, #4A90D9 100%);
/* 카드 배경 강조 */
--gradient-card: linear-gradient(180deg, rgba(46,117,182,0.05) 0%, transparent 100%);
```

### Tailwind 확장 (tailwind.config.ts)
```typescript
colors: {
  primary: { DEFAULT: '#2E75B6', light: '#4A90D9', dark: '#1E5A8F' },
  accent: '#51CF66',
  warning: '#F59F00',
  danger: '#DC3545',
}
```

## 3-4. 타이포그래피

### 폰트 설정
- **한글**: Pretendard Variable (CDN 또는 self-host)
- **영문/숫자**: Inter (Next.js 내장 next/font)
- **코드**: JetBrains Mono (필요 시)

### 스케일
| 용도 | 클래스 | 사이즈 | Weight |
|------|--------|--------|--------|
| Display (히어로) | text-5xl md:text-6xl | 48/60px | font-extrabold (800) |
| H1 | text-3xl md:text-4xl | 30/36px | font-bold (700) |
| H2 | text-2xl md:text-3xl | 24/30px | font-bold (700) |
| H3 | text-xl | 20px | font-semibold (600) |
| Body Large | text-lg | 18px | font-normal (400) |
| Body | text-base | 16px | font-normal (400) |
| Small | text-sm | 14px | font-normal (400) |
| Caption | text-xs | 12px | font-medium (500) |

### 행간
- 제목: leading-tight (1.25)
- 본문: leading-relaxed (1.625)
- 캡션: leading-normal (1.5)

## 3-5. 스페이싱 / 레이아웃

### 컨테이너
```
max-w-7xl mx-auto px-4 sm:px-6 lg:px-8
```

### 섹션 간격
- 섹션 간: `py-20 md:py-28`
- 섹션 내 그룹: `space-y-12 md:space-y-16`
- 컴포넌트 간: `gap-6 md:gap-8`
- 카드 내부: `p-6 md:p-8`

### 그리드
- 12컬럼: `grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6`
- 사이드바 레이아웃: `grid grid-cols-[280px_1fr]` (데스크톱)
- 대시보드 카드: `grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6`

### 반응형 브레이크포인트
| 브레이크포인트 | 값 | 용도 |
|---------------|-----|------|
| sm | 640px | 모바일 가로 |
| md | 768px | 태블릿 |
| lg | 1024px | 데스크톱 |
| xl | 1280px | 대형 데스크톱 |

## 3-6. 컴포넌트 가이드

### 버튼
```
기본: rounded-lg px-6 py-3 font-semibold transition-all duration-200
호버: hover:shadow-md hover:scale-[1.02]
액티브: active:scale-[0.98]
Primary: bg-primary text-white hover:bg-primary-light
Secondary: border border-border bg-white hover:bg-gray-50
Ghost: hover:bg-gray-100
```

### 카드
```
기본: rounded-xl border border-border bg-white p-6 shadow-sm
호버: hover:shadow-lg hover:-translate-y-1 transition-all duration-300
이미지 카드: overflow-hidden → 이미지 aspect-video object-cover
```

### 모달/다이얼로그
- 백드롭: `bg-black/50 backdrop-blur-sm`
- 컨테이너: `rounded-2xl shadow-2xl max-w-lg`
- 진입 애니메이션: scale(0.95) → scale(1) + opacity

### 입력 필드
```
기본: rounded-lg border border-border px-4 py-3 text-base
포커스: focus:ring-2 focus:ring-primary/20 focus:border-primary
에러: border-danger text-danger
```

### 네비게이션 (헤더)
```
스크롤 전: bg-transparent
스크롤 후: bg-white/80 backdrop-blur-md shadow-sm border-b
높이: h-16 md:h-20
```

### 사이드바 (대시보드)
```
너비: w-64 (데스크톱), 풀스크린 오버레이 (모바일)
배경: bg-slate-50 border-r border-border
아이템: px-4 py-2.5 rounded-lg hover:bg-white
활성: bg-white shadow-sm text-primary font-medium
```

### 테이블
```
헤더: bg-slate-50 text-xs font-semibold uppercase tracking-wider
행: hover:bg-slate-50 border-b border-border
셀: px-6 py-4 text-sm
```

### 토스트
- 위치: 우측 하단
- 스타일: `rounded-lg shadow-lg border`
- 종류별 색상: success(accent), error(danger), warning(warning), info(primary)

## 3-7. 히어로 / 랜딩 패턴

### 히어로 섹션
```
구조:
  배경: 그라데이션 또는 실사 이미지 + 오버레이
  높이: min-h-[80vh]
  정렬: flex items-center justify-center text-center

  콘텐츠:
    - 태그라인 배지: inline-flex rounded-full px-4 py-1.5 text-sm bg-primary/10 text-primary
    - 메인 타이틀: text-5xl md:text-6xl font-extrabold
    - 서브카피: text-xl text-muted-foreground max-w-2xl mx-auto
    - CTA 그룹: flex gap-4 justify-center
      - Primary CTA: 크기 lg, 그라데이션 배경
      - Secondary CTA: Ghost 스타일
    - 사회적 증거: flex items-center gap-8 mt-12
```

### 기능 소개 섹션
```
구조: 3컬럼 그리드
카드: 아이콘(48px, primary 색상) + 제목 + 설명
간격: py-20, gap-8
```

### 가격표 섹션
```
구조: 3컬럼 카드
추천: ring-2 ring-primary, "인기" 배지
기능 목록: 체크 아이콘 + 텍스트
```

### FAQ 아코디언
- shadcn/ui Accordion 사용
- 부드러운 열기/닫기 애니메이션

### 풋터
```
4컬럼 레이아웃 (lg)
로고 + 설명 | 제품 | 지원 | 법적
하단: 카피라이트 + 소셜 링크
```

## 3-8. 이미지 / 비주얼 전략

### 실사 이미지
- **소스**: Unsplash (https://images.unsplash.com/...)
- **용도**: 히어로 배경, 크리에이터 프로필, 캠페인 썸네일
- **키워드**: influencer, content creator, social media, marketing, collaboration

### Next.js Image 설정
```tsx
<Image
  src="https://images.unsplash.com/..."
  alt="설명적 대체 텍스트"
  width={1200}
  height={630}
  className="object-cover"
  placeholder="blur"
  blurDataURL="data:image/jpeg;base64,..."
/>
```

### 아이콘
- **Lucide React 통일**: 모든 아이콘은 lucide-react에서 가져온다
- **크기 일관성**: 내비게이션 20px, 기능 카드 48px, 인라인 16px
- **색상**: 기본 currentColor, 강조 시 primary

### 아바타
- 기본: 이니셜 원형 (bg-primary text-white)
- 업로드: rounded-full object-cover

## 3-9. 마이크로 인터랙션

### Framer Motion 기본 설정
```tsx
// 페이드인 (섹션)
const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 }
};

// 순차 등장 (카드 그리드)
const staggerContainer = {
  animate: { transition: { staggerChildren: 0.1 } }
};

// 호버 리프트 (카드)
const hoverLift = {
  whileHover: { y: -4, transition: { duration: 0.2 } }
};

// 스크롤 기반 등장
<motion.div
  initial={{ opacity: 0, y: 20 }}
  whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: true, margin: "-100px" }}
/>
```

### 페이지 전환
```tsx
// 레이아웃 래퍼
<motion.div
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  transition={{ duration: 0.3 }}
>
  {children}
</motion.div>
```

### 로딩 상태
- **Skeleton**: shadcn/ui Skeleton 컴포넌트
- **카드 스켈레톤**: rounded-xl + 펄스 애니메이션
- **테이블 스켈레톤**: 행 단위 펄스

### 상태 전환
- 토글: 0.2초 이징
- 탭 전환: 언더라인 슬라이드
- 모달: 0.2초 scale + opacity

## 3-10. 레퍼런스

| 사이트 | 참고 포인트 |
|--------|-------------|
| Linear (linear.app) | 깔끔한 SaaS 랜딩, 여백, 타이포그래피 |
| Vercel (vercel.com) | 다크 히어로, 그라데이션, 마이크로 인터랙션 |
| Stripe (stripe.com) | 가격표 레이아웃, 카드 디자인 |
| 당근마켓 | 신뢰 온도 UI, 따뜻한 인터랙션 |
| 크몽 (kmong.com) | 한국형 마켓플레이스 UI 패턴 |

## 3-11. 변경 이력

| 날짜 | 변경 내용 |
|------|-----------|
| 2026-03-12 | 초안 작성 |
