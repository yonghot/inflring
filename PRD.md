# 인플링 (Inflring) — 요구사항정의서 (PRD)

> 인플루언서 광고 매칭 플랫폼
> "광고가 울리는 순간" — 인플루언서와 브랜드를 잇는 고리

## 2-1. 프로젝트 개요

### 한 줄 요약
인플루언서가 MCN 전속 없이 광고 건별로 직접 계약하는 양면 마켓플레이스.

### 가치 체인
```
Deal Sourcing → Deal Cooking → Deal Closing
(딜 소싱)      (딜 쿠킹)      (딜 클로징)
```

- **Deal Sourcing**: 미디어킷 자동생성, AI 매칭, 광고 수용 상태 공개, 역제안(Reverse Pitch)
- **Deal Cooking**: 시장 평균 단가 비교, 협상 어시스턴트, 계약서 자동생성, 독소조항 경고
- **Deal Closing**: 에스크로 결제, 콘텐츠 검수, 성과 리포트, 신뢰 온도 시스템

### 수익 모델
| 수익원 | 구조 | 금액 |
|--------|------|------|
| 계약 성사 수수료 | 계약금액의 % | 5~15% |
| Pro 구독 (인플루언서) | 월정액 | ₩29,000 / ₩79,000 |
| 광고주 프리미엄 | 월정액/건별 | ₩99,000~ / 건당 ₩30,000 |

### 사용자 역할
| 역할 | 설명 |
|------|------|
| Creator | 인플루언서 (구독자 1만~50만, MCN 미소속) |
| Brand | 광고주 (중소기업/스타트업/D2C 브랜드) |
| Admin | 플랫폼 관리자 |

---

## 2-2. 페르소나

### 페르소나 1: 크리에이터 — 김현지 (27세, 남성패션 유튜버)
- **배경**: 구독자 3.68만, 남성패션/그루밍 니치 크리에이터. MCN 미소속.
- **고충**: 광고 단가를 모르겠다. DM으로 오는 제안이 적절한지 판단 어렵다. 계약서를 제대로 못 읽겠다.
- **니즈**: 시장 단가 알고 싶다. 내 채널에 맞는 광고만 받고 싶다. 공정한 계약을 하고 싶다.
- **기대**: 미디어킷이 자동으로 만들어지고, 내 조건에 맞는 광고가 추천되면 좋겠다.

### 페르소나 2: 광고주 — 이수진 (34세, D2C 향수 브랜드 마케터)
- **배경**: 중소 향수 브랜드 마케팅 담당. 인플루언서 마케팅 경험 3회.
- **고충**: 적합한 인플루언서 찾기 어렵다. 단가가 적정한지 모르겠다. 계약 후 콘텐츠 품질 보장이 없다.
- **니즈**: 카테고리/시청자가 맞는 인플루언서를 빠르게 찾고 싶다. 투명한 성과 리포트가 필요하다.
- **기대**: AI가 적합한 인플루언서를 추천하고, 계약부터 성과까지 한 곳에서 관리되면 좋겠다.

### 페르소나 3: 관리자 — 박운영 (30세, 플랫폼 운영자)
- **배경**: 인플링 플랫폼 운영/관리 담당.
- **고충**: 사용자 관리, 분쟁 중재, 데이터 모니터링을 효율적으로 하고 싶다.
- **니즈**: 대시보드에서 핵심 지표를 한눈에 보고, 문제 상황에 빠르게 대응하고 싶다.

---

## 2-3. 기능 명세

### P0 — MVP 필수 기능

#### F-001: 회원가입/로그인 (Supabase Auth)
- **우선순위**: P0
- **설명**: 이메일 기반 회원가입/로그인. 가입 시 역할(creator/brand) 선택.
- **AC**:
  1. 이메일+비밀번호로 회원가입 시 profiles 테이블에 역할과 함께 레코드 생성된다.
  2. 로그인 성공 시 역할에 따라 크리에이터/광고주 대시보드로 리다이렉트된다.
  3. 비로그인 사용자는 인증 필요 페이지 접근 시 로그인 페이지로 리다이렉트된다.

