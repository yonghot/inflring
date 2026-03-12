# 인플링 (Inflring)

> 인플루언서 광고 매칭 플랫폼 — "광고가 울리는 순간"

인플루언서가 MCN 전속 없이 광고 건별로 직접 계약하는 양면 마켓플레이스.

## 기술 스택

| 영역 | 기술 |
|------|------|
| 프레임워크 | Next.js 15 (App Router) |
| 언어 | TypeScript (strict) |
| DB/Auth | Supabase (PostgreSQL + Auth + RLS) |
| UI | shadcn/ui + Tailwind CSS |
| 유효성 검사 | Zod |
| 애니메이션 | Framer Motion |
| 아이콘 | Lucide React |
| 테스트 | Vitest |

## 아키텍처

```
app/api/        (27 route files — HTTP 핸들링, Zod 검증)
  ↓
lib/services/   (10 service files — 비즈니스 로직)
  ↓
lib/repositories/ (10 repository files — Supabase 접근)
```

## 시작하기

### 사전 요구사항

- Node.js 18+
- npm
- Supabase 프로젝트 (PostgreSQL)

### 설치

```bash
npm install
```

### 환경 변수 설정

`.env.example`을 `.env.local`로 복사하고 Supabase 정보를 입력하세요:

```bash
cp .env.example .env.local
```

필수 환경 변수:
- `NEXT_PUBLIC_SUPABASE_URL` — Supabase 프로젝트 URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` — Supabase anon key
- `SUPABASE_SERVICE_ROLE_KEY` — Supabase service role key

### 데이터베이스 마이그레이션

`supabase/migrations/001_initial_schema.sql`을 Supabase SQL Editor에서 실행하세요.

### 시드 데이터 (데모용) [PROD-TODO]

```bash
npm run seed
```

시드 실행 시 아래 데모 계정과 목데이터가 생성됩니다:

| 계정 | 비밀번호 | 역할 | 설명 |
|------|----------|------|------|
| admin@admin.com | admin123! | 관리자 | 전체 권한 |
| user1@demo.com | demo123! | 크리에이터 | 활발한 사용자 (데이터 다수) |
| user2@demo.com | demo123! | 광고주 | 일반 사용자 |
| user3@demo.com | demo123! | 크리에이터 | 신규 사용자 (데이터 소수) |

생성되는 데이터: 16 유저, 10 크리에이터, 5 브랜드, 15 캠페인, 20 매칭, 15 알림

> **주의**: `.env.local`에 `SUPABASE_SERVICE_ROLE_KEY`가 설정되어 있어야 시드가 정상 동작합니다.

### 개발 서버

```bash
npm run dev
```

http://localhost:3000 에서 확인하세요.

### 빌드

```bash
npm run build
```

### 테스트

```bash
npm test
```

## 디렉토리 구조

```
app/
  (auth)/          인증 (로그인/회원가입)
  api/             API Routes (27 route files)
  creator/         크리에이터 대시보드
  brand/           광고주 대시보드
  admin/           관리자 대시보드
components/
  ui/              shadcn/ui 기반 UI 컴포넌트
  layout/          Header, Footer, Sidebar
  shared/          공용 컴포넌트
  features/        기능별 컴포넌트
  landing/         랜딩 페이지 섹션
lib/
  repositories/    데이터 접근 계층
  services/        비즈니스 로직 계층
  supabase/        Supabase 클라이언트
  types/           TypeScript 타입
  validations/     Zod 스키마
  constants/       상수
  utils/           유틸리티
hooks/             커스텀 훅
docs/              문서
__tests__/         단위 테스트
```

## API Endpoints

### P0 — 핵심 (17 handlers)

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
| POST | /api/matches | 매칭 생성 |
| GET | /api/matches | 내 매칭 목록 |
| PATCH | /api/matches/[id] | 매칭 상태 변경 |
| GET | /api/admin/stats | 관리자 통계 |

### P1 — 알림, 채팅, 계약, 리뷰

| 메서드 | 경로 | 설명 |
|--------|------|------|
| GET | /api/notifications | 알림 목록 |
| PATCH | /api/notifications/[id] | 알림 읽음 처리 |
| POST | /api/notifications/read-all | 전체 읽음 |
| GET, POST | /api/chat/rooms | 채팅방 목록/생성 |
| GET, POST | /api/chat/rooms/[roomId]/messages | 메시지 조회/전송 |
| POST | /api/chat/rooms/[roomId]/read | 메시지 읽음 |
| GET, POST | /api/contracts | 계약 목록/생성 |
| GET, PATCH | /api/contracts/[id] | 계약 상세/상태변경 |
| POST | /api/contracts/[id]/submit | 콘텐츠 제출 |
| POST | /api/contracts/[id]/revision | 수정 요청 |
| POST | /api/contracts/[id]/complete | 계약 완료 |
| GET, POST | /api/reviews | 리뷰 조회/작성 |

## 사용자 역할

- **크리에이터**: 채널 등록 → 캠페인 피드 탐색 → 지원/역제안 → 계약/채팅/리뷰
- **광고주**: 캠페인 등록 → 인플루언서 검색 → 제안/매칭 → 계약/채팅/리뷰
- **관리자**: 플랫폼 통계 확인, 사용자 관리

## 데이터베이스 (12 테이블)

| 테이블 | 설명 |
|--------|------|
| profiles | 사용자 프로필 (auth.users FK) |
| creators | 크리에이터 채널 정보 |
| brands | 광고주 회사 정보 |
| campaigns | 캠페인 브리프 |
| matches | 매칭 (지원/제안/역제안) |
| notifications | 알림 |
| chat_rooms | 채팅방 |
| messages | 메시지 |
| contracts | 계약 (9단계 상태 머신) |
| escrow | 에스크로 |
| reviews | 리뷰/평점 |
| file_uploads | 파일 업로드 |

## 문서

- [PRD (요구사항)](./PRD.md)
- [아키텍처](./docs/architecture.md)
- [디자인 시스템](./DESIGN.md)
- [통합 리포트](./docs/integration-report.md)
- [테스트 리포트](./docs/test-report.md)

## 라이선스

Private
