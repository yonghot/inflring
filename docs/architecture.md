# 인플링 (Inflring) — 아키텍처 문서

## 기술 스택 및 근거

| 영역 | 기술 | 근거 |
|------|------|------|
| 프레임워크 | Next.js 15 (App Router) | SSR/SSG 지원, 파일 기반 라우팅, API Routes 내장 |
| 언어 | TypeScript (strict) | 타입 안전성, 개발자 경험, 리팩토링 안정성 |
| DB/Auth | Supabase | PostgreSQL + Auth + RLS + Realtime 통합, 빠른 개발 |
| UI | shadcn/ui + Tailwind CSS | 접근성(Radix), 커스터마이징 자유도, 빠른 개발 |
| 유효성 검사 | Zod | TypeScript 네이티브, 런타임 검증, 스키마 추론 |
| 애니메이션 | Framer Motion | React 최적화, 선언적 API, 성능 |
| 아이콘 | Lucide React | 경량, 일관된 스타일, tree-shaking |
| 배포 | Vercel | Next.js 최적화, Edge Functions, 글로벌 CDN |

## 3계층 아키텍처

```
app/api/ (HTTP 핸들링)
  ↓ 호출
lib/services/ (비즈니스 로직)
  ↓ 호출
lib/repositories/ (Supabase 접근)
```

- **API Route**: 요청 파싱, 인증 확인, Zod 검증, 서비스 호출, 응답 포맷팅.
- **Service**: 비즈니스 규칙 적용, 데이터 변환, 복수 리포지토리 조합.
- **Repository**: Supabase 쿼리 실행, CRUD 연산. 순수 데이터 접근.
- **역방향 의존 금지**: Repository → Service 또는 Service → API Route 참조 금지.

## 데이터 모델

### P0 테이블 (MVP)

```sql
-- 사용자
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  role TEXT NOT NULL CHECK (role IN ('creator', 'brand', 'admin')),
  display_name TEXT NOT NULL,
  email TEXT NOT NULL,
  avatar_url TEXT,
  trust_score DECIMAL(3,1) DEFAULT 36.5,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 크리에이터
CREATE TABLE creators (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  channel_name TEXT NOT NULL,
  channel_url TEXT NOT NULL,
  platform TEXT NOT NULL CHECK (platform IN ('youtube', 'instagram', 'tiktok', 'naver_blog')),
  subscribers INTEGER DEFAULT 0,
  avg_views INTEGER DEFAULT 0,
  engagement_rate DECIMAL(5,2) DEFAULT 0,
  content_category TEXT[],
  audience_demographics JSONB,
  top_videos JSONB,
  is_available BOOLEAN DEFAULT true,
  min_price INTEGER,
  max_price INTEGER,
  preferred_categories TEXT[],
  blocked_categories TEXT[],
  max_monthly_deals INTEGER DEFAULT 3,
  max_revisions INTEGER DEFAULT 1,
  thumbnail_autonomy BOOLEAN DEFAULT true,
  title_autonomy BOOLEAN DEFAULT true,
  media_kit_url TEXT,
  total_deals INTEGER DEFAULT 0,
  total_revenue BIGINT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 광고주
CREATE TABLE brands (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  company_name TEXT NOT NULL,
  business_category TEXT NOT NULL,
  contact_name TEXT NOT NULL,
  contact_email TEXT NOT NULL,
  contact_phone TEXT,
  website_url TEXT,
  total_deals INTEGER DEFAULT 0,
  total_spend BIGINT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 캠페인
CREATE TABLE campaigns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  brand_id UUID REFERENCES brands(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  content_type TEXT NOT NULL CHECK (content_type IN ('branded', 'ppl', 'review', 'unboxing', 'shorts', 'other')),
  target_platform TEXT NOT NULL CHECK (target_platform IN ('youtube', 'instagram', 'tiktok', 'naver_blog', 'multi')),
  target_categories TEXT[],
  min_subscribers INTEGER,
  max_subscribers INTEGER,
  target_audience_age TEXT[],
  target_audience_gender TEXT,
  budget_min INTEGER NOT NULL,
  budget_max INTEGER NOT NULL,
  campaign_start DATE,
  campaign_end DATE,
  content_deadline DATE,
  requirements TEXT,
  max_revisions INTEGER DEFAULT 1,
  status TEXT DEFAULT 'active' CHECK (status IN ('draft', 'active', 'paused', 'completed', 'cancelled')),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 매칭
CREATE TABLE matches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id UUID REFERENCES campaigns(id) ON DELETE CASCADE,
  creator_id UUID REFERENCES creators(id) ON DELETE CASCADE,
  match_score DECIMAL(5,2),
  match_reasons JSONB,
  direction TEXT NOT NULL CHECK (direction IN ('campaign_to_creator', 'creator_apply', 'creator_reverse_pitch', 'brand_direct_offer')),
  reverse_pitch_message TEXT,
  reverse_pitch_portfolio JSONB,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'viewed', 'accepted', 'rejected', 'negotiating', 'contracted')),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(campaign_id, creator_id)
);
```