#### F-002: 크리에이터 온보딩 (3필드 간편 가입)
- **우선순위**: P0
- **설명**: 이름+이메일+채널URL 3개 필드로 간편 온보딩. 채널 데이터 자동 수집.
- **AC**:
  1. 채널 URL 입력 시 플랫폼(youtube/instagram 등)이 자동 감지된다.
  2. creators 테이블에 채널 정보가 저장된다.
  3. 온보딩 완료 후 크리에이터 대시보드로 이동한다.
- **참고**: [PROD-TODO] YouTube Data API 실제 연동은 프로덕션에서. MVP는 목업 데이터 사용.

#### F-003: 광고주 온보딩
- **우선순위**: P0
- **설명**: 회사명+이름+이메일+광고분야 입력으로 간편 가입.
- **AC**:
  1. brands 테이블에 회사 정보가 저장된다.
  2. 온보딩 완료 후 광고주 대시보드로 이동한다.
  3. 대시보드에서 적합 인플루언서 추천 목록이 표시된다.

#### F-004: 크리에이터 프로필 / 광고 수용 상태 관리
- **우선순위**: P0
- **설명**: 크리에이터가 자신의 광고 수용 상태, 희망 단가, 선호/불가 카테고리를 설정.
- **AC**:
  1. 광고 가능/불가 토글이 동작한다.
  2. 희망 단가 범위(min/max)를 설정할 수 있다.
  3. 선호/불가 카테고리를 멀티셀렉트로 설정할 수 있다.

#### F-005: 캠페인 등록 (광고주)
- **우선순위**: P0
- **설명**: 광고주가 캠페인 브리프를 등록하여 인플루언서를 모집.
- **AC**:
  1. 캠페인 제목, 설명, 콘텐츠 유형, 플랫폼, 예산 범위가 필수 입력이다.
  2. campaigns 테이블에 저장되고 상태는 'active'로 시작한다.
  3. 캠페인 목록에서 다른 사용자가 조회할 수 있다.

#### F-006: 인플루언서 검색/탐색 (광고주)
- **우선순위**: P0
- **설명**: 광고주가 카테고리, 구독자 수, 플랫폼 등 조건으로 인플루언서를 검색.
- **AC**:
  1. 카테고리, 구독자 범위, 플랫폼 필터가 동작한다.
  2. 광고 가능 상태(is_available=true)인 크리에이터만 노출된다.
  3. 검색 결과에서 인플루언서 프로필 상세로 이동할 수 있다.

#### F-007: 원클릭 제안 (광고주→인플루언서)
- **우선순위**: P0
- **설명**: 광고주가 인플루언서 프로필에서 바로 제안을 보낼 수 있다.
- **AC**:
  1. '제안하기' 버튼 클릭 시 캠페인을 선택할 수 있다.
  2. matches 테이블에 direction='brand_direct_offer'로 레코드 생성된다.
  3. 매칭 상태가 'pending'으로 시작한다.

#### F-008: 캠페인 피드 + 지원 (인플루언서)
- **우선순위**: P0
- **설명**: 인플루언서가 활성 캠페인 목록을 보고 지원할 수 있다.
- **AC**:
  1. active 상태 캠페인만 피드에 노출된다.
  2. '지원하기' 버튼으로 matches 테이블에 direction='creator_apply'로 생성된다.
  3. 중복 지원 시 에러 메시지가 표시된다.

#### F-009: 딜 목록 / 상세 (양쪽)
- **우선순위**: P0
- **설명**: 크리에이터/광고주 모두 자신의 진행 중인 딜을 목록으로 보고 상세 확인.
- **AC**:
  1. 내 매칭/계약 목록이 상태별로 필터링된다.
  2. 딜 상세에서 매칭 정보, 계약 상태를 확인할 수 있다.
  3. 매칭 수락/거절 액션이 동작한다.

#### F-010: 랜딩 페이지
- **우선순위**: P0
- **설명**: 서비스 소개, CTA, 사회적 증거를 포함한 프리미엄 랜딩 페이지.
- **AC**:
  1. 히어로 섹션에 대형 타이틀 + 서브카피 + CTA 버튼이 있다.
  2. 서비스 특징/가치를 소개하는 섹션이 있다.
  3. 회원가입/로그인으로 연결되는 CTA가 동작한다.

