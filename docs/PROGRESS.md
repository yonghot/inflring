# 인플링 (Inflring) — 개발 진행 현황

## Phase 완료 상태

| Phase | 설명 | 상태 | 게이트 체크 |
|-------|------|------|------------|
| Phase 0 | 프로젝트 셋업 | ✅ 완료 | 10/10 파일 생성 |
| Phase 1 | PRD 분석 + 아키텍처 설계 | ✅ 완료 | Next.js 초기화, 기반 코드 |
| Phase 2 | 백엔드 구현 (P0) | ✅ 완료 | 17 API 핸들러, 빌드 성공 |
| Phase 3 | 프론트엔드 구현 (P0) | ✅ 완료 | 26 페이지, 프리미엄 디자인 |
| Phase 4 | 통합 + 테스트 | ✅ 완료 | 205 테스트 통과 |
| Phase 5 | 문서 + Git + 배포 준비 | ✅ 완료 | README, PROGRESS.md |
| Phase 6 | Supabase + Vercel 배포 | ✅ 완료 | 프로덕션 배포 완료 |
| Phase 7 | P1 기능 구현 | ✅ 완료 | 알림, 채팅, 계약, 리뷰 |
| Phase 8 | 시드 데이터 + UI/UX 개선 | ✅ 완료 | 목데이터 시딩, 프리미엄 UI |
| Phase 9 | 관리자 대시보드 전체 기능 | ✅ 완료 | 6개 관리 페이지 |
| Phase 10 | 크리에이터/광고주 전체 기능 체험 | ✅ 완료 | 5 테이블 시드 데이터 확장 |

## 현재 빌드 상태

| 항목 | 값 |
|------|-----|
| 페이지 | 38개 (P0: 26 + P1: 12) |
| API Route 파일 | 27개 |
| DB 테이블 | 12개 (P0: 5 + P1: 7) |
| 테스트 | 205개 (100% 통과) |
| TypeScript | strict 모드 통과 |

## 인프라 배포 현황

| 항목 | 상태 |
|------|------|
| Supabase 프로젝트 | `dcflztegvoyapufpumsc` (ap-northeast-2, Seoul) |
| DB 마이그레이션 | 001 (P0) + 002 (P1) 적용 완료, 12 테이블 |
| RLS 정책 | 전체 테이블 활성화 |
| Realtime | notifications, messages, chat_rooms 활성화 |
| Vercel 배포 | 프로덕션 배포 완료 |
| 환경변수 | SUPABASE_URL, ANON_KEY 설정 완료 |
| 미완료 | `SUPABASE_SERVICE_ROLE_KEY` 수동 설정 필요 |

---

## Phase 0: 프로젝트 셋업

### 산출물
- `CLAUDE.md` — 코딩 규칙 (9개 카테고리)
- `PRD.md` — 요구사항정의서 (F-001~F-019)
- `DESIGN.md` — 프리미엄 디자인 시스템
- `.claude/agents/` — 7개 서브 에이전트 정의

## Phase 1: PRD 분석 + 아키텍처 설계

### 산출물
- `docs/prd-analysis.md` — P0 기능 분석, 의존성 매트릭스
- `docs/architecture.md` — 3계층 아키텍처, SQL 스키마, RLS 정책, API 설계
- 프로젝트 초기화: package.json, tsconfig, tailwind, supabase 클라이언트
- `lib/types/` — 전체 타입 시스템
- `lib/validations/` — Zod 스키마 (8개)
- `lib/constants/` — 상수 (20개 카테고리, 플랫폼, 상태 라벨 등)

## Phase 2: 백엔드 구현 (P0)

### 3계층 아키텍처
```
app/api/ (13 route files, 17 handlers)
  ↓
lib/services/ (6 service files)
  ↓
lib/repositories/ (5 repository files)
```

### Repository 계층 (5개)
- `profile-repository.ts` — 프로필 CRUD
- `creator-repository.ts` — 크리에이터 CRUD + 필터링
- `brand-repository.ts` — 광고주 CRUD
- `campaign-repository.ts` — 캠페인 CRUD + 필터링
- `match-repository.ts` — 매칭 CRUD + 중복 체크