### RLS 정책
```sql
-- profiles
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "profiles_public_read" ON profiles FOR SELECT USING (true);
CREATE POLICY "profiles_self_update" ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "profiles_self_insert" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- creators
ALTER TABLE creators ENABLE ROW LEVEL SECURITY;
CREATE POLICY "creators_public_read" ON creators FOR SELECT USING (is_available = true OR profile_id = auth.uid());
CREATE POLICY "creators_self_all" ON creators FOR ALL USING (profile_id = auth.uid());

-- brands
ALTER TABLE brands ENABLE ROW LEVEL SECURITY;
CREATE POLICY "brands_public_read" ON brands FOR SELECT USING (true);
CREATE POLICY "brands_self_all" ON brands FOR ALL USING (profile_id = auth.uid());

-- campaigns
ALTER TABLE campaigns ENABLE ROW LEVEL SECURITY;
CREATE POLICY "campaigns_public_read" ON campaigns FOR SELECT USING (status = 'active' OR brand_id IN (SELECT id FROM brands WHERE profile_id = auth.uid()));
CREATE POLICY "campaigns_brand_all" ON campaigns FOR ALL USING (brand_id IN (SELECT id FROM brands WHERE profile_id = auth.uid()));

-- matches
ALTER TABLE matches ENABLE ROW LEVEL SECURITY;
CREATE POLICY "matches_party_access" ON matches FOR ALL USING (
  creator_id IN (SELECT id FROM creators WHERE profile_id = auth.uid()) OR
  campaign_id IN (SELECT c.id FROM campaigns c JOIN brands b ON c.brand_id = b.id WHERE b.profile_id = auth.uid())
);
```

## API 설계

### 응답 표준
```typescript
interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  meta?: { total?: number; page?: number; limit?: number };
}
```

### P0 엔드포인트 (17 handlers)

| 메서드 | 경로 | 설명 | 인증 |
|--------|------|------|------|
| GET | /api/health | 헬스체크 | 불필요 |
| POST | /api/auth/signup | 회원가입 | 불필요 |
| POST | /api/auth/login | 로그인 | 불필요 |
| GET | /api/auth/me | 현재 사용자 정보 | 필요 |
| POST | /api/creators | 크리에이터 등록 | 필요 |
| GET | /api/creators | 크리에이터 목록 (필터) | 불필요 |
| GET | /api/creators/[id] | 크리에이터 상세 | 불필요 |
| PATCH | /api/creators/[id] | 크리에이터 수정 | 필요 (본인) |
| POST | /api/brands | 광고주 등록 | 필요 |
| GET | /api/brands/[id] | 광고주 상세 | 불필요 |
| POST | /api/campaigns | 캠페인 등록 | 필요 |
| GET | /api/campaigns | 캠페인 목록 | 불필요 |
| GET | /api/campaigns/[id] | 캠페인 상세 | 불필요 |
| POST | /api/matches | 매칭 생성 | 필요 |
| GET | /api/matches | 내 매칭 목록 | 필요 |
| PATCH | /api/matches/[id] | 매칭 상태 변경 | 필요 |
| GET | /api/admin/stats | 관리자 통계 | 필요 (admin) |

### P1 엔드포인트 (추가)

