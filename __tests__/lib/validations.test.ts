import { describe, it, expect } from 'vitest';
import {
  signupSchema,
  loginSchema,
  creatorOnboardingSchema,
  brandOnboardingSchema,
  campaignSchema,
  matchCreateSchema,
  matchUpdateSchema,
  creatorProfileSchema,
} from '@/lib/validations';

// ---------------------------------------------------------------------------
// signupSchema
// ---------------------------------------------------------------------------
describe('signupSchema', () => {
  const validData = {
    email: 'user@example.com',
    password: 'secret123',
    displayName: 'Test User',
    role: 'creator' as const,
  };

  it('accepts valid creator signup data', () => {
    const result = signupSchema.safeParse(validData);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data).toEqual(validData);
    }
  });

  it('accepts valid brand signup data', () => {
    const result = signupSchema.safeParse({ ...validData, role: 'brand' });
    expect(result.success).toBe(true);
  });

  // email validation
  it('rejects missing email', () => {
    const result = signupSchema.safeParse({ ...validData, email: undefined });
    expect(result.success).toBe(false);
  });

  it('rejects empty email', () => {
    const result = signupSchema.safeParse({ ...validData, email: '' });
    expect(result.success).toBe(false);
  });

  it('rejects invalid email format', () => {
    const result = signupSchema.safeParse({ ...validData, email: 'not-an-email' });
    expect(result.success).toBe(false);
  });

  it('rejects email without domain', () => {
    const result = signupSchema.safeParse({ ...validData, email: 'user@' });
    expect(result.success).toBe(false);
  });

  // password validation
  it('rejects password shorter than 6 characters', () => {
    const result = signupSchema.safeParse({ ...validData, password: '12345' });
    expect(result.success).toBe(false);
  });

  it('accepts password with exactly 6 characters', () => {
    const result = signupSchema.safeParse({ ...validData, password: '123456' });
    expect(result.success).toBe(true);
  });

  it('rejects empty password', () => {
    const result = signupSchema.safeParse({ ...validData, password: '' });
    expect(result.success).toBe(false);
  });

  // displayName validation
  it('rejects empty displayName', () => {
    const result = signupSchema.safeParse({ ...validData, displayName: '' });
    expect(result.success).toBe(false);
  });

  it('accepts single character displayName', () => {
    const result = signupSchema.safeParse({ ...validData, displayName: 'A' });
    expect(result.success).toBe(true);
  });

  // role validation
  it('rejects invalid role value', () => {
    const result = signupSchema.safeParse({ ...validData, role: 'admin' });
    expect(result.success).toBe(false);
  });

  it('rejects missing role', () => {
    const { role, ...noRole } = validData;
    const result = signupSchema.safeParse(noRole);
    expect(result.success).toBe(false);
  });

  it('rejects empty object', () => {
    const result = signupSchema.safeParse({});
    expect(result.success).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// loginSchema
// ---------------------------------------------------------------------------
describe('loginSchema', () => {
  const validData = {
    email: 'user@example.com',
    password: 'anypassword',
  };

  it('accepts valid login data', () => {
    const result = loginSchema.safeParse(validData);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data).toEqual(validData);
    }
  });

  it('rejects invalid email', () => {
    const result = loginSchema.safeParse({ ...validData, email: 'bad' });
    expect(result.success).toBe(false);
  });

  it('rejects empty password', () => {
    const result = loginSchema.safeParse({ ...validData, password: '' });
    expect(result.success).toBe(false);
  });

  it('accepts single character password (min 1)', () => {
    const result = loginSchema.safeParse({ ...validData, password: 'x' });
    expect(result.success).toBe(true);
  });

  it('rejects missing email field', () => {
    const result = loginSchema.safeParse({ password: 'test' });
    expect(result.success).toBe(false);
  });

  it('rejects missing password field', () => {
    const result = loginSchema.safeParse({ email: 'user@example.com' });
    expect(result.success).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// creatorOnboardingSchema
// ---------------------------------------------------------------------------
describe('creatorOnboardingSchema', () => {
  const validData = {
    channelName: 'My Channel',
    channelUrl: 'https://youtube.com/@mychannel',
    platform: 'youtube' as const,
  };

  it('accepts valid creator onboarding data', () => {
    const result = creatorOnboardingSchema.safeParse(validData);
    expect(result.success).toBe(true);
  });

  it('accepts all valid platform values', () => {
    const platforms = ['youtube', 'instagram', 'tiktok', 'naver_blog'] as const;
    for (const platform of platforms) {
      const result = creatorOnboardingSchema.safeParse({ ...validData, platform });
      expect(result.success).toBe(true);
    }
  });

  it('rejects invalid platform', () => {
    const result = creatorOnboardingSchema.safeParse({ ...validData, platform: 'twitter' });
    expect(result.success).toBe(false);
  });

  it('rejects empty channelName', () => {
    const result = creatorOnboardingSchema.safeParse({ ...validData, channelName: '' });
    expect(result.success).toBe(false);
  });

  it('rejects invalid channelUrl', () => {
    const result = creatorOnboardingSchema.safeParse({ ...validData, channelUrl: 'not-a-url' });
    expect(result.success).toBe(false);
  });

  it('rejects missing channelUrl', () => {
    const { channelUrl, ...rest } = validData;
    const result = creatorOnboardingSchema.safeParse(rest);
    expect(result.success).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// brandOnboardingSchema
// ---------------------------------------------------------------------------
describe('brandOnboardingSchema', () => {
  const validData = {
    companyName: 'Acme Corp',
    businessCategory: 'IT/소프트웨어',
    contactName: 'Kim',
    contactEmail: 'contact@acme.com',
  };

  it('accepts valid brand onboarding data with required fields only', () => {
    const result = brandOnboardingSchema.safeParse(validData);
    expect(result.success).toBe(true);
  });

  it('accepts data with optional contactPhone', () => {
    const result = brandOnboardingSchema.safeParse({
      ...validData,
      contactPhone: '010-1234-5678',
    });
    expect(result.success).toBe(true);
  });

  it('accepts data with valid websiteUrl', () => {
    const result = brandOnboardingSchema.safeParse({
      ...validData,
      websiteUrl: 'https://acme.com',
    });
    expect(result.success).toBe(true);
  });

  it('accepts empty string for websiteUrl', () => {
    const result = brandOnboardingSchema.safeParse({
      ...validData,
      websiteUrl: '',
    });
    expect(result.success).toBe(true);
  });

  it('rejects invalid websiteUrl', () => {
    const result = brandOnboardingSchema.safeParse({
      ...validData,
      websiteUrl: 'not-a-url',
    });
    expect(result.success).toBe(false);
  });

  it('rejects empty companyName', () => {
    const result = brandOnboardingSchema.safeParse({ ...validData, companyName: '' });
    expect(result.success).toBe(false);
  });

  it('rejects empty businessCategory', () => {
    const result = brandOnboardingSchema.safeParse({ ...validData, businessCategory: '' });
    expect(result.success).toBe(false);
  });

  it('rejects empty contactName', () => {
    const result = brandOnboardingSchema.safeParse({ ...validData, contactName: '' });
    expect(result.success).toBe(false);
  });

  it('rejects invalid contactEmail', () => {
    const result = brandOnboardingSchema.safeParse({ ...validData, contactEmail: 'bad' });
    expect(result.success).toBe(false);
  });

  it('rejects missing contactEmail', () => {
    const { contactEmail, ...rest } = validData;
    const result = brandOnboardingSchema.safeParse(rest);
    expect(result.success).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// campaignSchema
// ---------------------------------------------------------------------------
describe('campaignSchema', () => {
  const validData = {
    title: 'Summer Campaign',
    description: 'A detailed description of the campaign for testing.',
    contentType: 'branded' as const,
    targetPlatform: 'youtube' as const,
    budgetMin: 100000,
    budgetMax: 500000,
  };

  it('accepts valid campaign data with required fields', () => {
    const result = campaignSchema.safeParse(validData);
    expect(result.success).toBe(true);
  });

  it('accepts all valid contentType values', () => {
    const types = ['branded', 'ppl', 'review', 'unboxing', 'shorts', 'other'] as const;
    for (const contentType of types) {
      const result = campaignSchema.safeParse({ ...validData, contentType });
      expect(result.success).toBe(true);
    }
  });

  it('accepts all valid targetPlatform values including multi', () => {
    const platforms = ['youtube', 'instagram', 'tiktok', 'naver_blog', 'multi'] as const;
    for (const targetPlatform of platforms) {
      const result = campaignSchema.safeParse({ ...validData, targetPlatform });
      expect(result.success).toBe(true);
    }
  });

  it('rejects empty title', () => {
    const result = campaignSchema.safeParse({ ...validData, title: '' });
    expect(result.success).toBe(false);
  });

  it('rejects description shorter than 10 characters', () => {
    const result = campaignSchema.safeParse({ ...validData, description: 'short' });
    expect(result.success).toBe(false);
  });

  it('accepts description with exactly 10 characters', () => {
    const result = campaignSchema.safeParse({ ...validData, description: '1234567890' });
    expect(result.success).toBe(true);
  });

  it('rejects budgetMin below 10000', () => {
    const result = campaignSchema.safeParse({ ...validData, budgetMin: 9999 });
    expect(result.success).toBe(false);
  });

  it('accepts budgetMin at exactly 10000', () => {
    const result = campaignSchema.safeParse({ ...validData, budgetMin: 10000 });
    expect(result.success).toBe(true);
  });

  it('rejects budgetMax below 10000', () => {
    const result = campaignSchema.safeParse({ ...validData, budgetMax: 5000 });
    expect(result.success).toBe(false);
  });

  it('accepts budgetMax at exactly 10000', () => {
    const result = campaignSchema.safeParse({ ...validData, budgetMax: 10000 });
    expect(result.success).toBe(true);
  });

  it('rejects invalid contentType', () => {
    const result = campaignSchema.safeParse({ ...validData, contentType: 'podcast' });
    expect(result.success).toBe(false);
  });

  it('rejects invalid targetPlatform', () => {
    const result = campaignSchema.safeParse({ ...validData, targetPlatform: 'twitter' });
    expect(result.success).toBe(false);
  });

  it('accepts optional fields as null or undefined', () => {
    const result = campaignSchema.safeParse({
      ...validData,
      targetCategories: undefined,
      minSubscribers: null,
      maxSubscribers: null,
      campaignStart: null,
      campaignEnd: null,
      contentDeadline: null,
      requirements: undefined,
    });
    expect(result.success).toBe(true);
  });

  it('accepts data with all optional fields populated', () => {
    const result = campaignSchema.safeParse({
      ...validData,
      targetCategories: ['뷰티', '테크'],
      minSubscribers: 1000,
      maxSubscribers: 100000,
      campaignStart: '2026-04-01',
      campaignEnd: '2026-05-01',
      contentDeadline: '2026-04-15',
      requirements: 'Must include product demo.',
    });
    expect(result.success).toBe(true);
  });
});

// ---------------------------------------------------------------------------
// matchCreateSchema
// ---------------------------------------------------------------------------
describe('matchCreateSchema', () => {
  const validUuid = '550e8400-e29b-41d4-a716-446655440000';
  const validData = {
    campaignId: validUuid,
    creatorId: validUuid,
    direction: 'campaign_to_creator' as const,
  };

  it('accepts valid match create data', () => {
    const result = matchCreateSchema.safeParse(validData);
    expect(result.success).toBe(true);
  });

  it('accepts all valid direction values', () => {
    const directions = [
      'campaign_to_creator',
      'creator_apply',
      'creator_reverse_pitch',
      'brand_direct_offer',
    ] as const;
    for (const direction of directions) {
      const result = matchCreateSchema.safeParse({ ...validData, direction });
      expect(result.success).toBe(true);
    }
  });

  it('rejects invalid UUID for campaignId', () => {
    const result = matchCreateSchema.safeParse({ ...validData, campaignId: 'not-a-uuid' });
    expect(result.success).toBe(false);
  });

  it('rejects invalid UUID for creatorId', () => {
    const result = matchCreateSchema.safeParse({ ...validData, creatorId: 'abc123' });
    expect(result.success).toBe(false);
  });

  it('rejects invalid direction', () => {
    const result = matchCreateSchema.safeParse({ ...validData, direction: 'random' });
    expect(result.success).toBe(false);
  });

  it('accepts optional reversePitchMessage', () => {
    const result = matchCreateSchema.safeParse({
      ...validData,
      direction: 'creator_reverse_pitch',
      reversePitchMessage: 'I would love to collaborate!',
    });
    expect(result.success).toBe(true);
  });

  it('accepts without reversePitchMessage', () => {
    const result = matchCreateSchema.safeParse(validData);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.reversePitchMessage).toBeUndefined();
    }
  });
});

// ---------------------------------------------------------------------------
// matchUpdateSchema
// ---------------------------------------------------------------------------
describe('matchUpdateSchema', () => {
  it('accepts all valid status values', () => {
    const statuses = [
      'pending',
      'viewed',
      'accepted',
      'rejected',
      'negotiating',
      'contracted',
    ] as const;
    for (const status of statuses) {
      const result = matchUpdateSchema.safeParse({ status });
      expect(result.success).toBe(true);
    }
  });

  it('rejects invalid status value', () => {
    const result = matchUpdateSchema.safeParse({ status: 'cancelled' });
    expect(result.success).toBe(false);
  });

  it('rejects missing status', () => {
    const result = matchUpdateSchema.safeParse({});
    expect(result.success).toBe(false);
  });

  it('rejects empty string status', () => {
    const result = matchUpdateSchema.safeParse({ status: '' });
    expect(result.success).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// creatorProfileSchema
// ---------------------------------------------------------------------------
describe('creatorProfileSchema', () => {
  it('accepts empty object (all fields optional)', () => {
    const result = creatorProfileSchema.safeParse({});
    expect(result.success).toBe(true);
  });

  it('accepts full valid profile data', () => {
    const result = creatorProfileSchema.safeParse({
      isAvailable: true,
      minPrice: 50000,
      maxPrice: 500000,
      preferredCategories: ['뷰티', '테크'],
      blockedCategories: ['도박'],
      maxMonthlyDeals: 5,
      maxRevisions: 3,
      thumbnailAutonomy: true,
      titleAutonomy: false,
    });
    expect(result.success).toBe(true);
  });

  it('accepts null for nullable price fields', () => {
    const result = creatorProfileSchema.safeParse({
      minPrice: null,
      maxPrice: null,
    });
    expect(result.success).toBe(true);
  });

  it('rejects negative minPrice', () => {
    const result = creatorProfileSchema.safeParse({ minPrice: -1 });
    expect(result.success).toBe(false);
  });

  it('rejects negative maxPrice', () => {
    const result = creatorProfileSchema.safeParse({ maxPrice: -100 });
    expect(result.success).toBe(false);
  });

  it('rejects maxMonthlyDeals below 1', () => {
    const result = creatorProfileSchema.safeParse({ maxMonthlyDeals: 0 });
    expect(result.success).toBe(false);
  });

  it('rejects maxMonthlyDeals above 20', () => {
    const result = creatorProfileSchema.safeParse({ maxMonthlyDeals: 21 });
    expect(result.success).toBe(false);
  });

  it('accepts maxMonthlyDeals boundary values', () => {
    expect(creatorProfileSchema.safeParse({ maxMonthlyDeals: 1 }).success).toBe(true);
    expect(creatorProfileSchema.safeParse({ maxMonthlyDeals: 20 }).success).toBe(true);
  });

  it('rejects maxRevisions below 0', () => {
    const result = creatorProfileSchema.safeParse({ maxRevisions: -1 });
    expect(result.success).toBe(false);
  });

  it('rejects maxRevisions above 10', () => {
    const result = creatorProfileSchema.safeParse({ maxRevisions: 11 });
    expect(result.success).toBe(false);
  });

  it('accepts maxRevisions boundary values', () => {
    expect(creatorProfileSchema.safeParse({ maxRevisions: 0 }).success).toBe(true);
    expect(creatorProfileSchema.safeParse({ maxRevisions: 10 }).success).toBe(true);
  });
});
