import { describe, it, expect } from 'vitest';
import {
  CONTENT_CATEGORIES,
  BLOCKED_CATEGORIES,
  PLATFORMS,
  CONTENT_TYPES,
  AUDIENCE_AGE_RANGES,
  MATCH_STATUS_LABELS,
  CAMPAIGN_STATUS_LABELS,
  BUSINESS_CATEGORIES,
  TRUST_SCORE_CONFIG,
} from '@/lib/constants';

// ---------------------------------------------------------------------------
// CONTENT_CATEGORIES
// ---------------------------------------------------------------------------
describe('CONTENT_CATEGORIES', () => {
  it('is an array with 20 items', () => {
    expect(CONTENT_CATEGORIES).toHaveLength(20);
  });

  it('contains expected categories', () => {
    const expected = ['남성패션', '여성패션', '뷰티', '테크', '게임', '여행', '요리'];
    for (const category of expected) {
      expect(CONTENT_CATEGORIES).toContain(category);
    }
  });

  it('includes Korean fashion and beauty categories', () => {
    expect(CONTENT_CATEGORIES).toContain('향수');
    expect(CONTENT_CATEGORIES).toContain('그루밍');
  });

  it('includes lifestyle categories', () => {
    expect(CONTENT_CATEGORIES).toContain('라이프스타일');
    expect(CONTENT_CATEGORIES).toContain('운동/피트니스');
    expect(CONTENT_CATEGORIES).toContain('인테리어');
  });

  it('has no duplicate entries', () => {
    const unique = new Set(CONTENT_CATEGORIES);
    expect(unique.size).toBe(CONTENT_CATEGORIES.length);
  });

  it('contains only non-empty strings', () => {
    for (const category of CONTENT_CATEGORIES) {
      expect(typeof category).toBe('string');
      expect(category.length).toBeGreaterThan(0);
    }
  });
});

// ---------------------------------------------------------------------------
// BLOCKED_CATEGORIES
// ---------------------------------------------------------------------------
describe('BLOCKED_CATEGORIES', () => {
  it('is an array with 6 items', () => {
    expect(BLOCKED_CATEGORIES).toHaveLength(6);
  });

  it('contains expected blocked categories', () => {
    const expected = ['도박', '성인', '정치', '종교', '담배', '주류'];
    for (const cat of expected) {
      expect(BLOCKED_CATEGORIES).toContain(cat);
    }
  });

  it('has no overlap with CONTENT_CATEGORIES', () => {
    for (const blocked of BLOCKED_CATEGORIES) {
      expect(CONTENT_CATEGORIES).not.toContain(blocked);
    }
  });

  it('has no duplicate entries', () => {
    const unique = new Set(BLOCKED_CATEGORIES);
    expect(unique.size).toBe(BLOCKED_CATEGORIES.length);
  });
});

// ---------------------------------------------------------------------------
// PLATFORMS
// ---------------------------------------------------------------------------
describe('PLATFORMS', () => {
  it('has 4 platforms', () => {
    expect(PLATFORMS).toHaveLength(4);
  });

  it('contains YouTube', () => {
    const youtube = PLATFORMS.find((p) => p.value === 'youtube');
    expect(youtube).toBeDefined();
    expect(youtube!.label).toBe('YouTube');
  });

  it('contains Instagram', () => {
    const instagram = PLATFORMS.find((p) => p.value === 'instagram');
    expect(instagram).toBeDefined();
    expect(instagram!.label).toBe('Instagram');
  });

  it('contains TikTok', () => {
    const tiktok = PLATFORMS.find((p) => p.value === 'tiktok');
    expect(tiktok).toBeDefined();
    expect(tiktok!.label).toBe('TikTok');
  });

  it('contains Naver Blog', () => {
    const naver = PLATFORMS.find((p) => p.value === 'naver_blog');
    expect(naver).toBeDefined();
    expect(naver!.label).toBe('네이버 블로그');
  });

  it('each platform has value and label properties', () => {
    for (const platform of PLATFORMS) {
      expect(platform).toHaveProperty('value');
      expect(platform).toHaveProperty('label');
      expect(typeof platform.value).toBe('string');
      expect(typeof platform.label).toBe('string');
    }
  });

  it('has unique values', () => {
    const values = PLATFORMS.map((p) => p.value);
    const unique = new Set(values);
    expect(unique.size).toBe(PLATFORMS.length);
  });
});