### Service 계층 (6개)
- `auth-service.ts` — 회원가입 (admin client), 로그인, 현재 사용자
- `creator-service.ts` — 온보딩, 목록, 상세, 프로필 수정
- `brand-service.ts` — 온보딩, 상세
- `campaign-service.ts` — 생성, 목록, 상세
- `match-service.ts` — 생성, 내 매칭, 상태 변경
- `admin-service.ts` — 통계 (Promise.all 병렬 쿼리)

### P0 API Routes (17 handlers)
| 경로 | 메서드 |
|------|--------|
| /api/health | GET |
| /api/auth/signup | POST |
| /api/auth/login | POST |
| /api/auth/me | GET |
| /api/creators | GET, POST |
| /api/creators/[id] | GET, PATCH |
| /api/brands | POST |
| /api/brands/[id] | GET |
| /api/campaigns | GET, POST |
| /api/campaigns/[id] | GET |
| /api/matches | GET, POST |
| /api/matches/[id] | PATCH |
| /api/admin/stats | GET |

### DB 마이그레이션
- `001_initial_schema.sql` — 5 테이블 (profiles, creators, brands, campaigns, matches) + RLS

## Phase 3: 프론트엔드 구현 (P0)

### 페이지 목록 (26개)
| 라우트 | 유형 | 설명 |
|--------|------|------|
| / | Static | 랜딩 페이지 (5 섹션) |
| /login | Static | 로그인 |
| /signup | Static | 회원가입 (역할 선택) |
| /creator/onboarding | Static | 크리에이터 온보딩 |
| /creator/dashboard | Static | 크리에이터 대시보드 |
| /creator/campaigns | Static | 캠페인 피드 |
| /creator/campaigns/[id] | Dynamic | 캠페인 상세 |
| /creator/deals | Static | 내 딜 목록 |
| /creator/deals/[id] | Dynamic | 딜 상세 |
| /creator/profile/edit | Static | 프로필 편집 |
| /brand/onboarding | Static | 광고주 온보딩 |
| /brand/dashboard | Static | 광고주 대시보드 |
| /brand/campaigns | Static | 내 캠페인 |
| /brand/campaigns/new | Static | 캠페인 등록 |
| /brand/campaigns/[id] | Dynamic | 캠페인 상세 |
| /brand/creators | Static | 인플루언서 검색 |
| /brand/creators/[id] | Dynamic | 크리에이터 상세 |
| /brand/deals | Static | 내 딜 |
| /brand/deals/[id] | Dynamic | 딜 상세 |
| /admin/dashboard | Static | 관리자 대시보드 |

### 컴포넌트 구조
- **UI (10개)**: Button, Input, Card, Badge, Skeleton, Label, Textarea, Select, Dialog, Avatar
- **Layout (3개)**: Header (스크롤 반응형), Footer, DashboardSidebar
- **Shared (3개)**: MotionWrapper (FadeIn, Stagger, HoverLift), LoadingSkeleton, EmptyState
- **Landing (5개)**: Hero, Features, Process, Testimonials, CTA
- **Features (5개)**: CampaignCard, CreatorCard, MatchCard, CategoryCheckboxGrid, CampaignFormFields

## Phase 4: 통합 + 테스트

### 테스트 결과
| 항목 | 값 |
|------|-----|
| 프레임워크 | Vitest 4.0.18 |
| 테스트 파일 | 4개 |
| 테스트 수 | 205개 |
| 통과율 | 100% |
| 실행 시간 | ~3.3초 |

### 테스트 커버리지 (핵심 파일)
| 파일 | Statements | Branches | Functions | Lines |
|------|-----------|----------|-----------|-------|
| lib/validations/index.ts | 100% | 100% | 100% | 100% |
| lib/utils/index.ts | 100% | 100% | 100% | 100% |
| lib/constants/index.ts | 100% | 100% | 100% | 100% |
| lib/utils/api-helpers.ts | 73% | 58% | 86% | 72% |

## Phase 5: 문서 + 배포 준비

### 산출물
- `README.md` — 프로젝트 설명, 시작 가이드, API 목록
- `docs/PROGRESS.md` — 본 문서

## Phase 6: Supabase + Vercel 배포