#### F-011: 관리자 대시보드
- **우선순위**: P0
- **설명**: 관리자가 핵심 지표를 확인하는 대시보드.
- **AC**:
  1. 총 사용자 수, 캠페인 수, 매칭 수 등 핵심 지표가 표시된다.
  2. admin 역할만 접근 가능하다.
  3. 최근 활동 목록이 표시된다.

### P1 — Phase 2 기능

#### F-012: 계약서 템플릿 빌더
- **우선순위**: P1
- **설명**: 모듈화된 조항으로 계약서를 자동 생성하고 독소조항을 경고.
- **AC**:
  1. 필수 모듈(계약 당사자, 활동 범위, 콘텐츠 귀속 등)이 자동 포함된다.
  2. 선택 모듈(수정 횟수, 자율권 등)을 토글로 추가/제거할 수 있다.
  3. [PROD-TODO] 독소조항 감지는 Claude API 연동 후 구현.

#### F-013: 인앱 메시징
- **우선순위**: P1
- **설명**: 매칭 당사자 간 실시간 채팅.
- **AC**:
  1. 매칭된 당사자만 채팅에 참여할 수 있다.
  2. 텍스트 메시지를 주고받을 수 있다.
  3. [PROD-TODO] Supabase Realtime 실시간 구독은 프로덕션에서 구현.

#### F-014: 역제안 (Reverse Pitch)
- **우선순위**: P1
- **설명**: 인플루언서가 광고주에게 먼저 제안.
- **AC**:
  1. 역제안 메시지, 희망 금액, 콘텐츠 형식을 입력할 수 있다.
  2. matches 테이블에 direction='creator_reverse_pitch'로 생성된다.
  3. 과거 성과 데이터가 자동 첨부된다.

#### F-015: 신뢰 온도 시스템
- **우선순위**: P1
- **설명**: 당근마켓식 온도 시스템으로 사용자 신뢰도를 수치화.
- **AC**:
  1. 계약 완료 후 상호 평가(5개 항목, 1~5점)가 가능하다.
  2. 평가 점수에 따라 온도가 변동된다.
  3. 프로필에 온도가 표시된다.

### P2 — Phase 3 기능

#### F-016: 에스크로 결제
- **우선순위**: P2
- **설명**: [PROD-TODO] PG사 연동으로 에스크로 결제. Phase 3에서 구현.

#### F-017: 콘텐츠 검수 워크플로
- **우선순위**: P2
- **설명**: [PROD-TODO] 콘텐츠 업로드/검수/승인/수정요청 워크플로. Phase 3.

#### F-018: 성과 리포트 자동생성
- **우선순위**: P2
- **설명**: [PROD-TODO] YouTube/Instagram API로 성과 자동 추적. Phase 3.

#### F-019: AI 매칭 엔진
- **우선순위**: P2
- **설명**: [PROD-TODO] Claude API로 매칭 점수 산출. MVP는 단순 카테고리 매칭.

---

## 2-4. 사용자 플로우

### 크리에이터 플로우
```
회원가입(역할: creator) → 크리에이터 온보딩(채널URL) → 프로필 설정(광고 수용 상태)
→ 캠페인 피드 탐색 → 지원하기 → 딜 상세 확인 → (매칭 수락/거절)
```

### 광고주 플로우
```
회원가입(역할: brand) → 광고주 온보딩(회사정보) → 캠페인 등록
→ 인플루언서 검색 → 제안하기 → 딜 상세 확인 → (매칭 관리)
```

### 관리자 플로우
```
로그인(admin 계정) → 관리자 대시보드 → 사용자/캠페인/매칭 현황 확인
```

---

## 2-5. 기술 스택

| 영역 | 기술 | 비고 |
|------|------|------|
| 프레임워크 | Next.js 15 (App Router) | TypeScript strict |
| 배포 | Vercel | |
| DB/Auth | Supabase | PostgreSQL + Auth + RLS |
| UI | shadcn/ui + Tailwind CSS | Radix UI 기반 |
| 폰트 | Pretendard | 한글 웹폰트 |
| 애니메이션 | Framer Motion | 마이크로 인터랙션 |
| 아이콘 | Lucide React | |
| 유효성 검사 | Zod | API + 폼 |
| AI | Claude API | [PROD-TODO] |
| 결제 | Toss Payments / PortOne | [PROD-TODO] |
| 외부 API | YouTube Data API v3 등 | [PROD-TODO] |