| 메서드 | 경로 | 설명 | 인증 |
|--------|------|------|------|
| GET | /api/notifications | 알림 목록 (페이지네이션) | 필요 |
| PATCH | /api/notifications/[id] | 알림 읽음 처리 | 필요 |
| POST | /api/notifications/read-all | 전체 읽음 처리 | 필요 |
| GET | /api/chat/rooms | 채팅방 목록 | 필요 |
| POST | /api/chat/rooms | 채팅방 생성/조회 | 필요 |
| GET | /api/chat/rooms/[roomId]/messages | 메시지 목록 (페이지네이션) | 필요 |
| POST | /api/chat/rooms/[roomId]/messages | 메시지 전송 | 필요 |
| POST | /api/chat/rooms/[roomId]/read | 메시지 읽음 처리 | 필요 |
| GET | /api/contracts | 계약 목록 | 필요 |
| POST | /api/contracts | 계약 생성 | 필요 |
| GET | /api/contracts/[id] | 계약 상세 | 필요 |
| PATCH | /api/contracts/[id] | 계약 상태 변경 (서명 등) | 필요 |
| POST | /api/contracts/[id]/submit | 콘텐츠 제출 | 필요 |
| POST | /api/contracts/[id]/revision | 수정 요청 | 필요 |
| POST | /api/contracts/[id]/complete | 계약 완료 (에스크로 해제) | 필요 |
| GET | /api/reviews | 리뷰 목록 | 필요 |
| POST | /api/reviews | 리뷰 작성 | 필요 |

## P1 데이터 모델

### P1 테이블

```sql
-- 알림
CREATE TABLE notifications (
  id UUID PRIMARY KEY, user_id UUID REFERENCES profiles(id),
  type TEXT, title TEXT, body TEXT, data JSONB, is_read BOOLEAN
);

-- 채팅방
CREATE TABLE chat_rooms (
  id UUID PRIMARY KEY, match_id UUID REFERENCES matches(id),
  creator_id UUID, brand_id UUID, last_message_at TIMESTAMPTZ
);

-- 메시지
CREATE TABLE messages (
  id UUID PRIMARY KEY, room_id UUID REFERENCES chat_rooms(id),
  sender_id UUID, content TEXT, message_type TEXT, file_url TEXT, is_read BOOLEAN
);

-- 계약 (9단계 상태 머신)
CREATE TABLE contracts (
  id UUID PRIMARY KEY, match_id UUID REFERENCES matches(id),
  creator_id UUID, brand_id UUID, amount INTEGER, platform_fee INTEGER,
  status TEXT, -- draft→pending_creator→pending_brand→active→content_submitted→revision_requested→completed|cancelled|disputed
  signed_by_creator BOOLEAN, signed_by_brand BOOLEAN
);

-- 에스크로
CREATE TABLE escrow (
  id UUID PRIMARY KEY, contract_id UUID REFERENCES contracts(id),
  amount INTEGER, platform_fee INTEGER,
  status TEXT -- pending→held→released|refunded|disputed
);

-- 리뷰
CREATE TABLE reviews (
  id UUID PRIMARY KEY, contract_id UUID REFERENCES contracts(id),
  reviewer_id UUID, reviewee_id UUID,
  rating INTEGER(1-5), communication_score, quality_score, timeliness_score,
  UNIQUE(contract_id, reviewer_id)
);

-- 파일 업로드
CREATE TABLE file_uploads (
  id UUID PRIMARY KEY, user_id UUID, file_name TEXT, file_url TEXT,
  context TEXT -- media_kit, contract_attachment, message_attachment, content_delivery, profile_avatar
);
```

### P1 RLS 정책
- notifications: 본인 읽기/수정
- chat_rooms, messages: 당사자(creator_id/brand_id)만 접근
- contracts, escrow: 당사자만 접근
- reviews: 공개 리뷰 읽기, 본인 작성
- file_uploads: 본인 전체, 미디어킷/아바타 공개 읽기

## 디렉토리 구조
PRD.md 2-9 참조.

## [PROD-TODO]
PRD.md 2-11 참조.

---

## 관리자 대시보드 (P2)

### 목적

관리자가 플랫폼의 모든 데이터를 읽기 전용으로 조회하여 클라이언트 데모 체험을 지원한다.
서비스 역할 키(service_role_key) 없이 서버사이드 Supabase 클라이언트(`createServerSupabaseClient`)를 사용하며, RLS 정책이 admin을 허용하도록 DB 정책을 추가하는 방식으로 구현한다.