// ---------------------------------------------------------------------------
// CONTENT_TYPES
// ---------------------------------------------------------------------------
describe('CONTENT_TYPES', () => {
  it('has 6 content types', () => {
    expect(CONTENT_TYPES).toHaveLength(6);
  });

  it('includes all expected content type values', () => {
    const values = CONTENT_TYPES.map((ct) => ct.value);
    expect(values).toContain('branded');
    expect(values).toContain('ppl');
    expect(values).toContain('review');
    expect(values).toContain('unboxing');
    expect(values).toContain('shorts');
    expect(values).toContain('other');
  });

  it('has Korean labels for each content type', () => {
    const labels = CONTENT_TYPES.map((ct) => ct.label);
    expect(labels).toContain('브랜디드 콘텐츠');
    expect(labels).toContain('PPL');
    expect(labels).toContain('리뷰');
    expect(labels).toContain('언박싱');
    expect(labels).toContain('쇼츠/릴스');
    expect(labels).toContain('기타');
  });

  it('each item has value and label', () => {
    for (const ct of CONTENT_TYPES) {
      expect(typeof ct.value).toBe('string');
      expect(typeof ct.label).toBe('string');
    }
  });

  it('has unique values', () => {
    const values = CONTENT_TYPES.map((ct) => ct.value);
    const unique = new Set(values);
    expect(unique.size).toBe(CONTENT_TYPES.length);
  });
});

// ---------------------------------------------------------------------------
// AUDIENCE_AGE_RANGES
// ---------------------------------------------------------------------------
describe('AUDIENCE_AGE_RANGES', () => {
  it('has 6 age range options', () => {
    expect(AUDIENCE_AGE_RANGES).toHaveLength(6);
  });

  it('starts with the youngest range', () => {
    expect(AUDIENCE_AGE_RANGES[0]).toBe('13-17');
  });

  it('ends with the oldest range', () => {
    expect(AUDIENCE_AGE_RANGES[AUDIENCE_AGE_RANGES.length - 1]).toBe('55+');
  });

  it('contains all expected ranges', () => {
    const expected = ['13-17', '18-24', '25-34', '35-44', '45-54', '55+'];
    expect([...AUDIENCE_AGE_RANGES]).toEqual(expected);
  });
});

// ---------------------------------------------------------------------------
// MATCH_STATUS_LABELS
// ---------------------------------------------------------------------------
describe('MATCH_STATUS_LABELS', () => {
  it('has all 6 match statuses', () => {
    const keys = Object.keys(MATCH_STATUS_LABELS);
    expect(keys).toHaveLength(6);
  });

  it('maps statuses to Korean labels', () => {
    expect(MATCH_STATUS_LABELS.pending).toBe('대기 중');
    expect(MATCH_STATUS_LABELS.viewed).toBe('확인됨');
    expect(MATCH_STATUS_LABELS.accepted).toBe('수락됨');
    expect(MATCH_STATUS_LABELS.rejected).toBe('거절됨');
    expect(MATCH_STATUS_LABELS.negotiating).toBe('협상 중');
    expect(MATCH_STATUS_LABELS.contracted).toBe('계약됨');
  });

  it('has string values for all keys', () => {
    for (const value of Object.values(MATCH_STATUS_LABELS)) {
      expect(typeof value).toBe('string');
      expect(value.length).toBeGreaterThan(0);
    }
  });
});