---

## 2-6. 데이터 모델

### 핵심 테이블
| 테이블 | 설명 | 주요 필드 |
|--------|------|-----------|
| profiles | 사용자 | id(auth.users FK), role, display_name, email, trust_score |
| creators | 크리에이터 | profile_id FK, channel_name, platform, subscribers, is_available, min/max_price |
| brands | 광고주 | profile_id FK, company_name, business_category, contact_* |
| campaigns | 캠페인 | brand_id FK, title, content_type, target_platform, budget_min/max, status |
| matches | 매칭 | campaign_id FK, creator_id FK, match_score, direction, status |
| contracts | 계약 | match_id FK, contract_amount, platform_fee, status |
| messages | 메시지 | match_id FK, sender_id FK, content, message_type |
| payments | 결제 | contract_id FK, amount, escrow_status |
| reports | 성과 | contract_id FK, views, engagement_rate |
| trust_reviews | 신뢰 평가 | contract_id FK, reviewer/reviewee_id, 평가 항목들 |
| market_rates | 시장 단가 | platform, category, subscriber_range, avg/min/max_rate |

### RLS 정책 요약
- profiles: 전체 읽기, 본인만 수정
- creators: available만 읽기, 본인 전체 권한
- campaigns: active만 읽기, 소유 광고주 전체 권한
- contracts: 당사자만 접근
- messages: 매칭 당사자만 접근

---

## 2-7. API 설계

### API 응답 표준
```typescript
interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  meta?: {
    total?: number;
    page?: number;
    limit?: number;
  };
}
```

### P0 API 엔드포인트
| 메서드 | 경로 | 설명 |
|--------|------|------|
| GET | /api/health | 헬스체크 |
| POST | /api/auth/signup | 회원가입 |
| POST | /api/auth/login | 로그인 |
| GET | /api/auth/me | 현재 사용자 |
| POST | /api/creators | 크리에이터 등록 |
| GET | /api/creators | 크리에이터 목록 |
| GET | /api/creators/[id] | 크리에이터 상세 |
| PATCH | /api/creators/[id] | 크리에이터 수정 |
| POST | /api/brands | 광고주 등록 |
| GET | /api/brands/[id] | 광고주 상세 |
| POST | /api/campaigns | 캠페인 등록 |
| GET | /api/campaigns | 캠페인 목록 |
| GET | /api/campaigns/[id] | 캠페인 상세 |
| POST | /api/matches | 매칭 생성 (지원/제안) |
| GET | /api/matches | 내 매칭 목록 |
| PATCH | /api/matches/[id] | 매칭 상태 변경 |
| GET | /api/admin/stats | 관리자 통계 |

---

## 2-8. 라우트 맵

```
app/
├── page.tsx                          # 랜딩 페이지
├── (auth)/
│   ├── login/page.tsx                # 로그인
│   ├── signup/page.tsx               # 회원가입 (역할 선택)
│   └── callback/route.ts            # OAuth callback
├── (creator)/
│   ├── layout.tsx                    # Creator 레이아웃
│   ├── dashboard/page.tsx            # 크리에이터 대시보드
│   ├── onboarding/page.tsx           # 크리에이터 온보딩
│   ├── profile/
│   │   ├── page.tsx                  # 내 프로필
│   │   └── edit/page.tsx             # 프로필 편집 + 광고 수용 설정
│   ├── campaigns/
│   │   ├── page.tsx                  # 캠페인 피드
│   │   └── [id]/page.tsx             # 캠페인 상세 + 지원
│   └── deals/
│       ├── page.tsx                  # 내 딜 목록
│       └── [id]/page.tsx             # 딜 상세
├── (brand)/
│   ├── layout.tsx                    # Brand 레이아웃
│   ├── dashboard/page.tsx            # 광고주 대시보드
│   ├── onboarding/page.tsx           # 광고주 온보딩
│   ├── campaigns/
│   │   ├── page.tsx                  # 내 캠페인 목록
│   │   ├── new/page.tsx              # 캠페인 등록
│   │   └── [id]/page.tsx             # 캠페인 상세
│   ├── creators/
│   │   ├── page.tsx                  # 인플루언서 검색
│   │   └── [id]/page.tsx             # 인플루언서 프로필
│   └── deals/
│       ├── page.tsx                  # 내 딜 목록
│       └── [id]/page.tsx             # 딜 상세
├── (admin)/
│   ├── layout.tsx                    # Admin 레이아웃
│   └── dashboard/page.tsx            # 관리자 대시보드
└── api/
    ├── health/route.ts
    ├── auth/...
    ├── creators/...
    ├── brands/...
    ├── campaigns/...
    ├── matches/...
    └── admin/...
```

