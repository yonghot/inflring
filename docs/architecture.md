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

---

## Phase 10: 크리에이터/광고주 전체 기능 체험 시드 데이터 (P2)

### 목적

contracts, chat_rooms, messages, reviews, escrow 테이블이 현재 0 rows 상태다.
데모 계정 로그인 시 채팅, 계약, 리뷰, 에스크로 기능을 즉시 체험할 수 있도록 시드 데이터를 추가한다.

---

### 추가할 시드 데이터 계획

| 테이블 | 추가 건수 | 상태 분포 |
|--------|-----------|-----------|
| contracts | 5개 | active 2, content_submitted 1, completed 2 |
| chat_rooms | 5개 | accepted 2 + contracted 3 매칭에 대응 |
| messages | 25개 | 채팅방당 4~6개 (text/system 혼합) |
| reviews | 4개 | completed 계약 2건 × 쌍방 리뷰 |
| escrow | 3개 | held 1, released 2 |

---

### 데이터 관계 매핑

contracted 매칭 3건 → 계약으로 전환, 채팅방 생성:

| match | 캠페인 | 크리에이터 | 광고주 | contract 상태 | escrow 상태 |
|-------|--------|-----------|--------|--------------|-------------|
| MATCH_IDS[17] | CAMP_9 겨울 보습 크림 | C_11 서유나 | B_13 | completed | released |
| MATCH_IDS[18] | CAMP_10 블루투스 스피커 | C_USER3 박지우 | B_14 | completed | released |
| MATCH_IDS[19] | CAMP_11 소셜미디어 관리 | C_10 윤재호 | B_USER2 | content_submitted | held |

accepted 매칭 2건 → 채팅방 생성 (계약 없음, 협상 중):

| match | 캠페인 | 크리에이터 | 광고주 | contract 상태 |
|-------|--------|-----------|--------|--------------|
| MATCH_IDS[8] | CAMP_9 겨울 보습 | C_USER1 김수진 | B_13 | active |
| MATCH_IDS[11] | CAMP_8 가을 트렌치코트 | C_9 강다은 | B_16 | active |

completed 계약 2건 → 쌍방 리뷰 생성:

| contract | 리뷰어 | 피리뷰어 | 평점 |
|----------|--------|---------|------|
| MATCH_IDS[17] 계약 | B_13 (광고주) → C_11 (크리에이터) | 5점 | is_public=true |
| MATCH_IDS[17] 계약 | C_11 (크리에이터) → B_13 (광고주) | 4점 | is_public=true |
| MATCH_IDS[18] 계약 | B_14 (광고주) → C_USER3 (크리에이터) | 5점 | is_public=true |
| MATCH_IDS[18] 계약 | C_USER3 (크리에이터) → B_14 (광고주) | 5점 | is_public=true |

---

### 시드 함수 설계 (seed.ts Step 8~12)

기존 seed.ts는 Step 1(사용자)~Step 7(알림)까지 구현되어 있다.
아래 Step 8~12를 `seedContracts`, `seedChatRooms`, `seedMessages`, `seedEscrow`, `seedReviews` 함수로 추가한다.

#### Step 8: seedContracts

```typescript
async function seedContracts(
  matchIds: string[],         // MATCH_IDS[17,18,19,8,11]
  creatorProfileIds: Record<string, string>,  // C_USER1, C_USER3, C_9, C_10, C_11 의 profile_id
  brandProfileIds: Record<string, string>,    // B_USER2, B_13, B_14, B_16 의 profile_id
): Promise<Record<string, string>>            // match_id → contract_id 맵 반환
```

삽입 데이터 상세:

| match | amount | platform_fee | status | signed_by_creator | signed_by_brand | signed_at | completed_at |
|-------|--------|-------------|--------|------------------|----------------|-----------|--------------|
| MATCH_IDS[17] | 1_500_000 | 150_000 | completed | true | true | now()-35d | now()-5d |
| MATCH_IDS[18] | 800_000 | 80_000 | completed | true | true | now()-28d | now()-3d |
| MATCH_IDS[19] | 2_000_000 | 200_000 | content_submitted | true | true | now()-14d | null |
| MATCH_IDS[8] | 1_200_000 | 120_000 | active | true | true | now()-7d | null |
| MATCH_IDS[11] | 600_000 | 60_000 | active | true | true | now()-5d | null |

- `content_requirements`: 캠페인 제목 기반 한국어 요구사항 문자열.
- `delivery_deadline`: 현재 날짜 기준 +14d ~ +30d.
- `max_revisions`: 2.

#### Step 9: seedChatRooms

