import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseUrl || !serviceRoleKey) {
  console.error('❌ NEXT_PUBLIC_SUPABASE_URL 또는 SUPABASE_SERVICE_ROLE_KEY가 설정되지 않았습니다.');
  console.error('   .env.local 파일을 확인해주세요.');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

// ============================================
// Fixed UUIDs
// ============================================

// Creator table IDs
const C_USER1 = 'c1111111-1111-4111-8111-111111111111';
const C_USER3 = 'c2222222-2222-4222-8222-222222222222';
const C_5 = 'c3333333-3333-4333-8333-333333333333';
const C_6 = 'c4444444-4444-4444-8444-444444444444';
const C_7 = 'c5555555-5555-4555-8555-555555555555';
const C_8 = 'c6666666-6666-4666-8666-666666666666';
const C_9 = 'c7777777-7777-4777-8777-777777777777';
const C_10 = 'c8888888-8888-4888-8888-888888888888';
const C_11 = 'c9999999-9999-4999-8999-999999999999';
const C_12 = 'caaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa';

// Brand table IDs
const B_USER2 = 'b1111111-1111-4111-8111-111111111111';
const B_13 = 'b2222222-2222-4222-8222-222222222222';
const B_14 = 'b3333333-3333-4333-8333-333333333333';
const B_15 = 'b4444444-4444-4444-8444-444444444444';
const B_16 = 'b5555555-5555-4555-8555-555555555555';

// Campaign IDs
const CAMP_1 = 'ca111111-1111-4111-8111-111111111111';
const CAMP_2 = 'ca222222-2222-4222-8222-222222222222';
const CAMP_3 = 'ca333333-3333-4333-8333-333333333333';
const CAMP_4 = 'ca444444-4444-4444-8444-444444444444';
const CAMP_5 = 'ca555555-5555-4555-8555-555555555555';
const CAMP_6 = 'ca666666-6666-4666-8666-666666666666';
const CAMP_7 = 'ca777777-7777-4777-8777-777777777777';
const CAMP_8 = 'ca888888-8888-4888-8888-888888888888';
const CAMP_9 = 'ca999999-9999-4999-8999-999999999999';
const CAMP_10 = 'caaaaaaa-1111-4111-8111-111111111111';
const CAMP_11 = 'cabbbbbb-2222-4222-8222-222222222222';
const CAMP_12 = 'cacccccc-3333-4333-8333-333333333333';
const CAMP_13 = 'cadddddd-4444-4444-8444-444444444444';
const CAMP_14 = 'caeeeeee-5555-4555-8555-555555555555';
const CAMP_15 = 'caffffff-6666-4666-8666-666666666666';

// Match IDs
const MATCH_IDS = Array.from({ length: 20 }, (_, i) => {
  const hex = (i + 1).toString(16).padStart(2, '0');
  return `ma${hex}${hex}${hex}${hex}-${hex}${hex}${hex}-4${hex}${hex}-8${hex}${hex}-${hex}${hex}${hex}${hex}${hex}${hex}${hex}${hex}${hex}${hex}`;
}).map((_, i) => {
  const h = (i + 1).toString(16).padStart(8, '0');
  return `${h}-0000-4000-8000-${h}${h.slice(0, 4)}`;
});

// Notification IDs
const NOTIF_IDS = Array.from({ length: 15 }, (_, i) => {
  const h = (i + 0xa0).toString(16).padStart(8, '0');
  return `${h}-0000-4000-8000-${h}${h.slice(0, 4)}`;
});

// ============================================
// Auth User Definitions
// ============================================

interface UserDef {
  email: string;
  password: string;
  role: 'creator' | 'brand' | 'admin';
  display_name: string;
}

const AUTH_USERS: UserDef[] = [
  { email: 'admin@admin.com', password: 'admin123!', role: 'admin', display_name: '관리자' },
  { email: 'user1@demo.com', password: 'demo123!', role: 'creator', display_name: '김수진' },
  { email: 'user2@demo.com', password: 'demo123!', role: 'brand', display_name: '이마케팅' },
  { email: 'user3@demo.com', password: 'demo123!', role: 'creator', display_name: '박지우' },
  { email: 'creator5@demo.com', password: 'demo123!', role: 'creator', display_name: '최예은' },
  { email: 'creator6@demo.com', password: 'demo123!', role: 'creator', display_name: '정하늘' },
  { email: 'creator7@demo.com', password: 'demo123!', role: 'creator', display_name: '한서연' },
  { email: 'creator8@demo.com', password: 'demo123!', role: 'creator', display_name: '오민준' },
  { email: 'creator9@demo.com', password: 'demo123!', role: 'creator', display_name: '강다은' },
  { email: 'creator10@demo.com', password: 'demo123!', role: 'creator', display_name: '윤재호' },
  { email: 'creator11@demo.com', password: 'demo123!', role: 'creator', display_name: '서유나' },
  { email: 'creator12@demo.com', password: 'demo123!', role: 'creator', display_name: '임태현' },
  { email: 'brand13@demo.com', password: 'demo123!', role: 'brand', display_name: '클린뷰티코리아' },
  { email: 'brand14@demo.com', password: 'demo123!', role: 'brand', display_name: '테크기어' },
  { email: 'brand15@demo.com', password: 'demo123!', role: 'brand', display_name: '프레시밀' },
  { email: 'brand16@demo.com', password: 'demo123!', role: 'brand', display_name: '스타일하우스' },
];

// Avatar URLs
const AVATARS = {
  woman1: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200',
  woman2: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200',
  woman3: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200',
  woman4: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200',
  woman5: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200',
  man1: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200',
  man2: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200',
  man3: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200',
  man4: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=200',
  brand1: 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=200',
  brand2: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=200',
  brand3: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=200',
};

// ============================================
// Helper Functions
// ============================================

function daysAgo(n: number): string {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d.toISOString();
}

function dateStr(daysFromNow: number): string {
  const d = new Date();
  d.setDate(d.getDate() + daysFromNow);
  return d.toISOString().split('T')[0];
}

async function getOrCreateUser(def: UserDef): Promise<string> {
  // Try to create user
  const { data: created, error: createErr } = await supabase.auth.admin.createUser({
    email: def.email,
    password: def.password,
    email_confirm: true,
    user_metadata: { role: def.role, display_name: def.display_name },
  });

  if (created?.user) {
    console.log(`  ✅ 유저 생성: ${def.email} (${created.user.id})`);
    return created.user.id;
  }

  // User already exists - find by email
  if (createErr?.message?.includes('already been registered') || createErr?.message?.includes('already exists')) {
    const { data: listData } = await supabase.auth.admin.listUsers({ perPage: 1000 });
    const existing = listData?.users?.find((u) => u.email === def.email);
    if (existing) {
      console.log(`  ℹ️  유저 존재: ${def.email} (${existing.id})`);
      return existing.id;
    }
  }

  throw new Error(`유저 생성/조회 실패: ${def.email} - ${createErr?.message}`);
}

// ============================================
// Step 1: Auth Users
// ============================================

interface UserIds {
  admin: string;
  user1: string; // creator (김수진)
  user2: string; // brand (이마케팅)
  user3: string; // creator (박지우)
  cr5: string;
  cr6: string;
  cr7: string;
  cr8: string;
  cr9: string;
  cr10: string;
  cr11: string;
  cr12: string;
  br13: string;
  br14: string;
  br15: string;
  br16: string;
}

async function createAuthUsers(): Promise<UserIds> {
  console.log('\n📌 Step 1: Auth 유저 생성...');
  const ids: string[] = [];
  for (const def of AUTH_USERS) {
    const id = await getOrCreateUser(def);
    ids.push(id);
  }
  return {
    admin: ids[0],
    user1: ids[1],
    user2: ids[2],
    user3: ids[3],
    cr5: ids[4],
    cr6: ids[5],
    cr7: ids[6],
    cr8: ids[7],
    cr9: ids[8],
    cr10: ids[9],
    cr11: ids[10],
    cr12: ids[11],
    br13: ids[12],
    br14: ids[13],
    br15: ids[14],
    br16: ids[15],
  };
}

// ============================================
// Step 2: Profiles
// ============================================

async function createProfiles(u: UserIds) {
  console.log('\n📌 Step 2: 프로필 생성...');

  const profiles = [
    { id: u.admin, role: 'admin', display_name: '관리자', email: 'admin@admin.com', avatar_url: null, trust_score: 50.0 },
    { id: u.user1, role: 'creator', display_name: '김수진', email: 'user1@demo.com', avatar_url: AVATARS.woman1, trust_score: 42.0 },
    { id: u.user2, role: 'brand', display_name: '이마케팅', email: 'user2@demo.com', avatar_url: AVATARS.brand1, trust_score: 38.5 },
    { id: u.user3, role: 'creator', display_name: '박지우', email: 'user3@demo.com', avatar_url: AVATARS.man1, trust_score: 36.5 },
    { id: u.cr5, role: 'creator', display_name: '최예은', email: 'creator5@demo.com', avatar_url: AVATARS.woman2, trust_score: 40.0 },
    { id: u.cr6, role: 'creator', display_name: '정하늘', email: 'creator6@demo.com', avatar_url: AVATARS.man2, trust_score: 39.0 },
    { id: u.cr7, role: 'creator', display_name: '한서연', email: 'creator7@demo.com', avatar_url: AVATARS.woman3, trust_score: 41.5 },
    { id: u.cr8, role: 'creator', display_name: '오민준', email: 'creator8@demo.com', avatar_url: AVATARS.man3, trust_score: 37.0 },
    { id: u.cr9, role: 'creator', display_name: '강다은', email: 'creator9@demo.com', avatar_url: AVATARS.woman4, trust_score: 38.0 },
    { id: u.cr10, role: 'creator', display_name: '윤재호', email: 'creator10@demo.com', avatar_url: AVATARS.man4, trust_score: 43.0 },
    { id: u.cr11, role: 'creator', display_name: '서유나', email: 'creator11@demo.com', avatar_url: AVATARS.woman5, trust_score: 39.5 },
    { id: u.cr12, role: 'creator', display_name: '임태현', email: 'creator12@demo.com', avatar_url: AVATARS.man2, trust_score: 40.5 },
    { id: u.br13, role: 'brand', display_name: '클린뷰티코리아', email: 'brand13@demo.com', avatar_url: AVATARS.brand1, trust_score: 41.0 },
    { id: u.br14, role: 'brand', display_name: '테크기어', email: 'brand14@demo.com', avatar_url: AVATARS.brand2, trust_score: 39.0 },
    { id: u.br15, role: 'brand', display_name: '프레시밀', email: 'brand15@demo.com', avatar_url: AVATARS.brand3, trust_score: 37.5 },
    { id: u.br16, role: 'brand', display_name: '스타일하우스', email: 'brand16@demo.com', avatar_url: AVATARS.brand2, trust_score: 38.0 },
  ];

  const { error } = await supabase.from('profiles').upsert(profiles, { onConflict: 'id' });
  if (error) throw new Error(`프로필 생성 실패: ${error.message}`);
  console.log(`  ✅ ${profiles.length}개 프로필 생성 완료`);
}

// ============================================
// Step 3: Creators
// ============================================

async function createCreators(u: UserIds) {
  console.log('\n📌 Step 3: 크리에이터 생성...');

  const creators = [
    {
      id: C_USER1,
      profile_id: u.user1,
      channel_name: '수진의 뷰티다이어리',
      channel_url: 'https://youtube.com/@sujin_beauty',
      platform: 'youtube',
      subscribers: 185000,
      avg_views: 45000,
      engagement_rate: 4.8,
      content_category: ['뷰티', '화장품', '스킨케어'],
      is_available: true,
      min_price: 500000,
      max_price: 2000000,
      preferred_categories: ['화장품/뷰티', '패션/의류'],
      blocked_categories: ['도박', '성인'],
      max_monthly_deals: 4,
      total_deals: 23,
      total_revenue: 18500000,
    },
    {
      id: C_USER3,
      profile_id: u.user3,
      channel_name: '지우의 테크리뷰',
      channel_url: 'https://youtube.com/@jiwoo_tech',
      platform: 'youtube',
      subscribers: 12000,
      avg_views: 3500,
      engagement_rate: 3.2,
      content_category: ['테크', 'IT', '가젯'],
      is_available: true,
      min_price: 100000,
      max_price: 500000,
      preferred_categories: ['IT/전자', '게임'],
      blocked_categories: [],
      max_monthly_deals: 2,
      total_deals: 2,
      total_revenue: 450000,
    },
    {
      id: C_5,
      profile_id: u.cr5,
      channel_name: '예은이네 맛있는 부엌',
      channel_url: 'https://youtube.com/@yeeeun_cook',
      platform: 'youtube',
      subscribers: 320000,
      avg_views: 85000,
      engagement_rate: 5.1,
      content_category: ['음식', '요리', '맛집'],
      is_available: true,
      min_price: 800000,
      max_price: 3000000,
      preferred_categories: ['식품/건강', '가전'],
      blocked_categories: ['주류'],
      max_monthly_deals: 3,
      total_deals: 45,
      total_revenue: 52000000,
    },
    {
      id: C_6,
      profile_id: u.cr6,
      channel_name: '하늘여행기',
      channel_url: 'https://instagram.com/haneul_travel',
      platform: 'instagram',
      subscribers: 95000,
      avg_views: 22000,
      engagement_rate: 6.3,
      content_category: ['여행', '관광', '맛집'],
      is_available: true,
      min_price: 300000,
      max_price: 1200000,
      preferred_categories: ['여행/관광', '식품/건강'],
      blocked_categories: [],
      max_monthly_deals: 5,
      total_deals: 31,
      total_revenue: 22000000,
    },
    {
      id: C_7,
      profile_id: u.cr7,
      channel_name: '서연의 스타일룸',
      channel_url: 'https://tiktok.com/@seoyeon_style',
      platform: 'tiktok',
      subscribers: 480000,
      avg_views: 150000,
      engagement_rate: 7.2,
      content_category: ['패션', '스타일', '데일리룩'],
      is_available: true,
      min_price: 1000000,
      max_price: 4000000,
      preferred_categories: ['패션/의류', '화장품/뷰티'],
      blocked_categories: [],
      max_monthly_deals: 3,
      total_deals: 38,
      total_revenue: 65000000,
    },
    {
      id: C_8,
      profile_id: u.cr8,
      channel_name: '민준게임즈',
      channel_url: 'https://youtube.com/@minjun_games',
      platform: 'youtube',
      subscribers: 250000,
      avg_views: 70000,
      engagement_rate: 4.5,
      content_category: ['게임', 'e스포츠', 'IT'],
      is_available: true,
      min_price: 600000,
      max_price: 2500000,
      preferred_categories: ['게임', 'IT/전자'],
      blocked_categories: ['도박'],
      max_monthly_deals: 4,
      total_deals: 28,
      total_revenue: 35000000,
    },
    {
      id: C_9,
      profile_id: u.cr9,
      channel_name: '다은의 일상기록',
      channel_url: 'https://blog.naver.com/daeun_life',
      platform: 'naver_blog',
      subscribers: 45000,
      avg_views: 12000,
      engagement_rate: 3.8,
      content_category: ['라이프스타일', '일상', '인테리어'],
      is_available: true,
      min_price: 200000,
      max_price: 800000,
      preferred_categories: ['생활용품', '인테리어'],
      blocked_categories: [],
      max_monthly_deals: 6,
      total_deals: 52,
      total_revenue: 28000000,
    },
    {
      id: C_10,
      profile_id: u.cr10,
      channel_name: '재호의 IT연구소',
      channel_url: 'https://youtube.com/@jaeho_itlab',
      platform: 'youtube',
      subscribers: 150000,
      avg_views: 40000,
      engagement_rate: 4.2,
      content_category: ['IT', '테크', '프로그래밍'],
      is_available: true,
      min_price: 700000,
      max_price: 2800000,
      preferred_categories: ['IT/전자', '교육'],
      blocked_categories: [],
      max_monthly_deals: 3,
      total_deals: 19,
      total_revenue: 24000000,
    },
    {
      id: C_11,
      profile_id: u.cr11,
      channel_name: '유나뷰티',
      channel_url: 'https://instagram.com/yuna_beauty_',
      platform: 'instagram',
      subscribers: 210000,
      avg_views: 55000,
      engagement_rate: 5.5,
      content_category: ['뷰티', '메이크업', '스킨케어'],
      is_available: true,
      min_price: 600000,
      max_price: 2200000,
      preferred_categories: ['화장품/뷰티', '패션/의류'],
      blocked_categories: [],
      max_monthly_deals: 4,
      total_deals: 35,
      total_revenue: 42000000,
    },
    {
      id: C_12,
      profile_id: u.cr12,
      channel_name: '태현의 피트니스 채널',
      channel_url: 'https://youtube.com/@taehyun_fit',
      platform: 'youtube',
      subscribers: 130000,
      avg_views: 35000,
      engagement_rate: 4.0,
      content_category: ['피트니스', '운동', '건강'],
      is_available: true,
      min_price: 400000,
      max_price: 1500000,
      preferred_categories: ['건강/피트니스', '식품/건강'],
      blocked_categories: ['주류', '도박'],
      max_monthly_deals: 3,
      total_deals: 15,
      total_revenue: 12000000,
    },
  ];

  const { error } = await supabase.from('creators').upsert(creators, { onConflict: 'id' });
  if (error) throw new Error(`크리에이터 생성 실패: ${error.message}`);
  console.log(`  ✅ ${creators.length}명 크리에이터 생성 완료`);
}

// ============================================
// Step 4: Brands
// ============================================

async function createBrands(u: UserIds) {
  console.log('\n📌 Step 4: 브랜드(광고주) 생성...');

  const brands = [
    {
      id: B_USER2,
      profile_id: u.user2,
      company_name: '마케팅프로',
      business_category: '서비스/마케팅',
      contact_name: '이마케팅',
      contact_email: 'user2@demo.com',
      contact_phone: '010-1234-5678',
      website_url: 'https://marketingpro.kr',
      total_deals: 8,
      total_spend: 12500000,
    },
    {
      id: B_13,
      profile_id: u.br13,
      company_name: '클린뷰티코리아',
      business_category: '화장품/뷰티',
      contact_name: '김민서',
      contact_email: 'brand13@demo.com',
      contact_phone: '02-1111-2222',
      website_url: 'https://cleanbeauty.kr',
      total_deals: 15,
      total_spend: 35000000,
    },
    {
      id: B_14,
      profile_id: u.br14,
      company_name: '테크기어',
      business_category: 'IT/전자',
      contact_name: '박준혁',
      contact_email: 'brand14@demo.com',
      contact_phone: '02-3333-4444',
      website_url: 'https://techgear.co.kr',
      total_deals: 10,
      total_spend: 28000000,
    },
    {
      id: B_15,
      profile_id: u.br15,
      company_name: '프레시밀',
      business_category: '식품/건강',
      contact_name: '정소영',
      contact_email: 'brand15@demo.com',
      contact_phone: '02-5555-6666',
      website_url: 'https://freshmeal.kr',
      total_deals: 12,
      total_spend: 22000000,
    },
    {
      id: B_16,
      profile_id: u.br16,
      company_name: '스타일하우스',
      business_category: '패션/의류',
      contact_name: '최다영',
      contact_email: 'brand16@demo.com',
      contact_phone: '02-7777-8888',
      website_url: 'https://stylehouse.co.kr',
      total_deals: 20,
      total_spend: 48000000,
    },
  ];

  const { error } = await supabase.from('brands').upsert(brands, { onConflict: 'id' });
  if (error) throw new Error(`브랜드 생성 실패: ${error.message}`);
  console.log(`  ✅ ${brands.length}개 브랜드 생성 완료`);
}

// ============================================
// Step 5: Campaigns
// ============================================

async function createCampaigns(_u: UserIds) {
  console.log('\n📌 Step 5: 캠페인 생성...');

  const campaigns = [
    // === Active (8) ===
    {
      id: CAMP_1,
      brand_id: B_13,
      title: '봄 신상 쿠션 파운데이션 리뷰',
      description: '클린뷰티코리아 신제품 비건 쿠션 파운데이션을 뷰티 크리에이터분들께 보내드립니다. 솔직한 사용 후기를 영상으로 제작해주세요.',
      content_type: 'review',
      target_platform: 'youtube',
      target_categories: ['뷰티', '화장품', '스킨케어'],
      min_subscribers: 10000,
      max_subscribers: 500000,
      budget_min: 500000,
      budget_max: 1500000,
      campaign_start: dateStr(-10),
      campaign_end: dateStr(20),
      content_deadline: dateStr(15),
      requirements: '• 최소 5분 이상 영상\n• 실제 사용 장면 포함\n• 성분 설명 필수\n• 비건 인증 마크 노출',
      max_revisions: 2,
      status: 'active',
    },
    {
      id: CAMP_2,
      brand_id: B_14,
      title: '신제품 무선이어폰 언박싱',
      description: '테크기어의 새 무선이어폰 TG-Pro X를 언박싱하고 음질, 착용감, 배터리 등을 리뷰해주세요.',
      content_type: 'unboxing',
      target_platform: 'youtube',
      target_categories: ['테크', 'IT', '가젯'],
      min_subscribers: 5000,
      max_subscribers: 300000,
      budget_min: 300000,
      budget_max: 1000000,
      campaign_start: dateStr(-5),
      campaign_end: dateStr(25),
      content_deadline: dateStr(20),
      requirements: '• 언박싱 전체 과정 촬영\n• 타사 제품과 간단 비교\n• 스펙 자막 표시',
      max_revisions: 1,
      status: 'active',
    },
    {
      id: CAMP_3,
      brand_id: B_15,
      title: '다이어트 도시락 PPL 프로젝트',
      description: '프레시밀 저칼로리 도시락 3종을 일주일간 먹어보며 식단 일기를 공유하는 PPL 콘텐츠를 제작해주세요.',
      content_type: 'ppl',
      target_platform: 'instagram',
      target_categories: ['음식', '건강', '다이어트'],
      min_subscribers: 20000,
      max_subscribers: null,
      budget_min: 400000,
      budget_max: 1200000,
      campaign_start: dateStr(-3),
      campaign_end: dateStr(27),
      content_deadline: dateStr(22),
      requirements: '• 인스타 피드 3장 + 릴스 1개\n• 실제 식사 사진\n• 칼로리 정보 포함',
      max_revisions: 1,
      status: 'active',
    },
    {
      id: CAMP_4,
      brand_id: B_16,
      title: '여름 신상 룩북 촬영',
      description: '스타일하우스 여름 컬렉션 5벌을 활용한 룩북 영상을 제작해주세요. 다양한 스타일링을 보여주세요.',
      content_type: 'branded',
      target_platform: 'tiktok',
      target_categories: ['패션', '스타일', '데일리룩'],
      min_subscribers: 50000,
      max_subscribers: null,
      budget_min: 1000000,
      budget_max: 3000000,
      campaign_start: dateStr(-7),
      campaign_end: dateStr(23),
      content_deadline: dateStr(18),
      requirements: '• 틱톡 60초 영상 2개\n• 각 의류 별 코디 포인트 설명\n• 브랜드 태그 필수',
      max_revisions: 2,
      status: 'active',
    },
    {
      id: CAMP_5,
      brand_id: B_USER2,
      title: '마케팅 자동화 툴 소개 영상',
      description: '마케팅프로의 신규 자동화 플랫폼을 소개하는 브랜디드 콘텐츠를 제작해주세요.',
      content_type: 'branded',
      target_platform: 'youtube',
      target_categories: ['IT', '비즈니스', '마케팅'],
      min_subscribers: 30000,
      max_subscribers: 200000,
      budget_min: 800000,
      budget_max: 2500000,
      campaign_start: dateStr(-2),
      campaign_end: dateStr(28),
      content_deadline: dateStr(23),
      requirements: '• 실제 사용 시연\n• 비포/애프터 데이터 비교\n• 가격 정보 포함',
      max_revisions: 2,
      status: 'active',
    },
    {
      id: CAMP_6,
      brand_id: B_13,
      title: '립틴트 신제품 숏츠 챌린지',
      description: '클린뷰티코리아의 새 립틴트 6색을 활용한 숏츠/릴스 콘텐츠를 제작해주세요.',
      content_type: 'shorts',
      target_platform: 'multi',
      target_categories: ['뷰티', '메이크업'],
      min_subscribers: 10000,
      max_subscribers: null,
      budget_min: 200000,
      budget_max: 800000,
      campaign_start: dateStr(-1),
      campaign_end: dateStr(14),
      content_deadline: dateStr(10),
      requirements: '• 30~60초 숏폼 영상\n• 스와치 영상 필수\n• 해시태그: #클린뷰티립틴트',
      max_revisions: 1,
      status: 'active',
    },
    {
      id: CAMP_7,
      brand_id: B_15,
      title: '프로틴 쉐이크 운동 후기',
      description: '프레시밀 프로틴 쉐이크를 운동 루틴과 함께 소개하는 콘텐츠를 제작해주세요.',
      content_type: 'ppl',
      target_platform: 'youtube',
      target_categories: ['피트니스', '건강', '운동'],
      min_subscribers: 20000,
      max_subscribers: 300000,
      budget_min: 500000,
      budget_max: 1500000,
      campaign_start: dateStr(0),
      campaign_end: dateStr(30),
      content_deadline: dateStr(25),
      requirements: '• 운동 루틴 포함\n• 맛 평가\n• 성분표 노출',
      max_revisions: 1,
      status: 'active',
    },
    {
      id: CAMP_8,
      brand_id: B_16,
      title: '가을 트렌치코트 스타일링',
      description: '스타일하우스 시그니처 트렌치코트 다양한 스타일링을 블로그에 소개해주세요.',
      content_type: 'review',
      target_platform: 'naver_blog',
      target_categories: ['패션', '라이프스타일'],
      min_subscribers: 5000,
      max_subscribers: 100000,
      budget_min: 200000,
      budget_max: 600000,
      campaign_start: dateStr(-5),
      campaign_end: dateStr(25),
      content_deadline: dateStr(20),
      requirements: '• 사진 10장 이상\n• 3가지 이상 스타일링\n• 사이즈 정보 포함',
      max_revisions: 1,
      status: 'active',
    },
    // === Completed (3) ===
    {
      id: CAMP_9,
      brand_id: B_13,
      title: '겨울 보습 크림 체험단',
      description: '클린뷰티코리아 보습 크림 3종 체험 및 리뷰 캠페인입니다.',
      content_type: 'review',
      target_platform: 'youtube',
      target_categories: ['뷰티', '스킨케어'],
      min_subscribers: 10000,
      max_subscribers: 200000,
      budget_min: 400000,
      budget_max: 1200000,
      campaign_start: dateStr(-60),
      campaign_end: dateStr(-30),
      content_deadline: dateStr(-35),
      requirements: '• 2주 사용 후기\n• 피부 타입별 추천',
      max_revisions: 1,
      status: 'completed',
    },
    {
      id: CAMP_10,
      brand_id: B_14,
      title: '블루투스 스피커 비교 리뷰',
      description: '테크기어 포터블 스피커와 타사 제품 비교 리뷰입니다.',
      content_type: 'review',
      target_platform: 'youtube',
      target_categories: ['테크', 'IT'],
      min_subscribers: 20000,
      max_subscribers: 300000,
      budget_min: 600000,
      budget_max: 1800000,
      campaign_start: dateStr(-45),
      campaign_end: dateStr(-15),
      content_deadline: dateStr(-20),
      requirements: '• 음질 비교 테스트\n• 배터리 테스트\n• 가격 대비 성능 평가',
      max_revisions: 2,
      status: 'completed',
    },
    {
      id: CAMP_11,
      brand_id: B_USER2,
      title: '소셜미디어 관리 툴 리뷰',
      description: '마케팅프로 소셜미디어 관리 도구 사용 후기 캠페인입니다.',
      content_type: 'branded',
      target_platform: 'youtube',
      target_categories: ['IT', '비즈니스'],
      min_subscribers: 50000,
      max_subscribers: null,
      budget_min: 1000000,
      budget_max: 3000000,
      campaign_start: dateStr(-50),
      campaign_end: dateStr(-20),
      content_deadline: dateStr(-25),
      requirements: '• 실제 사용 시연 10분 이상\n• 장단점 솔직 리뷰',
      max_revisions: 2,
      status: 'completed',
    },
    // === Paused (2) ===
    {
      id: CAMP_12,
      brand_id: B_15,
      title: '비건 간편식 출시 기념 이벤트',
      description: '프레시밀 비건 간편식 신메뉴 출시 기념 인스타 이벤트 캠페인입니다. (재고 부족으로 일시 중단)',
      content_type: 'ppl',
      target_platform: 'instagram',
      target_categories: ['음식', '건강', '비건'],
      min_subscribers: 10000,
      max_subscribers: null,
      budget_min: 300000,
      budget_max: 900000,
      campaign_start: dateStr(-15),
      campaign_end: dateStr(15),
      content_deadline: dateStr(10),
      requirements: '• 인스타 릴스 1개\n• 피드 포스팅 2개',
      max_revisions: 1,
      status: 'paused',
    },
    {
      id: CAMP_13,
      brand_id: B_16,
      title: '겨울 패딩 얼리버드 캠페인',
      description: '스타일하우스 겨울 패딩 사전 예약 프로모션입니다. (시즌 조정으로 일시 중단)',
      content_type: 'branded',
      target_platform: 'multi',
      target_categories: ['패션', '스타일'],
      min_subscribers: 30000,
      max_subscribers: null,
      budget_min: 800000,
      budget_max: 2500000,
      campaign_start: dateStr(-20),
      campaign_end: dateStr(10),
      content_deadline: dateStr(5),
      requirements: '• 다양한 컬러/사이즈 소개\n• 할인 코드 안내',
      max_revisions: 2,
      status: 'paused',
    },
    // === Draft (1) ===
    {
      id: CAMP_14,
      brand_id: B_14,
      title: '스마트워치 신제품 런칭',
      description: '테크기어 스마트워치 TG-Watch 2 출시 예정. 캠페인 기획 중입니다.',
      content_type: 'unboxing',
      target_platform: 'youtube',
      target_categories: ['테크', 'IT', '웨어러블'],
      min_subscribers: 30000,
      max_subscribers: 500000,
      budget_min: 700000,
      budget_max: 2000000,
      campaign_start: dateStr(30),
      campaign_end: dateStr(60),
      content_deadline: dateStr(55),
      requirements: '• 기획 단계 - 상세 요구사항 추후 확정',
      max_revisions: 2,
      status: 'draft',
    },
    // === Cancelled (1) ===
    {
      id: CAMP_15,
      brand_id: B_USER2,
      title: 'CRM 솔루션 도입 사례 영상',
      description: '마케팅프로 CRM 도입 사례를 소개하는 영상 캠페인입니다. (예산 조정으로 취소)',
      content_type: 'branded',
      target_platform: 'youtube',
      target_categories: ['IT', '비즈니스'],
      min_subscribers: 50000,
      max_subscribers: null,
      budget_min: 1500000,
      budget_max: 5000000,
      campaign_start: dateStr(-30),
      campaign_end: dateStr(-5),
      content_deadline: dateStr(-10),
      requirements: '• 실제 기업 인터뷰 포함',
      max_revisions: 2,
      status: 'cancelled',
    },
  ];

  const { error } = await supabase.from('campaigns').upsert(campaigns, { onConflict: 'id' });
  if (error) throw new Error(`캠페인 생성 실패: ${error.message}`);
  console.log(`  ✅ ${campaigns.length}개 캠페인 생성 완료`);
  console.log(`     active: 8 | completed: 3 | paused: 2 | draft: 1 | cancelled: 1`);
}

// ============================================
// Step 6: Matches
// ============================================

async function createMatches(_u: UserIds) {
  console.log('\n📌 Step 6: 매칭 생성...');

  const matches = [
    // pending (4)
    { id: MATCH_IDS[0], campaign_id: CAMP_1, creator_id: C_USER1, match_score: 92.5, match_reasons: ['카테고리 일치', '구독자 수 적합', '높은 참여율'], direction: 'campaign_to_creator', status: 'pending', created_at: daysAgo(2) },
    { id: MATCH_IDS[1], campaign_id: CAMP_2, creator_id: C_USER3, match_score: 88.0, match_reasons: ['테크 전문 크리에이터', 'IT 카테고리 매칭'], direction: 'campaign_to_creator', status: 'pending', created_at: daysAgo(1) },
    { id: MATCH_IDS[2], campaign_id: CAMP_3, creator_id: C_5, match_score: 95.0, match_reasons: ['푸드 전문', '높은 참여율', '대형 채널'], direction: 'campaign_to_creator', status: 'pending', created_at: daysAgo(1) },
    { id: MATCH_IDS[3], campaign_id: CAMP_6, creator_id: C_11, match_score: 91.0, match_reasons: ['뷰티 전문', '인스타 활동', '높은 참여율'], direction: 'campaign_to_creator', status: 'pending', created_at: daysAgo(0) },

    // viewed (3)
    { id: MATCH_IDS[4], campaign_id: CAMP_4, creator_id: C_7, match_score: 96.0, match_reasons: ['패션 전문', '틱톡 대형 채널', '최고 참여율'], direction: 'campaign_to_creator', status: 'viewed', created_at: daysAgo(5) },
    { id: MATCH_IDS[5], campaign_id: CAMP_5, creator_id: C_10, match_score: 85.0, match_reasons: ['IT 전문', '유튜브 채널'], direction: 'brand_direct_offer', status: 'viewed', created_at: daysAgo(4) },
    { id: MATCH_IDS[6], campaign_id: CAMP_7, creator_id: C_12, match_score: 93.5, match_reasons: ['피트니스 전문', '건강 카테고리 매칭'], direction: 'campaign_to_creator', status: 'viewed', created_at: daysAgo(3) },

    // accepted (5)
    { id: MATCH_IDS[7], campaign_id: CAMP_1, creator_id: C_11, match_score: 89.0, match_reasons: ['뷰티 전문', '인스타 대형 채널'], direction: 'creator_apply', status: 'accepted', created_at: daysAgo(8) },
    { id: MATCH_IDS[8], campaign_id: CAMP_9, creator_id: C_USER1, match_score: 94.0, match_reasons: ['뷰티 전문', '높은 신뢰도'], direction: 'campaign_to_creator', status: 'accepted', created_at: daysAgo(55) },
    { id: MATCH_IDS[9], campaign_id: CAMP_10, creator_id: C_10, match_score: 90.0, match_reasons: ['IT 전문', '리뷰 경험 풍부'], direction: 'brand_direct_offer', status: 'accepted', created_at: daysAgo(40) },
    { id: MATCH_IDS[10], campaign_id: CAMP_3, creator_id: C_6, match_score: 78.0, match_reasons: ['맛집 카테고리 일부 매칭', '인스타 활동'], direction: 'creator_apply', status: 'accepted', created_at: daysAgo(2) },
    { id: MATCH_IDS[11], campaign_id: CAMP_8, creator_id: C_9, match_score: 87.0, match_reasons: ['라이프스타일 블로거', '네이버 블로그 활동'], direction: 'campaign_to_creator', status: 'accepted', created_at: daysAgo(4) },

    // rejected (2)
    { id: MATCH_IDS[12], campaign_id: CAMP_4, creator_id: C_USER1, match_score: 55.0, match_reasons: ['카테고리 불일치'], direction: 'creator_apply', status: 'rejected', created_at: daysAgo(6) },
    { id: MATCH_IDS[13], campaign_id: CAMP_5, creator_id: C_8, match_score: 62.0, match_reasons: ['플랫폼 매칭', '카테고리 부분 매칭'], direction: 'creator_apply', status: 'rejected', created_at: daysAgo(3) },

    // negotiating (3)
    { id: MATCH_IDS[14], campaign_id: CAMP_2, creator_id: C_10, match_score: 91.0, match_reasons: ['IT 전문', '구독자 수 적합'], direction: 'brand_direct_offer', status: 'negotiating', created_at: daysAgo(4) },
    { id: MATCH_IDS[15], campaign_id: CAMP_6, creator_id: C_USER1, match_score: 88.5, match_reasons: ['뷰티 전문', '숏폼 제작 경험'], direction: 'creator_apply', status: 'negotiating', created_at: daysAgo(1) },
    { id: MATCH_IDS[16], campaign_id: CAMP_7, creator_id: C_5, match_score: 72.0, match_reasons: ['건강 카테고리 일부 매칭'], direction: 'creator_apply', status: 'negotiating', created_at: daysAgo(2) },

    // contracted (3)
    { id: MATCH_IDS[17], campaign_id: CAMP_9, creator_id: C_11, match_score: 90.0, match_reasons: ['뷰티 전문', '높은 참여율'], direction: 'campaign_to_creator', status: 'contracted', created_at: daysAgo(50) },
    { id: MATCH_IDS[18], campaign_id: CAMP_10, creator_id: C_USER3, match_score: 86.0, match_reasons: ['테크 리뷰 전문'], direction: 'campaign_to_creator', status: 'contracted', created_at: daysAgo(38) },
    { id: MATCH_IDS[19], campaign_id: CAMP_11, creator_id: C_10, match_score: 92.0, match_reasons: ['IT 전문', '비즈니스 콘텐츠 경험'], direction: 'brand_direct_offer', status: 'contracted', created_at: daysAgo(45) },
  ];

  const { error } = await supabase.from('matches').upsert(matches, { onConflict: 'id' });
  if (error) throw new Error(`매칭 생성 실패: ${error.message}`);
  console.log(`  ✅ ${matches.length}개 매칭 생성 완료`);
  console.log(`     pending: 4 | viewed: 3 | accepted: 5 | rejected: 2 | negotiating: 3 | contracted: 3`);
}

// ============================================
// Step 7: Notifications
// ============================================

async function createNotifications(u: UserIds) {
  console.log('\n📌 Step 7: 알림 생성...');

  const notifications = [
    // user1 (김수진 - creator) 알림
    {
      id: NOTIF_IDS[0],
      user_id: u.user1,
      type: 'match_received',
      title: '새로운 매칭 요청',
      body: '클린뷰티코리아의 "봄 신상 쿠션 파운데이션 리뷰" 캠페인에 매칭되었습니다.',
      data: { campaign_id: CAMP_1, match_id: MATCH_IDS[0] },
      is_read: false,
      created_at: daysAgo(2),
    },
    {
      id: NOTIF_IDS[1],
      user_id: u.user1,
      type: 'match_accepted',
      title: '매칭 수락됨',
      body: '겨울 보습 크림 체험단 캠페인 매칭이 수락되었습니다.',
      data: { campaign_id: CAMP_9, match_id: MATCH_IDS[8] },
      is_read: true,
      created_at: daysAgo(5),
    },
    {
      id: NOTIF_IDS[2],
      user_id: u.user1,
      type: 'match_rejected',
      title: '매칭 거절됨',
      body: '여름 신상 룩북 촬영 캠페인 매칭이 거절되었습니다.',
      data: { campaign_id: CAMP_4, match_id: MATCH_IDS[12] },
      is_read: false,
      created_at: daysAgo(6),
    },
    {
      id: NOTIF_IDS[3],
      user_id: u.user1,
      type: 'message_received',
      title: '새 메시지',
      body: '클린뷰티코리아에서 메시지를 보냈습니다.',
      data: { sender_name: '클린뷰티코리아' },
      is_read: false,
      created_at: daysAgo(1),
    },
    {
      id: NOTIF_IDS[4],
      user_id: u.user1,
      type: 'system',
      title: '프로필 업데이트 알림',
      body: '프로필 정보를 최신 상태로 유지해주세요. 최근 30일 내 업데이트가 없습니다.',
      data: null,
      is_read: false,
      created_at: daysAgo(0),
    },
    {
      id: NOTIF_IDS[5],
      user_id: u.user1,
      type: 'contract_created',
      title: '계약서 생성',
      body: '겨울 보습 크림 체험단 캠페인의 계약서가 생성되었습니다. 확인해주세요.',
      data: { campaign_id: CAMP_9 },
      is_read: true,
      created_at: daysAgo(4),
    },
    {
      id: NOTIF_IDS[6],
      user_id: u.user1,
      type: 'match_received',
      title: '새로운 매칭 요청',
      body: '립틴트 신제품 숏츠 챌린지 캠페인에서 협업을 제안합니다.',
      data: { campaign_id: CAMP_6, match_id: MATCH_IDS[15] },
      is_read: false,
      created_at: daysAgo(1),
    },

    // user2 (이마케팅 - brand) 알림
    {
      id: NOTIF_IDS[7],
      user_id: u.user2,
      type: 'match_received',
      title: '크리에이터 지원',
      body: '윤재호님이 "마케팅 자동화 툴 소개 영상" 캠페인에 지원했습니다.',
      data: { campaign_id: CAMP_5, match_id: MATCH_IDS[5] },
      is_read: false,
      created_at: daysAgo(4),
    },
    {
      id: NOTIF_IDS[8],
      user_id: u.user2,
      type: 'match_accepted',
      title: '매칭 수락 완료',
      body: '소셜미디어 관리 툴 리뷰 캠페인에서 윤재호님과 매칭이 성사되었습니다.',
      data: { campaign_id: CAMP_11, match_id: MATCH_IDS[19] },
      is_read: true,
      created_at: daysAgo(7),
    },
    {
      id: NOTIF_IDS[9],
      user_id: u.user2,
      type: 'campaign_status_changed',
      title: '캠페인 상태 변경',
      body: 'CRM 솔루션 도입 사례 영상 캠페인이 취소되었습니다.',
      data: { campaign_id: CAMP_15, new_status: 'cancelled' },
      is_read: true,
      created_at: daysAgo(5),
    },
    {
      id: NOTIF_IDS[10],
      user_id: u.user2,
      type: 'message_received',
      title: '새 메시지',
      body: '윤재호님에게서 메시지가 도착했습니다.',
      data: { sender_name: '윤재호' },
      is_read: false,
      created_at: daysAgo(1),
    },
    {
      id: NOTIF_IDS[11],
      user_id: u.user2,
      type: 'system',
      title: '캠페인 성과 리포트',
      body: '최근 완료된 캠페인의 성과 리포트가 준비되었습니다.',
      data: null,
      is_read: false,
      created_at: daysAgo(0),
    },
    {
      id: NOTIF_IDS[12],
      user_id: u.user2,
      type: 'match_rejected',
      title: '지원 거절됨',
      body: '오민준님의 마케팅 자동화 툴 소개 영상 캠페인 지원이 거절되었습니다.',
      data: { campaign_id: CAMP_5, match_id: MATCH_IDS[13] },
      is_read: false,
      created_at: daysAgo(3),
    },
    {
      id: NOTIF_IDS[13],
      user_id: u.user2,
      type: 'contract_created',
      title: '계약서 생성',
      body: '소셜미디어 관리 툴 리뷰 캠페인 계약서가 생성되었습니다.',
      data: { campaign_id: CAMP_11 },
      is_read: true,
      created_at: daysAgo(6),
    },
    {
      id: NOTIF_IDS[14],
      user_id: u.user2,
      type: 'system',
      title: '결제 수단 확인',
      body: '등록된 결제 수단의 유효기간이 곧 만료됩니다. 결제 정보를 업데이트해주세요.',
      data: null,
      is_read: false,
      created_at: daysAgo(0),
    },
  ];

  const { error } = await supabase.from('notifications').upsert(notifications, { onConflict: 'id' });
  if (error) throw new Error(`알림 생성 실패: ${error.message}`);

  const unread = notifications.filter((n) => !n.is_read).length;
  console.log(`  ✅ ${notifications.length}개 알림 생성 완료 (읽지 않음: ${unread}개)`);
}

// ============================================
// Main
// ============================================

async function main() {
  console.log('🌱 인플링 시드 데이터 생성 시작...');
  console.log(`   Supabase URL: ${supabaseUrl}`);
  console.log('');

  try {
    // Step 1: Create auth users (get real UUIDs from Supabase)
    const userIds = await createAuthUsers();

    // Step 2: Create profiles
    await createProfiles(userIds);

    // Step 3: Create creators
    await createCreators(userIds);

    // Step 4: Create brands
    await createBrands(userIds);

    // Step 5: Create campaigns
    await createCampaigns(userIds);

    // Step 6: Create matches
    await createMatches(userIds);

    // Step 7: Create notifications
    await createNotifications(userIds);

    console.log('\n' + '='.repeat(50));
    console.log('✅ 시드 데이터 생성 완료!');
    console.log('='.repeat(50));
    console.log('\n📋 생성된 데이터 요약:');
    console.log('   • Auth 유저: 16명');
    console.log('   • 프로필: 16개');
    console.log('   • 크리에이터: 10명');
    console.log('   • 브랜드(광고주): 5개');
    console.log('   • 캠페인: 15개');
    console.log('   • 매칭: 20개');
    console.log('   • 알림: 15개');
    console.log('\n🔐 로그인 계정:');
    console.log('   • admin@admin.com / admin123! (관리자)');
    console.log('   • user1@demo.com / demo123! (크리에이터 - 김수진)');
    console.log('   • user2@demo.com / demo123! (광고주 - 이마케팅)');
    console.log('   • user3@demo.com / demo123! (크리에이터 - 박지우)');
  } catch (err) {
    console.error('\n❌ 시드 실패:', err);
    process.exit(1);
  }
}

main();