### RLS 정책 추가 (admin 전체 조회 허용)

서버사이드 클라이언트는 `auth.uid()`로 로그인한 admin 유저를 식별한다. 현재 RLS 정책 중 admin 조회를 막는 테이블에 아래 정책을 추가해야 한다.

```sql
-- creators: is_available = false인 레코드도 admin이 볼 수 있도록
CREATE POLICY "creators_admin_read" ON creators
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- campaigns: draft/paused/cancelled 등 비공개 상태도 admin이 볼 수 있도록
CREATE POLICY "campaigns_admin_read" ON campaigns
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- matches: 당사자가 아닌 admin도 전체 조회 가능하도록
CREATE POLICY "matches_admin_read" ON matches
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- contracts: 당사자가 아닌 admin도 전체 조회 가능하도록
CREATE POLICY "contracts_admin_read" ON contracts
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- reviews: 이미 공개 읽기 정책 있으므로 추가 불필요
-- notifications, messages: admin 조회 불필요 (개인정보 보호)
```

### API 엔드포인트 (P2 추가)

모든 엔드포인트는 `role = 'admin'` 인증 확인 후 응답한다.
페이지네이션 파라미터: `?page=1&limit=20` (기본값).
필터 파라미터는 각 엔드포인트에 명시.

| 메서드 | 경로 | 설명 | 쿼리 파라미터 |
|--------|------|------|---------------|
| GET | /api/admin/stats | 통계 요약 (기존) | - |
| GET | /api/admin/users | 전체 사용자 목록 | `role`, `page`, `limit` |
| GET | /api/admin/creators | 전체 크리에이터 목록 | `platform`, `page`, `limit` |
| GET | /api/admin/campaigns | 전체 캠페인 목록 | `status`, `page`, `limit` |
| GET | /api/admin/matches | 전체 매칭 목록 | `status`, `page`, `limit` |
| GET | /api/admin/contracts | 전체 계약 목록 | `status`, `page`, `limit` |
| GET | /api/admin/reviews | 전체 리뷰 목록 | `page`, `limit` |

#### 응답 스키마 예시

```typescript
// GET /api/admin/users
{
  success: true,
  data: Array<{
    id: string;
    role: 'creator' | 'brand' | 'admin';
    display_name: string;
    email: string;
    avatar_url: string | null;
    trust_score: number;
    created_at: string;
  }>,
  meta: { total: number; page: number; limit: number }
}

// GET /api/admin/creators
{
  success: true,
  data: Array<{
    id: string;
    channel_name: string;
    platform: string;
    subscribers: number;
    engagement_rate: number;
    is_available: boolean;
    profile: { display_name: string; email: string; avatar_url: string | null };
  }>,
  meta: { total: number; page: number; limit: number }
}

// GET /api/admin/campaigns
{
  success: true,
  data: Array<{
    id: string;
    title: string;
    status: string;
    budget_min: number;
    budget_max: number;
    target_platform: string;
    created_at: string;
    brand: { company_name: string };
  }>,
  meta: { total: number; page: number; limit: number }
}

// GET /api/admin/matches
{
  success: true,
  data: Array<{
    id: string;
    status: string;
    direction: string;
    match_score: number | null;
    created_at: string;
    campaign: { title: string };
    creator: { channel_name: string };
  }>,
  meta: { total: number; page: number; limit: number }
}

// GET /api/admin/contracts
{
  success: true,
  data: Array<{
    id: string;
    status: string;
    amount: number;
    platform_fee: number;
    signed_by_creator: boolean;
    signed_by_brand: boolean;
    created_at: string;
  }>,
  meta: { total: number; page: number; limit: number }
}

// GET /api/admin/reviews
{
  success: true,
  data: Array<{
    id: string;
    rating: number;
    communication_score: number;
    quality_score: number;
    timeliness_score: number;
    comment: string | null;
    created_at: string;
    reviewer: { display_name: string };
    reviewee: { display_name: string };
  }>,
  meta: { total: number; page: number; limit: number }
}
```

### 3계층 파일 구조