### Supabase
- 프로젝트 생성: `inflring` (ap-northeast-2, Seoul)
- 프로젝트 ID: `dcflztegvoyapufpumsc`
- `001_initial_schema.sql` 적용 → 5 P0 테이블 + RLS
- `002_p1_notifications_messages_reviews.sql` 적용 → 7 P1 테이블 + RLS + Realtime
- 총 12 테이블, 전체 RLS 활성화

### Vercel
- 프로덕션 배포 완료
- 프로덕션 URL: https://inflring.vercel.app
- GitHub 연동: https://github.com/yonghot/inflring (main 브랜치 → 자동 배포)
- 환경변수: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `NEXT_PUBLIC_APP_URL` 설정
- Node.js: 24.x

### 배포 이력

| 날짜 | 버전 | 내용 | 상태 |
|------|------|------|------|
| 2026-03-12 | v1.0.0 | P0+P1 전체 기능 프로덕션 배포 | ✅ Ready |

### 배포 구성
- **빌드**: Next.js 15 (App Router)
- **정적 페이지**: 26개 (○ Static)
- **동적 페이지**: 12개 (ƒ Dynamic)
- **서버리스 함수**: 자동 생성
- **GitHub 연동**: push to main → 자동 프로덕션 배포

## Phase 7: P1 기능 구현

### 추가 DB 마이그레이션
- `002_p1_notifications_messages_reviews.sql` — 7 테이블 + RLS + Realtime

| 테이블 | 설명 |
|--------|------|
| notifications | 알림 (매칭, 메시지, 리뷰, 계약 등) |
| chat_rooms | 채팅방 (매칭 당사자) |
| messages | 메시지 (텍스트, 파일, 이미지, 시스템) |
| contracts | 계약 (9단계 상태 머신, 쌍방 서명) |
| escrow | 에스크로 (계약 연동, 자동 생성/해제) |
| reviews | 리뷰 (1~5점, 소통/품질/시간 세부 점수) |
| file_uploads | 파일 업로드 (미디어킷, 계약첨부, 메시지첨부 등) |

### 추가 Repository 계층 (+5개 → 총 10개)
- `notification-repository.ts` — 알림 CRUD + 읽지 않은 수
- `chat-repository.ts` — 채팅방/메시지 CRUD + 페이지네이션
- `contract-repository.ts` — 계약 CRUD + 조인 쿼리
- `escrow-repository.ts` — 에스크로 CRUD
- `review-repository.ts` — 리뷰 CRUD + 평균 점수

### 추가 Service 계층 (+4개 → 총 10개)
- `notification-service.ts` — 페이지네이션, 읽음 처리, admin으로 생성
- `chat-service.ts` — getOrCreateRoom (당사자 검증), sendMessage
- `contract-service.ts` — 상태 머신 (VALID_STATUS_TRANSITIONS), 쌍방 서명 → active + 에스크로, 콘텐츠 제출, 수정 요청, 완료 처리
- `review-service.ts` — 완료 계약 검증, 중복 방지, 사용자별 리뷰

### 추가 P1 API Routes (+14개 → 총 27 route 파일)
| 경로 | 메서드 |
|------|--------|
| /api/notifications | GET |
| /api/notifications/[id] | PATCH |
| /api/notifications/read-all | POST |
| /api/chat/rooms | GET, POST |
| /api/chat/rooms/[roomId]/messages | GET, POST |
| /api/chat/rooms/[roomId]/read | POST |
| /api/contracts | GET, POST |
| /api/contracts/[id] | GET, PATCH |
| /api/contracts/[id]/submit | POST |
| /api/contracts/[id]/revision | POST |
| /api/contracts/[id]/complete | POST |
| /api/reviews | GET, POST |

### 추가 P1 페이지 (+12개 → 총 38개)
| 라우트 | 설명 |
|--------|------|
| /creator/messages | 크리에이터 채팅 |
| /creator/contracts | 크리에이터 계약 목록 |
| /creator/contracts/[id] | 크리에이터 계약 상세 |
| /creator/reviews | 크리에이터 리뷰 |
| /brand/messages | 광고주 채팅 |
| /brand/contracts | 광고주 계약 목록 |
| /brand/contracts/[id] | 광고주 계약 상세 |
| /brand/reviews | 광고주 리뷰 |

