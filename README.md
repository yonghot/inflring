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
app/api/        (HTTP 핸들링, Zod 검증)
  ↓
lib/services/   (비즈니스 로직)
  ↓
lib/repositories/ (Supabase 접근)
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
  api/             API Routes (15 endpoints)
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

## 사용자 역할

- **크리에이터**: 채널 등록 → 캠페인 피드 탐색 → 지원/역제안
- **광고주**: 캠페인 등록 → 인플루언서 검색 → 제안/매칭
- **관리자**: 플랫폼 통계 확인, 사용자 관리

## 문서

- [PRD (요구사항)](./PRD.md)
- [아키텍처](./docs/architecture.md)
- [디자인 시스템](./DESIGN.md)
- [통합 리포트](./docs/integration-report.md)
- [테스트 리포트](./docs/test-report.md)

## 라이선스

Private