// ---------------------------------------------------------------------------
// CAMPAIGN_STATUS_LABELS
// ---------------------------------------------------------------------------
describe('CAMPAIGN_STATUS_LABELS', () => {
  it('has all 5 campaign statuses', () => {
    const keys = Object.keys(CAMPAIGN_STATUS_LABELS);
    expect(keys).toHaveLength(5);
  });

  it('maps statuses to Korean labels', () => {
    expect(CAMPAIGN_STATUS_LABELS.draft).toBe('초안');
    expect(CAMPAIGN_STATUS_LABELS.active).toBe('진행 중');
    expect(CAMPAIGN_STATUS_LABELS.paused).toBe('일시중지');
    expect(CAMPAIGN_STATUS_LABELS.completed).toBe('완료');
    expect(CAMPAIGN_STATUS_LABELS.cancelled).toBe('취소됨');
  });

  it('has string values for all keys', () => {
    for (const value of Object.values(CAMPAIGN_STATUS_LABELS)) {
      expect(typeof value).toBe('string');
      expect(value.length).toBeGreaterThan(0);
    }
  });
});

// ---------------------------------------------------------------------------
// BUSINESS_CATEGORIES
// ---------------------------------------------------------------------------
describe('BUSINESS_CATEGORIES', () => {
  it('has 20 business categories', () => {
    expect(BUSINESS_CATEGORIES).toHaveLength(20);
  });

  it('contains expected categories', () => {
    const expected = [
      'IT/소프트웨어',
      '패션/의류',
      '뷰티/화장품',
      '식품/음료',
      '게임',
      '기타',
    ];
    for (const cat of expected) {
      expect(BUSINESS_CATEGORIES).toContain(cat);
    }
  });

  it('has no duplicate entries', () => {
    const unique = new Set(BUSINESS_CATEGORIES);
    expect(unique.size).toBe(BUSINESS_CATEGORIES.length);
  });

  it('contains only non-empty strings', () => {
    for (const cat of BUSINESS_CATEGORIES) {
      expect(typeof cat).toBe('string');
      expect(cat.length).toBeGreaterThan(0);
    }
  });

  it('ends with "기타" (other)', () => {
    expect(BUSINESS_CATEGORIES[BUSINESS_CATEGORIES.length - 1]).toBe('기타');
  });
});

// ---------------------------------------------------------------------------
// TRUST_SCORE_CONFIG
// ---------------------------------------------------------------------------
describe('TRUST_SCORE_CONFIG', () => {
  it('has the correct initial trust score', () => {
    expect(TRUST_SCORE_CONFIG.initial).toBe(36.5);
  });

  it('has the correct warning threshold', () => {
    expect(TRUST_SCORE_CONFIG.warning).toBe(33.0);
  });

  it('has the correct restricted threshold', () => {
    expect(TRUST_SCORE_CONFIG.restricted).toBe(30.0);
  });

  it('has exactly 3 configuration keys', () => {
    expect(Object.keys(TRUST_SCORE_CONFIG)).toHaveLength(3);
  });

  it('maintains hierarchy: initial > warning > restricted', () => {
    expect(TRUST_SCORE_CONFIG.initial).toBeGreaterThan(TRUST_SCORE_CONFIG.warning);
    expect(TRUST_SCORE_CONFIG.warning).toBeGreaterThan(TRUST_SCORE_CONFIG.restricted);
  });

  it('all values are positive numbers', () => {
    expect(TRUST_SCORE_CONFIG.initial).toBeGreaterThan(0);
    expect(TRUST_SCORE_CONFIG.warning).toBeGreaterThan(0);
    expect(TRUST_SCORE_CONFIG.restricted).toBeGreaterThan(0);
  });

  it('values are numeric type', () => {
    expect(typeof TRUST_SCORE_CONFIG.initial).toBe('number');
    expect(typeof TRUST_SCORE_CONFIG.warning).toBe('number');
    expect(typeof TRUST_SCORE_CONFIG.restricted).toBe('number');
  });
});