```typescript
async function seedChatRooms(
  matchIds: string[],   // MATCH_IDS[17,18,19,8,11]
  creatorProfileIds: Record<string, string>,
  brandProfileIds: Record<string, string>,
): Promise<Record<string, string>>  // match_id → room_id 맵 반환
```

- 5개 채팅방 생성. `last_message_at`은 각 채팅방의 마지막 메시지 시각과 동기화.
- Step 10 완료 후 `last_message_at` UPDATE 필요.

#### Step 10: seedMessages

```typescript
async function seedMessages(
  roomMap: Record<string, string>,   // match_id → room_id
  senderIds: Record<string, string>, // 각 룸의 creator/brand profile_id
): Promise<void>
```

채팅방별 메시지 시나리오 (각 4~6개):

**MATCH_IDS[17] 룸 (서유나 + B_13, 완료된 계약):**
1. `system`: "계약이 체결되었습니다." (now()-35d)
2. `text` B_13: "안녕하세요! 계약 완료됐네요. 콘텐츠 방향성 논의해요." (now()-34d)
3. `text` C_11: "네, 잘 부탁드립니다. 겨울 보습 크림 리뷰로 진행하면 될까요?" (now()-33d)
4. `text` B_13: "맞아요. 제품 발송 완료했습니다. 확인해 주세요." (now()-20d)
5. `system`: "콘텐츠가 제출되었습니다." (now()-8d)
6. `system`: "계약이 완료되었습니다. 에스크로 금액이 지급되었습니다." (now()-5d)

**MATCH_IDS[18] 룸 (박지우 + B_14, 완료된 계약):**
1. `system`: "계약이 체결되었습니다." (now()-28d)
2. `text` B_14: "박지우 님, 블루투스 스피커 리뷰 기대하고 있습니다!" (now()-27d)
3. `text` C_USER3: "받았습니다. 영상 제작 시작할게요." (now()-26d)
4. `text` C_USER3: "촬영 완료했습니다. 편집 중이에요." (now()-10d)
5. `system`: "계약이 완료되었습니다. 에스크로 금액이 지급되었습니다." (now()-3d)

**MATCH_IDS[19] 룸 (윤재호 + B_USER2, 콘텐츠 제출 중):**
1. `system`: "계약이 체결되었습니다." (now()-14d)
2. `text` B_USER2: "윤재호 님, 소셜미디어 관리 캠페인 시작해요." (now()-13d)
3. `text` C_10: "네! 인스타그램 피드 최적화부터 진행하겠습니다." (now()-12d)
4. `text` B_USER2: "초안 검토해 봤는데 방향성 좋네요. 계속 진행해 주세요." (now()-7d)
5. `system`: "콘텐츠가 제출되었습니다. 검토 중입니다." (now()-2d)

**MATCH_IDS[8] 룸 (김수진 + B_13, 계약 진행 중):**
1. `system`: "계약이 체결되었습니다." (now()-7d)
2. `text` B_13: "김수진 님 안녕하세요! 겨울 보습 크림 두 번째 크리에이터로 함께하게 되어 기쁩니다." (now()-6d)
3. `text` C_USER1: "감사합니다. 제품 받으면 바로 촬영 시작할게요." (now()-5d)
4. `text` B_13: "제품 발송했습니다. 3~4일 내 도착 예정이에요." (now()-3d)

**MATCH_IDS[11] 룸 (강다은 + B_16, 계약 진행 중):**
1. `system`: "계약이 체결되었습니다." (now()-5d)
2. `text` B_16: "강다은 님, 가을 트렌치코트 캠페인 잘 부탁드립니다." (now()-4d)
3. `text` C_9: "네, 잘 부탁드려요. 스타일링 컨셉 먼저 공유해 주실 수 있나요?" (now()-3d)
4. `text` B_16: "물론이죠. 파일 첨부해서 다시 보내드릴게요." (now()-2d)

- `is_read`: 가장 최근 메시지 제외 모두 true.
- `sender_id`: 해당 계정의 profile_id.

#### Step 11: seedEscrow

```typescript
async function seedEscrow(
  contractMap: Record<string, string>,  // match_id → contract_id
  contractAmounts: Record<string, { amount: number; platform_fee: number }>,
): Promise<void>
```

| match | escrow amount | status | paid_at | released_at |
|-------|--------------|--------|---------|-------------|
| MATCH_IDS[17] | 1_500_000 | released | now()-34d | now()-5d |
| MATCH_IDS[18] | 800_000 | released | now()-27d | now()-3d |
| MATCH_IDS[19] | 2_000_000 | held | now()-13d | null |