---

## 2-9. 디렉토리 구조

```
inflring/
├── app/                              # Next.js App Router
│   ├── (auth)/                       # 인증 페이지
│   ├── (creator)/                    # 크리에이터 전용
│   ├── (brand)/                      # 광고주 전용
│   ├── (admin)/                      # 관리자 전용
│   ├── api/                          # API Routes
│   ├── layout.tsx                    # Root layout
│   ├── page.tsx                      # 랜딩 페이지
│   └── globals.css                   # 글로벌 스타일
├── components/
│   ├── ui/                           # shadcn/ui 컴포넌트
│   ├── layout/                       # 레이아웃 (Header, Sidebar, Footer)
│   ├── features/                     # 기능별 컴포넌트
│   │   ├── auth/                     # 인증 관련
│   │   ├── creator/                  # 크리에이터 관련
│   │   ├── brand/                    # 광고주 관련
│   │   ├── campaign/                 # 캠페인 관련
│   │   ├── match/                    # 매칭 관련
│   │   └── landing/                  # 랜딩 페이지
│   └── shared/                       # 공용 컴포넌트
├── lib/
│   ├── supabase/                     # Supabase 클라이언트
│   │   ├── client.ts                 # 브라우저 클라이언트
│   │   ├── server.ts                 # 서버 클라이언트
│   │   └── admin.ts                  # Admin 클라이언트 (service role)
│   ├── services/                     # 비즈니스 로직
│   ├── repositories/                 # Supabase 접근
│   ├── validations/                  # Zod 스키마
│   ├── types/                        # TypeScript 타입
│   ├── constants/                    # 상수
│   └── utils/                        # 유틸리티
├── hooks/                            # React 커스텀 훅
├── docs/                             # 프로젝트 문서
├── public/                           # 정적 파일
├── __tests__/                        # 테스트
└── 설정 파일들
```

---

## 2-10. 비기능 요구사항

| 항목 | 기준 |
|------|------|
| 응답 속도 | API 300ms 이하, 페이지 로드 3초 이하 |
| 접근성 | WCAG 2.1 AA (시맨틱 HTML, aria 레이블) |
| 반응형 | 모바일 퍼스트, sm/md/lg 브레이크포인트 |
| 보안 | RLS 적용, 인증 필수 API, XSS/CSRF 방어 |
| SEO | 메타데이터, OG 태그 (랜딩 페이지) |

---

## 2-11. MVP 경계 ([PROD-TODO] 목록)

| 항목 | MVP 처리 | 프로덕션 전환 시 |
|------|----------|-----------------|
| YouTube API 연동 | 목업 데이터 사용 | YouTube Data API v3 실제 연동 |
| Instagram API | 미구현 | Instagram Graph API 연동 |
| AI 매칭 | 단순 카테고리 매칭 | Claude API 매칭 점수 산출 |
| 독소조항 감지 | 미구현 | Claude API 분석 |
| 에스크로 결제 | 미구현 | Toss Payments / PortOne |
| 실시간 채팅 | 폴링 또는 리프레시 | Supabase Realtime |
| 미디어킷 PDF | 미구현 | Puppeteer / react-pdf |
| 성과 리포트 자동추적 | 수동 입력 | API 자동 수집 |
| admin 시드 계정 | admin@admin.com / admin123! | 보안 강화 |
