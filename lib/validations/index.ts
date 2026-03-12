import { z } from 'zod';

export const signupSchema = z.object({
  email: z.string().email('유효한 이메일을 입력하세요'),
  password: z.string().min(6, '비밀번호는 6자 이상이어야 합니다'),
  displayName: z.string().min(1, '이름을 입력하세요'),
  role: z.enum(['creator', 'brand'], { message: '역할을 선택하세요' }),
});

export const loginSchema = z.object({
  email: z.string().email('유효한 이메일을 입력하세요'),
  password: z.string().min(1, '비밀번호를 입력하세요'),
});

export const creatorOnboardingSchema = z.object({
  channelName: z.string().min(1, '채널명을 입력하세요'),
  channelUrl: z.string().url('유효한 URL을 입력하세요'),
  platform: z.enum(['youtube', 'instagram', 'tiktok', 'naver_blog']),
});

export const creatorProfileSchema = z.object({
  isAvailable: z.boolean().optional(),
  minPrice: z.number().min(0).nullable().optional(),
  maxPrice: z.number().min(0).nullable().optional(),
  preferredCategories: z.array(z.string()).optional(),
  blockedCategories: z.array(z.string()).optional(),
  maxMonthlyDeals: z.number().min(1).max(20).optional(),
  maxRevisions: z.number().min(0).max(10).optional(),
  thumbnailAutonomy: z.boolean().optional(),
  titleAutonomy: z.boolean().optional(),
});

export const brandOnboardingSchema = z.object({
  companyName: z.string().min(1, '회사명을 입력하세요'),
  businessCategory: z.string().min(1, '업종을 선택하세요'),
  contactName: z.string().min(1, '담당자명을 입력하세요'),
  contactEmail: z.string().email('유효한 이메일을 입력하세요'),
  contactPhone: z.string().optional(),
  websiteUrl: z.string().url('유효한 URL을 입력하세요').optional().or(z.literal('')),
});

export const campaignSchema = z.object({
  title: z.string().min(1, '캠페인 제목을 입력하세요'),
  description: z.string().min(10, '캠페인 설명을 10자 이상 입력하세요'),
  contentType: z.enum(['branded', 'ppl', 'review', 'unboxing', 'shorts', 'other']),
  targetPlatform: z.enum(['youtube', 'instagram', 'tiktok', 'naver_blog', 'multi']),
  targetCategories: z.array(z.string()).optional(),
  minSubscribers: z.number().nullable().optional(),
  maxSubscribers: z.number().nullable().optional(),
  budgetMin: z.number().min(10000, '최소 예산은 1만원 이상입니다'),
  budgetMax: z.number().min(10000, '최대 예산은 1만원 이상입니다'),
  campaignStart: z.string().nullable().optional(),
  campaignEnd: z.string().nullable().optional(),
  contentDeadline: z.string().nullable().optional(),
  requirements: z.string().optional(),
});

export const matchCreateSchema = z.object({
  campaignId: z.string().uuid(),
  creatorId: z.string().uuid(),
  direction: z.enum(['campaign_to_creator', 'creator_apply', 'creator_reverse_pitch', 'brand_direct_offer']),
  reversePitchMessage: z.string().optional(),
});

export const matchUpdateSchema = z.object({
  status: z.enum(['pending', 'viewed', 'accepted', 'rejected', 'negotiating', 'contracted']),
});

export type SignupInput = z.infer<typeof signupSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type CreatorOnboardingInput = z.infer<typeof creatorOnboardingSchema>;
export type CreatorProfileInput = z.infer<typeof creatorProfileSchema>;
export type BrandOnboardingInput = z.infer<typeof brandOnboardingSchema>;
export type CampaignInput = z.infer<typeof campaignSchema>;
export type MatchCreateInput = z.infer<typeof matchCreateSchema>;
export type MatchUpdateInput = z.infer<typeof matchUpdateSchema>;