- `platform_fee`: 각 계약의 platform_fee와 동일.
- active 계약(MATCH_IDS[8], MATCH_IDS[11])은 에스크로 미생성 (계약 활성 상태이나 결제 전).

#### Step 12: seedReviews

```typescript
async function seedReviews(
  contractMap: Record<string, string>,  // match_id → contract_id
  creatorProfileIds: Record<string, string>,
  brandProfileIds: Record<string, string>,
): Promise<void>
```

삽입 데이터:

| contract | reviewer | reviewee | rating | comm | quality | timeliness | comment |
|----------|---------|---------|--------|------|---------|------------|---------|
| MATCH_IDS[17] | B_13 profile | C_11 profile | 5 | 5 | 5 | 4 | "전문적인 콘텐츠 제작과 빠른 소통 감사합니다." |
| MATCH_IDS[17] | C_11 profile | B_13 profile | 4 | 4 | 5 | 4 | "명확한 요구사항과 제때 제품 발송 감사합니다." |
| MATCH_IDS[18] | B_14 profile | C_USER3 profile | 5 | 5 | 5 | 5 | "기대 이상의 영상 품질이었습니다." |
| MATCH_IDS[18] | C_USER3 profile | B_14 profile | 5 | 5 | 5 | 5 | "소통이 원활하고 피드백이 빠른 광고주입니다." |

- `is_public`: 전부 true.
- MATCH_IDS[19] 계약은 content_submitted 상태이므로 리뷰 미생성.

---

### seed.ts 실행 순서

```
Step 1~7  (기존: 사용자, 크리에이터, 브랜드, 캠페인, 매칭, 알림)
     ↓
Step 8:  seedContracts   → contractMap (match_id → contract_id)
     ↓
Step 9:  seedChatRooms  → roomMap (match_id → room_id)
     ↓
Step 10: seedMessages   (roomMap 사용, last_message_at UPDATE 포함)
     ↓
Step 11: seedEscrow     (contractMap 사용)
     ↓
Step 12: seedReviews    (contractMap 사용)
```

각 Step은 독립적으로 실패 시 에러 메시지 출력 후 중단 (`throw`). 재실행 시 기존 데이터 충돌 방지를 위해 `onConflict: 'ignore'` 또는 실행 전 DELETE 적용.

---

### 테스트 계정 체험 시나리오

#### user1@demo.com (크리에이터 김수진) 로그인 시

| 메뉴 | 체험 가능 기능 | 데이터 |
|------|--------------|--------|
| 채팅 | 채팅방 2개 확인 | MATCH_IDS[8] 룸(B_13과 진행 중), 없는 경우 빈 상태 |
| 계약 | 계약서 1건 확인 | MATCH_IDS[8] active 계약 — 서명 완료, 진행 중 |
| 매칭 | 매칭 목록 다수 확인 | contracted 1건, accepted 다수, pending 다수 |
| 대시보드 | 통계 확인 | 총 계약 1건, 진행 중 1건 |

#### user2@demo.com (광고주 이마케팅) 로그인 시

| 메뉴 | 체험 가능 기능 | 데이터 |
|------|--------------|--------|
| 채팅 | 채팅방 1개 확인 | MATCH_IDS[19] 룸(윤재호와 콘텐츠 검토 중) |
| 계약 | 계약서 1건 확인 | MATCH_IDS[19] content_submitted — 검토 대기 |
| 에스크로 | 에스크로 1건 확인 | MATCH_IDS[19] held 상태, 200만원 보관 중 |
| 매칭 | 매칭 목록 확인 | contracted 1건, accepted 다수 |
| 캠페인 | 캠페인 관리 | CAMP_11 소셜미디어 관리 |

---

### [PROD-TODO] Phase 10

- [ ] `scripts/seed.ts`에 Step 8~12 함수 (`seedContracts`, `seedChatRooms`, `seedMessages`, `seedEscrow`, `seedReviews`) 추가.
- [ ] 각 Step에서 match_id → profile_id 매핑을 기존 Step 결과에서 추출하는 헬퍼 작성.
- [ ] `seedMessages` 완료 후 `chat_rooms.last_message_at` UPDATE 쿼리 실행.
- [ ] 재실행 안전성 보장: contracts/chat_rooms `match_id` unique 제약 활용, messages/reviews/escrow는 실행 전 해당 contract_id/room_id 기준 DELETE.
- [ ] 로컬 환경에서 `npx tsx scripts/seed.ts` 실행 후 5개 테이블 row 수 확인.
- [ ] user1@demo.com, user2@demo.com 로그인 후 채팅/계약/에스크로 화면에서 데이터 렌더링 확인.
