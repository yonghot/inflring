-- 인플링 (Inflring) 초기 스키마
-- P0 MVP 테이블 + RLS 정책

-- ============================================
-- 사용자 프로필
-- ============================================
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('creator', 'brand', 'admin')),
  display_name TEXT NOT NULL,
  email TEXT NOT NULL,
  avatar_url TEXT,
  trust_score DECIMAL(3,1) DEFAULT 36.5,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "profiles_public_read" ON profiles FOR SELECT USING (true);
CREATE POLICY "profiles_self_update" ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "profiles_self_insert" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- ============================================
-- 크리에이터
-- ============================================
CREATE TABLE IF NOT EXISTS creators (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  channel_name TEXT NOT NULL,
  channel_url TEXT NOT NULL,
  platform TEXT NOT NULL CHECK (platform IN ('youtube', 'instagram', 'tiktok', 'naver_blog')),
  subscribers INTEGER DEFAULT 0,
  avg_views INTEGER DEFAULT 0,
  engagement_rate DECIMAL(5,2) DEFAULT 0,
  content_category TEXT[] DEFAULT '{}',
  audience_demographics JSONB,
  top_videos JSONB,
  is_available BOOLEAN DEFAULT true,
  min_price INTEGER,
  max_price INTEGER,
  preferred_categories TEXT[] DEFAULT '{}',
  blocked_categories TEXT[] DEFAULT '{}',
  max_monthly_deals INTEGER DEFAULT 3,
  max_revisions INTEGER DEFAULT 1,
  thumbnail_autonomy BOOLEAN DEFAULT true,
  title_autonomy BOOLEAN DEFAULT true,
  media_kit_url TEXT,
  media_kit_updated_at TIMESTAMPTZ,
  total_deals INTEGER DEFAULT 0,
  total_revenue BIGINT DEFAULT 0,
  avg_completion_days DECIMAL(5,1),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE creators ENABLE ROW LEVEL SECURITY;
CREATE POLICY "creators_public_read" ON creators FOR SELECT USING (is_available = true OR profile_id = auth.uid());
CREATE POLICY "creators_self_insert" ON creators FOR INSERT WITH CHECK (profile_id = auth.uid());
CREATE POLICY "creators_self_update" ON creators FOR UPDATE USING (profile_id = auth.uid());
CREATE POLICY "creators_self_delete" ON creators FOR DELETE USING (profile_id = auth.uid());

-- ============================================
-- 광고주
-- ============================================
CREATE TABLE IF NOT EXISTS brands (
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

ALTER TABLE brands ENABLE ROW LEVEL SECURITY;
CREATE POLICY "brands_public_read" ON brands FOR SELECT USING (true);
CREATE POLICY "brands_self_insert" ON brands FOR INSERT WITH CHECK (profile_id = auth.uid());
CREATE POLICY "brands_self_update" ON brands FOR UPDATE USING (profile_id = auth.uid());
CREATE POLICY "brands_self_delete" ON brands FOR DELETE USING (profile_id = auth.uid());

-- ============================================
-- 캠페인
-- ============================================
CREATE TABLE IF NOT EXISTS campaigns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  brand_id UUID REFERENCES brands(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  content_type TEXT NOT NULL CHECK (content_type IN ('branded', 'ppl', 'review', 'unboxing', 'shorts', 'other')),
  target_platform TEXT NOT NULL CHECK (target_platform IN ('youtube', 'instagram', 'tiktok', 'naver_blog', 'multi')),
  target_categories TEXT[] DEFAULT '{}',
  min_subscribers INTEGER,
  max_subscribers INTEGER,
  target_audience_age TEXT[] DEFAULT '{}',
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

ALTER TABLE campaigns ENABLE ROW LEVEL SECURITY;
CREATE POLICY "campaigns_public_read" ON campaigns FOR SELECT USING (
  status = 'active' OR brand_id IN (SELECT id FROM brands WHERE profile_id = auth.uid())
);
CREATE POLICY "campaigns_brand_insert" ON campaigns FOR INSERT WITH CHECK (
  brand_id IN (SELECT id FROM brands WHERE profile_id = auth.uid())
);
CREATE POLICY "campaigns_brand_update" ON campaigns FOR UPDATE USING (
  brand_id IN (SELECT id FROM brands WHERE profile_id = auth.uid())
);
CREATE POLICY "campaigns_brand_delete" ON campaigns FOR DELETE USING (
  brand_id IN (SELECT id FROM brands WHERE profile_id = auth.uid())
);

-- ============================================
-- 매칭
-- ============================================
CREATE TABLE IF NOT EXISTS matches (
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

ALTER TABLE matches ENABLE ROW LEVEL SECURITY;
CREATE POLICY "matches_party_select" ON matches FOR SELECT USING (
  creator_id IN (SELECT id FROM creators WHERE profile_id = auth.uid()) OR
  campaign_id IN (SELECT c.id FROM campaigns c JOIN brands b ON c.brand_id = b.id WHERE b.profile_id = auth.uid())
);
CREATE POLICY "matches_party_insert" ON matches FOR INSERT WITH CHECK (
  creator_id IN (SELECT id FROM creators WHERE profile_id = auth.uid()) OR
  campaign_id IN (SELECT c.id FROM campaigns c JOIN brands b ON c.brand_id = b.id WHERE b.profile_id = auth.uid())
);
CREATE POLICY "matches_party_update" ON matches FOR UPDATE USING (
  creator_id IN (SELECT id FROM creators WHERE profile_id = auth.uid()) OR
  campaign_id IN (SELECT c.id FROM campaigns c JOIN brands b ON c.brand_id = b.id WHERE b.profile_id = auth.uid())
);

-- ============================================
-- admin 전용 정책 (service_role 키로 우회)
-- 통계 쿼리는 service_role 키 사용
-- ============================================
