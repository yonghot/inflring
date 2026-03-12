export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  meta?: {
    total?: number;
    page?: number;
    limit?: number;
  };
}

export type UserRole = 'creator' | 'brand' | 'admin';

export type Platform = 'youtube' | 'instagram' | 'tiktok' | 'naver_blog';

export type ContentType = 'branded' | 'ppl' | 'review' | 'unboxing' | 'shorts' | 'other';

export type CampaignStatus = 'draft' | 'active' | 'paused' | 'completed' | 'cancelled';

export type MatchDirection = 'campaign_to_creator' | 'creator_apply' | 'creator_reverse_pitch' | 'brand_direct_offer';

export type MatchStatus = 'pending' | 'viewed' | 'accepted' | 'rejected' | 'negotiating' | 'contracted';

export type ContractStatus = 'draft' | 'pending_sign' | 'active' | 'content_submitted' | 'under_review' | 'revision_requested' | 'approved' | 'completed' | 'disputed' | 'cancelled';

export type EscrowStatus = 'pending' | 'deposited' | 'released' | 'refunded' | 'disputed';

export interface Profile {
  id: string;
  role: UserRole;
  display_name: string;
  email: string;
  avatar_url: string | null;
  trust_score: number;
  created_at: string;
  updated_at: string;
}

export interface Creator {
  id: string;
  profile_id: string;
  channel_name: string;
  channel_url: string;
  platform: Platform;
  subscribers: number;
  avg_views: number;
  engagement_rate: number;
  content_category: string[];
  audience_demographics: Record<string, unknown> | null;
  top_videos: Record<string, unknown>[] | null;
  is_available: boolean;
  min_price: number | null;
  max_price: number | null;
  preferred_categories: string[];
  blocked_categories: string[];
  max_monthly_deals: number;
  max_revisions: number;
  thumbnail_autonomy: boolean;
  title_autonomy: boolean;
  media_kit_url: string | null;
  total_deals: number;
  total_revenue: number;
  created_at: string;
  updated_at: string;
  profile?: Profile;
}

export interface Brand {
  id: string;
  profile_id: string;
  company_name: string;
  business_category: string;
  contact_name: string;
  contact_email: string;
  contact_phone: string | null;
  website_url: string | null;
  total_deals: number;
  total_spend: number;
  created_at: string;
  updated_at: string;
  profile?: Profile;
}

export interface Campaign {
  id: string;
  brand_id: string;
  title: string;
  description: string;
  content_type: ContentType;
  target_platform: Platform | 'multi';
  target_categories: string[];
  min_subscribers: number | null;
  max_subscribers: number | null;
  target_audience_age: string[];
  target_audience_gender: string | null;
  budget_min: number;
  budget_max: number;
  campaign_start: string | null;
  campaign_end: string | null;
  content_deadline: string | null;
  requirements: string | null;
  max_revisions: number;
  status: CampaignStatus;
  created_at: string;
  updated_at: string;
  brand?: Brand;
}

export interface Match {
  id: string;
  campaign_id: string;
  creator_id: string;
  match_score: number | null;
  match_reasons: string[] | null;
  direction: MatchDirection;
  reverse_pitch_message: string | null;
  reverse_pitch_portfolio: Record<string, unknown>[] | null;
  status: MatchStatus;
  created_at: string;
  updated_at: string;
  campaign?: Campaign;
  creator?: Creator;
}
