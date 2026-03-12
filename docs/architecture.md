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

### P0 엔드포인트

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

## 디렉토리 구조
PRD.md 2-9 참조.

## [PROD-TODO]
PRD.md 2-11 참조.