### 추가 P1 컴포넌트 (+8개)
- `notification-bell.tsx` — 벨 아이콘 + 읽지 않은 수 뱃지 + 드롭다운 (30초 폴링)
- `notification-list.tsx` — IntersectionObserver 무한 스크롤
- `chat-room-list.tsx` — 채팅방 목록 + 아바타 + 안 읽은 메시지 뱃지
- `chat-message-area.tsx` — 메시지 버블 + 낙관적 전송 + 5초 폴링 + 날짜 그룹
- `contract-card.tsx` — 상태 색상 뱃지 + KRW 포맷
- `contract-timeline.tsx` — 7단계 시각적 진행 표시기
- `review-form.tsx` — 별점 + 호버 + 세부 평점 + 코멘트
- `review-list.tsx` — 평균 점수 카드 + 개별 리뷰 카드

## 기술적 결정사항

| 결정 | 이유 |
|------|------|
| Route groups → 실제 경로 | Next.js route group 충돌 방지 |
| Supabase env fallback | 빌드 시 환경변수 없이도 정적 생성 가능 |
| Admin client for signup | RLS 우회하여 프로필 자동 생성 |
| Promise.all for admin stats | 병렬 쿼리로 응답 속도 최적화 |
| detectPlatform() 자동 감지 | 온보딩 UX 개선 |
| 계약 쌍방 서명 패턴 | signed_by_creator + signed_by_brand → 둘 다 true 시 active |
| 에스크로 자동 생성/해제 | 계약 서명 시 자동 생성, 완료 시 자동 released |
| 플랫폼 수수료 10% | Math.floor(amount * 0.1) 계산 |
| Vercel 프로젝트명 명시 | 한국어 경로명에서 --name 플래그로 우회 |

## MVP 범위 (P0+P1) vs 향후 구현 (P2+)

### P0 (구현 완료)
- 회원가입/로그인 (이메일)
- 역할 기반 온보딩 (크리에이터/광고주)
- 크리에이터 프로필 관리
- 캠페인 CRUD
- 매칭 시스템 (지원/제안/역제안)
- 관리자 대시보드
- 랜딩 페이지

### P1 (구현 완료)
- 알림 시스템 (폴링 기반, Realtime 테이블 준비)
- 인앱 채팅/메시징
- 계약 관리 (9단계 상태 머신 + 쌍방 서명)
- 에스크로 (계약 연동 자동 생성/해제)
- 리뷰 시스템 (5점 척도 + 세부 점수)
- 파일 업로드 스키마 (DB 준비, 프론트 미구현)

### P2 (미구현 — PROD-TODO)
- Supabase Realtime 실시간 구독 (현재 폴링)
- PG사 연동 에스크로 결제 (Toss Payments / PortOne)
- 이메일 알림
- 미디어킷 PDF 생성
- Rate Limiting
- AI 매칭 점수 고도화 (Claude API)
- 콘텐츠 검수 워크플로
- 성과 리포트 자동추적

---

## 방법론 마이그레이션 (2026-03-13)

### 현재 상태
- **구현된 기능**: P0 (11개 기능) + P1 (4개 기능) 전체 구현 완료
- **배포 URL**: https://inflring.vercel.app
- **기술 스택**: Next.js 15 (App Router) + TypeScript strict + Supabase + shadcn/ui + Tailwind CSS + Framer Motion
- **페이지**: 38개 (P0: 26 + P1: 12)
- **API Routes**: 27개 파일
- **DB 테이블**: 12개 (P0: 5 + P1: 7)
- **테스트**: 205개 (100% 통과, Vitest)

### 기술 결정
- **인증**: Supabase Auth (이메일/비밀번호), Admin client로 프로필 자동 생성
- **DB**: Supabase PostgreSQL (ap-northeast-2, Seoul) + RLS 전체 활성화
- **API 응답 포맷**: `{ success: boolean, data?: T, error?: string, meta?: object }`
- **아키텍처**: 3계층 (API Route → Service → Repository), 역방향 의존 금지
- **채팅**: 폴링 기반 (5초), Realtime 테이블 준비 완료
- **계약**: 9단계 상태 머신 + 쌍방 서명 + 에스크로 자동 생성/해제
- **플랫폼 수수료**: 10% (Math.floor)