```
app/api/admin/
  stats/route.ts          (기존)
  users/route.ts          (신규)
  creators/route.ts       (신규)
  campaigns/route.ts      (신규)
  matches/route.ts        (신규)
  contracts/route.ts      (신규)
  reviews/route.ts        (신규)

lib/services/
  admin-service.ts        (기존 getStats + 신규 함수 추가)
    getUsers(supabase, filters)
    getCreators(supabase, filters)
    getCampaigns(supabase, filters)
    getMatches(supabase, filters)
    getContracts(supabase, filters)
    getReviews(supabase, filters)

lib/repositories/
  admin-repository.ts     (신규: admin 전용 읽기 쿼리)
    listUsers(supabase, role?, page, limit)
    listCreators(supabase, platform?, page, limit)
    listCampaigns(supabase, status?, page, limit)
    listMatches(supabase, status?, page, limit)
    listContracts(supabase, status?, page, limit)
    listReviews(supabase, page, limit)

app/admin/
  layout.tsx              (기존 — 사이드바 메뉴 7개로 확장)
  dashboard/page.tsx      (기존)
  users/page.tsx          (신규)
  creators/page.tsx       (신규)
  campaigns/page.tsx      (신규)
  matches/page.tsx        (신규)
  contracts/page.tsx      (신규)
  reviews/page.tsx        (신규)
```

### 사이드바 메뉴 (layout.tsx 수정)

```typescript
import {
  LayoutDashboard, Users, UserCheck, Megaphone,
  GitMerge, FileText, Star,
} from 'lucide-react';

const ADMIN_MENU: SidebarMenuItem[] = [
  { href: '/admin/dashboard',  label: '대시보드',      icon: LayoutDashboard },
  { href: '/admin/users',      label: '사용자 관리',   icon: Users },
  { href: '/admin/creators',   label: '크리에이터 관리', icon: UserCheck },
  { href: '/admin/campaigns',  label: '캠페인 관리',   icon: Megaphone },
  { href: '/admin/matches',    label: '매칭 관리',     icon: GitMerge },
  { href: '/admin/contracts',  label: '계약 관리',     icon: FileText },
  { href: '/admin/reviews',    label: '리뷰 관리',     icon: Star },
];
```

### 페이지 UI 패턴

모든 관리자 목록 페이지는 동일한 구조를 따른다.

```
페이지 헤더 (제목 + 총 건수 배지)
  ↓
필터 바 (shadcn/ui Select — 역할/상태/플랫폼 필터)
  ↓
데이터 테이블 (shadcn/ui Table — 정렬 없음, 읽기 전용)
  ↓
페이지네이션 (이전 / 페이지 번호 / 다음)
```

- 로딩 상태: shadcn/ui Skeleton 컴포넌트 사용.
- 빈 상태: "데이터가 없습니다" 안내 텍스트 표시.
- 에러 상태: `error?.message` 텍스트 표시.
- 데이터 패칭: `useEffect` + `fetch` (서버 컴포넌트 전환 고려 불필요, 기존 패턴 유지).

### 인증 흐름

API Route에서 기존 `getAuthenticatedUser` 유틸을 재사용한다.

```typescript
// 모든 /api/admin/* 라우트 공통 패턴
const supabase = await createServerSupabaseClient();
const { profile } = await getAuthenticatedUser(supabase);
if (profile.role !== 'admin') {
  return errorResponse('관리자 권한이 필요합니다', 403);
}
```

### [PROD-TODO] P2

- [ ] Supabase 대시보드에서 위 RLS 정책 6개 적용 (SQL Editor 실행).
- [ ] `admin-repository.ts` 작성 — 6개 listXxx 함수.
- [ ] `admin-service.ts` 확장 — 6개 getXxx 함수.
- [ ] `app/api/admin/` 하위 6개 route.ts 작성.
- [ ] `app/admin/layout.tsx` 사이드바 메뉴 7개로 교체.
- [ ] `app/admin/` 하위 6개 page.tsx 작성 (테이블 + 필터 + 페이지네이션).
- [ ] 페이지네이션 공용 컴포넌트 `components/ui/admin-pagination.tsx` 추출 (3곳 이상 사용 시).
- [ ] E2E: admin 계정으로 각 페이지 접근 및 데이터 렌더링 확인.
