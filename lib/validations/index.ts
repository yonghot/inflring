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
export const contractCreateSchema = z.object({
  matchId: z.string().uuid('유효한 매칭 ID를 입력하세요'),
  amount: z.number().min(10000, '금액은 1만원 이상이어야 합니다'),
  contentRequirements: z.string().min(1, '콘텐츠 요구사항을 입력하세요'),
  deliveryDeadline: z.string().min(1, '납품 기한을 입력하세요'),
  maxRevisions: z.number().min(0).max(10, '수정 횟수는 0~10회입니다').default(3),
});

export const contractUpdateSchema = z.object({
  status: z.enum([
    'draft', 'pending_sign', 'active', 'content_submitted',
    'under_review', 'revision_requested', 'approved',
    'completed', 'disputed', 'cancelled',
  ]),
});

export const messageCreateSchema = z.object({
  roomId: z.string().uuid('유효한 채팅방 ID를 입력하세요'),
  content: z.string().min(1, '메시지를 입력하세요'),
  messageType: z.enum(['text', 'image', 'file', 'system']).default('text'),
});

export const reviewCreateSchema = z.object({
  contractId: z.string().uuid('유효한 계약 ID를 입력하세요'),
  rating: z.number().min(1, '평점은 1~5점입니다').max(5, '평점은 1~5점입니다'),
  communicationScore: z.number().min(1).max(5).optional(),
  qualityScore: z.number().min(1).max(5).optional(),
  timelinessScore: z.number().min(1).max(5).optional(),
  comment: z.string().optional(),
});

export const fileUploadSchema = z.object({
  fileName: z.string().min(1, '파일명을 입력하세요'),
  fileType: z.string().min(1, '파일 타입을 입력하세요'),
  fileSize: z.number().min(1, '파일 크기가 유효하지 않습니다'),
  context: z.enum(['message', 'contract', 'portfolio', 'profile']),
  contextId: z.string().uuid().optional(),
});

export type MatchCreateInput = z.infer<typeof matchCreateSchema>;
export type MatchUpdateInput = z.infer<typeof matchUpdateSchema>;
export type ContractCreateInput = z.infer<typeof contractCreateSchema>;
export type ContractUpdateInput = z.infer<typeof contractUpdateSchema>;
export type MessageCreateInput = z.infer<typeof messageCreateSchema>;
export type ReviewCreateInput = z.infer<typeof reviewCreateSchema>;
export type FileUploadInput = z.infer<typeof fileUploadSchema>;