### 알려진 이슈 / TODO
- `SUPABASE_SERVICE_ROLE_KEY` Vercel에 수동 설정 필요
- Supabase Realtime 실시간 구독 전환 (현재 폴링)
- PG사 연동 에스크로 결제 미구현
- AI 매칭/독소조항 감지 미구현 (Claude API)
- YouTube/Instagram API 실제 연동 미구현 (목업 데이터)
- Rate Limiting 미적용

## Phase 8: 시드 데이터 + UI/UX 개선 (2026-03-13)

### 시드 데이터 [PROD-TODO]
- `scripts/seed.ts` — Supabase Auth + 전체 테이블 시드 스크립트
- `npm run seed` — 원커맨드 실행
- 데모 계정: admin@admin.com / admin123!, user1-3@demo.com / demo123!
- 생성 데이터: 16 유저, 10 크리에이터, 5 브랜드, 15 캠페인, 20 매칭, 15 알림
- 상태 분포: 캠페인 (active 8, completed 3, paused 2, draft 1, cancelled 1), 매칭 (pending 4, viewed 3, accepted 5, rejected 2, negotiating 3, contracted 3)
- 한국어 현실적 텍스트, Unsplash 프로필 이미지, 3개월 범위 날짜 분포

### UI/UX 프리미엄 개선
- 랜딩 페이지 히어로 섹션 강화
- 카드/버튼/뱃지 컴포넌트 호버 인터랙션 개선
- 대시보드 페이지 시각적 개선
- 인증 페이지 디자인 개선
- Framer Motion 마이크로 인터랙션 추가

### 배포 이력
| 날짜 | 커밋 | 내용 |
|------|------|------|
| 2026-03-13 00:39 | b97aa9f | 시드 데이터 + 프리미엄 UI/UX (Phase 8) |
| 2026-03-13 08:15 | 478b657 | 인증 페이지 UI 개선 + 비밀번호 재설정 |

### 핫픽스: 로그인 불가 해결 (2026-03-13)

**증상**: admin@admin.com / admin123! 로그인 시 "이메일 또는 비밀번호가 올바르지 않습니다" 에러

**근본 원인**: `auth.users` 레코드가 raw SQL INSERT로 생성되어 `email_change` 등 string 컬럼이 NULL. GoTrue(Go)의 `sql.Scan`이 NULL→string 변환 불가로 `Database error querying schema` (500 에러) 발생. 비밀번호 문제가 아닌 GoTrue 스키마 읽기 자체가 실패.

**수정 내역**:
1. `auth.users`의 NULL string 컬럼 일괄 빈 문자열로 수정 (email_change, phone_change, tokens 등)
2. Supabase Admin API(`updateUserById`)로 비밀번호 정상 갱신
3. `scripts/seed.ts`: 기존 유저 발견 시 비밀번호 갱신 로직 추가
4. `scripts/seed.ts`: `.env.local` 플레이스홀더 검증 가드 추가
5. `CLAUDE.md` 9번 섹션: raw SQL INSERT 금지 규칙 추가

**재발 방지**: auth.users 조작은 반드시 Supabase Admin API 경유. raw SQL INSERT/UPDATE 금지.

---

## Phase 9: 관리자 대시보드 전체 기능 (P2)

### 구현 목적
관리자 계정 로그인 시 클라이언트가 플랫폼의 모든 기능을 목데이터로 즉시 체험할 수 있도록 관리 페이지 전체 구현.

### 데이터베이스 변경
- Supabase RLS 정책 4개 추가:
  - `creators_admin_read`: 관리자가 모든 크리에이터 조회 가능
  - `campaigns_admin_read`: 관리자가 모든 캠페인 조회 가능
  - `matches_admin_read`: 관리자가 모든 매칭 조회 가능
  - `contracts_admin_read`: 관리자가 모든 계약 조회 가능

### 백엔드 API (6개 엔드포인트)
| 엔드포인트 | 기능 | 필터 |
|-----------|------|------|
| GET /api/admin/users | 사용자 목록 | role |
| GET /api/admin/creators | 크리에이터 목록 | platform |
| GET /api/admin/campaigns | 캠페인 목록 | status |
| GET /api/admin/matches | 매칭 목록 | status |
| GET /api/admin/contracts | 계약 목록 | status |
| GET /api/admin/reviews | 리뷰 목록 | - |

- 3계층 구조 준수: route.ts → admin-service.ts → admin-repository.ts
- 페이지네이션 지원 (page, limit 쿼리 파라미터)
- 관리자 권한 검증 (role === 'admin')

### 프론트엔드 UI (6개 관리 페이지)
| 페이지 | 경로 | 주요 기능 |
|--------|------|----------|
| 사용자 관리 | /admin/users | 역할별 필터, 신뢰도 점수 표시 |
| 크리에이터 관리 | /admin/creators | 플랫폼별 필터, 구독자/참여율 표시 |
| 캠페인 관리 | /admin/campaigns | 상태별 필터, 예산/플랫폼 표시 |
| 매칭 관리 | /admin/matches | 상태별 필터, 매칭점수/방향 표시 |
| 계약 관리 | /admin/contracts | 상태별 필터, 서명상태/금액 표시 |
| 리뷰 관리 | /admin/reviews | 별점/세부점수 시각화 |

- 사이드바 메뉴 1개 → 7개로 확장
- 검색바, 필터 드롭다운, 로딩 스켈레톤, 빈 상태 컴포넌트 적용
- FadeIn/StaggerContainer 애니메이션 적용

### 파일 변경 내역
- 신규: `lib/repositories/admin-repository.ts`
- 수정: `lib/services/admin-service.ts` (6개 함수 추가)
- 신규: `app/api/admin/{users,creators,campaigns,matches,contracts,reviews}/route.ts` (6개)
- 수정: `app/admin/layout.tsx` (사이드바 메뉴 확장)
- 신규: `app/admin/{users,creators,campaigns,matches,contracts,reviews}/page.tsx` (6개)
- 수정: `docs/architecture.md` (P2 섹션 추가)

### 배포 이력
| 날짜 | 커밋 | 내용 |
|------|------|------|
| 2026-03-13 08:55 | aa5dfc6 | 관리자 대시보드 전체 기능 (Phase 9) — Vercel 프로덕션 배포 완료 |

---

## Phase 10: 크리에이터/광고주 전체 기능 체험 시드 데이터 (P2)

### 구현 목적
크리에이터(user1@demo.com)와 광고주(user2@demo.com) 계정으로 로그인 시 계약, 채팅, 리뷰, 에스크로 등 모든 기능을 목데이터로 즉시 체험할 수 있도록 시드 데이터 확장.

### 문제 분석
- 모든 19개 크리에이터/광고주 페이지가 이미 완전 구현됨
- DB 테이블 5개(contracts, chat_rooms, messages, reviews, escrow)에 데이터 0건
- 프론트엔드/API 변경 불필요 — 시드 데이터만 추가하면 전체 기능 체험 가능

### 추가된 시드 데이터
| 테이블 | 건수 | 내용 |
|--------|------|------|
| contracts | 5건 | completed(2), content_submitted(1), active(2) |
| chat_rooms | 5건 | 계약별 1:1 채팅방 |
| messages | 24건 | 채팅방당 4~6건, 한국어 현실적 대화 |
| escrow | 3건 | released(2), held(1) |
| reviews | 4건 | 완료 계약 양방향 리뷰 |

### 데이터 관계 매핑
- `MATCH_IDS[17~19, 8, 11]` → 5개 계약
- 각 계약 → 1:1 채팅방 (match_id 기반)
- 완료 계약 2건 → 양방향 리뷰 4건
- 완료 계약 2건 → 에스크로 released 2건, 콘텐츠 제출 계약 → held 1건

### 파일 변경
- 수정: `scripts/seed.ts` (Step 8~12 함수 5개 추가, UUID 상수 추가)
- 수정: `docs/architecture.md` (Phase 10 설계 섹션 추가)

### 체험 시나리오
- **크리에이터** (user1@demo.com / demo123!): 계약 목록/상세, 채팅, 리뷰 확인
- **광고주** (user2@demo.com / demo123!): 계약 관리, 채팅, 리뷰 확인, 에스크로 현황

### 배포 이력
| 날짜 | 커밋 | 내용 |
|------|------|------|

---

### 다음 작업 후보
1. Supabase Realtime 채팅 전환 (폴링 → 실시간)
2. 파일 업로드 프론트엔드 구현 (DB 스키마 준비 완료)
3. 에스크로 PG사 연동 (Toss Payments)
4. AI 매칭 엔진 (Claude API)
5. 미디어킷 PDF 자동 생성
